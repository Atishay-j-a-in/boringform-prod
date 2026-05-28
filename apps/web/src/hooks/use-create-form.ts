import { FormData } from "../components/dashboard/create-form-modal";
import { trpc } from "../trpc/client";

interface CreateFormInput {
  title: string;
  description: string;
  isProtected: boolean;
  password?: string;
  isPublished: boolean;
  visibility: "public" | "unlisted";
  expiresAt: Date;
}

export const useCreateForm = () => {
  const mutation = trpc.form.createForm.useMutation();

  const createForm = async (formData: FormData) => {
    try {
      // Prepare the payload
      const payload: CreateFormInput = {
        title: formData.title,
        description: formData.description,
        isProtected: formData.isProtected,
        password: formData.isProtected ? formData.password : undefined,
        isPublished: formData.isPublished,
        visibility: formData.visibility,
        expiresAt: formData.expiresAt,
      };

      const result = await mutation.mutateAsync(payload);
      return result;
    } catch (err) {
      throw err;
    }
  };

  return { createForm, isLoading: mutation.isPending, error: mutation.error?.message ?? null };
};
