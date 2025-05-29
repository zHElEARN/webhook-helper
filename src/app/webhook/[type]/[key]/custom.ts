import { WEBHOOK_ENDPOINT } from "@/lib/env";
import { sendMessage } from "@/lib/onebot";
import { createResponse } from "@/lib/response";
import { logWebhook } from "@/lib/webhook-log";
import { z } from "zod";
import { WebhookHandler, WebhookHandlerParams } from "@/types/webhook";

const customMessageSchema = z.object({ message: z.string() }).strict();

export class CustomWebhookHandler implements WebhookHandler {
  async handle({
    chatType,
    chatNumber,
    body,
  }: WebhookHandlerParams): Promise<Response> {
    try {
      const validatedBody = customMessageSchema.parse(body);

      const { id, error } = await logWebhook("custom", validatedBody);
      if (error) {
        return createResponse({ detail: error }, 500);
      }

      const message = `Custom Webhook\n详细: ${WEBHOOK_ENDPOINT}/logs/${id}\n\n${validatedBody.message}`;

      const sendResult = await sendMessage({ chatType, chatNumber }, message);

      if (sendResult.error) {
        return createResponse({ detail: sendResult.error }, 400);
      }

      return createResponse(null, 204);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return createResponse({ detail: "Invalid request body" }, 400);
      }
      return createResponse({ detail: "Invalid JSON" }, 400);
    }
  }
}
