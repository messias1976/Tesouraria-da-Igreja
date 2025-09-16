"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FinancialEntry } from "@/pages/TreasuryDashboard"; // Importando o tipo

type FinancialEntryListProps = {
  entries: FinancialEntry[];
};

export function FinancialEntryList({ entries }: FinancialEntryListProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Contribuinte</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead>Descrição</TableHead>
            {/* Colunas de Tesoureiro e Vice-Tesoureiro removidas */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                Nenhuma anotação financeira ainda.
              </TableCell>
            </TableRow>
          ) : (
            entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  {format(entry.date, "dd/MM/yyyy", { locale: ptBR })}
                </TableCell>
                <TableCell>
                  {entry.type === "income" ? "Entrada" : "Saída"}
                </TableCell>
                <TableCell>{entry.category}</TableCell>
                <TableCell>{entry.payerName || "-"}</TableCell>
                <TableCell
                  className={`text-right font-medium ${
                    entry.type === "income" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {entry.type === "income" ? "+" : "-"} R${" "}
                  {entry.amount.toFixed(2).replace(".", ",")}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {entry.description || "-"}
                </TableCell>
                {/* Células de Tesoureiro e Vice-Tesoureiro removidas */}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}