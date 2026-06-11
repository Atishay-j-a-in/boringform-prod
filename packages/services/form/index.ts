import { and, db, eq, max, asc, count, gte, desc } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import { fieldsTable } from "@repo/database/models/field";
import { responseTable } from "@repo/database/models/response";
import {
  type CreateFormInputType,
  createFormInput,
  listFormsByUserId,
  type ListFormsByUserIdType,
  type AddFieldsToFormInputType,
  addFieldsToFormInput,
  type UpdateFieldInputType,
  updateFieldInput,
  type UpdateFormInputType,
  updateFormInput,
  getFormByIdInput,
  type GetFormByIdInputType,
  type ProtectFormInputType,
  protectFormInput,
  deleteFormInput,
  type DeleteFormInputType,
  type DeleteFieldInputType,
  deleteFieldInput,
  type SubmitFormResponseInputType,
  submitFormResponseInput,
  type GetFormAnalyticsInputType,
  getFormAnalyticsInput,
} from "./model";
import { TRPCError } from "@trpc/server";
import * as crypto from "node:crypto";

class FormService {
  private generateHash(password: string) {
    return crypto.createHash("sha256").update(password).digest("hex");
  }

  // append at last
  private async getNextIndex(formId: string): Promise<string> {
    const result = await db
      .select({
        maxIndex: max(fieldsTable.index),
      })
      .from(fieldsTable)
      .where(eq(fieldsTable.formId, formId));
    const current = result[0]?.maxIndex;
    const next = current ? parseFloat(current) + 1 : 1;

    return next.toFixed(2);
  }

  public async createForm(payload: CreateFormInputType) {
    const {
      title,
      creatorId,
      description,
      isPublished,
      visibility,
      isProtected,
      password,
      expiresAt,
    } = await createFormInput.parseAsync(payload);
    const result = await db
      .insert(formsTable)
      .values({
        title,
        description,
        creatorId,
        isPublished,
        visibility,
        isProtected,
        password: this.generateHash(password?? ""),
        expiresAt,
      })
      .returning({
        id: formsTable.id,
      });

    if (!result || result.length === 0 || !result[0]?.id) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create form" });
    }

