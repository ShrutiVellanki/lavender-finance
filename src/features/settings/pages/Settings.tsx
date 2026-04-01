import { Layout } from "@/app/layout/layout";
import { useState, useEffect, useCallback, useRef } from "react";
import { UserSettings, CurrencyCode } from "@/types";
import { fetchSettings, updateSettings, setDataOverrides, clearDataOverrides, hasDataOverrides, validateDataOverride } from "@/services/api";
import { Loading } from "@/shared/components/Loading";
import { ErrorDisplay } from "@/shared/components/ErrorDisplay";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { Badge } from "@/shared/components/Badge";
import { useCurrency } from "@/shared/context/currency";
import { Save, User, Globe, Coins, Code2, Upload, FileJson, Check, AlertTriangle, X, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

const inputCls =
  "w-full h-9 rounded-lg border border-lavenderDawn-highlightMed dark:border-lavenderMoon-highlightMed bg-lavenderDawn-base dark:bg-lavenderMoon-overlay px-3 text-[13px] text-lavenderDawn-text dark:text-lavenderMoon-text placeholder:text-lavenderDawn-muted focus:outline-none focus:ring-1 focus:ring-lavenderDawn-iris dark:focus:ring-lavenderMoon-iris transition-colors";

const inputErrorCls =
  "w-full h-9 rounded-lg border border-lavenderDawn-love dark:border-lavenderMoon-love bg-lavenderDawn-base dark:bg-lavenderMoon-overlay px-3 text-[13px] text-lavenderDawn-text dark:text-lavenderMoon-text placeholder:text-lavenderDawn-muted focus:outline-none focus:ring-1 focus:ring-lavenderDawn-love dark:focus:ring-lavenderMoon-love transition-colors";

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const CURRENCIES: { code: CurrencyCode; label: string; symbol: string }[] = [
  { code: "USD", label: "US Dollar", symbol: "$" },
  { code: "EUR", label: "Euro", symbol: "€" },
  { code: "GBP", label: "British Pound", symbol: "£" },
  { code: "CAD", label: "Canadian Dollar", symbol: "CA$" },
  { code: "AUD", label: "Australian Dollar", symbol: "A$" },
  { code: "JPY", label: "Japanese Yen", symbol: "¥" },
  { code: "INR", label: "Indian Rupee", symbol: "₹" },
  { code: "CHF", label: "Swiss Franc", symbol: "CHF" },
];

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { setCurrency } = useCurrency();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [draft, setDraft] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [jsonFile, setJsonFile] = useState<{ name: string; data: unknown } | null>(null);
  const [validationResult, setValidationResult] = useState<{ valid: boolean; errors: string[]; counts: Record<string, number> } | null>(null);
  const [devError, setDevError] = useState<string | null>(null);
  const [dataOverrideActive, setDataOverrideActive] = useState(hasDataOverrides());
  const [appliedMessage, setAppliedMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const s = await fetchSettings();
      setSettings(s);
      setDraft(s);
      setCurrency(s.currency);
    } catch (err) {
      setError((err as globalThis.Error).message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const isDirty = settings && draft && (settings.name !== draft.name || settings.email !== draft.email || settings.phone !== draft.phone || settings.currency !== draft.currency);
  const phoneValid = draft ? isValidPhone(draft.phone) : true;
  const showPhoneError = phoneTouched && draft?.phone !== "" && !phoneValid;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!draft) return;
    setSaving(true);
    try {
      const updated = await updateSettings(draft);
      setSettings(updated);
      setDraft(updated);
      setCurrency(updated.currency);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  function processFile(file: File) {
    setDevError(null);
    setValidationResult(null);
    setAppliedMessage(null);

    if (file.size > MAX_FILE_SIZE) {
      setDevError(t("settings.fileTooLarge"));
      return;
    }
    if (!file.name.endsWith(".json")) {
      setDevError("File must be a .json file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        const result = validateDataOverride(parsed);
        setJsonFile({ name: file.name, data: parsed });
        setValidationResult(result);
      } catch (err) {
        setDevError(t("settings.invalidJson", { error: (err as Error).message }));
        setJsonFile(null);
      }
    };
    reader.readAsText(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    if (e.target) e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }

  function applyOverride() {
    if (!jsonFile?.data || !validationResult?.valid) return;
    setDataOverrides(jsonFile.data as Parameters<typeof setDataOverrides>[0]);
    setDataOverrideActive(true);
    const parts = Object.entries(validationResult.counts)
      .map(([k, v]) => `${v} ${k}`)
      .join(", ");
    setAppliedMessage(t("settings.dataApplied", { counts: parts }));
    setJsonFile(null);
    setValidationResult(null);
  }

  function resetOverride() {
    clearDataOverrides();
    setDataOverrideActive(false);
    setJsonFile(null);
    setValidationResult(null);
    setAppliedMessage(null);
    setDevError(null);
  }

  if (loading) return <Loading message={t("common.loading")} />;
  if (error && !settings) return <ErrorDisplay message={error} onRetry={load} title={t("common.error")} />;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold tracking-[-0.02em] text-lavenderDawn-text dark:text-lavenderMoon-text">{t("settings.title")}</h1>
          <p className="text-xs sm:text-[13px] text-lavenderDawn-muted dark:text-lavenderMoon-muted mt-1">{t("settings.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* ── Left column: Profile ── */}
          <Card className="p-6">
            <form onSubmit={handleSave} className="space-y-5">
              <div className="flex items-center gap-4 pb-4 border-b border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightMed">
                <div className="w-12 h-12 rounded-full bg-lavenderDawn-iris/15 dark:bg-lavenderMoon-iris/15 flex items-center justify-center">
                  <User className="w-6 h-6 text-lavenderDawn-iris dark:text-lavenderMoon-iris" />
                </div>
                <div>
                  <p className="text-sm font-medium text-lavenderDawn-text dark:text-lavenderMoon-text">{settings?.name}</p>
                  <p className="text-xs text-lavenderDawn-muted dark:text-lavenderMoon-muted">{settings?.email}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-lavenderDawn-muted dark:text-lavenderMoon-muted uppercase tracking-wider">{t("settings.fullName")}</label>
                <input className={inputCls} value={draft?.name ?? ""} onChange={(e) => setDraft((d) => d ? { ...d, name: e.target.value } : d)} />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-lavenderDawn-muted dark:text-lavenderMoon-muted uppercase tracking-wider">{t("settings.email")}</label>
                <input className={inputCls} type="email" value={draft?.email ?? ""} onChange={(e) => setDraft((d) => d ? { ...d, email: e.target.value } : d)} />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-lavenderDawn-muted dark:text-lavenderMoon-muted uppercase tracking-wider">{t("settings.phone")}</label>
                <input
                  className={showPhoneError ? inputErrorCls : inputCls}
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={draft?.phone ?? ""}
                  onChange={(e) => {
                    const formatted = formatPhone(e.target.value);
                    setDraft((d) => d ? { ...d, phone: formatted } : d);
                  }}
                  onBlur={() => setPhoneTouched(true)}
                />
                {showPhoneError && (
                  <p className="text-[11px] text-lavenderDawn-love dark:text-lavenderMoon-love">{t("settings.phoneInvalid")}</p>
                )}
              </div>

              {error && <p className="text-xs text-lavenderDawn-love dark:text-lavenderMoon-love">{error}</p>}

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" disabled={!isDirty || saving || !phoneValid} className="gap-2">
                  <Save className="w-3.5 h-3.5" />
                  {saving ? t("settings.saving") : t("settings.saveChanges")}
                </Button>
                {saved && <Badge variant="success">{t("common.saved")}</Badge>}
              </div>
            </form>
          </Card>

          {/* ── Right column: Language + Developer Settings ── */}
          <div className="space-y-6">
            {/* Language */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightMed">
                  <Globe className="w-5 h-5 text-lavenderDawn-iris dark:text-lavenderMoon-iris" />
                  <span className="text-sm font-medium text-lavenderDawn-text dark:text-lavenderMoon-text">{t("settings.language")}</span>
                </div>
                <div className="flex gap-2">
                  {[
                    { code: "en", label: "English" },
                    { code: "es", label: "Español" },
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => i18n.changeLanguage(lang.code)}
                      className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                        i18n.language === lang.code
                          ? "bg-lavenderDawn-iris/15 dark:bg-lavenderMoon-iris/15 text-lavenderDawn-iris dark:text-lavenderMoon-iris ring-1 ring-lavenderDawn-iris/30 dark:ring-lavenderMoon-iris/30"
                          : "bg-lavenderDawn-overlay dark:bg-lavenderMoon-overlay text-lavenderDawn-muted dark:text-lavenderMoon-muted hover:text-lavenderDawn-text dark:hover:text-lavenderMoon-text"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Currency */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightMed">
                  <Coins className="w-5 h-5 text-lavenderDawn-iris dark:text-lavenderMoon-iris" />
                  <div>
                    <span className="text-sm font-medium text-lavenderDawn-text dark:text-lavenderMoon-text">{t("settings.currency")}</span>
                    <p className="text-[11px] text-lavenderDawn-muted dark:text-lavenderMoon-muted">{t("settings.currencyDesc")}</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {CURRENCIES.map((c) => {
                    const isActive = (draft?.currency ?? "USD") === c.code;
                    const isDisabled = c.code !== "USD";
                    return (
                      <button
                        key={c.code}
                        disabled={isDisabled}
                        onClick={() => {
                          if (!isDisabled) {
                            setDraft((d) => d ? { ...d, currency: c.code } : d);
                            setCurrency(c.code);
                          }
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                          isActive
                            ? "bg-lavenderDawn-iris/15 dark:bg-lavenderMoon-iris/15 text-lavenderDawn-iris dark:text-lavenderMoon-iris ring-1 ring-lavenderDawn-iris/30 dark:ring-lavenderMoon-iris/30"
                            : isDisabled
                              ? "bg-lavenderDawn-overlay/50 dark:bg-lavenderMoon-overlay/50 text-lavenderDawn-muted/50 dark:text-lavenderMoon-muted/50 cursor-not-allowed"
                              : "bg-lavenderDawn-overlay dark:bg-lavenderMoon-overlay text-lavenderDawn-muted dark:text-lavenderMoon-muted hover:text-lavenderDawn-text dark:hover:text-lavenderMoon-text"
                        }`}
                      >
                        <span>{c.symbol}  {c.code} — {c.label}</span>
                        {isDisabled && (
                          <Badge variant="default" className="text-[10px] px-1.5 py-0 leading-4 opacity-60">
                            {t("common.comingSoon")}
                          </Badge>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Developer Settings */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightMed">
                  <Code2 className="w-5 h-5 text-lavenderDawn-iris dark:text-lavenderMoon-iris" />
                  <div>
                    <span className="text-sm font-medium text-lavenderDawn-text dark:text-lavenderMoon-text">{t("settings.developer")}</span>
                    <p className="text-[11px] text-lavenderDawn-muted dark:text-lavenderMoon-muted">{t("settings.developerDesc")}</p>
                  </div>
                </div>

              {/* Status bar */}
              {dataOverrideActive && (
                <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-lavenderDawn-foam/10 dark:bg-lavenderMoon-foam/10 border border-lavenderDawn-foam/20 dark:border-lavenderMoon-foam/20">
                  <div className="flex items-center gap-2 text-[12px] font-medium text-lavenderDawn-foam dark:text-lavenderMoon-foam">
                    <Check className="w-3.5 h-3.5" />
                    {t("settings.dataActive")}
                  </div>
                  <button
                    onClick={resetOverride}
                    className="flex items-center gap-1.5 text-[11px] font-medium text-lavenderDawn-muted dark:text-lavenderMoon-muted hover:text-lavenderDawn-text dark:hover:text-lavenderMoon-text transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    {t("settings.resetData")}
                  </button>
                </div>
              )}

              {appliedMessage && (
                <p className="text-[12px] text-lavenderDawn-foam dark:text-lavenderMoon-foam">{appliedMessage}</p>
              )}

              {/* Upload area */}
              <div className="space-y-2">
                <p className="text-[12px] text-lavenderDawn-muted dark:text-lavenderMoon-muted">{t("settings.uploadJsonDesc")}</p>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative flex flex-col items-center gap-2 p-6 rounded-lg border-2 border-dashed cursor-pointer transition-all duration-150 ${
                    dragOver
                      ? "border-lavenderDawn-iris dark:border-lavenderMoon-iris bg-lavenderDawn-iris/5 dark:bg-lavenderMoon-iris/5"
                      : "border-lavenderDawn-highlightMed dark:border-lavenderMoon-highlightMed hover:border-lavenderDawn-iris/40 dark:hover:border-lavenderMoon-iris/40"
                  }`}
                >
                  <Upload className="w-6 h-6 text-lavenderDawn-muted dark:text-lavenderMoon-muted" />
                  <div className="text-center">
                    <p className="text-[13px] font-medium text-lavenderDawn-iris dark:text-lavenderMoon-iris">{t("settings.chooseFile")}</p>
                    <p className="text-[11px] text-lavenderDawn-muted dark:text-lavenderMoon-muted">{t("settings.dragDrop")}</p>
                  </div>
                  <p className="text-[10px] text-lavenderDawn-muted/70 dark:text-lavenderMoon-muted/70">{t("settings.jsonFormat")}</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Error display */}
              {devError && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-lavenderDawn-love/10 dark:bg-lavenderMoon-love/10 border border-lavenderDawn-love/20 dark:border-lavenderMoon-love/20">
                  <AlertTriangle className="w-4 h-4 text-lavenderDawn-love dark:text-lavenderMoon-love shrink-0 mt-0.5" />
                  <p className="text-[12px] text-lavenderDawn-love dark:text-lavenderMoon-love">{devError}</p>
                </div>
              )}

              {/* Validation results */}
              {jsonFile && validationResult && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileJson className="w-4 h-4 text-lavenderDawn-iris dark:text-lavenderMoon-iris" />
                    <span className="text-[13px] font-medium text-lavenderDawn-text dark:text-lavenderMoon-text">{jsonFile.name}</span>
                    <button onClick={() => { setJsonFile(null); setValidationResult(null); }} className="ml-auto p-1 rounded hover:bg-lavenderDawn-overlay dark:hover:bg-lavenderMoon-overlay transition-colors">
                      <X className="w-3.5 h-3.5 text-lavenderDawn-muted dark:text-lavenderMoon-muted" />
                    </button>
                  </div>

                  {validationResult.valid ? (
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-lavenderDawn-foam/10 dark:bg-lavenderMoon-foam/10 border border-lavenderDawn-foam/20 dark:border-lavenderMoon-foam/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Check className="w-3.5 h-3.5 text-lavenderDawn-foam dark:text-lavenderMoon-foam" />
                          <span className="text-[12px] font-medium text-lavenderDawn-foam dark:text-lavenderMoon-foam">Validation passed</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(validationResult.counts).map(([key, count]) => (
                            <Badge key={key} variant="default">
                              {count} {key}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button onClick={applyOverride} className="gap-2">
                        <Check className="w-3.5 h-3.5" />
                        {t("settings.applyData")}
                      </Button>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-lavenderDawn-love/10 dark:bg-lavenderMoon-love/10 border border-lavenderDawn-love/20 dark:border-lavenderMoon-love/20 space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-lavenderDawn-love dark:text-lavenderMoon-love" />
                        <span className="text-[12px] font-medium text-lavenderDawn-love dark:text-lavenderMoon-love">{t("settings.validationFailed")}</span>
                      </div>
                      <ul className="space-y-1 ml-5.5">
                        {validationResult.errors.slice(0, 10).map((err, i) => (
                          <li key={i} className="text-[11px] text-lavenderDawn-love/80 dark:text-lavenderMoon-love/80 list-disc">{err}</li>
                        ))}
                        {validationResult.errors.length > 10 && (
                          <li className="text-[11px] text-lavenderDawn-muted dark:text-lavenderMoon-muted list-disc">
                            ...and {validationResult.errors.length - 10} more errors
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Schema hint */}
              <details className="group">
                <summary className="text-[11px] font-medium text-lavenderDawn-muted dark:text-lavenderMoon-muted cursor-pointer hover:text-lavenderDawn-text dark:hover:text-lavenderMoon-text transition-colors select-none">
                  {t("settings.expectedFormat")}
                </summary>
                <div className="mt-2 p-3 rounded-lg bg-lavenderDawn-overlay dark:bg-lavenderMoon-overlay border border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightLow">
                  <p className="text-[11px] text-lavenderDawn-muted dark:text-lavenderMoon-muted mb-2">{t("settings.schemaHint")}</p>
                  <pre className="text-[10px] leading-relaxed text-lavenderDawn-text/70 dark:text-lavenderMoon-text/70 overflow-x-auto">{JSON.stringify({
  accounts: { "acct-id": { id: "acct-id", name: "My Checking", current_balance: 1500, type: "depository", subtype: "checking" } },
  transactions: [{ id: "tx-1", accountId: "acct-id", description: "Coffee Shop", amount: -4.5, date: "2026-03-15", category: "Dining", status: "completed", merchant: "Starbucks" }],
  budgets: { "2026-3": [{ category: "Groceries", limit: 500, spent: 320 }] },
  spending: [{ category: "Groceries", amount: 320 }],
  chart: { "acct-id": [{ date: "2026-01-01", balance: 1200 }] }
}, null, 2)}</pre>
                </div>
              </details>
            </div>
          </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
