import { formService } from "../../services";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  addFieldToFormInputModel,
  addFieldToFormOutputModel,
  createFormInputModel,
  createFormOutputModel,
  deleteFormInputModel,
  deleteFormOutputModel,
  getFieldsByFormIdInputModel,
  getFieldsByFormIdOutputModel,
  getFormByFormIdInputModel,
  getFormByFormIdOutputModel,
  listFormsByUserIdInputModel,
  listFormsByUserIdOutputModel,
  listPublicFormsInputModel,
  listPublicFormsOutputModel,
  protectUnprotectFormByFormIdInputModel,
  protectUnprotectFormByFormIdOutputModel,
  updateFieldOutputModel,
  updateFieldInputModel,
  updateFormInputModel,
  updateFormOutputModel,
  deleteFieldInputModel,
  deleteFieldOutputModel,
  submitFormResponseInputModel,
  submitFormResponseOutputModel,
  getFormAnalyticsInputModel,
  getFormAnalyticsOutputModel,
} from "./model";
import { TRPCError } from "@trpc/server";
import { getRequestIp, rateLimit } from "../../utils/rate-limit";

const TAGS = ["Form"];
const getPath = generatePath("/form");

export const formRouter = router({
  listPublicForms: publicProcedure
    .use(({ ctx, path, next }) => {
      const ip = getRequestIp(ctx.req);
      const { ok, retryAfterSec } = rateLimit({
        key: `${ip}:${path}`,
        limit: 30,
        windowMs: 60_000,
      });

      if (!ok) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: `Rate limit exceeded. Try again in ${retryAfterSec}s.`,
        });
      }

      return next();
    })
    .meta({
      openapi: {
        method: "GET",
        tags: TAGS,
        path: getPath("/listPublicForms"),
        protect: false,
      },
    })
    .input(listPublicFormsInputModel)
    .output(listPublicFormsOutputModel)
    .query(async ({}) => {
      const forms = await formService.listPublicForms();

      return forms;
    }),
  createForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        tags: TAGS,
        path: getPath("/createForm"),
        protect: true,
      },
    })
    .input(createFormInputModel)
    .output(createFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { title, description, isPublished, expiresAt, visibility, isProtected, password } =
        input;

      const { id } = await formService.createForm({
        title,
        description,
        creatorId: ctx.user.id,
        isPublished,
        expiresAt,
        visibility,
        isProtected,
        password,
      });

      return { id };
    }),
  listFormsByUserId: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        tags: TAGS,
        path: getPath("/listFormsByUserId"),
        protect: true,
      },
    })
    .input(listFormsByUserIdInputModel)
    .output(listFormsByUserIdOutputModel)
    .query(async ({ ctx }) => {
      const form = await formService.listFormsByUserId({ userId: ctx.user.id });

      if (!form) {
        throw new TRPCError({ code: "NOT_FOUND", message: "No forms found for the user" });
      }
      return form;
    }),
  getFormByFormId: publicProcedure
    .use(({ ctx, path, next }) => {
      const ip = getRequestIp(ctx.req);
      const { ok, retryAfterSec } = rateLimit({
        key: `${ip}:${path}`,
        limit: 30,
        windowMs: 60_000,
      });

      if (!ok) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: `Rate limit exceeded. Try again in ${retryAfterSec}s.`,
        });
      }

      return next();
    })
    .meta({
      openapi: {
        method: "GET",
        tags: TAGS,
        path: getPath("/getFormByFormId"),
        protect: false,
      },
    })
    .input(getFormByFormIdInputModel)
    .output(getFormByFormIdOutputModel)
    .query(async ({ input }) => {
      const { formId, password } = input;
      const form = await formService.getFormByFormId({ formId, password });

      if (!form || form.fields.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" });
      }

      return {
        id: form.id!,
        title: form.title!,
        description: form.description ?? null,
        expiresAt: form.expiresAt ?? null,
        createdAt: form.createdAt!,
        fields: form.fields,
        isProtected: form.isProtected ?? undefined,
      };
    }),
  deleteFormByFormId: authenticatedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        tags: TAGS,
        path: getPath("/deleteFormByFormId"),
        protect: true,
      },
    })
    .input(deleteFormInputModel)
    .output(deleteFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { formId } = input;
      const result = await formService.deleteFormByFormId({ formId, userId: ctx.user.id });

      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Form not found or you are not authorized to delete this form",
        });
      }
      return { success: true };
    }),
  updateFormByFormId: authenticatedProcedure
    .meta({
      openapi: {
        method: "PUT",
        tags: TAGS,
        path: getPath("/updateFormByFormId"),
        protect: true,
      },
    })
    .input(updateFormInputModel)
    .output(updateFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { formId, ...updateData } = input;
      const result = await formService.updateFormbyFormId({
        formId,
        userId: ctx.user.id,
        ...updateData,
      });
      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Form not found or you are not authorized to update this form",
        });
      }
      return { id: result.id };
    }),
  protectUnprotectFormByFormId: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        tags: TAGS,
        path: getPath("/protectUnprotectFormByFormId"),
        protect: true,
      },
    })
    .input(protectUnprotectFormByFormIdInputModel)
    .output(protectUnprotectFormByFormIdOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { formId, password } = input;
      const result = await formService.protectUnprotectedForm({
        formId,
        userId: ctx.user.id,
        password,
      });

      return { message: result.message };
    }),
  addFieldsToForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        tags: TAGS,
        path: getPath("/addFieldsToForm"),
        protect: true,
      },
    })
    .input(addFieldToFormInputModel)
    .output(addFieldToFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { formId, fields } = input;
      const result = await formService.addFieldsToForm({ formId, userId: ctx.user.id, fields });

      return result;
    }),
  getFieldsByFormId: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        tags: TAGS,
        path: getPath("/getFieldsByFormId"),
        protect: true,
      },
    })
    .input(getFieldsByFormIdInputModel)
    .output(getFieldsByFormIdOutputModel)
    .query(async ({ input }) => {
      const { formId } = input;
      const result = await formService.getFieldsByFormId(formId);

      return result;
    }),
  updateFieldByFieldId: authenticatedProcedure
    .meta({
      openapi: {
        method: "PUT",
        tags: TAGS,
        path: getPath("/updateFieldByFieldId"),
        protect: true,
      },
    })
    .input(updateFieldInputModel)
    .output(updateFieldOutputModel)
    .mutation(async ({ input }) => {
      const result = await formService.updateField(input);
      return result;
    }),
  deleteFieldByFieldId: authenticatedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        tags: TAGS,
        path: getPath("/deleteFieldByFieldId"),
        protect: true,
      },
    })
    .input(deleteFieldInputModel)
    .output(deleteFieldOutputModel)
    .mutation(async ({ input }) => {
      const { fieldId, formId } = input;
      const result = await formService.deleteField({ fieldId, formId });
      return result;
    }),
  submitFormResponse: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        tags: TAGS,
        path: getPath("/submitFormResponse"),
      },
    })
    .input(submitFormResponseInputModel)
    .output(submitFormResponseOutputModel)
    .mutation(async ({ input }) => {
      const result = await formService.submitFormResponse(input);

      return result;
    }),
  getFormAnalytics: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        tags: TAGS,
        path: getPath("/getFormAnalytics"),
        protect: true,
      },
    })
    .input(getFormAnalyticsInputModel)
    .output(getFormAnalyticsOutputModel)
    .query(async ({ input, ctx }) => {
      const { formId } = input;
      const result = await formService.getFormAnalytics({ formId, userId: ctx.user.id });

      return result;
    }),
});
