"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { createAPIKey } from "./actions";
import { useTransition } from "react";
import { toast } from "sonner";

export const CreateButton = () => {
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    startTransition(async () => {
      const result = await createAPIKey();
      if (result.success) {
        toast.success("创建成功");
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <Button onClick={handleCreate} disabled={isPending}>
      <Plus className="h-4 w-4" />
      {!isPending && <span className="ml-1">创建</span>}
    </Button>
  );
};
