//for creating services
import * as JWT from "jsonwebtoken";
import { randomBytes, createHmac } from "node:crypto";
import { db, eq } from "@repo/database";
import { usersTable } from "@repo/database/models/user";
import {
  createUserwithEmailAndPasswordInput,
  generateTokenPayload,
  GenerateTokenPayloadType,
  signinUserwithEmailAndPasswordInput,
  SigninUserwithEmailAndPasswordInputType,
  type CreateUserwithEmailAndPasswordInputType,
} from "./model";
import { env } from "../env";
import { TRPCError } from "@trpc/server";

class UserService {
  private async getUserByEmail(email: string) {
    const result = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!result || result.length === 0) return null;
    return result[0];
  }
  private async generateUserToken(payload: GenerateTokenPayloadType) {
    const { id } = await generateTokenPayload.parseAsync(payload);
    //generate token using jwt
    const token = JWT.sign({ id }, env.JWT_SECRET);
    return token;
  }
  private generateHash(password: string, salt: string) {
    return createHmac("sha256", salt).update(password).digest("hex");
  }
  private async verifyUserToken(token: string): Promise<GenerateTokenPayloadType> {
    try {
      const decoded = JWT.verify(token, env.JWT_SECRET) as GenerateTokenPayloadType;
      return decoded;
    } catch (err) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid or expired token" });
    }
  }
  public async getUserById(id: string) {
    const result = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        fullName: usersTable.fullName,
      })
      .from(usersTable)
      .where(eq(usersTable.id, id));
    if (!result || result.length === 0 || !result[0])
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    return result[0];
  }

  public async createUserwithEmailAndPassword(payload: CreateUserwithEmailAndPasswordInputType) {
    const { fullName, email, password } =
      await createUserwithEmailAndPasswordInput.parseAsync(payload);

    //check if user with email already exists
    const existingUser = await this.getUserByEmail(email);
    if (existingUser) {
      throw new TRPCError({ code: "CONFLICT", message: "User with this email already exists" });
    }
    const salt = randomBytes(16).toString("hex");
    const hash = this.generateHash(password, salt);

    const userInsertResult = await db
      .insert(usersTable)
      .values({ email, fullName, password: hash, salt })
      .returning({
        id: usersTable.id,
      });
    if (!userInsertResult || userInsertResult.length === 0 || !userInsertResult[0]?.id) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create user" });
    }
    const id = userInsertResult[0]?.id;
    const token = await this.generateUserToken({ id });
    return {
      id,
      token,
    };
  }

  public async signinUserwithEmailAndPassword(payload: SigninUserwithEmailAndPasswordInputType) {
    const { email, password } = await signinUserwithEmailAndPasswordInput.parseAsync(payload);
    const existingUser = await this.getUserByEmail(email);
    if (!existingUser) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
    }
    if (!existingUser.password || !existingUser.salt) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid authentication method" });
    }
    const hash = this.generateHash(password, existingUser.salt);
    if (hash !== existingUser.password) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
    }
    const token = await this.generateUserToken({ id: existingUser.id });
    return {
      id: existingUser.id,
      token,
    };
  }

  public async verifyAndDecodeToken(token: string) {
    const { id } = await this.verifyUserToken(token);

    return { id };
  }
}

export default UserService;
