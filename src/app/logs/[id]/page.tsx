"use server";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/db";
import {
  CalendarIcon,
  ChevronRightIcon,
  CodeIcon,
  HashIcon,
  MessageSquareIcon,
} from "lucide-react";

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

  const renderMainPayload = () => {
    if (webhookLog.type === "custom") {
      const payload = webhookLog.payload as { message: string };
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MessageSquareIcon className="h-4 w-4" />
            <span className="font-medium">消息内容</span>
          </div>
          <Card className="bg-muted/50">
            <CardContent>
              <p className="text-sm leading-relaxed">{payload.message}</p>
            </CardContent>
          </Card>
        </div>
      );
    } else {
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CodeIcon className="h-4 w-4" />
            <span className="font-medium">Payload 内容</span>
          </div>
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <pre className="text-xs font-mono whitespace-pre-wrap break-all overflow-x-auto">
                {JSON.stringify(webhookLog.payload, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      );
    }
  };
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Webhook 日志详情</h1>
          <Badge
            variant={webhookLog.type === "custom" ? "default" : "secondary"}
            className="text-sm px-3 py-1"
          >
            类型: {webhookLog.type}
          </Badge>
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
        {renderMainPayload()}

        <Separator />

        <Collapsible defaultOpen={false}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="group flex items-center gap-2 w-full justify-start p-0"
            >
              <ChevronRightIcon className="h-4 w-4 group-data-[state=open]:rotate-90" />
              <span className="font-medium">查看原始 JSON 数据</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <Card className="bg-muted/30">
              <CardContent>
                <pre className="text-xs font-mono whitespace-pre-wrap break-all overflow-x-auto max-h-96 overflow-y-auto">
                  {JSON.stringify(webhookLog.payload, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default LogPage;
