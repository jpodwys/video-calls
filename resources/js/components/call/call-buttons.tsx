import { videoCaptureDefaults } from "@/pages/call/call";
import { LocalVideoTrack, Room } from "livekit-client";
import { Mic, MicOff, RefreshCcw, Video, VideoOff, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { NavigationMenu } from "@radix-ui/react-navigation-menu";

interface CallButtonsProps {
  room: Room;
  localVideoTrack?: LocalVideoTrack;
}

export default function CallButtons({ room, localVideoTrack }: CallButtonsProps) {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isMicBusy, setIsMicBusy] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isCameraBusy, setIsCameraBusy] = useState(false);

  const supportsFacingMode = useMemo(() => {
    return !!localVideoTrack?.mediaStreamTrack.getSettings().facingMode;
  }, [localVideoTrack]);

  const disconnect = useCallback(async () => {
    await room.disconnect();
  }, [room]);

  const flipCamera = useCallback(async () => {
    if (!localVideoTrack) {
      return;
    }
    const { facingMode } = localVideoTrack.mediaStreamTrack.getSettings();
    if (facingMode) {
      await localVideoTrack.restartTrack({
        ...videoCaptureDefaults,
        facingMode: facingMode === 'user' ? 'environment' : 'user',
      });
    }
  }, [localVideoTrack?.mediaStreamTrack]);

  const toggleMic = useCallback(async () => {
    setIsMicBusy(true);
    try {
      await room.localParticipant.setMicrophoneEnabled(!isMicOn);
      setIsMicOn(!isMicOn);
    } catch (e) {}
    setIsMicBusy(false);
  }, [setIsMicBusy, room, isMicOn, setIsMicOn]);

  const toggleCamera = useCallback(async () => {
    setIsCameraBusy(true);
    try {
      await room.localParticipant.setCameraEnabled(!isCameraOn);
      setIsCameraOn(!isCameraOn);
    } catch (e) {}
    setIsCameraBusy(false);
  }, [room, isCameraOn, setIsCameraOn]);

  return (
    <div className="absolute flex bottom-5 w-full">
      <NavigationMenu className="flex gap-3 m-auto">
        <Button onClick={disconnect} size="lg">
          <X />
        </Button>
        {supportsFacingMode &&
          <Button onClick={flipCamera} size="lg">
            <RefreshCcw />
          </Button>
        }
        <Button disabled={isMicBusy} onClick={toggleMic} size="lg">
          {isMicOn ? <Mic /> : <MicOff />}
        </Button>
        <Button disabled={isCameraBusy} onClick={toggleCamera} size="lg">
          {isCameraOn ? <Video /> : <VideoOff />}
        </Button>
      </NavigationMenu>
    </div>
  );
}
