import { ONEBOT_ACCESS_TOKEN, ONEBOT_API_URL } from "./env";

interface ChatInfo {
  chatType: string;
  chatNumber: string;
}

export const sendMessage = async (chatInfo: ChatInfo, message: string) => {
  if (isNaN(Number(chatInfo.chatNumber))) {
    return {
      success: false,
      error: "Chat number must be a valid number",
    };
  }

  let endpoint;
  let payload;

  if (chatInfo.chatType === "group") {
    endpoint = "/send_group_msg";
    payload = {
      group_id: chatInfo.chatNumber,
      message: [
        {
          type: "text",
          data: { text: message },
        },
      ],
    };
  } else if (chatInfo.chatType === "private") {
    endpoint = "/send_private_msg";
    payload = {
      user_id: chatInfo.chatNumber,
      message: [
        {
          type: "text",
          data: { text: message },
        },
      ],
    };
  } else {
    return {
      success: false,
      error: "Invalid chat type",
    };
  }

  let headers: {
    "Content-Type": string;
    Authorization?: string;
  } = {
    "Content-Type": "application/json",
  };
  if (ONEBOT_ACCESS_TOKEN) {
    headers["Authorization"] = `Bearer ${ONEBOT_ACCESS_TOKEN}`;
  }

  try {
    const response = await fetch(`${ONEBOT_API_URL}${endpoint}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to send message",
      };
    }

    if (data.status != "ok") {
      return {
        success: false,
        error: data.message || "Failed to send message",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
