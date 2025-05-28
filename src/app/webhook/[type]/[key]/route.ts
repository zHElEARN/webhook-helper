import { isKeyExists } from "@/lib/api-key";
import { sendMessage } from "@/lib/onebot";
import { createResponse } from "@/lib/response";
import { NextRequest, NextResponse } from "next/server";

const supportedTypes = ["github", "uptime-kuma", "custom"];

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
    return createResponse({ error: "Missing required parameters" }, 400);
  }

  if (!supportedTypes.includes(type)) {
    return createResponse({ error: "Unsupported type" }, 400);
  }

  if (!(await isKeyExists(key))) {
    return createResponse({ error: "Invalid API key" }, 401);
  }

  if (type === "custom") {
    const body = await request.json();

    return createResponse(
      await sendMessage(
        {
          chatType: chatType!,
          chatNumber: chatNumber!,
        },
        body.message
      )
    );
  }

  return NextResponse.json({
    type,
    key,
    chatType,
    chatNumber,
  });
};

export { POST };
