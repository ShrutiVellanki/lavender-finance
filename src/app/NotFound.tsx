import { Home, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "@/app/layout/layout";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";

export default function NotFound() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  useDocumentTitle("404 — " + t("notFound.title"));

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] text-center px-4">
        <p className="text-[120px] sm:text-[160px] font-extrabold leading-none tracking-tighter text-lavenderDawn-highlightMed dark:text-lavenderMoon-highlightMed select-none">
          404
        </p>

        <h1 className="mt-4 text-xl sm:text-2xl font-semibold tracking-[-0.02em] text-lavenderDawn-text dark:text-lavenderMoon-text">
          {t("notFound.title")}
        </h1>

        <p className="mt-2 text-[14px] text-lavenderDawn-muted dark:text-lavenderMoon-muted max-w-md">
          {t("notFound.description")}
        </p>

        <code className="mt-3 inline-block px-3 py-1.5 rounded-lg bg-lavenderDawn-overlay dark:bg-lavenderMoon-overlay text-[12px] font-mono text-lavenderDawn-subtle dark:text-lavenderMoon-subtle max-w-xs truncate">
          {pathname}
        </code>

        <div className="mt-8 flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 h-9 px-4 text-[13px] font-medium rounded-lg border border-lavenderDawn-highlightMed dark:border-lavenderMoon-highlightMed text-lavenderDawn-text dark:text-lavenderMoon-text hover:bg-lavenderDawn-highlightLow/60 dark:hover:bg-lavenderMoon-highlightLow/60 active:scale-[0.98] transition-all duration-150"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t("common.back")}
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 h-9 px-4 text-[13px] font-medium rounded-lg bg-lavenderDawn-iris text-white dark:bg-lavenderMoon-iris dark:text-lavenderMoon-base shadow-sm hover:opacity-90 active:scale-[0.98] transition-all duration-150"
          >
            <Home className="w-3.5 h-3.5" />
            {t("notFound.returnHome")}
          </Link>
        </div>
      </div>
    </Layout>
  );
}
