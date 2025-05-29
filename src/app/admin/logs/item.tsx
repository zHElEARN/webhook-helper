"use client";

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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteWebhookLog } from "./actions";

interface LogItemProps {
  log: {
    id: string;
    type: string;
    createdAt: Date;
    payload?: any;
  };
}

export const LogItem = ({ log }: LogItemProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    router.push(`/logs/${log.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    startTransition(async () => {
      const result = await deleteWebhookLog(log.id);
      if (result.success) {
        toast.success("删除成功");
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div
      className="flex items-center justify-between py-3 px-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">ID: {log.id}</span>
        <Badge variant="outline">{log.type}</Badge>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          {log.createdAt.toLocaleString()}
        </span>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              disabled={isPending}
              variant="destructive"
              size="sm"
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认删除</AlertDialogTitle>
              <AlertDialogDescription>
                确定要删除这条日志记录吗？此操作无法撤销。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isPending}>
                删除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
