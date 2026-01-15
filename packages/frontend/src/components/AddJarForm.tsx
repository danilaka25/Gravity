import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

type AddJarFormProps = {
  onAdd: (jarUrl: string, authorNickname: string) => Promise<void>;
};

const schema = z.object({
  jarUrl: z
    .string()
    .url("Невірне посилання")
    .min(1, "Посилання обов'язкове")
    .refine(
      (val) => val.startsWith("https://send.monobank.ua"),
      "Посилання має починатися з https://send.monobank.ua"
    ),
  authorNickname: z
    .string()
    .min(1, "Нік обов'язковий")
    .regex(
      /^[a-zA-Zа-яА-ЯёЁїЇіІєЄґҐ]+$/,
      "Нік автора тільки літери"
    ),
});

type FormData = z.infer<typeof schema>;

export default function AddJarForm({ onAdd }: AddJarFormProps) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema as any),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await onAdd(data.jarUrl, data.authorNickname);
      reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Додати нову банку</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-group">
          <label htmlFor="jarUrl">Посилання на банку Monobank</label>
          <input
            id="jarUrl"
            type="text"
            placeholder="https://send.monobank.ua/jar/..."
            {...register("jarUrl")}
            className={errors.jarUrl ? "error" : ""}
          />
          {errors.jarUrl && (
            <span style={{ color: "red", fontSize: "12px" }}>
              {errors.jarUrl.message}
            </span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="authorNickname">Нік автора</label>
          <input
            id="authorNickname"
            type="text"
            placeholder="Ваше ім'я або нік"
            {...register("authorNickname")}
            className={errors.authorNickname ? "error" : ""}
          />
          {errors.authorNickname && (
            <span style={{ color: "red", fontSize: "12px" }}>
              {errors.authorNickname.message}
            </span>
          )}
        </div>
        <button type="submit" className="btn primary" disabled={loading}>
          {loading ? "Додається..." : "Додати банку"}
        </button>
      </form>
    </div>
  );
}
