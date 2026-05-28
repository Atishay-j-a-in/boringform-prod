import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { clearCookieFactory, createCookieFactory, getCookieFactory } from "./utils/cookie";

//user in context is optional because not all routes will require authentication, and we want to allow for public routes as well. For authenticated routes, we can check if the user is present in the context and throw an error if not.
export interface TRPCCtxUser {
  // Use string for UUID values (e.g. from uuid library) to avoid missing global type
  id: string;
}

// Define the shape of the context that will be available in all tRPC resolvers
export interface TRPCContext {
  createCookie: ReturnType<typeof createCookieFactory>;
  getCookie: ReturnType<typeof getCookieFactory>;
  clearCookie: ReturnType<typeof clearCookieFactory>;
  req: CreateExpressContextOptions["req"];
  user?: TRPCCtxUser; // This will be populated for authenticated routes
}

// Create the context for each request, which includes cookie management functions
export async function createContext({
  req,
  res,
}: CreateExpressContextOptions): Promise<TRPCContext> {
  const ctx: TRPCContext = {
    createCookie: createCookieFactory(res),
    getCookie: getCookieFactory(req),
    clearCookie: clearCookieFactory(res),
    req,

    user: undefined, // We will populate this in authenticated routes
  };
  return ctx;
}

// Export the type of the context to be used in tRPC resolvers
export type Context = Awaited<ReturnType<typeof createContext>>;
