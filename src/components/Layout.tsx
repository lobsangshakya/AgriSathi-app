import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isChatPage = location.pathname === "/chat";

  return (
    <div className="min-h-screen bg-gradient-app">
      <div className="relative max-w-md mx-auto min-h-screen pb-0">
        <main className="pb-0">
          {children}
          {!isChatPage && (
            <div className="sticky bottom-6 flex justify-end z-40 pointer-events-none">
              <Button
                onClick={() => navigate("/chat")}
                className="rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 h-14 w-14 flex items-center justify-center pointer-events-auto"
                size="icon"
                aria-label="Open Chat"
              >
                <MessageCircle className="h-7 w-7" />
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};