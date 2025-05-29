import { WebhookHandler, WebhookHandlerParams } from "@/types/webhook";
import { createResponse } from "@/lib/response";

export class GitHubWebhookHandler implements WebhookHandler {
  async handle({
    chatType,
    chatNumber,
    body,
  }: WebhookHandlerParams): Promise<Response> {
    // TODO: 实现 GitHub webhook 处理逻辑
    return createResponse(
      { detail: "GitHub webhook handler not implemented yet" },
      501
    );
  }
}
