import { ONEBOT_ACCESS_TOKEN, ONEBOT_API_URL } from "./env";

interface ChatInfo {
  chatType: string;
  chatNumber: string;
}

const endpointConfig = {
  group: {
    endpoint: "/send_group_msg",
    idField: "group_id",
  },
  private: {
    endpoint: "/send_private_msg",
    idField: "user_id",
  },
};

export const sendMessage = async (
  chatInfo: ChatInfo,
  message: string
): Promise<{
  error: string | null;
}> => {
  if (isNaN(Number(chatInfo.chatNumber))) {
    return { error: "Chat number must be a valid number" };
  }

  const config =
    endpointConfig[chatInfo.chatType as keyof typeof endpointConfig];
  if (!config) {
    return { error: "Invalid chat type" };
  }

  const payload = {
    [config.idField]: chatInfo.chatNumber,
    message: [{ type: "text", data: { text: message } }],
  };

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(ONEBOT_ACCESS_TOKEN && {
      Authorization: `Bearer ${ONEBOT_ACCESS_TOKEN}`,
    }),
  };

  try {
    const response = await fetch(`${ONEBOT_API_URL}${config.endpoint}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || "Failed to send message" };
    }

    if (data.status != "ok") {
      return { error: data.message || "Failed to send message" };
    }

    return { error: null };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