    return { id: result[0].id };
  }

  public async listFormsByUserId(payload: ListFormsByUserIdType) {
    const { userId } = await listFormsByUserId.parseAsync(payload);
    const result = await db
      .select({
        id: formsTable.id,
        title: formsTable.title,
        description: formsTable.description,
        isPublished: formsTable.isPublished,
        visibility: formsTable.visibility,
        isProtected: formsTable.isProtected,
        password: formsTable.password,
        expiresAt: formsTable.expiresAt,
        createdAt: formsTable.createdAt,
      })
      .from(formsTable)
      .where(eq(formsTable.creatorId, userId));

    return result;
  }

  public async listPublicForms() {
    const result = await db
      .select({
        id: formsTable.id,
        title: formsTable.title,
        isProtected: formsTable.isProtected,
        expiresAt: formsTable.expiresAt,
        createdAt: formsTable.createdAt,
      })
      .from(formsTable)
      .where(and(eq(formsTable.isPublished, true), eq(formsTable.visibility, "public")));
    if (!result || result.length === 0) {
      throw new TRPCError({ code: "NOT_FOUND", message: "No public forms found" });
    }

    return result;
  }

  public async getFormByFormId(payload: GetFormByIdInputType) {
    const { formId, password } = await getFormByIdInput.parseAsync(payload);

    const form = await db
      .select({
        id: formsTable.id,
        title: formsTable.title,
        description: formsTable.description,
        isProtected: formsTable.isProtected,
        password: formsTable.password,
        expiresAt: formsTable.expiresAt,
        createdAt: formsTable.createdAt,
      })
      .from(formsTable)
      .where(and(eq(formsTable.id, formId), eq(formsTable.isPublished, true)));

    if (!form || form.length === 0) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" });
    }
    let hashedPassword = this.generateHash(password || "");

    if (form[0]?.isProtected && form[0].password !== hashedPassword) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Incorrect password for protected form",
      });
    }
    const fields = await this.getFieldsByFormId(formId);
    return {
      id: form[0]?.id,
      title: form[0]?.title,
      description: form[0]?.description,
      isProtected: form[0]?.isProtected,
      expiresAt: form[0]?.expiresAt,
      createdAt: form[0]?.createdAt,
      fields,
    };
  }
  public async deleteFormByFormId(payload: DeleteFormInputType) {
    const { formId, userId } = await deleteFormInput.parseAsync(payload);
    const result = await db
      .delete(formsTable)
      .where(and(eq(formsTable.id, formId), eq(formsTable.creatorId, userId)))
      .returning({
        id: formsTable.id,
      });
    if (!result || result.length === 0 || !result[0]?.id) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to delete form" });
    }
    return { id: result[0].id };
  }

  public async updateFormbyFormId(payload: UpdateFormInputType) {
    const { formId, userId, ...updateData } = await updateFormInput.parseAsync(payload);
    const filteredUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined),
    );
    if (Object.keys(filteredUpdateData).length === 0) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "No valid fields to update" });
    }
    const result = await db
      .update(formsTable)
      .set(filteredUpdateData)
      .where(and(eq(formsTable.id, formId), eq(formsTable.creatorId, userId)))
      .returning({
        id: formsTable.id,
      });
    if (!result || result.length === 0 || !result[0]?.id) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to update form" });
    }
    return { id: result[0].id };
  }
  public async protectUnprotectedForm(payload: ProtectFormInputType) {
    const { formId, password, userId } = await protectFormInput.parseAsync(payload);
    let result;
    if (password) {
      let hashedPassword = this.generateHash(password);

      result = await db
        .update(formsTable)
        .set({ isProtected: true, password: hashedPassword })
        .where(and(eq(formsTable.id, formId), eq(formsTable.creatorId, userId)))
        .returning({
          id: formsTable.id,
        });
    } else {
      result = await db
        .update(formsTable)
        .set({ isProtected: false, password: null })
        .where(and(eq(formsTable.id, formId), eq(formsTable.creatorId, userId)))
        .returning({
          id: formsTable.id,
        });
    }

    if (!result || result.length === 0 || !result[0]?.id) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Form not found or access denied" });
    }
    return { message: password ? "Form protected successfully" : "Form unprotected successfully" };
  }
  //fields services
  public async addFieldsToForm(payload: AddFieldsToFormInputType): Promise<any> {
    const { formId, userId, fields } = await addFieldsToFormInput.parseAsync(payload);
    const form = await db
      .select({
        id: formsTable.id,
      })
      .from(formsTable)
      .where(and(eq(formsTable.id, formId), eq(formsTable.creatorId, userId)));

    if (!form) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Form not found or access denied",
      });
    }
    let index = await this.getNextIndex(formId as string);
    // Implementation for adding field to form
    const labelledFields = fields.map((field) => {
      const fieldIndex = index;
      index = (parseFloat(index) + 1).toFixed(2);
      return {
        ...field,
        formId,
        index: fieldIndex,
      };
    });
    const result = await db.insert(fieldsTable).values(labelledFields).returning({
      id: fieldsTable.id,
      index: fieldsTable.index,
    });
    if (result.length === 0 || !result[0]?.id) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to add fields to form",
      });
    }
    return result;
  }

  public async getFieldsByFormId(formId: string) {
    const result = await db
      .select({
        id: fieldsTable.id,
        index: fieldsTable.index,
        label: fieldsTable.label,
        description: fieldsTable.description,
        placeholder: fieldsTable.placeholder,
        isRequired: fieldsTable.isRequired,
        type: fieldsTable.type,
        options: fieldsTable.options,
      })
      .from(fieldsTable)
      .where(eq(fieldsTable.formId, formId))
      .orderBy(asc(fieldsTable.index));

    if (!result || result.length === 0) {
      throw new TRPCError({ code: "NOT_FOUND", message: "No fields found for this form" });
    }
    return result;
  }

  public async updateField(payload: UpdateFieldInputType): Promise<any[]> {
    const updates = await updateFieldInput.parseAsync(payload);
    const filterUndefined = updates.map((update) => {
      const filteredUpdate = Object.fromEntries(
        Object.entries(update).filter(([_, value]) => value !== undefined),
      );
      return {
        id: update.fieldId,
        ...filteredUpdate,
      };
    });
    if (filterUndefined.length === 0) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "No valid updates provided" });
    }
    const result = await db.transaction(async (tx) => {
      return Promise.all(
        filterUndefined.map((update) =>
          tx.update(fieldsTable).set(update).where(eq(fieldsTable.id, update.id)).returning({
            id: fieldsTable.id,
            index: fieldsTable.index,
          }),
        ),
      );
    });
    return result;
  }

  public async deleteField(payload: DeleteFieldInputType) {
    const { fieldId, formId } = await deleteFieldInput.parseAsync(payload);
    const result = await db
      .delete(fieldsTable)
      .where(and(eq(fieldsTable.id, fieldId), eq(fieldsTable.formId, formId)))
      .returning({
        id: fieldsTable.id,
      });
    if (!result || result.length === 0 || !result[0]?.id) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to delete field" });
    }
    return { id: result[0].id };
  }

  public async submitFormResponse(payload: SubmitFormResponseInputType) {
    // Implementation for submitting form response
    const { formId, email, values } = await submitFormResponseInput.parseAsync(payload);

    const response = await db
      .insert(responseTable)
      .values({
        formId,
        email,
        values,
      })
      .returning({
        id: responseTable.id,
      });
    if (!response || response.length === 0 || !response[0]?.id) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to submit form response",
      });
    }
    return response[0];
  }

  public async getFormAnalytics(payload: GetFormAnalyticsInputType) {
    const { formId, userId } = await getFormAnalyticsInput.parseAsync(payload);
    const form = await db
      .select({
        id: formsTable.id,
        createdAt: formsTable.createdAt,
        title: formsTable.title,
      })
      .from(formsTable)
      .where(and(eq(formsTable.id, formId), eq(formsTable.creatorId, userId)));

    if (form.length === 0 || !form[0]?.id) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Form not found or access denied" });
    }

    const totalResponses = await db
      .select({
        count: count(),
      })
      .from(responseTable)
      .where(eq(responseTable.formId, formId));

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const responsesTodayResult = await db
      .select({
        count: count(),
      })
      .from(responseTable)
      .where(and(eq(responseTable.formId, formId), gte(responseTable.createdAt, today)));

    const recentResponses = await db
      .select({
        id: responseTable.id,
        email: responseTable.email,
        createdAt: responseTable.createdAt,
      })
      .from(responseTable)
      .where(eq(responseTable.formId, formId))
      .orderBy(desc(responseTable.createdAt))
      .limit(10);

    const createdAt = form[0]?.createdAt;
    const totalDays = createdAt
      ? Math.max(1, Math.ceil((new Date().getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)))
      : 1;
    const avgResponsesPerDay = totalResponses[0]!.count / totalDays;

    return {
      formId,
      title: form[0]?.title,
      totalResponses: totalResponses[0]?.count ?? 0,
      responsesToday: responsesTodayResult[0]?.count ?? 0,
      avgResponsesPerDay,
      recentResponses,
    };
  }
}
export default FormService;
