"use client";

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionContextProvider";
import { showSuccess, showError } from "@/utils/toast";
import { LogOut, Home, Wallet, User } from "lucide-react"; // Importar ícones, incluindo User

export function Navbar() {
  const { session, isLoading } = useSession();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      showSuccess("Você foi desconectado com sucesso!");
      navigate("/login");
    } catch (error: any) {
      showError(error.message);
    }
  };

  // Prioriza first_name, se não existir, usa o email
  const displayName = session?.user?.user_metadata?.first_name || session?.user?.email;

  return (
    <nav className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Tesouraria da Igreja
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <Home className="h-4 w-4" /> Início
            </Button>
          </Link>
          {!isLoading && ( // Only render auth-dependent buttons after loading
            session ? (
              <>
                {displayName && (
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <User className="h-4 w-4" /> {displayName}
                  </span>
                )}
                <Link to="/treasury">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" /> Tesouraria
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="ghost" className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" /> Sair
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
}