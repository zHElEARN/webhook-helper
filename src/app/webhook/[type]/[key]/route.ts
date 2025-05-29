import { isKeyExists } from "@/lib/api-key";
import { createResponse } from "@/lib/response";
import { NextRequest } from "next/server";
import { WebhookHandlerFactory } from "./webhook-factory";

const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ type: string; key: string }> }
) => {
  const { type, key } = await params;
  const queryParams = request.nextUrl.searchParams;
  const chatType = queryParams.get("chat_type");
  const chatNumber = queryParams.get("chat_number");

  const requiredParams = [type, key, chatType, chatNumber];
  if (requiredParams.some((param) => !param)) {
    return createResponse({ detail: "Missing required parameters" }, 400);
  }

  if (!WebhookHandlerFactory.getSupportedTypes().includes(type)) {
    return createResponse({ detail: "Unsupported type" }, 400);
  }

  if (!(await isKeyExists(key))) {
    return createResponse({ detail: "Invalid API key" }, 401);
  }

  const handler = WebhookHandlerFactory.getHandler(type);
  if (!handler) {
    return createResponse({ detail: "Handler not found" }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    console.error("Invalid JSON body:", error);
    return createResponse({ detail: "Invalid JSON" }, 400);
  }

  return handler.handle({ chatType: chatType!, chatNumber: chatNumber!, body });
};

export { POST };
