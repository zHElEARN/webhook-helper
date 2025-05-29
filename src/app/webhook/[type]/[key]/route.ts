import { isKeyExists } from "@/lib/api-key";
import { WEBHOOK_ENDPOINT } from "@/lib/env";
import { sendMessage } from "@/lib/onebot";
import { createResponse } from "@/lib/response";
import { logWebhook } from "@/lib/webhook-log";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const supportedTypes = ["github", "uptime-kuma", "custom"];

const customMessageSchema = z
  .object({
    message: z.string(),
  })
  .strict();

const heartbeatSchema = z
  .object({
    monitorID: z.number(),
    status: z.number(),
    time: z.string(),
    msg: z.string(),
    important: z.boolean(),
    duration: z.number(),
    timezone: z.string(),
    timezoneOffset: z.string(),
    localDateTime: z.string(),
    ping: z.number().nullable(),
  })
  .strict();

const monitorSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable(),
    pathName: z.string(),
    parent: z.any().nullable(),
    childrenIDs: z.array(z.any()).default([]),
    url: z.string(),
    method: z.string(),
    hostname: z.string().nullable(),
    port: z.number().nullable(),
    maxretries: z.number(),
    weight: z.number(),
    active: z.boolean(),
    forceInactive: z.boolean(),
    type: z.string(),
    timeout: z.number(),
    interval: z.number(),
    retryInterval: z.number(),
    resendInterval: z.number(),
    keyword: z.string().nullable(),
    invertKeyword: z.boolean(),
    expiryNotification: z.boolean(),
    ignoreTls: z.boolean(),
    upsideDown: z.boolean(),
    packetSize: z.number(),
    maxredirects: z.number(),
    accepted_statuscodes: z.array(z.string()),
    dns_resolve_type: z.string(),
    dns_resolve_server: z.string(),
    dns_last_result: z.string().nullable(),
    docker_container: z.string(),
    docker_host: z.string().nullable(),
    proxyId: z.number().nullable(),
    notificationIDList: z.record(z.boolean()),
    tags: z.array(z.any()).default([]),
    maintenance: z.boolean(),
    mqttTopic: z.string(),
    mqttSuccessMessage: z.string(),
    databaseQuery: z.string().nullable(),
    authMethod: z.string().nullable(),
    grpcUrl: z.string().nullable(),
    grpcProtobuf: z.string().nullable(),
    grpcMethod: z.string().nullable(),
    grpcServiceName: z.string().nullable(),
    grpcEnableTls: z.boolean(),
    radiusCalledStationId: z.string().nullable(),
    radiusCallingStationId: z.string().nullable(),
    game: z.string().nullable(),
    gamedigGivenPortOnly: z.boolean(),
    httpBodyEncoding: z.string().nullable(),
    jsonPath: z.string().nullable(),
    expectedValue: z.string().nullable(),
    kafkaProducerTopic: z.string().nullable(),
    kafkaProducerBrokers: z.array(z.any()).default([]),
    kafkaProducerSsl: z.boolean(),
    kafkaProducerAllowAutoTopicCreation: z.boolean(),
    kafkaProducerMessage: z.string().nullable(),
    screenshot: z.string().nullable(),
    includeSensitiveData: z.boolean(),
  })
  .strict();

const uptimeKumaWebhookSchema = z
  .object({
    heartbeat: heartbeatSchema,
    monitor: monitorSchema,
    msg: z.string(),
  })
  .strict();

const POST = async (
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ type: string; key: string }>;
  }
) => {
  const { type, key } = await params;
  const queryParams = request.nextUrl.searchParams;
  const chatType = queryParams.get("chat_type");
  const chatNumber = queryParams.get("chat_number");

  const requiredParams = [type, key, chatType, chatNumber];
  if (requiredParams.some((param) => !param)) {
    return createResponse({ datail: "Missing required parameters" }, 400);
  }

  if (!supportedTypes.includes(type)) {
    return createResponse({ datail: "Unsupported type" }, 400);
  }

  if (!(await isKeyExists(key))) {
    return createResponse({ datail: "Invalid API key" }, 401);
  }

  if (type === "custom") {
    try {
      const validatedBody = customMessageSchema.parse(await request.json());

      const { id, error } = await logWebhook(type, validatedBody);
      if (error) {
        return createResponse({ detail: error }, 500);
      }

      const message = `Custom Webhook\n详细: ${WEBHOOK_ENDPOINT}/logs/${id}\n\n${validatedBody.message}`;

      if (
        (
          await sendMessage(
            {
              chatType: chatType!,
              chatNumber: chatNumber!,
            },
            message
          )
        ).error
      ) {
        return createResponse({ detail: error }, 400);
      }

      return createResponse(null, 204);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return createResponse({ detail: "Invalid request body" }, 400);
      }
      return createResponse({ detail: "Invalid JSON" }, 400);
    }
  } else if (type === "uptime-kuma") {
    try {
      const validatedBody = uptimeKumaWebhookSchema.parse(await request.json());

      const { id, error } = await logWebhook(type, validatedBody);
      if (error) {
        return createResponse({ detail: error }, 500);
      }

      const message = `Uptime Kuma Webhook\n详细: ${WEBHOOK_ENDPOINT}/logs/${id}\n\nMonitor: ${validatedBody.monitor.name}\nMessage: ${validatedBody.msg}`;

      if (
        (
          await sendMessage(
            {
              chatType: chatType!,
              chatNumber: chatNumber!,
            },
            message
          )
        ).error
      ) {
        return createResponse({ detail: error }, 400);
      }

      return createResponse(null, 204);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Invalid request body:", error.errors);
        return createResponse({ detail: "Invalid request body" }, 400);
      }
      return createResponse({ detail: "Invalid JSON" }, 400);
    }
  }

  return NextResponse.json({
    type,
    key,
    chatType,
    chatNumber,
  });
};

export { POST };
