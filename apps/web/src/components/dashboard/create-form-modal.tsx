import { FC, useState } from "react";
import { X, Lock } from "lucide-react";

interface CreateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void | Promise<void>;
  isLoading?: boolean;
}

export interface FormData {
  title: string;
  description: string;
  isProtected: boolean;
  password: string;
  isPublished: boolean;
  visibility: "public" | "unlisted";
  expiresAt: Date;
}

const CreateFormModal: FC<CreateFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const getDefaultExpiry = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7); // Default to 7 days from now
    return date.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    isProtected: false,
    password: "",
    isPublished: true,
    visibility: "unlisted",
    expiresAt: new Date(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black border border-white/10 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-black">
          <h2 className="text-xl font-bold text-white">Create New Form</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Form Title *</label>
            <input
              type="text"
              placeholder="e.g., Contact Us, Feedback Form"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-pink-400/50 transition-all"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Description</label>
            <textarea
              placeholder="Tell users what this form is about..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-pink-400/50 transition-all resize-none"
            />
          </div>

          {/* Protection Toggle */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isProtected}
                onChange={(e) => handleInputChange("isProtected", e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/10 text-pink-500 focus:ring-pink-500"
              />
              <span className="text-white font-medium">Protect with password</span>
            </label>

            {formData.isProtected && (
              <div className="relative ml-7">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-pink-400/50 transition-all"
                  required={formData.isProtected}
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-8 px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 transition-all"
          >
            {isLoading ? "Creating..." : "Create Form"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateFormModal;
