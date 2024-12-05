"use server";

import { createSession, deleteSession } from "~/lib/session";
import { redirect } from "next/navigation";

const testUser = {
  id: "1",
  email: "test@ut.ee",
  password: "12345678",
};

export async function login(email: string, password: string) {
  if (email !== testUser.email || password !== testUser.password) {
    console.log("Invalid login credentials");
    return;
  }
  await createSession(testUser.id);

  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}
