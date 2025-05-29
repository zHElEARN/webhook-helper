import { prisma } from "./db";

export const isKeyExists = async (key: string): Promise<boolean> => {
  try {
    const apiKey = await prisma.aPIKey.findUnique({
      where: {
        key: key,
      },
    });

    return apiKey !== null;
  } catch (error) {
    console.error("Error checking API key existence:", error);
    return false;
  }
};
