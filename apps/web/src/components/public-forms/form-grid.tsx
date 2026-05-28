import FormCard from "./form-card";

type Props = {
  forms: any[];
  onFormClick: (form: any) => void;
};

const FormsGrid = ({ forms, onFormClick }: Props) => {
  return (
    <div
      className="
      mt-10
      grid gap-6
      md:grid-cols-2
      xl:grid-cols-3
      "
    >
      {forms.map((form) => (
        <FormCard key={form.id} form={form} onClick={() => onFormClick(form)} />
      ))}
    </div>
  );
};
export default FormsGrid;
