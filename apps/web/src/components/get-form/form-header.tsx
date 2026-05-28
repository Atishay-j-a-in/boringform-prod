type Props = {
  title: string;
  description?: string | null;
};

export const FormHeader = ({ title, description }: Props) => {
  return (
    <div className="mb-14 text-center">
      <h1
        className="
        bg-gradient-to-r
        from-pink-400
        via-purple-400
        to-blue-400
        bg-clip-text
        text-6xl
        font-black
        text-transparent
      "
      >
        {title}
      </h1>

      {description && <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">{description}</p>}
    </div>
  );
};
