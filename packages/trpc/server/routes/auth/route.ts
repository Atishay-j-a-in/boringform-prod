import { userService } from "../../services";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  createUserwithEmailAndPasswordInputModel,
  createUserwithEmailAndPasswordOutputModel,
  getLoggedInUserInputModel,
  getLoggedInUserOutputModel,
  logoutUserInputModel,
  logoutUserOutputModel,
  signinUserwithEmailAndPasswordInputModel,
  signinUserwithEmailAndPasswordOutputModel,
} from "./model";
import { clearAuthenticationCookie, setAuthenticationCookie } from "../../utils/cookie";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({
  //meta is for documentation and validation purposes
  createUserwithEmailAndPassword: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        tags: TAGS,
        path: getPath("/createUserwithEmailAndPassword"),
      },
    })
    .input(createUserwithEmailAndPasswordInputModel)
    .output(createUserwithEmailAndPasswordOutputModel)
    .mutation(async ({ input, ctx }) => {
      //dynamically import the user service to avoid circular dependencies
      const { fullName, email, password } = input;

      // jo user service ki class h uska object banaya h uske baad uske method ko call krna h
      const { id, token } = await userService.createUserwithEmailAndPassword({
        fullName,
        email,
        password,
      });

      setAuthenticationCookie(ctx, token);

      return {
        id,
      };
    }),

  signinUserwithEmailAndPassword: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        tags: TAGS,
        path: getPath("/signinUserwithEmailAndPassword"),
      },
    })
    .input(signinUserwithEmailAndPasswordInputModel)
    .output(signinUserwithEmailAndPasswordOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;
      const { id, token } = await userService.signinUserwithEmailAndPassword({ email, password });

      setAuthenticationCookie(ctx, token);

      return {
        id,
      };
    }),

  getLoggedInUser: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        tags: TAGS,
        path: getPath("/getLoggedInUser"),
        protect: true, // this indicates that this route requires authentication, and we can use this information in our documentation or client generation to enforce auth on the client side as well
      },
    })
    .input(getLoggedInUserInputModel)
    .output(getLoggedInUserOutputModel)
    .query(async ({ ctx }) => {
      const { id, email, fullName } = await userService.getUserById(ctx.user.id); // ctx.user will be populated by the authenticatedProcedure middleware, so we can safely assert that it is not undefined here
      return { id, email, fullName };
    }),

  logoutUser: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        tags: TAGS,
        path: getPath("/logoutUser"),
        protect: true,
      },
    })
    .input(logoutUserInputModel)
    .output(logoutUserOutputModel)
    .mutation(async ({ ctx }) => {
      clearAuthenticationCookie(ctx);
      return { message: "Successfully logged out" };
    }),
});
