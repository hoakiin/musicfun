import spriteContent from "@/assets/sprite.svg?raw";

export const SvgSprite = () => (
  <div dangerouslySetInnerHTML={{ __html: spriteContent }} style={{ display: "none" }} />
);
