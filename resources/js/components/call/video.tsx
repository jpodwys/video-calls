import { VideoTrack } from "livekit-client";
import { useEffect, useRef } from "react";

interface VideoProps {
  track: VideoTrack;
  muted?: boolean;
  mirror?: boolean;
  className?: string;
}

export default function Video({ track, mirror, ...props }: VideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) {
      return;
    }
    track.attach(el);
    return () => {
      track.detach();
    }
  }, [track]);

  return <video autoPlay playsInline ref={videoRef} {...props} style={{transform: mirror ? 'scaleX(-1)' : ''}}/>
};
