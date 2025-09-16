"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
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

  // Memoize public routes to ensure stable reference for useEffect dependencies
  const publicRoutes = useMemo(() => ["/", "/login", "/404"], []);

  useEffect(() => {
    const handleAuthChange = (event: string, currentSession: Session | null) => {
      console.log("Auth state changed:", event, "Session:", currentSession ? "exists" : "null");
      setSession(currentSession);
      setIsLoading(false);

      const isPublicRoute = publicRoutes.includes(location.pathname);
      console.log("Current path:", location.pathname, "Is public route:", isPublicRoute);

      if (currentSession) {
        // User is logged in
        if (location.pathname === "/login") {
          console.log("Redirecting logged-in user from /login to /treasury");
          navigate("/treasury");
        }
      } else {
        // User is not logged in
        if (!isPublicRoute) {
          console.log("Redirecting unauthenticated user from protected route to /login");
          navigate("/login");
        }
      }
    };

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log("Initial session check completed.");
      handleAuthChange("INITIAL_LOAD", initialSession);
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname, publicRoutes]); // Added publicRoutes to dependencies

  // Log localStorage token for debugging, only in client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const supabaseAuthToken = localStorage.getItem('sb-sozymmjdzjqaubuoocpz-auth-token');
      console.log("SessionContext Render - localStorage token:", supabaseAuthToken ? "exists" : "null");
    }
  }, [session]); // Log when session changes

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