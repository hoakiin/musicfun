import type { UseFormRegisterReturn } from "react-hook-form";
import s from "./TextField.module.css";

type Props = {
  registration: UseFormRegisterReturn;
  label?: string;
  placeholder?: string;
  error?: string;
};

export const TextField = ({ registration, label, placeholder, error }: Props) => (
  <div className={s.field}>
    {label && <label className={s.label}>{label}</label>}
    <input {...registration} className={s.input} placeholder={placeholder} />
    {error && <span className={s.error}>{error}</span>}
  </div>
);
