"use client";

import React, { createContext, useContext, useReducer } from "react";

// ─── Modal types ────────────────────────────────────────────────────────────

export type ModalType =
  | "bank-account"
  | "credit-card"
  | "health-insurance"
  | "loyalty-card"
  | "passport"
  | "ssn"
  | "investment"
  | "crypto-wallet"
  | "drivers-license"
  | "gift-card"
  | "vehicle-insurance";

// ─── Saved item shapes (masked for display) ─────────────────────────────────

export interface WalletItem {
  id: string;
  type: ModalType;
  label: string;       // e.g. "Chase Checking ••4321"
  sublabel?: string;   // e.g. "Checking · $2,400"
  addedAt: string;
}

// ─── State ───────────────────────────────────────────────────────────────────

interface ModalState {
  open: ModalType | null;
  items: WalletItem[];
}

// ─── Actions ─────────────────────────────────────────────────────────────────

type Action =
  | { type: "OPEN_MODAL"; modal: ModalType }
  | { type: "CLOSE_MODAL" }
  | { type: "ADD_ITEM"; item: WalletItem }
  | { type: "REMOVE_ITEM"; id: string };

// ─── Reducer ─────────────────────────────────────────────────────────────────

// Keeping global modal state (which modal is open) and persistent wallet items
// in one reducer makes it easy to guarantee the modal always closes after save,
// and lets any part of the tree read saved items without prop drilling.

function reducer(state: ModalState, action: Action): ModalState {
  switch (action.type) {
    case "OPEN_MODAL":
      return { ...state, open: action.modal };
    case "CLOSE_MODAL":
      return { ...state, open: null };
    case "ADD_ITEM":
      return { ...state, open: null, items: [...state.items, action.item] };
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface ModalContextValue {
  state: ModalState;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  addItem: (item: Omit<WalletItem, "id" | "addedAt">) => void;
  removeItem: (id: string) => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { open: null, items: [] });

  const openModal = (modal: ModalType) => dispatch({ type: "OPEN_MODAL", modal });
  const closeModal = () => dispatch({ type: "CLOSE_MODAL" });
  const addItem = (item: Omit<WalletItem, "id" | "addedAt">) =>
    dispatch({
      type: "ADD_ITEM",
      item: { ...item, id: crypto.randomUUID(), addedAt: new Date().toISOString() },
    });
  const removeItem = (id: string) => dispatch({ type: "REMOVE_ITEM", id });

  return (
    <ModalContext.Provider value={{ state, openModal, closeModal, addItem, removeItem }}>
      {children}
    </ModalContext.Provider>
  );
};

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
}
