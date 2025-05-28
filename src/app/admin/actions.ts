"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const getAPIKeys = async () => {
  return await prisma.aPIKey.findMany({
    orderBy: {
      id: "desc",
    },
  });
};

export const createAPIKey = async () => {
  await prisma.aPIKey.create({
    data: {
      key: crypto.randomUUID(),
    },
  });
  revalidatePath("/admin");
};

export const deleteAPIKey = async (id: string) => {
  await prisma.aPIKey.delete({
    where: {
      id,
    },
  });
  revalidatePath("/admin");
};
