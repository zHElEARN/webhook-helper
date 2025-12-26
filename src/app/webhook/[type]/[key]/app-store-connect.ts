import { WEBHOOK_ENDPOINT } from "@/lib/env";
import { sendMessage } from "@/lib/onebot";
import { createResponse } from "@/lib/response";
import { logWebhook } from "@/lib/webhook-log";
import { WebhookHandler, WebhookHandlerParams } from "@/types/webhook";
import { z } from "zod";

const relationshipSchema = z.object({
  id: z.string(),
  type: z.string(),
});

const relationshipDataSchema = z.object({
  data: relationshipSchema,
});

const appStoreVersionRelationshipSchema = z.object({
  instance: relationshipDataSchema,
});

const stateChangeAttributesSchema = z.object({
  oldValue: z.string(),
  newValue: z.string(),
  timestamp: z.string(),
});

const pingAttributesSchema = z.object({
  timestamp: z.string(),
});

const stateChangeDataSchema = z.object({
  id: z.string(),
  type: z.literal("appStoreVersionAppVersionStateUpdated"),
  attributes: stateChangeAttributesSchema,
  relationships: appStoreVersionRelationshipSchema,
});

const pingDataSchema = z.object({
  id: z.string(),
  type: z.literal("webhookPingCreated"),
  attributes: pingAttributesSchema,
});

// Union schema for all supported App Store Connect events
const appStoreConnectEventSchema = z.object({
  data: z.discriminatedUnion("type", [stateChangeDataSchema, pingDataSchema]),
});

export class AppStoreConnectWebhookHandler implements WebhookHandler {
  async handle({
    chatType,
    chatNumber,
    body,
  }: WebhookHandlerParams): Promise<Response> {
    try {
      const parsedBody = appStoreConnectEventSchema.parse(body);
      const eventData = parsedBody.data;

      const { id, error } = await logWebhook("app-store-connect", parsedBody);
      if (error) {
        return createResponse({ detail: error }, 500);
      }

      let message = "";

      switch (eventData.type) {
        case "appStoreVersionAppVersionStateUpdated": {
          const { oldValue, newValue, timestamp } = eventData.attributes;
          const oldStatus = oldValue;
          const newStatus = newValue;
          const formattedTime = new Date(timestamp).toLocaleString("zh-CN", {
            timeZone: "Asia/Shanghai",
          });

          message = `App Store Connect 状态变更\n详细: ${WEBHOOK_ENDPOINT}/logs/${id}\n\n旧状态: ${oldStatus}\n新状态: ${newStatus}\n时间: ${formattedTime}`;
          break;
        }
        case "webhookPingCreated": {
          const { timestamp } = eventData.attributes;
          const formattedTime = new Date(timestamp).toLocaleString("zh-CN", {
            timeZone: "Asia/Shanghai",
          });
          message = `App Store Connect 测试 Ping\n详细: ${WEBHOOK_ENDPOINT}/logs/${id}\n\n接收时间: ${formattedTime}`;
          break;
        }
      }

      if (!message) {
        // Should not happen due to discriminated union, but good for safety
        return createResponse({ detail: "Unknown event type" }, 400);
      }

      const sendResult = await sendMessage(
        { chatType, chatNumber },
        message.trim()
      );

      if (sendResult.error) {
        return createResponse({ detail: sendResult.error }, 400);
      }

      return createResponse(null, 204);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(
          `[${new Date().toISOString()}] Invalid request body:`,
          error.errors
        );
        return createResponse(
          { detail: "Invalid request body", errors: error.errors },
          400
        );
      }
      return createResponse({ detail: "Invalid JSON or Schema Mismatch" }, 400);
    }
  }
}
