import { db } from "~/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, ctx.session.user.id),
    });
    return user;
  }),
});
