import { z } from "zod";
import { fieldTypeEnum } from "@repo/database/models/field";
import { userInfo } from "os";

export const createFormInput = z.object({
  title: z.string().describe("Title of the form"),
  description: z.string().describe("Description of the form").optional(),
  creatorId: z.uuid().describe(" id of user creating the form"),
  isProtected: z.boolean().default(false).describe("Whether the form is protected or not"),
  password: z.string().describe("Password for protected forms").optional(),
  isPublished: z.boolean().describe("Whether the form is published or not").default(true),
  visibility: z.enum(["public", "unlisted"]).describe("Visibility of the form").default("public"),
  expiresAt: z.date().describe("Expiration date of the form in ISO format"),
});

export type CreateFormInputType = z.infer<typeof createFormInput>;

export const getFormByIdInput = z.object({
  formId: z.uuid().describe("ID of the form to be retrieved"),
  password: z.string().describe("Password of the form if it is protected").optional(),
});

export type GetFormByIdInputType = z.infer<typeof getFormByIdInput>;

export const listFormsByUserId = z.object({
  userId: z.uuid().describe("ID of the user whose forms we want to list"),
});

export type ListFormsByUserIdType = z.infer<typeof listFormsByUserId>;

export const updateFormInput = z.object({
  formId: z.uuid().describe("ID of the form to be updated"),
  userId: z.uuid().describe("ID of the user who created the form"),
  title: z.string().describe("Title of the form").optional(),
  description: z.string().describe("Description of the form").optional(),
  isPublished: z.boolean().describe("Whether the form is published or not").optional(),
  visibility: z.enum(["public", "unlisted"]).describe("Visibility of the form").optional(),
  expiresAt: z.date().describe("Expiration date of the form in ISO format").optional(),
});

export type UpdateFormInputType = z.infer<typeof updateFormInput>;

export const protectFormInput = z.object({
  formId: z.uuid().describe("ID of the form to be protected"),
  userId: z.uuid().describe("ID of the user who created the form"),
  password: z
    .string()
    .describe("Password to protect the form with")
    .min(6, "Password must be at least 6 characters long")
    .optional(),
});

export type ProtectFormInputType = z.infer<typeof protectFormInput>;

export const addFieldsToFormInput = z.object({
  formId: z.uuid().describe("ID of the form to which the field will be added"),
  userId: z.uuid().describe("ID of the user who created the form"),
  fields: z
    .array(
      z.object({
        label: z.string().describe("Label of the field"),
        type: z.enum(fieldTypeEnum.enumValues).describe("Type of the field accepted"),
        options:z.array(z.object({ label: z.string() })).describe("Options for the field if the type is radio, checkbox or select").optional(),
        description: z.string().describe("Description of the field").optional(),
        placeholder: z.string().describe("Placeholder of the field").optional(),
        isRequired: z.boolean().describe("Whether the field is required or not").default(false),
      }),
    )
    .min(1, "At least one field must be added")
    .describe("Array of fields to be added to the form"),
});

export type AddFieldsToFormInputType = z.infer<typeof addFieldsToFormInput>;

export const updateFieldInput = z
  .array(
    z.object({
      fieldId: z.uuid().describe("ID of the field to be updated"),
      label: z.string().describe("Label of the field").optional(),
      type: z.enum(fieldTypeEnum.enumValues).describe("Type of the field accepted").optional(),
      description: z.string().describe("Description of the field").optional(),
      placeholder: z.string().describe("Placeholder of the field").optional(),
      isRequired: z.boolean().describe("Whether the field is required or not").optional(),
    }),
  )
  .min(1, "At least one update must be provided")
  .describe("Array of updates to be applied to the field");

export type UpdateFieldInputType = z.infer<typeof updateFieldInput>;

export const deleteFormInput = z.object({
  formId: z.uuid().describe("ID of the form to be deleted"),
  userId: z.uuid().describe("ID of the user who created the form"),
});
export type DeleteFormInputType = z.infer<typeof deleteFormInput>;

export const deleteFieldInput = z.object({
  fieldId: z.uuid().describe("ID of the field to be deleted"),
  formId: z.uuid().describe("ID of the form from which the field will be deleted"),
});
export type DeleteFieldInputType = z.infer<typeof deleteFieldInput>;

export const submitFormResponseInput = z.object({
  formId: z.uuid().describe("ID of the form being submitted"),
  email: z.string().email().describe("Email of the respondent").optional(),
  values: z
    .array(
      z.object({
        fieldId: z.uuid().describe("ID of the field being responded to"),
        value: z.string().describe("Response value for the field"),
      }),
    )
    .describe("Array of responses for each field in the form"),
});
export type SubmitFormResponseInputType = z.infer<typeof submitFormResponseInput>;

export const getFormAnalyticsInput = z.object({
  formId: z.uuid().describe("ID of the form to retrieve analytics for"),
  userId: z.uuid().describe("ID of the user retrieving analytics"),
});

export type GetFormAnalyticsInputType = z.infer<typeof getFormAnalyticsInput>;
