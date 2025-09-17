"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FinancialEntry } from "@/pages/TreasuryDashboard"; // Importando o tipo
import { useSession } from "@/components/SessionContextProvider"; // Importar useSession
import { TreasurerSelect } from "./TreasurerSelect"; // Importar o novo componente

// Define o esquema do formulário
const formSchema = z.object({
  type: z.enum(["income", "expense"], {
    required_error: "O tipo é obrigatório.",
  }),
  category: z.enum(["dízimo", "oferta", "voto", "despesa"], {
    required_error: "A categoria é obrigatória.",
  }),
  amount: z.coerce
    .number()
    .min(0.01, "O valor deve ser maior que zero.")
    .refine((val) => !isNaN(val), {
      message: "O valor deve ser um número válido.",
    }),
  date: z.date({
    required_error: "A data é obrigatória.",
  }),
  description: z.string().optional(),
  payerName: z.string().optional(),
  treasurerName: z.string().min(1, "O nome do tesoureiro é obrigatório."), // Adicionado de volta e agora é obrigatório
});

// Define o tipo para os valores do formulário explicitamente a partir do esquema Zod
type FinancialEntryFormValues = z.infer<typeof formSchema>;

type FinancialEntryFormProps = {
  onAddEntry: (entry: FinancialEntryFormValues) => void;
};

export function FinancialEntryForm({ onAddEntry }: FinancialEntryFormProps) {
  const { session } = useSession();
  // O nome do tesoureiro inicial será o do usuário logado, mas pode ser alterado pelo select
  const defaultTreasurerName = session?.user?.user_metadata?.first_name || session?.user?.email || "Desconhecido";

  const form = useForm<FinancialEntryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "income",
      category: "dízimo",
      amount: 0,
      date: new Date(),
      description: "",
      payerName: "",
      treasurerName: defaultTreasurerName, // Usar o nome do tesoureiro padrão
    },
  });

  const onSubmit = (values: FinancialEntryFormValues) => {
    onAddEntry({
      type: values.type,
      category: values.category,
      amount: parseFloat(values.amount.toFixed(2)),
      date: values.date,
      description: values.description,
      payerName: values.payerName,
      treasurerName: values.treasurerName, // Agora vem do formulário
      viceTreasurerName: undefined, // Não há vice-tesoureiro no formulário
    });
    form.reset({
      type: "income",
      category: "dízimo",
      amount: 0,
      date: new Date(),
      description: "",
      payerName: "",
      treasurerName: defaultTreasurerName, // Resetar para o tesoureiro padrão
    });
  };

  const entryType = form.watch("type");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="income">Entrada</SelectItem>
                    <SelectItem value="expense">Saída</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="dízimo">Dízimo</SelectItem>
                    <SelectItem value="oferta">Oferta</SelectItem>
                    <SelectItem value="voto">Voto</SelectItem>
                    <SelectItem value="despesa">Despesa</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {entryType === "income" && (
          <FormField
            control={form.control}
            name="payerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Dizimista/Ofertante/Votante</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do contribuinte" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detalhes da transação"
                  className="resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="treasurerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Tesoureiro</FormLabel>
              <FormControl>
                <TreasurerSelect
                  selectedTreasurer={field.value}
                  onTreasurerChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Adicionar Anotação
        </Button>
      </form>
    </Form>
  );
}