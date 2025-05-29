"use server";

import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";
import { CalendarIcon, HashIcon, MessageSquareIcon } from "lucide-react";
import { PayloadRenderer } from "./payload-renderer";
import { RawDataCollapsible } from "./rawdata-collapsible";

const LogPage = async ({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await params;

  const webhookLog = await prisma.webhookLog.findUnique({
    where: {
      id: id,
    },
  });

  if (!webhookLog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <MessageSquareIcon className="mx-auto h-12 w-12 mb-4" />
          <h2 className="text-xl font-semibold mb-2">日志未找到</h2>
          <p>请检查日志 ID 是否正确</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Webhook 日志详情</h1>
          <div className="flex items-center space-x-2">
            <Badge
              variant={webhookLog.type === "custom" ? "default" : "secondary"}
              className="text-sm px-3 py-1"
            >
              类型: {webhookLog.type}
            </Badge>
            <ThemeToggle />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
              <HashIcon className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">日志 ID</p>
              <p className="font-mono text-sm font-medium">{webhookLog.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
              <CalendarIcon className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">创建时间</p>
              <p className="text-sm font-medium">
                {new Date(webhookLog.createdAt).toLocaleString("zh-CN")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <PayloadRenderer webhookLog={webhookLog} />
        <RawDataCollapsible payload={webhookLog.payload} />
      </div>
    </div>
  );
};

export default LogPage;
