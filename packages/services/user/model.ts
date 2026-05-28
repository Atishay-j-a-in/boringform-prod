// for type and validation exports
import { z } from "zod";

export const createUserwithEmailAndPasswordInput = z.object({
  fullName: z.string().describe("Full name of the user"),
  email: z.email().describe("email address of the user"),
  password: z.string().describe("password of the user").min(8).max(128),
});

//creating type for the input of the createUserwithEmailAndPassword
export type CreateUserwithEmailAndPasswordInputType = z.infer<
  typeof createUserwithEmailAndPasswordInput
>;

export const generateTokenPayload = z.object({
  id: z.uuid().describe("uuid of the user"),
});

export type GenerateTokenPayloadType = z.infer<typeof generateTokenPayload>;

export const signinUserwithEmailAndPasswordInput = z.object({
  email: z.email().describe("email address of the user"),
  password: z.string().describe("password of the user").min(8).max(128),
});

export type SigninUserwithEmailAndPasswordInputType = z.infer<
  typeof signinUserwithEmailAndPasswordInput
>;
