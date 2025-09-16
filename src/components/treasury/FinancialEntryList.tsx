"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Trash2 } from "lucide-react"; // Importar o ícone de lixeira
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button"; // Importar Button
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FinancialEntry } from "@/pages/TreasuryDashboard"; // Importando o tipo

type FinancialEntryListProps = {
  entries: FinancialEntry[];
  onDeleteEntry: (id: string) => void; // Adicionar prop para a função de exclusão
};

export function FinancialEntryList({ entries, onDeleteEntry }: FinancialEntryListProps) {
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
            <TableHead className="text-center">Ações</TableHead> {/* Nova coluna para ações */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
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
                <TableCell className="text-center">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso excluirá permanentemente
                          este lançamento financeiro.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDeleteEntry(entry.id)}>
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}