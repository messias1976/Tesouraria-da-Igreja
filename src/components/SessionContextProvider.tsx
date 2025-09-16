"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";

type SessionContextType = {
  session: Session | null;
  isLoading: boolean;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const publicRoutes = ["/", "/login", "/404"]; // Rotas acessíveis sem autenticação

    const handleAuthChange = (event: string, currentSession: Session | null) => {
      console.log("Auth state changed:", event, "Session:", currentSession ? "exists" : "null");
      setSession(currentSession);
      setIsLoading(false);

      const isPublicRoute = publicRoutes.includes(location.pathname);
      console.log("Current path:", location.pathname, "Is public route:", isPublicRoute);

      if (currentSession && location.pathname === "/login") {
        console.log("Redirecting logged-in user from /login to /treasury");
        navigate("/treasury");
      } else if (!currentSession && !isPublicRoute) {
        console.log("Redirecting unauthenticated user from protected route to /login");
        navigate("/login");
      } else {
        console.log("No redirection needed for current state and path.");
      }
    };

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log("Initial session check:", initialSession ? "exists" : "null");
      handleAuthChange("INITIAL_LOAD", initialSession); // Use the same logic for initial load
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  console.log("SessionContext Render - Session:", session ? "exists" : "null", "Is Loading:", isLoading, "Current Path:", location.pathname);
  if (typeof window !== 'undefined') {
    const supabaseAuthToken = localStorage.getItem('sb-sozymmjdzjqaubuoocpz-auth-token');
    console.log("SessionContext Render - localStorage token:", supabaseAuthToken ? "exists" : "null");
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-lg text-gray-600 dark:text-gray-400">Carregando sessão...</p>
      </div>
    );
  }

  return (
    <SessionContext.Provider value={{ session, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionContextProvider");
  }
  return context;
};