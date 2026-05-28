import { z } from "zod";
import {
  createUserwithEmailAndPasswordInput,
  signinUserwithEmailAndPasswordInput,
} from "../../../../services/user/model";

export const createUserwithEmailAndPasswordInputModel = createUserwithEmailAndPasswordInput;
export const createUserwithEmailAndPasswordOutputModel = z.object({
  id: z.string().describe("ID of the created user"),
});

export const signinUserwithEmailAndPasswordInputModel = signinUserwithEmailAndPasswordInput;

export const signinUserwithEmailAndPasswordOutputModel = z.object({
  id: z.string().describe("ID of the signed in user"),
});

export const getLoggedInUserInputModel = z.object({}).optional();

export const getLoggedInUserOutputModel = z.object({
  id: z.string().describe("ID of the logged in user"),
  email: z.email().describe("email address of the logged in user"),
  fullName: z.string().describe("Full name of the logged in user"),
});

export const logoutUserInputModel = z.object({}).optional();

export const logoutUserOutputModel = z.object({
  message: z.string().describe("Logout success message"),
});
