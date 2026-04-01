import type React from "react"
import { useState } from "react"
import { Wifi } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CreditCardData {
  number: string
  name: string
  expiry: string
  cvv: string
}

interface CreditCardDisplayProps {
  data: CreditCardData
  flipped: boolean
  className?: string
}

const CARD_NETWORKS = {
  visa: /^4/,
  mastercard: /^5[1-5]/,
  amex: /^3[47]/,
  discover: /^6(?:011|5)/,
}

function detectNetwork(number: string): keyof typeof CARD_NETWORKS | null {
  const cleaned = number.replace(/\s/g, "")
  for (const [network, regex] of Object.entries(CARD_NETWORKS)) {
    if (regex.test(cleaned)) return network as keyof typeof CARD_NETWORKS
  }
  return null
}

function formatCardNumber(value: string): string {
  const cleaned = value.replace(/\D/g, "").slice(0, 16)
  const groups = cleaned.match(/.{1,4}/g) || []
  return groups.join(" ")
}

function maskCardNumber(value: string): string {
  const cleaned = value.replace(/\D/g, "")
  const padded = cleaned.padEnd(16, "•")
  const groups = padded.match(/.{1,4}/g) || []
  return groups
    .map((g, i) => (i < 2 ? g.replace(/\d/g, "•") : g))
    .join(" ")
}

const VisaLogo = () => (
  <svg viewBox="0 0 48 16" className="h-6 w-auto fill-white">
    <path d="M18.7 0.8L12 15.2H7.7L4.4 4.2c-.2-.7-.4-1-.9-1.3C2.6 2.4 1.1 2 0 1.8L.1.8h7c.9 0 1.7.6 1.9 1.6l1.7 9.2L14.4.8h4.3zm17.1 9.7c0-4.3-5.9-4.5-5.9-6.4 0-.6.6-1.2 1.8-1.3 1.8-.1 3.1.5 4 .9l.7-3.4C35.4.1 34.2-.3 32.5 0c-4 0-6.8 2.1-6.8 5.2 0 2.3 2 3.5 3.5 4.3 1.6.8 2.1 1.3 2.1 2 0 1.1-1.3 1.6-2.4 1.6-2 0-3.2-.5-4.1-1l-.7 3.4c.9.4 2.6.8 4.4.8 4.3.2 7-1.9 7-5.2l-.2.4zm10.6 4.7H50L47.1.8h-3.5c-.8 0-1.5.5-1.8 1.2L35.9 15.2h4.3l.9-2.4h5.2l.5 2.4h.6zm-4.5-5.8l2.2-5.9 1.2 5.9H42v-.4zm-17.2-8.4L20.7 15.2h-4.1L19.8.8h4.1V.8z" />
  </svg>
)

const MastercardLogo = () => (
  <svg viewBox="0 0 38 24" className="h-8 w-auto">
    <circle cx="15" cy="12" r="10" fill="#EB001B" />
    <circle cx="23" cy="12" r="10" fill="#F79E1B" />
    <path d="M19 5.8A10 10 0 0 1 22.8 12 10 10 0 0 1 19 18.2 10 10 0 0 1 15.2 12 10 10 0 0 1 19 5.8z" fill="#FF5F00" />
  </svg>
)

const AmexLogo = () => (
  <span className="text-white font-bold text-sm tracking-widest">AMEX</span>
)

const NetworkLogo = ({ network }: { network: keyof typeof CARD_NETWORKS | null }) => {
  if (network === "visa") return <VisaLogo />
  if (network === "mastercard") return <MastercardLogo />
  if (network === "amex") return <AmexLogo />
  return null
}

const CardFront = ({ data }: { data: CreditCardData }) => {
  const network = detectNetwork(data.number)
  const displayNumber = data.number ? maskCardNumber(data.number) : "•••• •••• •••• ••••"

  return (
    <div className="absolute inset-0 backface-hidden rounded-2xl p-6 flex flex-col justify-between bg-gradient-to-br from-lavenderDawn-iris via-lavenderDawn-pine to-lavenderDawn-foam dark:from-lavenderMoon-iris dark:via-lavenderMoon-pine dark:to-lavenderMoon-foam shadow-2xl overflow-hidden">
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10" />
      <div className="absolute -bottom-16 -left-8 w-56 h-56 rounded-full bg-white/5" />
      <div className="relative flex items-start justify-between">
        <Wifi className="w-8 h-8 text-white/80 rotate-90" />
        <NetworkLogo network={network} />
      </div>
      <div className="relative space-y-5">
        <div className="w-10 h-8 rounded-md bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-inner flex items-center justify-center">
          <div className="w-6 h-5 rounded-sm border border-yellow-600/40 grid grid-cols-3 gap-px p-0.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-yellow-400/60 rounded-[1px]" />
            ))}
          </div>
        </div>
        <p className="font-mono text-xl tracking-[0.2em] text-white drop-shadow">{displayNumber}</p>
      </div>
      <div className="relative flex items-end justify-between">
        <div>
          <p className="text-white/60 text-[10px] uppercase tracking-widest mb-0.5">Card Holder</p>
          <p className="text-white font-medium tracking-wide uppercase text-sm truncate max-w-[180px]">{data.name || "Full Name"}</p>
        </div>
        <div className="text-right">
          <p className="text-white/60 text-[10px] uppercase tracking-widest mb-0.5">Expires</p>
          <p className="text-white font-medium tracking-wide text-sm">{data.expiry || "MM/YY"}</p>
        </div>
      </div>
    </div>
  )
}

