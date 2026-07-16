import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { authenticateRequest } from "./kimi/auth";
import { Context } from "./context";
import { Session } from "@contracts/constants";

const t = initTRPC.context<Context>().create({ transformer: superjson });

export const createRouter = t.router;
export const publicProcedure = t.procedure;

export const authedProcedure = t.procedure.use(async ({ ctx, next }) => {
  const user = await authenticateRequest(ctx.req.headers);
  return next({ ctx: { ...ctx, user } });
});

export const adminProcedure = authedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new Error("Admin access required");
  }
  return next({ ctx });
});

// Aliases matching imports in routers
export { publicProcedure as publicQuery };
export { authedProcedure as authedQuery };
export { adminProcedure as adminQuery };
export { publicProcedure as publicMutation };
export { authedProcedure as authedMutation };
export { adminProcedure as adminMutation };
