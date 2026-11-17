import type {
  LegacyAnimationControls as AnimationControls,
  Variants,
} from "framer-motion";
import { Blob } from "~/components/ui/blob";

const blobVariants: Variants = {
  initial: { opacity: 0, scale: 0.5 },
  illuminating: {
    opacity: 0.04,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  wiggling: {
    scale: [1, 1.1, 1],
    opacity: [0.04, 0.035, 0.04],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    },
  },
};

interface ProjectBlobsProps {
  controls: AnimationControls;
  color?: string;
}

export function ProjectBlobs({ controls, color }: ProjectBlobsProps) {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <Blob
        className="absolute top-1/2 left-1/2 h-[50rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        color={color}
      />
      <Blob
        className="absolute top-1/2 left-1/2 h-[45rem] w-[45rem] -translate-x-1/3 -translate-y-1/3 rounded-full blur-3xl"
        color={color}
      />
    </div>
  );
}
