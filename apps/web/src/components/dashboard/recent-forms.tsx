"use client";

import { FC, ReactNode, useMemo, useState } from "react";
import { Copy, MoreVertical, Trash2, Shield, Pencil, Plus, X } from "lucide-react";
import { toast } from "sonner";

import {
  useListFormsByUserId,
  useDeleteForm,
  useProtectUnprotectForm,
  useAddFieldsToForm,
  useGetFieldsByFormId,
  useUpdateField,
  useDeleteField,
  useUpdateForm,
} from "~/hooks/api/form";

export type FieldType =
  | "text"
  | "radio"
  | "boolean"
  | "date"
  | "email"
  | "number"
  | "rate"
  | "checkbox"
  | "tel"
  | "file"
  | "textarea";

interface Form {
  id: string;
  title: string;
  description?: string | null;
  isPublished?: boolean | null;
  visibility?: "public" | "unlisted" | null;
  isProtected?: boolean | null;
  createdAt?: string;
  expiresAt?: string | null;
}

interface RecentFormsProps {
  icon?: ReactNode;
}

interface AddFieldState {
  label: string;
  type: FieldType;
  placeholder: string;
  isRequired: boolean;
}

interface UpdateFormState {
  formId: string;
  title: string;
  description: string;
  isPublished: boolean;
  visibility: "public" | "unlisted";
  expiresAt: string;
}

const defaultField: AddFieldState = {
  label: "",
  type: "text",
  placeholder: "",
  isRequired: false,
};

const createDefaultUpdateFormState = (form: Form): UpdateFormState => {
  const expiresAt = form.expiresAt ? new Date(form.expiresAt).toISOString().slice(0, 16) : "";

  return {
    formId: form.id,
    title: form.title ?? "",
    description: form.description ?? "",
    isPublished: Boolean(form.isPublished),
    visibility: (form.visibility ?? "unlisted") as "public" | "unlisted",
    expiresAt,
  };
};

