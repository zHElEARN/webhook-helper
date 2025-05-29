import { Card, CardContent } from "@/components/ui/card";
import { MessageSquareIcon } from "lucide-react";

interface CustomPayloadProps {
  payload: { message: string };
}

export const CustomPayload = ({ payload }: CustomPayloadProps) => {
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
};
