import defaultCover from "@/assets/images/default-playlist-cover.png";
import type { Images } from "@/common/types";
import s from "./TrackCover.module.css";

type Props = {
  trackId: string;
  images: Images;
};

export const TrackCover = ({ images }: Props) => {
  const originalCover = images.main?.find((img) => img.type === "original");
  const src = originalCover ? originalCover?.url : defaultCover;

  return (
    <div>
      <img src={src} alt={"cover"} width={"100px"} className={s.cover} />
    </div>
  );
};
