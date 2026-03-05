"use client";

import { Layout } from "@/components/layout/layout";
import { ModalProvider, useModal, type ModalType, type WalletItem } from "@/components/product/wallet/modal-context";
import { ModalRouter } from "@/components/product/wallet/modal-router";
import {
  Wallet, Building2, CreditCard, HeartPulse, Gift, BookUser,
  ShieldAlert, TrendingUp, Bitcoin, Car, Tag, Trash2, Plus
} from "lucide-react";

// ─── Wallet tile definitions ─────────────────────────────────────────────────

interface TileDef {
  type: ModalType;
  label: string;
  description: string;
  icon: React.ElementType;
}

const TILES: TileDef[] = [
  { type: "bank-account",      label: "Bank Account",       description: "Checking, savings, money market",  icon: Building2    },
  { type: "credit-card",       label: "Credit Card",        description: "Visa, Mastercard, Amex",           icon: CreditCard   },
  { type: "health-insurance",  label: "Health Insurance",   description: "Member ID, group number, plan",    icon: HeartPulse   },
  { type: "loyalty-card",      label: "Loyalty Card",       description: "Rewards, miles, points programs",  icon: Gift         },
  { type: "passport",          label: "Passport",           description: "Travel document & expiry",         icon: BookUser     },
  { type: "ssn",               label: "Social Security",    description: "SSN with Luhn-style validation",   icon: ShieldAlert  },
  { type: "investment",        label: "Investment Account", description: "Brokerage, IRA, 401(k)",           icon: TrendingUp   },
  { type: "crypto-wallet",     label: "Crypto Wallet",      description: "ETH, BTC, SOL, MATIC addresses",  icon: Bitcoin      },
  { type: "drivers-license",   label: "Driver's License",   description: "State ID with class & expiry",    icon: Car          },
  { type: "gift-card",         label: "Gift Card",          description: "Balance, PIN, and issuer",         icon: Tag          },
  { type: "vehicle-insurance", label: "Vehicle Insurance",  description: "Policy, vehicle, coverage type",   icon: Car          },
];

// ─── Saved item row ───────────────────────────────────────────────────────────

const ItemRow = ({ item, onRemove }: { item: WalletItem; onRemove: () => void }) => {
  const tile = TILES.find((t) => t.type === item.type);
  const Icon = tile?.icon ?? Wallet;
  return (
    <div className="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-lavenderDawn-overlay/30 dark:bg-lavenderMoon-overlay/30 group">
      <div className="w-7 h-7 flex items-center justify-center rounded-full bg-lavenderDawn-iris/10 dark:bg-lavenderMoon-iris/10">
        <Icon className="w-3.5 h-3.5 text-lavenderDawn-iris dark:text-lavenderMoon-iris" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-lavenderDawn-text dark:text-lavenderMoon-text truncate">{item.label}</p>
        {item.sublabel && <p className="text-xs text-lavenderDawn-subtle dark:text-lavenderMoon-subtle truncate">{item.sublabel}</p>}
      </div>
      <button
        onClick={onRemove}
        aria-label="Remove"
        className="opacity-0 group-hover:opacity-100 text-lavenderDawn-muted dark:text-lavenderMoon-muted hover:text-red-500 transition-all duration-200"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

// ─── Tile button ──────────────────────────────────────────────────────────────

const TileButton = ({ tile, count }: { tile: TileDef; count: number }) => {
  const { openModal } = useModal();
  const Icon = tile.icon;
  return (
    <button
      onClick={() => openModal(tile.type)}
      className="relative flex flex-col items-start gap-3 rounded-2xl border border-lavenderDawn-overlay dark:border-lavenderMoon-overlay bg-lavenderDawn-overlay/50 dark:bg-[#636363]/50 p-5 text-left hover:bg-lavenderDawn-highlightLow/40 dark:hover:bg-lavenderMoon-highlightLow/10 hover:border-lavenderDawn-iris/30 dark:hover:border-lavenderMoon-iris/30 transition-all duration-200 group"
    >
      <div className="flex items-center justify-between w-full">
        <div className="w-9 h-9 rounded-xl bg-lavenderDawn-iris/10 dark:bg-lavenderMoon-iris/10 flex items-center justify-center group-hover:bg-lavenderDawn-iris/20 dark:group-hover:bg-lavenderMoon-iris/20 transition-colors">
          <Icon className="w-4.5 h-4.5 w-[18px] h-[18px] text-lavenderDawn-iris dark:text-lavenderMoon-iris" />
        </div>
        <div className="flex items-center gap-1.5">
          {count > 0 && (
            <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-lavenderDawn-iris/10 dark:bg-lavenderMoon-iris/10 text-lavenderDawn-iris dark:text-lavenderMoon-iris">
              {count}
            </span>
          )}
          <Plus className="w-4 h-4 text-lavenderDawn-muted dark:text-lavenderMoon-muted group-hover:text-lavenderDawn-iris dark:group-hover:text-lavenderMoon-iris transition-colors" />
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-lavenderDawn-text dark:text-lavenderMoon-text">{tile.label}</p>
        <p className="text-xs text-lavenderDawn-subtle dark:text-lavenderMoon-subtle mt-0.5">{tile.description}</p>
      </div>
    </button>
  );
};

// ─── Inner page (needs modal context) ────────────────────────────────────────

const WalletPageInner = () => {
  const { state, removeItem } = useModal();

  return (
    <Layout>
      <div className="md:p-0 p-6">
        <div className="max-w-4xl mx-auto space-y-8 py-6">
          {/* Header */}
          <div className="px-6 flex items-center gap-3">
            <Wallet className="w-8 h-8 text-lavenderDawn-iris dark:text-lavenderMoon-iris" />
            <div>
              <h1 className="text-2xl font-medium text-lavenderDawn-text dark:text-lavenderMoon-text">
                Wallet
              </h1>
              <p className="text-sm text-lavenderDawn-subtle dark:text-lavenderMoon-subtle">
                Securely store all your financial documents in one place
              </p>
            </div>
          </div>

          {/* Saved items */}
          {state.items.length > 0 && (
            <div className="rounded-2xl border border-lavenderDawn-overlay dark:border-lavenderMoon-overlay bg-lavenderDawn-overlay/50 dark:bg-[#636363]/50 backdrop-blur-sm p-6 space-y-2">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-lavenderDawn-subtle dark:text-lavenderMoon-subtle mb-3">
                Saved Items
              </h2>
              {state.items.map((item) => (
                <ItemRow key={item.id} item={item} onRemove={() => removeItem(item.id)} />
              ))}
            </div>
          )}

          {/* Tile grid */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-lavenderDawn-subtle dark:text-lavenderMoon-subtle px-1 mb-4">
              Add a Document
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TILES.map((tile) => (
                <TileButton
                  key={tile.type}
                  tile={tile}
                  count={state.items.filter((i) => i.type === tile.type).length}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Render active modal */}
      <ModalRouter />
    </Layout>
  );
};

// ─── Page (wraps with provider) ──────────────────────────────────────────────

export default function WalletPage() {
  return (
    <ModalProvider>
      <WalletPageInner />
    </ModalProvider>
  );
}
