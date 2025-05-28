"use server";

import { ADMIN_PASSWORD, ADMIN_USERNAME } from "@/lib/env";
import { cookies } from "next/headers";

export const login = async (username: string, password: string) => {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    (await cookies()).set("token", btoa(`${username}:${password}`), {
      httpOnly: true,
      sameSite: "strict",
    });

    return true;
  }
  return false;
};
