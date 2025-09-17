"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TreasurySummaryProps = {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
};

export function TreasurySummary({
  totalIncome,
  totalExpenses,
  balance,
}: TreasurySummaryProps) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Entradas</CardTitle>
          <span className="text-green-500">▲</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            R$ {totalIncome.toFixed(2).replace(".", ",")}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Saídas</CardTitle>
          <span className="text-red-500">▼</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            R$ {totalExpenses.toFixed(2).replace(".", ",")}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
          <span>💰</span>
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              balance >= 0 ? "text-blue-600" : "text-red-600"
            }`}
          >
            R$ {balance.toFixed(2).replace(".", ",")}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}