import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { RouterProvider } from "@tanstack/react-router";
import router from "./router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "sonner";

import { trpc } from "~/trpc/client";
import { createTRPCHttpBatchClientClient } from "~/trpc/create-client";
import MouseGlowTrail from "./components/MouseGlowTrail";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: true,
      staleTime: Infinity,
    },
  },
});

function Providers({ children }: { children: React.ReactNode }) {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [createTRPCHttpBatchClientClient()],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          {children}
          <Toaster richColors position="top-right" />
        </trpc.Provider>
      </NextThemesProvider>
    </QueryClientProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Providers>
      <MouseGlowTrail />
      <RouterProvider router={router} />
    </Providers>
  </React.StrictMode>,
);
