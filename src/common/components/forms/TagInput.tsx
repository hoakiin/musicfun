import { useState, type KeyboardEvent } from "react";
import s from "./TagInput.module.css";

const MAX_TAGS = 5;

type Props = {
  tags: string[];
  onChange: (tags: string[]) => void;
};

export const TagInput = ({ tags, onChange }: Props) => {
  const [input, setInput] = useState("");

  const addTag = () => {
    const name = input.trim();
    if (!name || tags.includes(name) || tags.length >= MAX_TAGS) return;
    onChange([...tags, name]);
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (name: string) => {
    onChange(tags.filter((t) => t !== name));
  };

  return (
    <div>
      <div className={s.container}>
        {tags.map((name) => (
          <span key={name} className={s.chip}>
            #{name}
            <button
              type="button"
              className={s.removeBtn}
              onClick={() => removeTag(name)}
            >
              ×
            </button>
          </span>
        ))}
        <input
          className={s.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? "Type and press Enter" : ""}
          disabled={tags.length >= MAX_TAGS}
        />
      </div>
      <span className={s.counter}>{tags.length}/{MAX_TAGS}</span>
    </div>
  );
};
