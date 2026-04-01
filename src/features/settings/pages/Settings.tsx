import { Layout } from "@/app/layout/layout";
import { useState, useEffect, useCallback } from "react";
import { UserSettings } from "@/types";
import { fetchSettings, updateSettings } from "@/services/api";
import { Loading } from "@/shared/components/Loading";
import { ErrorDisplay } from "@/shared/components/ErrorDisplay";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { Badge } from "@/shared/components/Badge";
import { Settings as SettingsIcon, Save, User, Globe } from "lucide-react";
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

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [draft, setDraft] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const s = await fetchSettings();
      setSettings(s);
      setDraft(s);
    } catch (err) {
      setError((err as globalThis.Error).message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const isDirty = settings && draft && (settings.name !== draft.name || settings.email !== draft.email || settings.phone !== draft.phone);
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
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loading message={t("common.loading")} />;
  if (error && !settings) return <ErrorDisplay message={error} onRetry={load} title={t("common.error")} />;

  return (
    <Layout>
      <div className="space-y-6 max-w-lg w-full">
        <div className="flex items-center gap-3">
          <SettingsIcon className="w-6 h-6 sm:w-8 sm:h-8 text-lavenderDawn-iris dark:text-lavenderMoon-iris" />
          <h1 className="text-lg sm:text-xl font-semibold tracking-[-0.02em] text-lavenderDawn-text dark:text-lavenderMoon-text">{t("settings.title")}</h1>
        </div>

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
      </div>
    </Layout>
  );
}
