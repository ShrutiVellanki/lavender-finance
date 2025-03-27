import React from 'react';
import { Sidebar } from './sidebar/sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-lavenderDawn-base dark:bg-lavenderMoon-base">
      <Sidebar />
      <main className="pl-60">
        <div className="max-w-6xl mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}; 