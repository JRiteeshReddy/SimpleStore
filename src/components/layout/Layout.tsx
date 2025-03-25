
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { cn } from '@/lib/utils';

type LayoutProps = {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
};

export default function Layout({ children, className, fullWidth = false }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={cn(
        "flex-1 pt-24 pb-8", 
        !fullWidth && "px-4 sm:px-6 max-w-7xl mx-auto",
        className
      )}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
