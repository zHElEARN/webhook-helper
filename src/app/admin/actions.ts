"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const logout = async () => {
  (await cookies()).delete("token");
  redirect("/admin/login");
};
