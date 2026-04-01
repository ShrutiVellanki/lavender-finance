import React, { useState, useEffect } from 'react';
import { Sidebar } from './sidebar/sidebar';
import { Menu } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches);
    handler(mq);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-lavenderDawn-base dark:bg-lavenderMoon-base">
      {/* Mobile top bar */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-40 h-14 flex items-center px-4 border-b bg-lavenderDawn-surface dark:bg-lavenderMoon-surface border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightMed">
          <button
            onClick={() => setMobileOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-lavenderDawn-text dark:text-lavenderMoon-text hover:bg-lavenderDawn-highlightLow dark:hover:bg-lavenderMoon-highlightLow transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="ml-3 text-[15px] font-semibold tracking-[-0.02em] text-lavenderDawn-text dark:text-lavenderMoon-text">Lavender</span>
        </div>
      )}

      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      {isMobile ? (
        <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <Sidebar isCollapsed={false} onCollapsedChange={() => setMobileOpen(false)} onNavigate={() => setMobileOpen(false)} />
        </div>
      ) : (
        <Sidebar isCollapsed={isCollapsed} onCollapsedChange={setIsCollapsed} />
      )}

      <main className={`transition-all duration-300 ease-in-out ${
        isMobile ? 'pt-14 pl-0' : isCollapsed ? 'pl-16' : 'pl-60'
      }`}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
};
