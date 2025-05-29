"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createAPIKey } from "./actions";
import { CreateModal } from "./create-modal";

export const CreateButton = () => {
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreate = (key: string) => {
    startTransition(async () => {
      const result = await createAPIKey(key);
      if (result.success) {
        toast.success("创建成功");
        setModalOpen(false);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <>
      <Button onClick={() => setModalOpen(true)} disabled={isPending}>
        <Plus className="h-4 w-4" />
        <span className="ml-1">创建</span>
      </Button>

      <CreateModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onConfirm={handleCreate}
        isPending={isPending}
      />
    </>
  );
};
