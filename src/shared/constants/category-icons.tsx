import React from "react";
import {
  ShoppingCart,
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Zap,
  Film,
  DollarSign,
  ArrowLeftRight,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

export const CATEGORY_ICON: Record<string, React.ReactNode> = {
  Groceries: <ShoppingCart />,
  Dining: <UtensilsCrossed />,
  Transport: <Car />,
  Shopping: <ShoppingBag />,
  Utilities: <Zap />,
  Entertainment: <Film />,
  Income: <DollarSign />,
  Transfer: <ArrowLeftRight />,
};

export const STATUS_ICON: Record<string, React.ReactNode> = {
  completed: <CheckCircle2 />,
  pending: <Clock />,
  failed: <XCircle />,
};