const CardBack = ({ data }: { data: CreditCardData }) => {
  const network = detectNetwork(data.number)

  return (
    <div
      className="absolute inset-0 backface-hidden rounded-2xl flex flex-col justify-between bg-gradient-to-br from-lavenderDawn-iris via-lavenderDawn-pine to-lavenderDawn-foam dark:from-lavenderMoon-iris dark:via-lavenderMoon-pine dark:to-lavenderMoon-foam shadow-2xl overflow-hidden"
      style={{ transform: "rotateY(180deg)" }}
    >
      <div className="mt-8 h-10 bg-black/80 w-full" />
      <div className="px-6 space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-9 bg-white/90 rounded flex items-center px-3">
            <div className="flex-1 h-1.5 bg-gray-300/60 rounded" />
          </div>
          <div className="bg-white/90 rounded px-3 py-1.5 min-w-[56px] text-center">
            <p className="text-[10px] text-gray-500 leading-none mb-0.5">CVV</p>
            <p className="font-mono text-sm font-bold text-gray-800">
              {data.cvv ? "•".repeat(data.cvv.length) : "•••"}
            </p>
          </div>
        </div>
        <p className="text-white/50 text-[10px] leading-relaxed">
          This card is property of Lavender Finance. Misuse is subject to prosecution. If found, please return to the nearest branch.
        </p>
      </div>
      <div className="px-6 pb-5 flex justify-end">
        <NetworkLogo network={network} />
      </div>
    </div>
  )
}

export const CreditCardDisplay: React.FC<CreditCardDisplayProps> = ({ data, flipped, className }) => (
  <div className={cn("w-full max-w-sm mx-auto perspective-1000", className)}>
    <div
      className="relative h-48 transition-transform duration-700"
      style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
    >
      <CardFront data={data} />
      <CardBack data={data} />
    </div>
  </div>
)

const inputCls = cn(
  "w-full bg-muted border border-input rounded-lg px-3 py-2.5 text-sm text-foreground",
  "placeholder:text-muted-foreground",
  "focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary",
  "transition-all duration-200 font-mono tracking-wide",
)

interface CardInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

const CardInput: React.FC<CardInputProps> = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</label>
    <input {...props} className={inputCls} />
  </div>
)

export interface CreditCardFormProps {
  onSubmit?: (data: CreditCardData) => void
  className?: string
}

export const CreditCardForm: React.FC<CreditCardFormProps> = ({ onSubmit, className }) => {
  const [card, setCard] = useState<CreditCardData>({ number: "", name: "", expiry: "", cvv: "" })
  const [cvvFocused, setCvvFocused] = useState(false)

  const handleNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCard((prev) => ({ ...prev, number: formatCardNumber(e.target.value) }))
  }

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCard((prev) => ({ ...prev, name: e.target.value.toUpperCase() }))
  }

  const handleExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 4)
    if (value.length >= 3) value = value.slice(0, 2) + "/" + value.slice(2)
    setCard((prev) => ({ ...prev, expiry: value }))
  }

  const handleCvv = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCard((prev) => ({ ...prev, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(card)
  }

  return (
    <div className={cn("w-full max-w-sm mx-auto space-y-6", className)}>
      <CreditCardDisplay data={card} flipped={cvvFocused} />
      <form onSubmit={handleSubmit} className="space-y-4">
        <CardInput label="Card Number" placeholder="0000 0000 0000 0000" value={card.number} onChange={handleNumber} inputMode="numeric" autoComplete="cc-number" />
        <CardInput label="Card Holder" placeholder="Full Name" value={card.name} onChange={handleName} autoComplete="cc-name" />
        <div className="grid grid-cols-2 gap-3">
          <CardInput label="Expiry" placeholder="MM/YY" value={card.expiry} onChange={handleExpiry} inputMode="numeric" autoComplete="cc-exp" />
          <CardInput label="CVV" placeholder="•••" value={card.cvv} onChange={handleCvv} onFocus={() => setCvvFocused(true)} onBlur={() => setCvvFocused(false)} inputMode="numeric" autoComplete="cc-csc" type="password" />
        </div>
        <button
          type="submit"
          className="w-full py-3 rounded-xl font-medium text-sm tracking-wide text-primary-foreground bg-gradient-to-r from-lavenderDawn-iris to-lavenderDawn-pine dark:from-lavenderMoon-iris dark:to-lavenderMoon-pine hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-lg"
        >
          Add Card
        </button>
      </form>
    </div>
  )
}
