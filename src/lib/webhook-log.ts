import { prisma } from "./db";

export const logWebhook = async (
  type: string,
  payload: any
): Promise<{
  id: string | null;
  error: string | null;
}> => {
  try {
    const webhookLog = await prisma.webhookLog.create({
      data: {
        type: type,
        payload: payload,
      },
    });
    return { id: webhookLog.id, error: null };
  } catch (error) {
    return {
      id: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
