import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import s from "./ModalRadix.module.css";
import type { ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  modalTitle: string;
  size?: "default" | "small";
};

export const ModalRadix = ({
  modalTitle,
  onClose,
  children,
  open,
  size = "default",
}: Props) => (
  <Dialog.Root open={open} onOpenChange={onClose}>
    <Dialog.Portal>
      <Dialog.Overlay className={s.overlay} />
      <Dialog.Content
        className={`${s.content} ${size === "small" ? s.small : ""}`}
      >
        <div className={s.header}>
          <Dialog.Title className={s.title}>{modalTitle}</Dialog.Title>
          <Dialog.Close asChild>
            <button className={s.closeBtn} aria-label="Close">
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </div>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);
