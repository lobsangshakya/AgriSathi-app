import { ReactNode } from "react";
import { BottomNavigationEnhanced } from "./BottomNavigationEnhanced";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pb-20 max-w-md mx-auto">
        {children}
      </main>
      <BottomNavigationEnhanced />
    </div>
  );
};