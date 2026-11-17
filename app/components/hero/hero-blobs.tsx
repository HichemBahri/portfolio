import { Blob } from '~/components/ui/blob';
import './hero-blobs.css';

export function HeroBlobs() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <Blob
        className="absolute top-[5%] left-[50%] h-[20rem] w-[20rem] rounded-full blur-3xl blob-animation"
        color="#00d5be"
      />
      <Blob
        className="absolute right-[5%] bottom-[5%] h-[25rem] w-[25rem] rounded-full blur-3xl blob-animation"
        color="#3b82f6"
      />
    </div>
  );
}