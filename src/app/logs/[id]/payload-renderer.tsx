import { Separator } from "@/components/ui/separator";
import { CustomPayload } from "./custom-payload";
import { GenericPayload } from "./genereic-payload";
import { GitHubPayload } from "./github-payload";
import { UptimeKumaPayload } from "./uptime-kuma-payload";

interface WebhookLog {
  id: string;
  type: string;
  payload: any;
  createdAt: Date;
}

interface PayloadRendererProps {
  webhookLog: WebhookLog;
}

export const PayloadRenderer = ({ webhookLog }: PayloadRendererProps) => {
  const renderPayload = () => {
    switch (webhookLog.type) {
      case "custom":
        return <CustomPayload payload={webhookLog.payload} />;
      case "uptime-kuma":
        return <UptimeKumaPayload payload={webhookLog.payload} />;
      case "github":
        return <GitHubPayload payload={webhookLog.payload} />;
      default:
        return <GenericPayload payload={webhookLog.payload} />;
    }
  };

  return (
    <>
      {renderPayload()}
      <Separator />
    </>
  );
};
