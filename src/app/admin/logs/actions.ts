"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const getWebhookLogs = async (
  page: number = 1,
  pageSize: number = 10
) => {
  try {
    const skip = (page - 1) * pageSize;

    const [logs, total] = await Promise.all([
      prisma.webhookLog.findMany({
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: pageSize,
      }),
      prisma.webhookLog.count(),
    ]);

    return {
      success: true,
      logs,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
      pageSize,
    };
  } catch (error) {
    console.error("获取 Webhook 日志失败:", error);
    return {
      success: false,
      error: "获取 Webhook 日志失败",
      logs: [],
      total: 0,
      totalPages: 0,
      currentPage: page,
      pageSize,
    };
  }
};

export const deleteWebhookLog = async (id: string) => {
  try {
    await prisma.webhookLog.delete({
      where: { id },
    });

    revalidatePath("/admin/logs");

    return {
      success: true,
    };
  } catch (error) {
    console.error("删除 Webhook 日志失败:", error);
    return {
      success: false,
      error: "删除 Webhook 日志失败",
    };
  }
};
