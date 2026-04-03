import { useEffect } from "react";

export function useDocumentTitle(title: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} · Lavender Finance` : "Lavender Finance";
    return () => {
      document.title = prev;
    };
  }, [title]);
}
