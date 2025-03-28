import React, { useState } from 'react';
import { Sidebar } from './sidebar/sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-lavenderDawn-base dark:bg-lavenderMoon-base">
      <Sidebar isCollapsed={isCollapsed} onCollapsedChange={setIsCollapsed} />
      <main className={`transition-all duration-300 ${isCollapsed ? 'pl-16' : 'pl-60'}`}>
        <div className="max-w-6xl mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}; 