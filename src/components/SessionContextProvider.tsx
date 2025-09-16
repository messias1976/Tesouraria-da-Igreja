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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      setSession(currentSession);
      setIsLoading(false);

      const publicRoutes = ["/", "/login", "/404"]; // Rotas acessíveis sem autenticação
      const isPublicRoute = publicRoutes.includes(location.pathname);

      if (currentSession && location.pathname === "/login") {
        // Se o usuário está logado e tenta acessar a página de login, redireciona para a tesouraria
        navigate("/treasury");
      } else if (!currentSession && !isPublicRoute) {
        // Se o usuário não está logado e tenta acessar uma rota protegida, redireciona para o login
        navigate("/login");
      }
    });

    // Carregar a sessão inicial
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setIsLoading(false);

      const publicRoutes = ["/", "/login", "/404"];
      const isPublicRoute = publicRoutes.includes(location.pathname);

      if (initialSession && location.pathname === "/login") {
        navigate("/treasury");
      } else if (!initialSession && !isPublicRoute) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

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