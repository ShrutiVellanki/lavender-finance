import { PiggyBank } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center bg-lavenderDawn-base dark:bg-lavenderMoon-base">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-lavenderDawn-iris/10 dark:bg-lavenderMoon-iris/10 flex items-center justify-center">
            <PiggyBank className="w-8 h-8 text-lavenderDawn-iris dark:text-lavenderMoon-iris" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-[-0.02em] text-lavenderDawn-text dark:text-lavenderMoon-text">
            {t("notFound.title")}
          </h1>
          <p className="text-[14px] text-lavenderDawn-muted dark:text-lavenderMoon-muted max-w-sm mx-auto">
            {t("notFound.description")}
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center h-9 px-4 text-[13px] font-medium rounded-lg bg-lavenderDawn-iris text-white dark:bg-lavenderMoon-iris dark:text-lavenderMoon-base shadow-sm hover:opacity-90 active:scale-[0.98] transition-all duration-150"
        >
          {t("notFound.returnHome")}
        </Link>
      </div>
    </div>
  );
}
