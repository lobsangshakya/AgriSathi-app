import { ReactNode } from "react";
import { BottomNavigation } from "./BottomNavigation";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-app relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,hsl(var(--primary)/0.1)_0%,transparent_50%)]" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_75%_75%,hsl(var(--accent)/0.1)_0%,transparent_50%)]" />
        <div className="absolute top-1/2 left-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,hsl(var(--secondary)/0.05)_0%,transparent_50%)]" />
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 right-10 w-20 h-20 bg-primary/5 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-40 left-8 w-16 h-16 bg-accent/5 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-10 w-12 h-12 bg-secondary/5 rounded-full blur-lg animate-float" style={{ animationDelay: '4s' }} />
      
      <main className="relative z-10 pb-24 max-w-md mx-auto">
        {children}
      </main>
      
      <BottomNavigation />
    </div>
  );
};