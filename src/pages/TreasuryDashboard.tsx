"use client";

import React, { useState, useEffect } from "react";
import { FinancialEntryForm } from "@/components/treasury/FinancialEntryForm";
import { FinancialEntryList } from "@/components/treasury/FinancialEntryList";
import { TreasurySummary } from "@/components/treasury/TreasurySummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { showSuccess } from "@/utils/toast";

// Definindo o tipo FinancialEntry aqui para ser usado pelos componentes
export type FinancialEntry = {
  id: string;
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
  const [entries, setEntries] = useState<FinancialEntry[]>(() => {
    // Carregar entradas do localStorage ao iniciar
    if (typeof window !== "undefined") {
      const savedEntries = localStorage.getItem("treasuryEntries");
      return savedEntries
        ? JSON.parse(savedEntries).map((entry: FinancialEntry) => ({
            ...entry,
            date: new Date(entry.date), // Converter string de volta para Date
          }))
        : [];
    }
    return [];
  });

  useEffect(() => {
    // Salvar entradas no localStorage sempre que forem atualizadas
    if (typeof window !== "undefined") {
      localStorage.setItem("treasuryEntries", JSON.stringify(entries));
    }
  }, [entries]);

  const handleAddEntry = (newEntry: Omit<FinancialEntry, "id">) => {
    const entryWithId: FinancialEntry = {
      ...newEntry,
      id: crypto.randomUUID(), // Gerar um ID único
    };
    setEntries((prevEntries) => [...prevEntries, entryWithId]);
    showSuccess("Anotação financeira adicionada com sucesso!");
  };

  const totalIncome = entries
    .filter((entry) => entry.type === "income")
    .reduce((sum, entry) => sum + entry.amount, 0);

  const totalExpenses = entries
    .filter((entry) => entry.type === "expense")
    .reduce((sum, entry) => sum + entry.amount, 0);

  const balance = totalIncome - totalExpenses;

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