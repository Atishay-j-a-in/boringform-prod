import { z } from "zod";
import { fieldTypeEnum } from "../../../../database/models/field";
import { updateFormInput, updateFieldInput } from "../../../../services/form/model";

export const createFormInputModel = z.object({
  title: z.string().describe("Title of the form"),
  description: z.string().describe("Description of the form").optional(),
  isProtected: z.boolean().default(false).describe("Whether the form is protected or not"),
  password: z.string().describe("Password for protected forms").optional(),
  isPublished: z.boolean().describe("Whether the form is published or not").default(true),
  visibility: z.enum(["public", "unlisted"]).describe("Visibility of the form").default("public"),
  expiresAt: z.coerce.date().describe("Expiration date of the form"),
});

export const createFormOutputModel = z.object({
  id: z.string().describe("The ID of the newly created form"),
});

export const listFormsByUserIdInputModel = z.object({}).optional(); // we can get userId from the authenticated context, so no need for input
export const listPublicFormsInputModel = z.object({}).optional(); // no input needed for listing public forms
export const listPublicFormsOutputModel = z.array(
  z.object({
    id: z.string().describe("The ID of the form"),
    title: z.string().describe("Title of the form"),
    expiresAt: z.date().describe("Expiration date of the form").nullable(),
    createdAt: z.date().describe("Creation date of the form").nullable(),
    isProtected: z.boolean().default(false).describe("Whether the form is protected").nullable(),
  }),
);
export const listFormsByUserIdOutputModel = z.array(
  z.object({
    id: z.string().describe("The ID of the form"),
    title: z.string().describe("Title of the form"),
    description: z.string().describe("Description of the form").nullable(),
    isPublished: z.boolean().default(true).describe("Whether the form is published"),
    visibility: z.enum(["public", "unlisted"]).default("public").describe("Visibility of the form"),
    isProtected: z.boolean().default(false).describe("Whether the form is protected"),
    password: z.string().describe("Password for protected forms").nullable(),
    expiresAt: z.date().describe("Expiration date of the form"),
    createdAt: z.date().describe("Creation date of the form"),
  }),
);

export const getFormByFormIdInputModel = z.object({
  formId: z.string().describe("The ID of the form to retrieve"),
  password: z.string().describe("Password for protected forms").optional(),
});

export const getFormByFormIdOutputModel = z.object({
  id: z.string().describe("The ID of the form"),
  title: z.string().describe("Title of the form"),
  description: z.string().describe("Description of the form").nullable(),
  expiresAt: z.date().describe("Expiration date of the form").nullable(),
  isProtected: z.boolean().default(false).describe("Whether the form is protected").nullable(),
  createdAt: z.date().describe("Creation date of the form"),
  fields: z.array(
    z.object({
      id: z.string().describe("The ID of the field"),
      index: z.string().describe("The index of the field in the form"),
      label: z.string().describe("Label of the field"),
      type: z.enum(fieldTypeEnum.enumValues),
      isRequired: z.boolean().describe("Whether the field is required").nullable(),
      placeholder: z.string().describe("Placeholder for the field").nullable(),
      description: z.string().describe("Description of the field").nullable(),
    }),
  ),
});

export const deleteFormInputModel = z.object({
  formId: z.string().describe("The ID of the form to delete"),
});

export const deleteFormOutputModel = z.object({
  success: z.boolean().describe("Whether the form was successfully deleted"),
});

export const updateFormInputModel = updateFormInput.omit({ userId: true }).extend({
  expiresAt: z.coerce.date().optional(),
});

export const updateFormOutputModel = z.object({
  id: z.string().describe("The ID of the updated form"),
});

export const protectUnprotectFormByFormIdInputModel = z.object({
  formId: z.string().describe("The ID of the form to protect/unprotect"),
  password: z.string().describe("Password for protected forms").optional(),
});

export const protectUnprotectFormByFormIdOutputModel = z.object({
  message: z
    .string()
    .describe(
      "Result message indicating whether the form was protected or unprotected successfully",
    ),
});

export const addFieldToFormInputModel = z.object({
  formId: z.uuid().describe("ID of the form to which the field will be added"),
  fields: z
    .array(
      z.object({
        label: z.string().describe("Label of the field"),
        type: z.enum(fieldTypeEnum.enumValues).describe("Type of the field accepted"),
        description: z.string().describe("Description of the field").optional(),
        placeholder: z.string().describe("Placeholder of the field").optional(),
        isRequired: z.boolean().describe("Whether the field is required or not").default(false),
      }),
    )
    .min(1, "At least one field must be added")
    .describe("Array of fields to be added to the form"),
});

export const addFieldToFormOutputModel = z.array(
  z.object({
    id: z.string().describe("The ID of the added field"),
    index: z.string().describe("The index of the added field in the form"),
  }),
);

export const getFieldsByFormIdInputModel = z.object({
  formId: z.string().describe("The ID of the form to retrieve fields for"),
});

export const getFieldsByFormIdOutputModel = z.array(
  z.object({
    id: z.string().describe("The ID of the field"),
    index: z.string().describe("The index of the field in the form"),
    label: z.string().describe("Label of the field"),
    description: z.string().describe("Description of the field").nullable(),
    placeholder: z.string().describe("Placeholder for the field").nullable(),
    isRequired: z.boolean().describe("Whether the field is required").nullable(),
    type: z.enum(fieldTypeEnum.enumValues).describe("Type of the field accepted"),
  }),
);

export const updateFieldInputModel = updateFieldInput;

export const updateFieldOutputModel = z.array(
  z.array(
    z.object({
      id: z.string(),
      index: z.string(),
    }),
  ),
);

export const deleteFieldInputModel = z.object({
  fieldId: z.string().describe("The ID of the field to delete"),
  formId: z.string().describe("The ID of the form to which the field belongs"),
});

export const deleteFieldOutputModel = z.object({
  id: z.string().describe("The ID of the deleted field"),
});

export const submitFormResponseInputModel = z.object({
  formId: z.string().describe("ID of the form being submitted"),
  email: z.email().describe("Email of the respondent").optional(),
  values: z
    .array(
      z.object({
        fieldId: z.string().describe("ID of the field being responded to"),
        value: z.string().describe("Response value for the field"),
      }),
    )
    .describe("Array of responses for each field in the form"),
});

export const submitFormResponseOutputModel = z.object({
  id: z.string().describe("ID of the submitted response"),
});

export const getFormAnalyticsInputModel = z.object({
  formId: z.uuid().describe("ID of the form to retrieve analytics for"),
});

export const getFormAnalyticsOutputModel = z.object({
  formId: z.string().describe("ID of the form"),
  title: z.string().describe("Title of the form"),
  totalResponses: z.number().describe("Total number of responses received for the form"),
  responsesToday: z.number().describe("Number of responses received for the form today"),
  avgResponsesPerDay: z
    .number()
    .describe("Average number of responses received per day since the form was created"),
  recentResponses: z
    .array(
      z.object({
        id: z.string().describe("ID of the response"),
        email: z.string().email().describe("Email of the respondent").nullable(),
        createdAt: z.date().describe("Creation date of the response").nullable(),
      }),
    )
    .describe(
      "Array of recent responses for the form, sorted by creation date in descending order",
    ),
});
