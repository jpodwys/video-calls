import { LocalVideoTrack, RemoteVideoTrack } from "livekit-client";
import Video from "./video";

interface ParticipantProps {
  isLocal?: boolean;
  track?: LocalVideoTrack | RemoteVideoTrack;
  isAlone?: boolean;
}

// This component will be responsible for showing an avatar when the track is disabled
// It will also style the video element or container correctly based on isLocal
// I could also hide that by making remote and local participant components
// Local participant should take up the whole screen when no one else is here
export default function Participant({ isLocal, track, isAlone }: ParticipantProps) {
  const { width, height, facingMode } = track?.mediaStreamTrack.getSettings() ?? {};
  const isFrontFacing = facingMode !== 'environment';
  const isPortrait = (height ?? 0) > (width ?? 0);
  let className = isLocal && !isAlone
    ? 'absolute top-2 right-2 h-50'
    : 'm-auto w-full h-full md:object-contain';
  if (isPortrait) {
    className += ' object-cover';
  }
  if (!track) {
    return null;
  }
  return (
    <Video mirror={isLocal && isFrontFacing} track={track} className={className} />
  );
}
