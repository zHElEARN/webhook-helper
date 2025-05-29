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
  }

  return NextResponse.json({
    type,
    key,
    chatType,
    chatNumber,
  });
};

export { POST };
