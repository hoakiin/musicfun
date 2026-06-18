import { useEffect, useRef, useState, type ReactNode } from "react";
import s from "./MultiSelect.module.css";
import { useClickOutside } from "@/common/hooks";

export type MultiSelectItem = {
  id: string;
  name: string;
};

type Props<T extends MultiSelectItem> = {
  selectedItems: T[];
  onChange: (items: T[]) => void;
  items: T[];
  isLoading?: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  formatChip?: (item: T) => ReactNode;
  formatItem?: (item: T, isChecked: boolean) => ReactNode;
};

const MAX_VISIBLE_CHIPS = 5;

export const MultiSelect = <T extends MultiSelectItem>({
  selectedItems,
  onChange,
  items,
  isLoading,
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  formatChip,
  formatItem,
}: Props<T>) => {
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useClickOutside(containerRef, () => {
    setIsOpen(false);
  });

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleItem = (item: T) => {
    const exists = selectedItems.some((t) => t.id === item.id);

    if (exists) {
      onChange(selectedItems.filter((t) => t.id !== item.id));
    } else {
      onChange([...selectedItems, item]);
    }
  };

  const removeItem = (id: string) => {
    onChange(selectedItems.filter((t) => t.id !== id));
  };

  const isSelected = (id: string) => {
    return selectedItems.some((t) => t.id === id);
  };

  const visibleItems = selectedItems.slice(0, MAX_VISIBLE_CHIPS);
  const extraCount = selectedItems.length - MAX_VISIBLE_CHIPS;

  return (
    <div className={s.container} ref={containerRef}>
      <div
        className={s.control}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {visibleItems.map((item) => (
          <span key={item.id} className={s.chip}>
            {formatChip ? formatChip(item) : item.name}
            <button
              className={s.removeButton}
              onClick={(e) => {
                e.stopPropagation();
                removeItem(item.id);
              }}
            >
              ×
            </button>
          </span>
        ))}

        {extraCount > 0 && (
          <span className={s.extra}>and {extraCount} more</span>
        )}

        <input
          ref={inputRef}
          className={s.input}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={selectedItems.length === 0 ? searchPlaceholder : ""}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />

        <span className={s.arrow}>⌄</span>
      </div>

      {isOpen && (
        <div className={s.dropdown}>
          {isLoading && <div className={s.loading}>Loading...</div>}

          <ul className={s.list}>
            {items.map((item) => {
              const checked = isSelected(item.id);

              return (
                <li
                  key={item.id}
                  className={`${s.item} ${checked ? s.checked : ""}`}
                  onClick={() => toggleItem(item)}
                >
                  <input type="checkbox" checked={checked} readOnly />

                  <span>
                    {formatItem ? formatItem(item, checked) : item.name}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
