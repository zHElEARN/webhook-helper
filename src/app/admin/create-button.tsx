"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { createAPIKey } from "./actions";
import { useTransition } from "react";

export const CreateButton = () => {
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    startTransition(async () => {
      await createAPIKey();
    });
  };

  return (
    <Button onClick={handleCreate} disabled={isPending} className="mb-4">
      <Plus className="w-4 h-4 mr-2" />
      {isPending ? "创建中..." : "创建 API Key"}
    </Button>
  );
};
