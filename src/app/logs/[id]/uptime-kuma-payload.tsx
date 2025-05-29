import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircleIcon, MessageSquareIcon, XCircleIcon } from "lucide-react";

interface UptimeKumaPayload {
  msg: string;
  monitor: {
    id: number;
    name: string;
    type: string;
    url?: string;
    hostname?: string;
  };
  heartbeat: {
    status: number;
    time: string;
    duration: number;
    msg: string;
  };
}

interface UptimeKumaPayloadProps {
  payload: UptimeKumaPayload;
}

export const UptimeKumaPayload = ({ payload }: UptimeKumaPayloadProps) => {
  const StatusIcon =
    payload.heartbeat.status === 1 ? CheckCircleIcon : XCircleIcon;
  const statusText = payload.heartbeat.status === 1 ? "正常" : "异常";
  const statusColor =
    payload.heartbeat.status === 1 ? "text-green-600" : "text-red-600";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquareIcon className="h-4 w-4" />
        <span className="font-medium">Uptime Kuma 监控</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-muted/50">
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <StatusIcon className={`h-5 w-5 ${statusColor}`} />
                <span className={`font-medium ${statusColor}`}>
                  状态: {statusText}
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">监控名称</p>
                <p className="font-medium">{payload.monitor.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">监控类型</p>
                <Badge variant="outline">{payload.monitor.type}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">检测时间</p>
                <p className="font-medium text-sm">{payload.heartbeat.time}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">响应时间</p>
                <p className="font-medium">{payload.heartbeat.duration}ms</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {payload.monitor.type === "ping" ? "主机地址" : "目标地址"}
                </p>
                <p className="font-mono text-sm break-all">
                  {payload.monitor.type === "ping"
                    ? payload.monitor.hostname
                    : payload.monitor.url || payload.monitor.hostname}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {payload.heartbeat.msg && (
        <Card className="bg-muted/50">
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">错误信息</p>
              <p className="text-sm font-mono bg-background/50 p-2 rounded border">
                {payload.heartbeat.msg}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-muted/50">
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">完整消息</p>
            <p className="text-sm">{payload.msg}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
