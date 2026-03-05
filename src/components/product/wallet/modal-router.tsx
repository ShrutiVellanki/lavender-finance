"use client";

import { useModal } from "./modal-context";
import { BankAccountForm } from "./forms/bank-account-form";
import { CreditCardModalForm } from "./forms/credit-card-modal-form";
import { HealthInsuranceForm } from "./forms/health-insurance-form";
import { LoyaltyCardForm } from "./forms/loyalty-card-form";
import { PassportForm } from "./forms/passport-form";
import { SsnForm } from "./forms/ssn-form";
import { InvestmentForm } from "./forms/investment-form";
import { CryptoWalletForm } from "./forms/crypto-wallet-form";
import { DriversLicenseForm } from "./forms/drivers-license-form";
import { GiftCardForm } from "./forms/gift-card-form";
import { VehicleInsuranceForm } from "./forms/vehicle-insurance-form";

export const ModalRouter = () => {
  const { state } = useModal();
  switch (state.open) {
    case "bank-account":       return <BankAccountForm />;
    case "credit-card":        return <CreditCardModalForm />;
    case "health-insurance":   return <HealthInsuranceForm />;
    case "loyalty-card":       return <LoyaltyCardForm />;
    case "passport":           return <PassportForm />;
    case "ssn":                return <SsnForm />;
    case "investment":         return <InvestmentForm />;
    case "crypto-wallet":      return <CryptoWalletForm />;
    case "drivers-license":    return <DriversLicenseForm />;
    case "gift-card":          return <GiftCardForm />;
    case "vehicle-insurance":  return <VehicleInsuranceForm />;
    default:                   return null;
  }
};