const RecentForms: FC<RecentFormsProps> = () => {
  const { forms, isLoading, refetch } = useListFormsByUserId();

  const { deleteForm } = useDeleteForm();
  const { protectForm } = useProtectUnprotectForm();

  const { updateForm } = useUpdateForm();

  const { addFields } = useAddFieldsToForm();

  const { updateField } = useUpdateField();

  const { deleteField } = useDeleteField();

  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const [showSecurityModal, setShowSecurityModal] = useState(false);

  const [showAddFieldModal, setShowAddFieldModal] = useState(false);

  const [showUpdateFieldModal, setShowUpdateFieldModal] = useState(false);

  const [showDeleteFieldModal, setShowDeleteFieldModal] = useState(false);

  const [showUpdateFormModal, setShowUpdateFormModal] = useState(false);

  const [updateFormState, setUpdateFormState] = useState<UpdateFormState | null>(null);

  const [password, setPassword] = useState("");

  const [fieldData, setFieldData] = useState<AddFieldState>(defaultField);

  const { fields, refetch: refetchFields } = useGetFieldsByFormId(selectedFormId ?? "");

  const selectedFields = useMemo(() => {
    return fields ?? [];
  }, [fields]);

  const handleDeleteForm = async (formId: string) => {
    try {
      await deleteForm(formId);
      await refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const handleProtectForm = async () => {
    if (!selectedFormId) return;

    try {
      await protectForm({
        formId: selectedFormId,
        password,
      });

      setPassword("");
      setShowSecurityModal(false);

      await refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddField = async () => {
    if (!selectedFormId) return;

    try {
      await addFields({
        formId: selectedFormId,
        fields: [
          {
            label: fieldData.label,
            type: fieldData.type,
            placeholder: fieldData.placeholder,
            isRequired: fieldData.isRequired,
          },
        ],
      });

      setFieldData(defaultField);

      setShowAddFieldModal(false);

      await refetchFields();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteField = async (fieldId: string) => {
    if (!selectedFormId) return;

    try {
      await deleteField({
        fieldId,
        formId: selectedFormId,
      });

      await refetchFields();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateField = async (fieldId: string, label: string) => {
    try {
      await updateField([
        {
          fieldId,
          label,
        },
      ]);

      await refetchFields();
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenUpdateFormModal = (form: Form) => {
    setUpdateFormState(createDefaultUpdateFormState(form));
    setShowUpdateFormModal(true);
  };

  const handleUpdateForm = async () => {
    if (!updateFormState) return;

    try {
      await updateForm({
        formId: updateFormState.formId,
        title: updateFormState.title,
        description: updateFormState.description || undefined,
        isPublished: updateFormState.isPublished,
        visibility: updateFormState.visibility,
        expiresAt: updateFormState.expiresAt ? new Date(updateFormState.expiresAt) : undefined,
      });

      setShowUpdateFormModal(false);
      setUpdateFormState(null);
      await refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopyLink = async (form: Form) => {
    const origin = window.location.origin;
    const isProtected = form.isProtected
    const shareUrl = `${origin}/get-form?id=${form.id}&isProtected=${isProtected}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied");
    } catch (error) {
      console.error(error);
      toast.error("Failed to copy link");
    }
  };

  if (isLoading) {
    return <div className="text-white p-10">Loading Forms...</div>;
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <h2 className="text-lg font-semibold text-white">Recent Forms</h2>

          <select className="rounded-lg border border-white/10 bg-gray-800 px-3 py-2 text-sm text-white">
            <option>All</option>
            <option>UnPublished</option>
            <option>Published :: Public</option>
            <option>Published :: Unlisted</option>
            <option>Protected</option>
            <option>UnProtected</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400">
                  Form Name
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400">
                  Update Form
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400">
                  Security
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400">Delete</th>

                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400">
                  Share
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400">
                  Fields
                </th>
              </tr>
            </thead>

            <tbody>
              {forms?.map((form) => (
                <tr
                  key={form.id}
                  className="border-b border-white/5 transition-colors duration-200 hover:bg-white/5"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-gradient-to-br from-pink-500/20 to-purple-500/20">
                        ✨
                      </div>

                      <div>
                        <p className="text-sm font-medium text-white">{form.title}</p>

                        <p className="text-xs text-gray-500">{form.visibility}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleOpenUpdateFormModal(form)}
                      className="rounded-xl bg-blue-500/20 px-4 py-2 text-sm text-blue-300 transition-all hover:bg-blue-500/30"
                    >
                      Update
                    </button>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedFormId(form.id);
                        setShowSecurityModal(true);
                      }}
                      className="rounded-xl bg-yellow-500/20 px-4 py-2 text-sm text-yellow-300 transition-all hover:bg-yellow-500/30"
                    >
                      {form.isProtected ? "Protected" : "Protect"}
                    </button>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteForm(form.id)}
                      className="rounded-xl bg-red-500/20 p-2 text-red-300 transition-all hover:bg-red-500/30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleCopyLink(form)}
                      className="inline-flex items-center justify-center rounded-xl bg-white/5 p-2 text-gray-300 transition-all hover:bg-white/10 hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </td>

                  <td className="relative px-6 py-4 text-center">
                    <button
                      onClick={() => setMenuOpenId(menuOpenId === form.id ? null : form.id)}
                      className="p-1 text-gray-500 transition-colors hover:text-white"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {menuOpenId === form.id && (
                      <div className="absolute right-10 top-14 z-50 w-48 rounded-2xl border border-white/10 bg-zinc-900 p-2 shadow-2xl">
                        <button
                          onClick={() => {
                            setSelectedFormId(form.id);
                            setShowAddFieldModal(true);
                            setMenuOpenId(null);
                          }}
                          className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-left text-sm text-white transition-all hover:bg-white/10"
                        >
                          <Plus className="h-4 w-4" />
                          Add Field
                        </button>

                        <button
                          onClick={() => {
                            setSelectedFormId(form.id);
                            setShowUpdateFieldModal(true);
                            setMenuOpenId(null);
                          }}
                          className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-left text-sm text-white transition-all hover:bg-white/10"
                        >
                          <Pencil className="h-4 w-4" />
                          Update Field
                        </button>

                        <button
                          onClick={() => {
                            setSelectedFormId(form.id);
                            setShowDeleteFieldModal(true);
                            setMenuOpenId(null);
                          }}
                          className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-left text-sm text-red-300 transition-all hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete Field
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-center border-t border-white/10 p-6">
          <button className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-2 text-sm font-semibold text-white transition-all duration-200 hover:from-pink-600 hover:to-purple-600">
            View All Forms
          </button>
        </div>
      </div>

      {showSecurityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Protect Form</h2>

              <button onClick={() => setShowSecurityModal(false)}>
                <X className="text-white" />
              </button>
            </div>

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4 text-white outline-none"
            />

            <button
              onClick={handleProtectForm}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4 font-semibold text-white"
            >
              <Shield className="h-4 w-4" />
              Save Protection
            </button>
          </div>
        </div>
      )}

      {showAddFieldModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-zinc-950 p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Add Field</h2>

              <button onClick={() => setShowAddFieldModal(false)}>
                <X className="text-white" />
              </button>
            </div>

            <div className="space-y-4">
              <input
                placeholder="Field Label"
                value={fieldData.label}
                onChange={(e) =>
                  setFieldData((prev) => ({
                    ...prev,
                    label: e.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4 text-white outline-none"
              />

              <select
                value={fieldData.type}
                onChange={(e) =>
                  setFieldData((prev) => ({
                    ...prev,
                    type: e.target.value as FieldType,
                  }))
                }
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4 text-white outline-none"
              >
                <option value="text">Text</option>
                <option value="radio">Radio</option>
                <option value="boolean">Boolean</option>
                <option value="date">Date</option>
                <option value="email">Email</option>
                <option value="number">Number</option>
                <option value="rate">Rate</option>
                <option value="checkbox">Checkbox</option>
                <option value="tel">Telephone</option>
                <option value="file">File</option>
                <option value="textarea">Textarea</option>
              </select>

              <input
                placeholder="Placeholder"
                value={fieldData.placeholder}
                onChange={(e) =>
                  setFieldData((prev) => ({
                    ...prev,
                    placeholder: e.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4 text-white outline-none"
              />

              <label className="flex items-center gap-3 text-white">
                <input
                  type="checkbox"
                  checked={fieldData.isRequired}
                  onChange={(e) =>
                    setFieldData((prev) => ({
                      ...prev,
                      isRequired: e.target.checked,
                    }))
                  }
                />
                Required Field
              </label>
            </div>

            <button
              onClick={handleAddField}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-4 font-semibold text-white"
            >
              Add Field
            </button>
          </div>
        </div>
      )}

      {showUpdateFieldModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-zinc-950 p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Update Fields</h2>

              <button onClick={() => setShowUpdateFieldModal(false)}>
                <X className="text-white" />
              </button>
            </div>

            <div className="space-y-4">
              {selectedFields.map((field) => (
                <div key={field.id} className="rounded-2xl border border-white/10 p-4">
                  <input
                    defaultValue={field.label}
                    onBlur={(e) => handleUpdateField(field.id, e.target.value)}
                    className="w-full rounded-xl bg-black px-4 py-3 text-white outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showDeleteFieldModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-zinc-950 p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Delete Fields</h2>

              <button onClick={() => setShowDeleteFieldModal(false)}>
                <X className="text-white" />
              </button>
            </div>

            <div className="space-y-4">
              {selectedFields.map((field) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 p-4"
                >
                  <div>
                    <p className="text-white">{field.label}</p>

                    <p className="text-sm text-zinc-500">{field.type}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteField(field.id)}
                    className="rounded-xl bg-red-500/20 p-3 text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showUpdateFormModal && updateFormState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-zinc-950 p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Update Form</h2>

              <button onClick={() => setShowUpdateFormModal(false)}>
                <X className="text-white" />
              </button>
            </div>

            <div className="space-y-4">
              <input
                value={updateFormState.title}
                onChange={(e) =>
                  setUpdateFormState((prev) => (prev ? { ...prev, title: e.target.value } : prev))
                }
                placeholder="Form Title"
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4 text-white outline-none"
              />

              <textarea
                value={updateFormState.description}
                onChange={(e) =>
                  setUpdateFormState((prev) =>
                    prev ? { ...prev, description: e.target.value } : prev,
                  )
                }
                placeholder="Description"
                rows={3}
                className="w-full resize-none rounded-2xl border border-white/10 bg-black px-4 py-4 text-white outline-none"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex items-center gap-3 text-white">
                  <input
                    type="checkbox"
                    checked={updateFormState.isPublished}
                    onChange={(e) =>
                      setUpdateFormState((prev) =>
                        prev ? { ...prev, isPublished: e.target.checked } : prev,
                      )
                    }
                  />
                  Published
                </label>

                <select
                  value={updateFormState.visibility}
                  onChange={(e) =>
                    setUpdateFormState((prev) =>
                      prev
                        ? {
                            ...prev,
                            visibility: e.target.value as "public" | "unlisted",
                          }
                        : prev,
                    )
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4 text-white outline-none"
                >
                  <option value="public">Public</option>
                  <option value="unlisted">Unlisted</option>
                </select>
              </div>

              <input
                type="datetime-local"
                value={updateFormState.expiresAt}
                onChange={(e) =>
                  setUpdateFormState((prev) =>
                    prev ? { ...prev, expiresAt: e.target.value } : prev,
                  )
                }
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4 text-white outline-none"
              />
            </div>

            <button
              onClick={handleUpdateForm}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4 font-semibold text-white"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RecentForms;
