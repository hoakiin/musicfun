import type { UseFormRegisterReturn } from "react-hook-form";
import s from "./TextareaField.module.css";

type Props = {
  registration: UseFormRegisterReturn;
  label?: string;
  placeholder?: string;
  error?: string;
};

export const TextareaField = ({
  registration,
  label,
  placeholder,
  error,
}: Props) => (
  <div className={s.field}>
    {label && <label className={s.label}>{label}</label>}
    <textarea
      {...registration}
      className={s.textarea}
      placeholder={placeholder}
    />
    {error && <span className={s.error}>{error}</span>}
  </div>
);
