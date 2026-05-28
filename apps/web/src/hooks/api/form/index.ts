import { trpc } from "../../../trpc/client";

type FieldType =
  | "number"
  | "boolean"
  | "email"
  | "date"
  | "file"
  | "text"
  | "radio"
  | "rate"
  | "checkbox"
  | "tel"
  | "textarea";
/**
 * Hook for creating a new form
 */
export const useCreateForm = () => {
  const mutation = trpc.form.createForm.useMutation();

  const createForm = async (data: {
    title: string;
    description?: string;
    isPublished: boolean;
    visibility: "public" | "unlisted";
    expiresAt: Date;
    isProtected: boolean;
    password?: string;
  }) => {
    try {
      const result = await mutation.mutateAsync(data);
      return result;
    } catch (err) {
      throw err;
    }
  };

  return { createForm, isLoading: mutation.isPending, error: mutation.error?.message ?? null };
};

/**
 * Hook for listing forms by user ID
 */
export const useListFormsByUserId = () => {
  const query = trpc.form.listFormsByUserId.useQuery();

  return {
    forms: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Hook for listing public forms
 */
export const useListPublicForms = () => {
  const query = trpc.form.listPublicForms.useQuery(undefined, {
    retry: false,
  });

  return {
    forms: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Hook for getting a form by ID
 */
export const useGetFormByFormId = (params: { formId: string; password?: string } | null) => {
  const query = trpc.form.getFormByFormId.useQuery(params ?? { formId: "" }, {
    enabled: !!params?.formId,
    retry: false,
  });

  return {
    form: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Hook for deleting a form
 */
export const useDeleteForm = () => {
  const mutation = trpc.form.deleteFormByFormId.useMutation();

  const deleteForm = async (formId: string) => {
    try {
      const result = await mutation.mutateAsync({ formId });
      return result;
    } catch (err) {
      throw err;
    }
  };

  return { deleteForm, isLoading: mutation.isPending, error: mutation.error?.message ?? null };
};

/**
 * Hook for updating a form
 */
export const useUpdateForm = () => {
  const mutation = trpc.form.updateFormByFormId.useMutation();

  const updateForm = async (data: {
    formId: string;
    title?: string;
    description?: string;
    isPublished?: boolean;
    visibility?: "public" | "unlisted";
    expiresAt?: Date;
  }) => {
    try {
      const result = await mutation.mutateAsync(data);
      return result;
    } catch (err) {
      throw err;
    }
  };

  return { updateForm, isLoading: mutation.isPending, error: mutation.error?.message ?? null };
};

/**
 * Hook for protecting/unprotecting a form
 */
export const useProtectUnprotectForm = () => {
  const mutation = trpc.form.protectUnprotectFormByFormId.useMutation();

  const protectForm = async (data: { formId: string; password: string }) => {
    try {
      const result = await mutation.mutateAsync(data);
      return result;
    } catch (err) {
      throw err;
    }
  };

  return { protectForm, isLoading: mutation.isPending, error: mutation.error?.message ?? null };
};

/**
 * Hook for adding fields to a form
 */
export const useAddFieldsToForm = () => {
  const mutation = trpc.form.addFieldsToForm.useMutation();

  const addFields = async (data: {
    formId: string;
    fields: Array<{
      type: FieldType;
      label: string;
      isRequired?: boolean;
      placeholder?: string;
    }>;
  }) => {
    try {
      const result = await mutation.mutateAsync(data);
      return result;
    } catch (err) {
      throw err;
    }
  };

  return { addFields, isLoading: mutation.isPending, error: mutation.error?.message ?? null };
};

/**
 * Hook for getting fields by form ID
 */
export const useGetFieldsByFormId = (formId: string) => {
  const query = trpc.form.getFieldsByFormId.useQuery(
    { formId },
    {
      retry: false,
    },
  );

  return {
    fields: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Hook for updating a field
 */
export const useUpdateField = () => {
  const mutation = trpc.form.updateFieldByFieldId.useMutation();

  const updateField = async (
    data: {
      fieldId: string;
      type?: FieldType;
      label?: string;
      isRequired?: boolean;
      placeholder?: string;
    }[],
  ) => {
    try {
      const result = await mutation.mutateAsync(data);
      return result;
    } catch (err) {
      throw err;
    }
  };

  return { updateField, isLoading: mutation.isPending, error: mutation.error?.message ?? null };
};

/**
 * Hook for deleting a field
 */
export const useDeleteField = () => {
  const mutation = trpc.form.deleteFieldByFieldId.useMutation();

  const deleteField = async (data: { fieldId: string; formId: string }) => {
    try {
      const result = await mutation.mutateAsync(data);
      return result;
    } catch (err) {
      throw err;
    }
  };

  return { deleteField, isLoading: mutation.isPending, error: mutation.error?.message ?? null };
};

/**
 * Hook for submitting a form response
 */
export const useSubmitFormResponse = () => {
  const mutation = trpc.form.submitFormResponse.useMutation();

  const submitResponse = async (data: {
    formId: string;
    values: {
      fieldId: string;
      value: string;
    }[];
    email?: string;
  }) => {
    try {
      const result = await mutation.mutateAsync(data);
      return result;
    } catch (err) {
      throw err;
    }
  };

  return { submitResponse, isLoading: mutation.isPending, error: mutation.error?.message ?? null };
};

export const useGetFormAnalytics = (formId: string) => {
  const query = trpc.form.getFormAnalytics.useQuery(
    {
      formId,
    },
    {
      enabled: !!formId,
      retry: false,
    },
  );

  return {
    analytics: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
