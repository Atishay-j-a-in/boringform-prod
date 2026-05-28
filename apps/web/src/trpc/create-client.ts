import { httpLink, httpBatchStreamLink } from "@repo/trpc/client";
import { env } from "~/env";

interface CreateTRPCHttpBatchClientClientOpts {
  enableStreaming?: boolean;
}

export const createTRPCHttpBatchClientClient = (opts?: CreateTRPCHttpBatchClientClientOpts) => {
  const c = opts?.enableStreaming ? httpBatchStreamLink : httpLink;
  return c({
    url: env.VITE_API_URL ?? "http://localhost:8000/trpc",
    methodOverride: "POST",
    fetch(url: string, options: RequestInit) {
      return fetch(url, {
        ...options,
        credentials: "include",
      });
    },
  });
};
