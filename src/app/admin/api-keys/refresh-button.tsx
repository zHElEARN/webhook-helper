"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export const RefreshButton = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <Button 
      onClick={handleRefresh} 
      disabled={isPending} 
      variant="outline"
    >
      <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
    </Button>
  );
};