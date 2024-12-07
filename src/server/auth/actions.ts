"use server";

import { createSession, deleteSession } from "~/lib/session";
import { redirect } from "next/navigation";
import { db } from "../db";
import { users } from "../db/schema";
import bcrypt from "bcrypt";

export async function login(email: string, password: string) {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  });
  if (!user) {
    return {
      error: "Invalid email or password",
    };
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return {
      error: "Invalid email or password",
    };
  }

  await createSession(user.id.toString());
  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}

export const registerUser = async (email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  });

  if (existingUser) {
    return {
      error: "User already exists",
    };
  }

  const newUser = await db
    .insert(users)
    .values({
      email,
      password: hashedPassword,
    })
    .returning();

  const userId = newUser[0]?.id;

  if (!userId) {
    return {
      error: "Can't create user",
    };
  }
  await createSession(userId.toString());
  redirect("/dashboard");
};
