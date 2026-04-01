import { Layout } from "@/app/layout/layout";
import { CreditCardForm, CreditCardDisplay, CreditCardData } from "@/shared/components/CreditCardForm";
import PinInput from "@/shared/components/PinCode";
import PassportForm from "@/shared/components/PassportForm";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { Modal } from "@/shared/components/Modal";
import { Badge } from "@/shared/components/Badge";
import { CardEntry, Account } from "@/types";
import { fetchAccountData, fetchSettings, submitCard, getSavedCards, saveCard, removeCard } from "@/services/api";
import { CreditCard, ShieldCheck, UserCheck, CheckCircle, Loader2, Plus, ArrowLeft, Trash2, Calendar, Hash, User as UserIcon, Wifi } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

type Step = "list" | "detail" | "verify-identity" | "verify-pin" | "add-card" | "done";

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return phone;
  return "***-***-" + digits.slice(-4);
}

function accountToCard(account: Account): CardEntry {
  const last4 = account.id.slice(-4);
  return {
    id: account.id,
    last4,
    network: "visa",
    name: account.name,
    expiry: "12/27",
    accountId: account.id,
  };
}

export default function CardsPage() {
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>("list");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pin, setPin] = useState("");
  const [cards, setCards] = useState<CardEntry[]>([]);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [pendingCardData, setPendingCardData] = useState<CreditCardData | null>(null);
  const [selectedCard, setSelectedCard] = useState<CardEntry | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [acctData, settings] = await Promise.all([fetchAccountData(), fetchSettings()]);
      const creditAccounts = Object.values(acctData).filter((a) => a.type === "credit");
      const accountCards = creditAccounts.map(accountToCard);
      const userCards = getSavedCards();
      const accountCardIds = new Set(accountCards.map((c) => c.id));
      const merged = [...accountCards, ...userCards.filter((c) => !accountCardIds.has(c.id))];
      setCards(merged);
      setPhone(settings.phone);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const flowSteps: { key: Step; label: string; icon: React.ReactNode }[] = [
    { key: "verify-identity", label: "Identity", icon: <UserCheck className="w-4 h-4" /> },
    { key: "verify-pin", label: "PIN Verification", icon: <ShieldCheck className="w-4 h-4" /> },
    { key: "add-card", label: "Card Details", icon: <CreditCard className="w-4 h-4" /> },
  ];

  const currentIdx = flowSteps.findIndex((s) => s.key === step);

  async function handleCardSubmit(data: CreditCardData) {
    setPendingCardData(data);
    setShowConfirmModal(true);
  }

  async function confirmAddCard() {
    if (!pendingCardData) return;
    setShowConfirmModal(false);

    const tempId = `temp-${Date.now()}`;
    const last4 = pendingCardData.number.replace(/\s/g, "").slice(-4);
    const optimisticCard: CardEntry = {
      id: tempId,
      last4,
      network: "visa",
      name: pendingCardData.name,
      expiry: pendingCardData.expiry,
      syncing: true,
    };

    setCards((prev) => [optimisticCard, ...prev]);
    setStep("done");

    try {
      const confirmed = await submitCard({
        last4,
        network: "visa",
        name: pendingCardData.name,
        expiry: pendingCardData.expiry,
      });
      setCards((prev) => prev.map((c) => (c.id === tempId ? { ...confirmed, syncing: false } : c)));
    } catch {
      setCards((prev) => prev.filter((c) => c.id !== tempId));
    }
  }

  function startAddFlow() {
    setStep("verify-identity");
    setPin("");
    setPendingCardData(null);
  }

  const isInFlow = step !== "list" && step !== "done" && step !== "detail";

  function openCardDetail(card: CardEntry) {
    setSelectedCard(card);
    setStep("detail");
  }

  function deleteCard() {
    if (!selectedCard) return;
    removeCard(selectedCard.id);
    setCards((prev) => prev.filter((c) => c.id !== selectedCard.id));
    setShowDeleteModal(false);
    setSelectedCard(null);
    setStep("list");
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* ─── LIST / DONE views ─── */}
        {!isInFlow && (
          <>
            <div>
              <h1 className="text-lg sm:text-xl font-semibold tracking-[-0.02em] text-lavenderDawn-text dark:text-lavenderMoon-text">{t("cards.title")}</h1>
              <p className="text-xs sm:text-[13px] text-lavenderDawn-muted dark:text-lavenderMoon-muted mt-1">{t("cards.subtitle")}</p>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-lavenderDawn-muted" />
              </div>
            )}

            {!loading && cards.length === 0 && step === "list" && (
              <Card className="p-8 text-center space-y-4">
                <CreditCard className="w-12 h-12 mx-auto text-lavenderDawn-muted dark:text-lavenderMoon-muted" />
                <p className="text-sm text-lavenderDawn-muted dark:text-lavenderMoon-muted">{t("cards.noCards")}</p>
                <Button onClick={startAddFlow}>{t("cards.addCard")}</Button>
              </Card>
            )}

            {!loading && cards.length > 0 && step === "list" && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-medium text-lavenderDawn-text dark:text-lavenderMoon-text">{t("cards.yourCards")}</h2>
                  <Button variant="outline" size="sm" onClick={startAddFlow} className="gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> {t("cards.addCard")}
                  </Button>
                </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cards.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => !card.syncing && openCardDetail(card)}
                  className="w-full relative pb-1 text-left cursor-pointer rounded-2xl transition-transform hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavenderDawn-iris dark:focus-visible:ring-lavenderMoon-iris"
                >
                      <CreditCardDisplay
                        data={{
                          number: `•••• •••• •••• ${card.last4}`,
                          name: card.name,
                          expiry: card.expiry,
                          cvv: "",
                        }}
                        flipped={false}
                      />
                      {card.syncing && (
                        <div className="absolute top-3 right-3 z-10">
                          <Badge variant="warning" className="gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" /> {t("cards.syncing")}
                          </Badge>
                        </div>
                      )}
                </button>
                  ))}
                </div>
              </div>
            )}

            {step === "done" && (
              <Card className="max-w-lg mx-auto p-8">
                <div className="text-center space-y-4">
                  <CheckCircle className="w-16 h-16 mx-auto text-lavenderDawn-foam dark:text-lavenderMoon-foam" />
                  <h3 className="text-lg font-medium text-lavenderDawn-text dark:text-lavenderMoon-text">
                    {t("cards.addedSuccess")}
                  </h3>
                  <p className="text-sm text-lavenderDawn-muted dark:text-lavenderMoon-muted">
                    {t("cards.addedDesc")}
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={() => setStep("list")}>{t("cards.viewCards")}</Button>
                    <Button onClick={startAddFlow}>{t("cards.addAnother")}</Button>
                  </div>
                </div>
              </Card>
            )}
          </>
        )}

        {/* ─── CARD DETAIL VIEW ─── */}
        {step === "detail" && selectedCard && (
          <>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => { setStep("list"); setSelectedCard(null); }}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-lavenderDawn-muted dark:text-lavenderMoon-muted hover:text-lavenderDawn-text dark:hover:text-lavenderMoon-text transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("cards.backToCards")}
              </button>
            </div>

            <div className="max-w-md mx-auto space-y-6">
              <CreditCardDisplay
                data={{
                  number: `•••• •••• •••• ${selectedCard.last4}`,
                  name: selectedCard.name,
                  expiry: selectedCard.expiry,
                  cvv: "",
                }}
                flipped={false}
              />

              <Card className="divide-y divide-lavenderDawn-highlightLow dark:divide-lavenderMoon-highlightLow">
                <div className="px-5 py-4 flex items-center gap-3">
                  <UserIcon className="w-4 h-4 text-lavenderDawn-muted dark:text-lavenderMoon-muted shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium text-lavenderDawn-muted dark:text-lavenderMoon-muted uppercase tracking-wider">{t("cards.cardHolder")}</p>
                    <p className="text-sm font-medium text-lavenderDawn-text dark:text-lavenderMoon-text truncate">{selectedCard.name}</p>
                  </div>
                </div>
                <div className="px-5 py-4 flex items-center gap-3">
                  <Hash className="w-4 h-4 text-lavenderDawn-muted dark:text-lavenderMoon-muted shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium text-lavenderDawn-muted dark:text-lavenderMoon-muted uppercase tracking-wider">{t("cards.cardNumber")}</p>
                    <p className="text-sm font-mono text-lavenderDawn-text dark:text-lavenderMoon-text">•••• •••• •••• {selectedCard.last4}</p>
                  </div>
                </div>
                <div className="px-5 py-4 flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-lavenderDawn-muted dark:text-lavenderMoon-muted shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium text-lavenderDawn-muted dark:text-lavenderMoon-muted uppercase tracking-wider">{t("cards.expiry")}</p>
                    <p className="text-sm font-medium text-lavenderDawn-text dark:text-lavenderMoon-text">{selectedCard.expiry}</p>
                  </div>
                </div>
                <div className="px-5 py-4 flex items-center gap-3">
                  <Wifi className="w-4 h-4 text-lavenderDawn-muted dark:text-lavenderMoon-muted shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium text-lavenderDawn-muted dark:text-lavenderMoon-muted uppercase tracking-wider">{t("cards.network")}</p>
                    <p className="text-sm font-medium text-lavenderDawn-text dark:text-lavenderMoon-text capitalize">{selectedCard.network}</p>
                  </div>
                </div>
              </Card>

              <Button
                variant="destructive"
                className="w-full gap-2"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 className="w-4 h-4" />
                {t("cards.deleteCard")}
              </Button>
            </div>
          </>
        )}

        {/* ─── ADD CARD FLOW (replaces entire view) ─── */}
        {isInFlow && (
          <div className="max-w-lg mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep("list")}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-lavenderDawn-muted dark:text-lavenderMoon-muted hover:text-lavenderDawn-text dark:hover:text-lavenderMoon-text transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("cards.backToCards")}
              </button>
            </div>

            <div className="space-y-6">
              <div className="text-center space-y-1">
                <h1 className="text-xl font-semibold tracking-[-0.02em] text-lavenderDawn-text dark:text-lavenderMoon-text">{t("cards.addCard")}</h1>
                <p className="text-sm text-lavenderDawn-muted dark:text-lavenderMoon-muted">{t("cards.addFlowSubtitle")}</p>
              </div>

              {/* Step indicator */}
              <div className="flex items-center justify-center gap-2">
                {flowSteps.map((s, i) => (
                  <div key={s.key} className="flex items-center gap-2">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      i < currentIdx
                        ? "bg-lavenderDawn-foam/15 text-lavenderDawn-foam dark:bg-lavenderMoon-foam/15 dark:text-lavenderMoon-foam"
                        : i === currentIdx
                          ? "bg-lavenderDawn-iris/15 text-lavenderDawn-iris dark:bg-lavenderMoon-iris/15 dark:text-lavenderMoon-iris"
                          : "bg-lavenderDawn-overlay text-lavenderDawn-muted dark:bg-lavenderMoon-overlay dark:text-lavenderMoon-muted"
                    }`}>
                      {s.icon}
                      <span className="hidden sm:inline">{s.label}</span>
                    </div>
                    {i < flowSteps.length - 1 && (
                      <div className={`w-8 h-px ${i < currentIdx ? "bg-lavenderDawn-foam dark:bg-lavenderMoon-foam" : "bg-lavenderDawn-highlightLow dark:bg-lavenderMoon-highlightLow"}`} />
                    )}
                  </div>
                ))}
              </div>

              <Card className="p-8">
                {step === "verify-identity" && (
                  <PassportForm
                    title={t("cards.step1Title")}
                    onSubmit={() => setStep("verify-pin")}
                  />
                )}

                {step === "verify-pin" && (
                  <div className="space-y-6">
                    <h3 className="text-base font-medium text-lavenderDawn-text dark:text-lavenderMoon-text">
                      {t("cards.step2Title")}
                    </h3>
                    <p className="text-sm text-lavenderDawn-muted dark:text-lavenderMoon-muted">
                      {t("cards.codeSent", { phone: maskPhone(phone) })}{" "}
                      <Link to="/settings" className="text-lavenderDawn-iris dark:text-lavenderMoon-iris hover:underline text-xs">{t("cards.updatePhone")}</Link>
                    </p>
                    <div className="flex justify-center">
                      <PinInput
                        length={6}
                        masked
                        label="Enter code"
                        onChange={setPin}
                        onComplete={() => setStep("add-card")}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button variant="ghost" onClick={() => setStep("verify-identity")} className="flex-1">{t("common.back")}</Button>
                      <Button onClick={() => setStep("add-card")} disabled={pin.length < 6} className="flex-1">{t("cards.verify")}</Button>
                    </div>
                  </div>
                )}

                {step === "add-card" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="success">{t("cards.verified")}</Badge>
                      <span className="text-sm text-lavenderDawn-muted dark:text-lavenderMoon-muted">{t("cards.identityConfirmed")}</span>
                    </div>
                    <CreditCardForm onSubmit={handleCardSubmit} />
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}

        {/* Add Card Confirmation Modal */}
        <Modal open={showConfirmModal} onClose={() => setShowConfirmModal(false)} title={t("cards.confirmTitle")}>
          <div className="space-y-4">
            <p className="text-sm text-lavenderDawn-text dark:text-lavenderMoon-text">
              {t("cards.confirmDesc")}
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowConfirmModal(false)}>{t("common.cancel")}</Button>
              <Button className="flex-1" onClick={confirmAddCard}>{t("common.confirm")}</Button>
            </div>
          </div>
        </Modal>

        {/* Delete Card Confirmation Modal */}
        <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} title={t("cards.deleteTitle")}>
          <div className="space-y-4">
            <p className="text-sm text-lavenderDawn-text dark:text-lavenderMoon-text">
              {t("cards.deleteDesc", { last4: selectedCard?.last4 })}
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowDeleteModal(false)}>{t("common.cancel")}</Button>
              <Button variant="destructive" className="flex-1" onClick={deleteCard}>{t("cards.confirmDelete")}</Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
}
