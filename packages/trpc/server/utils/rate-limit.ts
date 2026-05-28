import type { Request } from "express";

interface RateLimitResult {
  ok: boolean;
  retryAfterSec: number;
}

interface RateLimitOptions {
  key: string;
  limit: number;
  windowMs: number;
}

const store = new Map<string, { count: number; resetAt: number }>();

export const getRequestIp = (req: Request): string => {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")?[0].toString().trim() ?? "unknown" : "unknown";
  }

  return req.ip ?? req.socket?.remoteAddress ?? "unknown";
};

export const rateLimit = ({ key, limit, windowMs }: RateLimitOptions): RateLimitResult => {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }

  if (existing.count >= limit) {
    const retryAfterSec = Math.ceil((existing.resetAt - now) / 1000);
    return { ok: false, retryAfterSec };
  }

  existing.count += 1;
  store.set(key, existing);
  return { ok: true, retryAfterSec: 0 };
};
