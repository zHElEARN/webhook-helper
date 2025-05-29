import { WebhookHandler } from "@/types/webhook";
import { CustomWebhookHandler } from "./custom";
import { UptimeKumaWebhookHandler } from "./uptime-kuma";
import { GitHubWebhookHandler } from "./github";

export class WebhookHandlerFactory {
  private static handlers: Record<string, WebhookHandler> = {
    custom: new CustomWebhookHandler(),
    "uptime-kuma": new UptimeKumaWebhookHandler(),
    github: new GitHubWebhookHandler(),
  };

  static getHandler(type: string): WebhookHandler | null {
    return this.handlers[type] || null;
  }

  static getSupportedTypes(): string[] {
    return Object.keys(this.handlers);
  }
}
