import { exhibitionRouter } from "~/server/api/routers/exhibitions";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { quizRouter } from "./routers/quizzes";
import { categoryRouter } from "./routers/categories";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  exhibition: exhibitionRouter,
  quiz: quizRouter,
  category: categoryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.exhibition.all();
 *       ^? Exhibition[]
 */
export const createCaller = createCallerFactory(appRouter);
