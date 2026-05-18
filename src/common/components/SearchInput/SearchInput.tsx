import { type ChangeEvent } from "react";
import s from "./SearchInput.module.css"

type Props = {
  value: string;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const SearchInput = ({ value, placeholder, onChange }: Props) => {
  return (
    <input
      type="search"
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className={s.input}
    />
  );
};
