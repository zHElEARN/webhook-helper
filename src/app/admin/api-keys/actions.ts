"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const getAPIKeys = async () => {
  try {
    const apiKeys = await prisma.aPIKey.findMany({
      orderBy: {
        id: "desc",
      },
    });
    return { success: true, data: apiKeys };
  } catch (error) {
    console.error("获取 API Keys 失败:", error);
    return {
      success: false,
      error: "获取 API Keys 失败",
      data: [],
    };
  }
};

export const createAPIKey = async (key: string) => {
  try {
    const existing = await prisma.aPIKey.findFirst({ where: { key } });
    if (existing) {
      return { success: false, error: "API Key 已存在" };
    }

    await prisma.aPIKey.create({ data: { key } });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("创建 API Key 失败:", error);
    return { success: false, error: "创建 API Key 失败" };
  }
};

export const deleteAPIKey = async (id: string) => {
  try {
    await prisma.aPIKey.delete({
      where: {
        id,
      },
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("删除 API Key 失败:", error);
    return { success: false, error: "删除 API Key 失败" };
  }
};
