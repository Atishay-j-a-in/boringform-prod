import { useEffect, useState } from "react";

import { useSearch } from "@tanstack/react-router";

import { useGetFormByFormId, useSubmitFormResponse } from "../../hooks/api/form/index";

import { FormHeader } from "./form-header";
import { PasswordDialog } from "./password-dialog";
import { RenderField } from "./render-field";

export const GetFormPage = () => {
  const search = useSearch({
    from: "/get-form",
  }) as {
    id?: string;
    isProtected?: boolean;
  };

  const formId = search.id;
  const isProtected = search.isProtected === true;

  const [request, setRequest] = useState<{
    formId: string;
    password?: string;
  } | null>(null);

  const {
    form: fetchedForm,
    isLoading: isFormLoading,
    error: formError,
  } = useGetFormByFormId(request);

  const { submitResponse, isLoading: isSubmitting, error: submitError } = useSubmitFormResponse();

  const [form, setForm] = useState<any>(null);

  const [values, setValues] = useState<Record<string, string | boolean>>({});

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [open, setOpen] = useState(isProtected);

  useEffect(() => {
    if (!formId) return;

    setIsSubmitted(false);

    if (!isProtected) {
      setRequest({ formId });
      setOpen(false);
      return;
    }

    setRequest(null);
    setForm(null);
    setValues({});
    setOpen(true);
  }, [formId, isProtected]);

  useEffect(() => {
    if (!fetchedForm) return;

    setForm(fetchedForm);
    setValues({});
    setOpen(false);
  }, [fetchedForm]);

  const handleSubmit = async () => {
    if (!formId || !form) return;

    const payload = form.fields.map((field: any) => ({
      fieldId: field.id,
      value: String(values[field.id] ?? ""),
    }));

    try {
      await submitResponse({
        formId,
        values: payload,
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (isFormLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading form...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen min-w-screen overflow-hidden bg-black">
      {/* background */}
      <img src="/form-bg.png" className="absolute inset-0 h-full w-full object-cover opacity-60" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-20">
        {formError && (
          <div className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-sm text-red-200">
            Failed to load form. Please try again.
          </div>
        )}

        {form && (
          <>
            <FormHeader title={form.title} description={form.description} />

            <div
              className="
              rounded-[40px]
              border border-white/10
              bg-black/30
              p-10
              backdrop-blur-2xl
            "
            >
              {isSubmitted ? (
                <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-8 text-center text-white">
                  <p className="text-2xl font-semibold">Thanks for your response!</p>
                  <p className="mt-2 text-sm text-zinc-400">Your submission has been received.</p>
                </div>
              ) : (
                <>
                  {form.fields.map((field: any) => (
                    <RenderField
                      key={field.id}
                      field={field}
                      value={values[field.id]}
                      onChange={(value) =>
                        setValues((prev) => ({
                          ...prev,
                          [field.id]: value,
                        }))
                      }
                    />
                  ))}

                  {submitError && (
                    <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-sm text-red-200">
                      {submitError}
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="
                    mt-8 h-14 rounded-2xl
                    bg-gradient-to-r
                    from-pink-500
                    via-purple-500
                    to-orange-500
                    px-10 font-semibold text-white
                  "
                  >
                    {isSubmitting ? "Submitting..." : "Submit Response"}
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>

      <PasswordDialog
        open={open}
        onSubmit={(password) => setRequest({ formId: formId!, password })}
      />
    </div>
  );
};
