import { initTRPC } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";

import { TRPCError } from "@trpc/server";
import { createContext } from "./context";
import { getAuthenticationCookie } from "./utils/cookie";
import { userService } from "./services";

export const tRPCContext = initTRPC.meta<OpenApiMeta>().context<typeof createContext>().create({});

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure;

// work like auth middleware for routes.
export const authenticatedProcedure = tRPCContext.procedure.use(async (options) => {
  const { ctx } = options;
  const token = getAuthenticationCookie(ctx);
  if (!token) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Authentication token is missing" });
  }

  const { id } = await userService.verifyAndDecodeToken(token);

  return options.next({
    ctx: {
      ...ctx,
      user: {
        id,
      },
    },
  });
});
