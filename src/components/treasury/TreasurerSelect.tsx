"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "@/components/SessionContextProvider";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";

type Treasurer = {
  id: string;
  name: string;
  user_id: string;
};

type TreasurerSelectProps = {
  selectedTreasurer: string | undefined;
  onTreasurerChange: (name: string) => void;
};

export function TreasurerSelect({
  selectedTreasurer,
  onTreasurerChange,
}: TreasurerSelectProps) {
  const { session } = useSession();
  const userId = session?.user?.id;
  const [treasurers, setTreasurers] = useState<Treasurer[]>([]);
  const [newTreasurerName, setNewTreasurerName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTreasurers = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("treasurers")
        .select("*")
        .eq("user_id", userId)
        .order("name", { ascending: true });

      if (error) throw error;
      setTreasurers(data || []);
    } catch (err: any) {
      console.error("Erro ao buscar tesoureiros:", err.message);
      showError("Erro ao carregar a lista de tesoureiros.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTreasurers();

    const subscription = supabase
      .channel("treasurers_channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "treasurers",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("Mudança em tempo real de tesoureiros:", payload);
          fetchTreasurers();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userId]);

  const handleAddTreasurer = async () => {
    if (!userId || !newTreasurerName.trim()) {
      showError("O nome do tesoureiro não pode ser vazio.");
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("treasurers")
        .insert({ user_id: userId, name: newTreasurerName.trim() })
        .select();

      if (error) throw error;

      showSuccess("Tesoureiro adicionado com sucesso!");
      setNewTreasurerName("");
      setIsDialogOpen(false);
      fetchTreasurers(); // Re-fetch para atualizar a lista
      if (data && data.length > 0) {
        onTreasurerChange(data[0].name); // Seleciona o novo tesoureiro automaticamente
      }
    } catch (err: any) {
      console.error("Erro ao adicionar tesoureiro:", err.message);
      showError("Erro ao adicionar tesoureiro: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Select
        onValueChange={onTreasurerChange}
        value={selectedTreasurer}
        disabled={isLoading || !userId}
      >
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Selecione o Tesoureiro" />
        </SelectTrigger>
        <SelectContent>
          {treasurers.map((treasurer) => (
            <SelectItem key={treasurer.id} value={treasurer.name}>
              {treasurer.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" disabled={!userId}>
            <PlusCircle className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Tesoureiro</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={newTreasurerName}
                onChange={(e) => setNewTreasurerName(e.target.value)}
                className="col-span-3"
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleAddTreasurer}
              disabled={isLoading || !newTreasurerName.trim()}
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}