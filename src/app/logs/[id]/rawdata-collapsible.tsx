import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRightIcon } from "lucide-react";

interface RawDataCollapsibleProps {
  payload: any;
}

export const RawDataCollapsible = ({ payload }: RawDataCollapsibleProps) => {
  return (
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
              {JSON.stringify(payload, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
};
