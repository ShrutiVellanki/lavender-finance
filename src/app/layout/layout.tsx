import React, { useState, useEffect } from 'react';
import { AppSidebar } from './sidebar/sidebar';
import { useIsMobile } from '@/shared/hooks/useIsMobile';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) setIsCollapsed(true);
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-lavenderDawn-base dark:bg-lavenderMoon-base">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <div className="fixed inset-y-0 left-0 z-30 overflow-visible">
        <AppSidebar
          isCollapsed={isMobile || isCollapsed}
          onCollapsedChange={isMobile ? undefined : setIsCollapsed}
          isMobile={isMobile}
        />
      </div>

      <main
        id="main-content"
        tabIndex={-1}
        className={`transition-all duration-300 ease-in-out ${
          (isMobile || isCollapsed) ? 'pl-[60px]' : 'pl-60'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-3 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
};
