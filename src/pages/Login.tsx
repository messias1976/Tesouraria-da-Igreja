"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export default function Login() {
  const redirectToUrl = window.location.origin + "/treasury";
  // A propriedade 'captcha' não é suportada diretamente pelo componente Auth.
  // A configuração do reCAPTCHA é geralmente feita no painel do Supabase.
  // const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  // const captchaProp = recaptchaSiteKey ? { siteKey: recaptchaSiteKey } : false;

  useEffect(() => {
    console.log("Login Page - Redirecting to:", redirectToUrl);
    // console.log("reCAPTCHA Site Key:", recaptchaSiteKey ? "exists" : "null");
    // console.log("Captcha prop passed to Auth component:", captchaProp); // Novo log para depuração
  }, [redirectToUrl]); // Removido recaptchaSiteKey e captchaProp das dependências

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
          Entrar ou Cadastrar
        </h2>
        <Auth
          supabaseClient={supabase}
          providers={["github"]}
          magicLink={false}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "hsl(var(--primary))",
                  brandAccent: "hsl(var(--primary-foreground))",
                },
              },
            },
          }}
          theme="light"
          redirectTo={redirectToUrl}
          // Removida a propriedade captcha
        />
      </div>
    </div>
  );
}