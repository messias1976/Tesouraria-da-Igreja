"use client";

import React, { useState, useEffect } from "react";
import { FinancialEntryForm } from "@/components/treasury/FinancialEntryForm";
import { FinancialEntryList } from "@/components/treasury/FinancialEntryList";
import { TreasurySummary } from "@/components/treasury/TreasurySummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionContextProvider";
import { Button } from "@/components/ui/button"; // Importar Button para o tratamento de erro

export type FinancialEntry = {
  id: string;
  userId: string; // Adicionado userId
  type: "income" | "expense";
  category: "dízimo" | "oferta" | "voto" | "despesa";
  amount: number;
  date: Date;
  description?: string;
  payerName?: string;
  treasurerName: string;
  viceTreasurerName?: string;
};

const TreasuryDashboard = () => {
  const { session, isLoading: isSessionLoading } = useSession();
  const userId = session?.user?.id;

  const [entries, setEntries] = useState<FinancialEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar entradas do Supabase
  const fetchEntries = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("financial_entries")
        .select("*")
        .eq("user_id", userId) // Filtrar por user_id
        .order("date", { ascending: false });

      if (error) throw error;

      setEntries(
        data.map((entry) => ({
          ...entry,
          date: new Date(entry.date),
          userId: entry.user_id, // Mapear user_id para userId
          payerName: entry.payer_name,
          treasurerName: entry.treasurer_name,
          viceTreasurerName: entry.vice_treasurer_name,
        })),
      );
    } catch (err: any) {
      console.error("Erro ao buscar anotações:", err.message);
      showError("Erro ao carregar anotações financeiras.");
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchEntries();

      // Configurar a escuta em tempo real para a tabela financial_entries
      const subscription = supabase
        .channel("financial_entries_channel")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "financial_entries",
            filter: `user_id=eq.${userId}`, // Filtrar eventos para o usuário atual
          },
          (payload) => {
            console.log("Mudança em tempo real:", payload);
            fetchEntries(); // Re-fetch para atualizar a lista
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [userId]); // Depende do userId para buscar e subscrever

  const handleAddEntry = async (
    newEntry: Omit<FinancialEntry, "id" | "userId">,
  ) => {
    if (!userId) {
      showError("Você precisa estar logado para adicionar anotações.");
      return;
    }
    console.log("Tentando adicionar nova entrada:", newEntry); // Log dos dados antes de enviar
    try {
      const { data, error } = await supabase
        .from("financial_entries")
        .insert({
          user_id: userId, // Adicionar user_id ao inserir
          type: newEntry.type,
          category: newEntry.category,
          amount: newEntry.amount,
          date: newEntry.date.toISOString(), // Converter Date para string ISO
          description: newEntry.description,
          payer_name: newEntry.payerName, // Mapeamento explícito para snake_case
          treasurer_name: newEntry.treasurerName, // Mapeamento explícito para snake_case
          vice_treasurer_name: newEntry.viceTreasurerName, // Mapeamento explícito para snake_case
        })
        .select();

      if (error) {
        console.error("Erro do Supabase ao adicionar anotação:", error); // Log do erro do Supabase
        throw error;
      }

      showSuccess("Anotação financeira adicionada com sucesso!");
      fetchEntries(); // Reativado para garantir a atualização imediata
    } catch (err: any) {
      console.error("Erro ao adicionar anotação (catch):", err.message); // Log do erro geral
      showError("Erro ao adicionar anotação financeira: " + err.message);
    }
  };

  const totalIncome = entries
    .filter((entry) => entry.type === "income")
    .reduce((sum, entry) => sum + entry.amount, 0);

  const totalExpenses = entries
    .filter((entry) => entry.type === "expense")
    .reduce((sum, entry) => sum + entry.amount, 0);

  const balance = totalIncome - totalExpenses;

  if (isSessionLoading || isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-lg text-gray-600 dark:text-gray-400">Carregando anotações financeiras...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        <p>Ocorreu um erro: {error}</p>
        <Button onClick={fetchEntries} className="mt-4">Tentar novamente</Button>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-lg text-gray-600 dark:text-gray-400">Por favor, faça login para ver o painel da tesouraria.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Painel da Tesouraria
      </h1>

      <TreasurySummary
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        balance={balance}
      />

      <Card>
        <CardHeader>
          <CardTitle>Adicionar Nova Anotação</CardTitle>
        </CardHeader>
        <CardContent>
          <FinancialEntryForm onAddEntry={handleAddEntry} />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Anotações</CardTitle>
        </CardHeader>
        <CardContent>
          <FinancialEntryList entries={entries} />
        </CardContent>
      </Card>
    </div>
  );
};

export default TreasuryDashboard;