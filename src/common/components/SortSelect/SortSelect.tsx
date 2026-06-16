import { type ChangeEvent } from "react";
import s from "./SortSelect.module.css";

type SortValue = "newest" | "oldest" | "top";

type SortSelectProps = {
  value: SortValue;
  onChange: (value: SortValue) => void;
};

const options: { value: SortValue; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "top", label: "Top-rated first" },
];

export const SortSelect = ({ value, onChange }: SortSelectProps) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.currentTarget.value as SortValue);
  };

  return (
    <div className={s.selectContainer}>
      <span className={s.selectLabel}>Sort By</span>
      <select className={s.select} value={value} onChange={handleChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
