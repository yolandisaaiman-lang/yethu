'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchLiveKitToken } from '@/lib/livekitClient';
import { Room, RoomEvent, createLocalTracks, LocalTrack } from 'livekit-client';
import {
  X,
  Radio,
  Video,
  Mic,
  MicOff,
  VideoOff,
  Users,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Camera,
  RefreshCw,
  Clock,
} from 'lucide-react';

interface GoLiveStudioModalProps {
  onSaveLiveToVault?: (data: { title: string; viewersCount: number; thumbnailUrl: string | null }) => void;
  onViewVault?: () => void;
}

export default function GoLiveStudioModal({ onSaveLiveToVault, onViewVault }: GoLiveStudioModalProps) {
  const { isGoLiveModalOpen, closeGoLiveModal, user } = useAuth();

  const [streamTitle, setStreamTitle] = useState('Afternoon Live: Afrobeats & Tech');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [hasCameraActive, setHasCameraActive] = useState(false);
  const [isFrontFacing, setIsFrontFacing] = useState(true);

  const [secondsLeft, setSecondsLeft] = useState(120);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [viewers, setViewers] = useState(0);
  const [streamEnded, setStreamEnded] = useState(false);
  const [connectedRoomName, setConnectedRoomName] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const roomRef = useRef<Room | null>(null);
  const localTracksRef = useRef<LocalTrack[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Initialize camera preview immediately when modal opens
  useEffect(() => {
    if (isGoLiveModalOpen) {
      startCameraPreview(isFrontFacing);
    } else {
      cleanupAllMedia();
    }
  }, [isGoLiveModalOpen]);

  // 120-second countdown timer during active broadcast
  useEffect(() => {
    let interval: any = null;
    if (isBroadcasting && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            handleEndBroadcast();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBroadcasting, secondsLeft]);

  // Viewers simulation while live
  useEffect(() => {
    let viewerTimer: any = null;
    if (isBroadcasting) {
      viewerTimer = setInterval(() => {
        setViewers((prev) => prev + Math.floor(Math.random() * 8) + 2);
      }, 2000);
    }
    return () => clearInterval(viewerTimer);
  }, [isBroadcasting]);

  const cleanupAllMedia = () => {
    if (roomRef.current) {
      roomRef.current.disconnect();
      roomRef.current = null;
    }
    // Stop LiveKit local tracks
    localTracksRef.current.forEach((t) => {
      try {
        t.stop();
        t.detach();
      } catch (e) {
        // ignore
      }
    });
    localTracksRef.current = [];

    // Stop Native mediaStream tracks
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => {
        try {
          t.stop();
        } catch (e) {
          // ignore
        }
      });
      mediaStreamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setHasCameraActive(false);
    setIsBroadcasting(false);
    setIsConnecting(false);
  };

  const startCameraPreview = async (facingFront: boolean) => {
    setCameraError(null);
    setConnectionError(null);

    // Stop previous stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }

    try {
      // Flexible constraints ensuring compatibility with both laptops and mobile devices
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingFront ? 'user' : 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: true,
      };

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (err: any) {
        console.warn('Initial constraints failed, retrying with basic constraints:', err);
        // Fallback to basic audio/video if specific resolution/facingMode is not supported
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      }

      mediaStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.warn('Auto-play note:', playErr);
        }
      }

      setHasCameraActive(true);
    } catch (err: any) {
      console.error('Camera permission or device error:', err);
      setHasCameraActive(false);
      setCameraError(
        err?.name === 'NotAllowedError'
          ? 'Camera access denied. Please click the camera icon in your browser address bar to allow camera & microphone access.'
          : 'Could not access device camera. Please check your camera connection or permissions.'
      );
    }
  };

  const flipCamera = () => {
    const nextFacing = !isFrontFacing;
    setIsFrontFacing(nextFacing);
    startCameraPreview(nextFacing);
  };

  const handleStartBroadcast = async () => {
    if (!user) return;
    setIsConnecting(true);
    setConnectionError(null);
    setStreamEnded(false);
    setSecondsLeft(120);

    const roomName = `yethu-${user.handle.replace('@', '').toLowerCase() || 'creator'}`;

    try {
      // 1. Fetch signed LiveKit token from Next.js server
      const tokenData = await fetchLiveKitToken({
        roomName,
        identity: user.id || `creator_${Date.now()}`,
        name: user.name || 'Yethu Creator',
        isPublisher: true,
      });

      // 2. Initialize LiveKit Room
      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
      });
      roomRef.current = room;

      room.on(RoomEvent.ParticipantConnected, () => {
        setViewers((v) => Math.max(v + 1, room.remoteParticipants.size));
      });

      // 3. Connect to LiveKit Cloud SFU
      await room.connect(tokenData.serverUrl, tokenData.token);
      setConnectedRoomName(roomName);

      // 4. Create and publish LiveKit tracks
      try {
        const tracks = await createLocalTracks({
          audio: true,
          video: {
            facingMode: isFrontFacing ? 'user' : 'environment',
          },
        });
        localTracksRef.current = tracks;

        for (const track of tracks) {
          await room.localParticipant.publishTrack(track);
          // Attach LiveKit track to video element
          if (track.kind === 'video' && videoRef.current) {
            track.attach(videoRef.current);
          }
        }
      } catch (trackErr: any) {
        console.warn('LiveKit local tracks publish note:', trackErr);
        // If mediaStream is already playing in videoRef, we keep it visible to the user!
      }

      setIsConnecting(false);
      setIsBroadcasting(true);
      setViewers(64); // Initial viewer count
    } catch (err: any) {
      console.error('LiveKit connection error:', err);
      setIsConnecting(false);
      setConnectionError(err?.message || 'Could not connect to LiveKit WebRTC');
    }
  };

  const handleEndBroadcast = () => {
    // 1. Capture snapshot frame from user's live video feed
    let snapshot: string | null = null;
    if (videoRef.current && videoRef.current.videoWidth > 0) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          snapshot = canvas.toDataURL('image/jpeg', 0.85);
        }
      } catch (e) {
        console.warn('Canvas video capture note:', e);
      }
    }

    setIsBroadcasting(false);
    setStreamEnded(true);

    // 2. Immediately save replay to 48-Hour Vault Moments
    if (onSaveLiveToVault) {
      onSaveLiveToVault({
        title: streamTitle,
        viewersCount: Math.max(viewers, 48),
        thumbnailUrl: snapshot,
      });
    }

    if (roomRef.current) {
      roomRef.current.disconnect();
      roomRef.current = null;
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    // Mute on mediaStream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach((t) => {
        t.enabled = !nextMuted;
      });
    }

    // Mute on LiveKit
    if (roomRef.current) {
      roomRef.current.localParticipant.setMicrophoneEnabled(!nextMuted);
    }
  };

  const toggleVideo = () => {
    const nextVideoOff = !isVideoOff;
    setIsVideoOff(nextVideoOff);

    // Toggle on mediaStream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getVideoTracks().forEach((t) => {
        t.enabled = !nextVideoOff;
      });
    }

    // Toggle on LiveKit
    if (roomRef.current) {
      roomRef.current.localParticipant.setCameraEnabled(!nextVideoOff);
    }
  };

  if (!isGoLiveModalOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const remSec = secondsLeft % 60;
  const formattedTime = `${minutes}:${remSec < 10 ? '0' : ''}${remSec}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl border border-white/15 bg-zinc-950 p-5 sm:p-6 shadow-2xl backdrop-blur-2xl text-white overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => {
            cleanupAllMedia();
            closeGoLiveModal();
          }}
          className="absolute top-5 right-5 z-30 rounded-full p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
          title="Close studio"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white font-mono flex items-center gap-2">
              <span>120-SECOND LIVE BROADCAST STUDIO</span>
              <span className="rounded bg-rose-500/20 text-rose-400 px-2 py-0.5 text-[10px] font-bold uppercase">
                WebRTC LiveKit
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Live SFU Cloud: <span className="text-amber-400 font-mono">wss://bible-pal-ph42v7mn.livekit.cloud</span>
            </p>
          </div>
        </div>

        {/* Camera Permission or Connection Error */}
        {(cameraError || connectionError) && (
          <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/15 p-3 text-xs text-rose-300 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{cameraError || connectionError}</span>
            </div>
            {cameraError && (
              <button
                onClick={() => startCameraPreview(isFrontFacing)}
                className="rounded-lg bg-rose-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-rose-500 transition-colors shrink-0"
              >
                Retry Camera
              </button>
            )}
          </div>
        )}

        {/* Main Camera Viewport */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 mb-4 flex items-center justify-center">
          {/* Live Device Camera Feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`h-full w-full object-cover ${isVideoOff ? 'hidden' : 'block'}`}
          />

          {/* Camera Disabled State */}
          {isVideoOff && (
            <div className="flex flex-col items-center gap-2 text-zinc-400">
              <VideoOff className="h-10 w-10 text-rose-400" />
              <span className="text-xs font-semibold">Camera is off</span>
            </div>
          )}

          {/* No camera access fallback prompt */}
          {!hasCameraActive && !isVideoOff && !cameraError && (
            <div className="flex flex-col items-center gap-3 text-zinc-400 p-6 text-center">
              <Camera className="h-10 w-10 text-amber-400 animate-pulse" />
              <span className="text-xs font-semibold">Starting camera preview...</span>
              <span className="text-[11px] text-zinc-500 max-w-xs">
                Please allow browser camera access when prompted.
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 pointer-events-none" />

          {/* Top Overlays */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <div className="flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 backdrop-blur-md border border-white/15 text-xs font-semibold">
              <span>{user?.countryCode === 'ZA' ? '🇿🇦' : user?.countryCode === 'NG' ? '🇳🇬' : user?.countryCode === 'KE' ? '🇰🇪' : '🌍'}</span>
              <span>{user?.name} ({user?.handle})</span>
            </div>

            {/* Timer Badge */}
            <div className="flex items-center gap-2">
              {isBroadcasting ? (
                <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white shadow-lg ${
                  secondsLeft <= 30 ? 'bg-rose-600 animate-urgent' : 'bg-rose-600 animate-pulse'
                }`}>
                  <span className="h-2 w-2 rounded-full bg-white" />
                  <span>ON AIR: {formattedTime}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-600/80 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                  <span>Camera Ready</span>
                </div>
              )}

              {isBroadcasting && (
                <div className="flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 backdrop-blur-md border border-white/15 text-xs font-semibold text-emerald-400">
                  <Users className="h-3.5 w-3.5" />
                  <span>{viewers} watching</span>
                </div>
              )}
            </div>
          </div>

          {/* 30-Second Final Wrap-Up Warning */}
          {secondsLeft <= 30 && isBroadcasting && (
            <div className="absolute top-14 left-1/2 -translate-x-1/2 rounded-full bg-rose-600 border border-rose-300 px-4 py-1.5 text-xs font-bold text-white animate-bounce shadow-2xl z-20">
              ⚡ 30s Final Wrap-Up! Stream will auto-end.
            </div>
          )}

          {/* Stream Ended Summary */}
          {streamEnded && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 text-center space-y-3 backdrop-blur-md z-30">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Broadcast Ended & Saved!</h4>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 px-3 py-1 text-xs font-bold text-amber-400">
                <Clock className="h-3 w-3" />
                <span>Saved to 48-Hour Vault Moments (Expires in 48h)</span>
              </div>
              <p className="text-xs text-zinc-300 max-w-md">
                Your live broadcast reached <strong className="text-amber-400">{viewers} live viewers</strong>. It is now playable by your followers in the 48-Hour Vault before self-destructing.
              </p>
              <div className="flex items-center gap-3 pt-2">
                {onViewVault && (
                  <button
                    onClick={() => {
                      cleanupAllMedia();
                      closeGoLiveModal();
                      onViewVault();
                    }}
                    className="rounded-full bg-zinc-800 hover:bg-zinc-700 border border-white/20 px-5 py-2.5 text-xs font-bold text-white transition-all shadow"
                  >
                    View in 48h Vault
                  </button>
                )}
                <button
                  onClick={() => {
                    setStreamEnded(false);
                    startCameraPreview(isFrontFacing);
                  }}
                  className="rounded-full african-sunset-gradient px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-500/25 hover:brightness-110 active:scale-95 transition-all"
                >
                  Go Live Again (120s)
                </button>
              </div>
            </div>
          )}

          {/* Bottom Stream Bar: Mic, Cam Toggle, Flip Camera */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-zinc-300 z-10">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-black/60 px-2.5 py-1 backdrop-blur-sm border border-white/10 font-mono text-[10px] text-zinc-300">
                {user?.nativeLanguage || 'isiZulu'}
              </span>
              <span className="rounded-full bg-emerald-500/20 text-emerald-300 px-2.5 py-1 backdrop-blur-sm font-mono text-[10px]">
                AI Subtitles: On
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Flip camera button (front vs back on mobile) */}
              <button
                type="button"
                onClick={flipCamera}
                className="flex items-center gap-1.5 p-2 rounded-full bg-black/70 hover:bg-zinc-800 text-white border border-white/20 transition-all active:scale-95"
                title="Switch between front and rear camera (Mobile / Laptop)"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="text-[10px] hidden sm:inline">{isFrontFacing ? 'Front' : 'Back'}</span>
              </button>

              {/* Mute Mic button */}
              <button
                type="button"
                onClick={toggleMute}
                className={`p-2 rounded-full backdrop-blur-md border transition-colors ${
                  isMuted ? 'bg-rose-500 text-white border-rose-400' : 'bg-black/70 text-white border-white/20'
                }`}
                title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
              >
                {isMuted ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
              </button>

              {/* Toggle Video button */}
              <button
                type="button"
                onClick={toggleVideo}
                className={`p-2 rounded-full backdrop-blur-md border transition-colors ${
                  isVideoOff ? 'bg-rose-500 text-white border-rose-400' : 'bg-black/70 text-white border-white/20'
                }`}
                title={isVideoOff ? 'Turn video on' : 'Turn video off'}
              >
                {isVideoOff ? <VideoOff className="h-3.5 w-3.5" /> : <Video className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Broadcast Title & Controls */}
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
              Broadcast Title
            </label>
            <input
              type="text"
              value={streamTitle}
              disabled={isBroadcasting || isConnecting}
              onChange={(e) => setStreamTitle(e.target.value)}
              placeholder="e.g. Soweto Music Breakdown Live..."
              className="w-full rounded-xl bg-zinc-900 border border-white/10 px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>LiveKit WebRTC Cloud • 120s Hard Cap</span>
            </div>

            {!isBroadcasting ? (
              <button
                onClick={handleStartBroadcast}
                disabled={isConnecting}
                className="flex items-center gap-2 rounded-full african-sunset-gradient px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-500/25 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
              >
                <Radio className="h-4 w-4 animate-pulse" />
                <span>{isConnecting ? 'Connecting to LiveKit...' : 'Start 120s Broadcast'}</span>
              </button>
            ) : (
              <button
                onClick={handleEndBroadcast}
                className="flex items-center gap-2 rounded-full bg-rose-600 hover:bg-rose-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg transition-all"
              >
                <span>End Stream Early</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
