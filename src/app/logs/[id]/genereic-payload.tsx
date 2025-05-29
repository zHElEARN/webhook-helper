import { Card, CardContent } from "@/components/ui/card";
import { CodeIcon } from "lucide-react";

interface GenericPayloadProps {
  payload: unknown;
}

export const GenericPayload = ({ payload }: GenericPayloadProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <CodeIcon className="h-4 w-4" />
        <span className="font-medium">Payload 内容</span>
      </div>
      <Card className="bg-muted/50">
        <CardContent className="pt-4">
          <pre className="text-xs font-mono whitespace-pre-wrap break-all overflow-x-auto">
            {JSON.stringify(payload, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};
