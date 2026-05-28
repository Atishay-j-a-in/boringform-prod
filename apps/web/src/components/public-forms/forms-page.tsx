import { useState } from "react";

import FormsGrid from "./form-grid";

import PublicFormsHeader from "./forms-header";
import { useNavigate } from "@tanstack/react-router";
import { useListPublicForms } from "../../hooks/api/form/index";

const PublicFormsPage = () => {
  const navigate = useNavigate();
  const { forms } = useListPublicForms();

  const dummyForms = [
    {
      id: "contact-form",
      title: "Contact Form",
      expiresAt: null,
      isProtected: false,
    },
    {
      id: "feedback-form",
      title: "Feedback Form",
      expiresAt: new Date(),
      isProtected: true,
    },
  ];

  const data = forms ?? dummyForms;

  const handleFormClick = (form: any) => {
    navigate({
      to: "/get-form",
      search: {
        id: form.id,
        isProtected: form.isProtected,
      },
    });
  };

  return (
    <div
      className="
      relative min-h-screen min-w-screen
      overflow-hidden
      bg-black
      "
    >
      {/* background */}
      <img
        src="/public-bg.png"
        className="
        absolute inset-0
        h-full w-full object-cover
        opacity-60
        "
      />

      <div
        className="
        relative z-10
        mx-auto max-w-7xl
        px-6 py-20
        "
      >
        <PublicFormsHeader />

        <FormsGrid forms={data} onFormClick={handleFormClick} />
      </div>
    </div>
  );
};

export default PublicFormsPage;
