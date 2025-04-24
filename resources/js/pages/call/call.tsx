import { useCallback, useEffect, useState } from "react";
import { LocalTrackPublication, LocalVideoTrack, RemoteAudioTrack, RemoteTrack, RemoteVideoTrack, Room, RoomEvent, VideoCaptureOptions } from 'livekit-client';
import PreCallButtons from "@/components/call/pre-call-buttons";
import Participant from "@/components/call/participant";
import CallButtons from "@/components/call/call-buttons";

export type ConnectionState = 'unconnected' | 'connecting' | 'connected' | 'error';

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

// Conditionally swap this based on device?
// Handle orientation change?
// I should also consider 480p in order to conserve bandwidth.
export const videoCaptureDefaults: VideoCaptureOptions = {
  facingMode: 'user',
  resolution: {
    aspectRatio: 16/9,
    width: isSafari ? 720 : 1280,
    height: isSafari ? 1280 : 720,
    frameRate: 30,
  },
};

export default function Call({ url, token }: { url: string, token: string }) {
  const [room] = useState<Room>(new Room({ videoCaptureDefaults }));
  const [connectionState, setConnectionState] = useState<ConnectionState>('unconnected');
  const [localVideoTrack, setLocalVideoTrack] = useState<LocalVideoTrack | undefined>();
  const [remoteVideoTrack, setRemoteVideoTrack] = useState<RemoteVideoTrack | undefined>();
  const [remoteParticipantCount, setRemoteParticipantCount] = useState(0);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const onParticipantConnected = useCallback(() => {
    setRemoteParticipantCount(remoteParticipantCount + 1);
  }, [remoteParticipantCount, setRemoteParticipantCount]);

  const onParticipantDisconnected = useCallback(() => {
    setRemoteParticipantCount(remoteParticipantCount - 1);
  }, [remoteParticipantCount, setRemoteParticipantCount]);

  const onConnected = useCallback(() => {
    setConnectionState('connected');
    setRemoteParticipantCount(room.remoteParticipants.size);
  }, [setConnectionState, setRemoteParticipantCount, room]);

  const onDisonnected = useCallback(() => {
    setConnectionState('unconnected');
    setRemoteParticipantCount(0);
  }, [setConnectionState, setRemoteParticipantCount]);

  const onTrackSubscribed = useCallback((track: RemoteTrack) => {
    if (track instanceof RemoteVideoTrack) {
      setRemoteVideoTrack(track);
    } else if (track instanceof RemoteAudioTrack) {
      track.attach();
    }
  }, [setRemoteVideoTrack]);

  const onTrackUnsubscribed = useCallback((track: RemoteTrack) => {
    if (track instanceof RemoteVideoTrack) {
      setRemoteVideoTrack(undefined);
    } else if (track instanceof RemoteAudioTrack) {
      track.detach();
    }
  }, [setRemoteVideoTrack]);

  const onLocalTrackPublished = useCallback((publication: LocalTrackPublication) => {
    const track = publication.track;
    if (track instanceof LocalVideoTrack) {
      setLocalVideoTrack(track);
    }
  }, [setLocalVideoTrack]);

  const onLocalTrackUnpublished = useCallback((publication: LocalTrackPublication) => {
    if (publication.kind === 'video') {
      setLocalVideoTrack(undefined);
    }
  }, [setLocalVideoTrack]);

  const listen = useEffect(() => {
    room.on(RoomEvent.ParticipantConnected, onParticipantConnected);
    room.on(RoomEvent.ParticipantDisconnected, onParticipantDisconnected);
    room.on(RoomEvent.Connected, onConnected);
    room.on(RoomEvent.Disconnected, onDisonnected);
    room.on(RoomEvent.TrackSubscribed, onTrackSubscribed);
    room.on(RoomEvent.TrackUnsubscribed, onTrackUnsubscribed);
    room.on(RoomEvent.LocalTrackPublished, onLocalTrackPublished);
    room.on(RoomEvent.LocalTrackUnpublished, onLocalTrackUnpublished);
    return () => {
      room.off(RoomEvent.ParticipantConnected, onParticipantConnected);
      room.off(RoomEvent.ParticipantDisconnected, onParticipantDisconnected);
      room.off(RoomEvent.Connected, onConnected);
      room.off(RoomEvent.Disconnected, onDisonnected);
      room.off(RoomEvent.TrackSubscribed, onTrackSubscribed);
      room.off(RoomEvent.TrackUnsubscribed, onTrackUnsubscribed);
      room.off(RoomEvent.LocalTrackPublished, onLocalTrackPublished);
      room.off(RoomEvent.LocalTrackUnpublished, onLocalTrackUnpublished);
    };
  }, [
    room,
    onParticipantConnected,
    onParticipantDisconnected,
    onConnected,
    onDisonnected,
    onTrackSubscribed,
    onTrackUnsubscribed,
    onLocalTrackPublished,
    onLocalTrackUnpublished,
  ]);

  const connect = useCallback(async () => {
    setConnectionState('connecting');
    try {
      await room.connect(url, token);
      await room.localParticipant.enableCameraAndMicrophone();
    } catch (e) {
      setConnectionState('error');
    }
  }, [listen, setConnectionState, room]);

  return (
    <div className="absolute flex content-center items-center w-full h-full">
      <PreCallButtons connectionState={connectionState} connect={connect} />
      {connectionState === 'connected' &&
        <>
          <Participant track={remoteVideoTrack} />
          <Participant isLocal isFrontFacing={facingMode !== 'environment'} track={localVideoTrack} isAlone={remoteParticipantCount === 0} />
          <CallButtons room={room} localVideoTrack={localVideoTrack} setFacingMode={setFacingMode} />
        </>
      }
    </div>
  );
}
