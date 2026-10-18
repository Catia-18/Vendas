import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  ShoppingBag,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
  Radio,
  CheckCircle2,
  Tv,
  Film,
  ChevronRight,
  ChevronLeft,
  Layers,
  Clock,
  Compass,
  Lightbulb
} from 'lucide-react';
import { extractYouTubeId, fetchYouTubeVideoInfo, YouTubeVideoInfo } from '../services/api';
import { LuminariaVideo } from '../types';
import { DEFAULT_LUMINARIA_VIDEOS } from '../data/defaultStore';

interface YouTubeVideoModalProps {
  isOpen: boolean;
  videos?: LuminariaVideo[];
  initialVideoId?: string;
  videoUrl?: string;
  platformVideoUrl?: string;
  productName?: string;
  onClose: () => void;
  onGoToCheckout?: () => void;
}

export const YouTubeVideoModal: React.FC<YouTubeVideoModalProps> = ({
  isOpen,
  videos = DEFAULT_LUMINARIA_VIDEOS,
  initialVideoId,
  videoUrl = 'https://www.youtube.com/watch?v=L24CqW2Hx34',
  platformVideoUrl = '/assets/videos/luminaria_video_1_apresentacao.mp4',
  productName = 'Luminária LED Recarregável com Sensor de Movimento',
  onClose,
  onGoToCheckout
}) => {
  const videoList = videos && videos.length > 0 ? videos : DEFAULT_LUMINARIA_VIDEOS;
  
  // Selected Video index
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>(0);

  // Synchronize when initialVideoId changes
  useEffect(() => {
    if (initialVideoId && videoList.length > 0) {
      const idx = videoList.findIndex((v) => v.id === initialVideoId);
      if (idx !== -1) {
        setSelectedVideoIndex(idx);
      }
    }
  }, [initialVideoId, videoList]);

  const currentVideo = videoList[selectedVideoIndex] || videoList[0];

  // Mode: 'platform' (Direct native video, zero restrictions) or 'youtube' (YouTube API Player)
  const [activeMode, setActiveMode] = useState<'platform' | 'youtube'>('platform');
  const [videoInfo, setVideoInfo] = useState<YouTubeVideoInfo | null>(null);

  // Native Video Player State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(12);

  const activeVideoPlatformUrl = currentVideo?.platformVideoUrl || platformVideoUrl;
  const activeVideoYouTubeUrl = currentVideo?.youtubeVideoUrl || videoUrl;
  const currentYouTubeId = currentVideo?.youtubeId || extractYouTubeId(activeVideoYouTubeUrl) || 'L24CqW2Hx34';

  // Fetch YouTube API info when active video changes
  useEffect(() => {
    if (!isOpen) return;

    fetchYouTubeVideoInfo(activeVideoYouTubeUrl)
      .then((info) => {
        if (info) setVideoInfo(info);
      })
      .catch(() => {});
  }, [isOpen, activeVideoYouTubeUrl]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when open and autoplay
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (activeMode === 'platform' && videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    } else {
      document.body.style.overflow = '';
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, activeMode, selectedVideoIndex]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 12);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current && videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleNextVideo = () => {
    setSelectedVideoIndex((prev) => (prev + 1) % videoList.length);
  };

  const handlePrevVideo = () => {
    setSelectedVideoIndex((prev) => (prev - 1 + videoList.length) % videoList.length);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const embedUrl = `https://www.youtube-nocookie.com/embed/${currentYouTubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&hl=pt`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-[#17191C] border border-[#C6A66B]/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-[#F8F8F6] my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-36 bg-[#C6A66B]/25 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative px-4 sm:px-6 py-3.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-[#1f2327]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#C6A66B] flex items-center justify-center text-[#17191C] shadow-md font-bold shrink-0">
              <Film className="w-4 h-4 text-[#17191C]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C6A66B]">
                  Vídeos da Luminária ({selectedVideoIndex + 1} de {videoList.length})
                </span>
                <span className="text-white/30 text-xs">·</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Disponível na Plataforma sem Restrições
                </span>
              </div>
              <h2
                id="video-modal-title"
                className="text-sm sm:text-base font-bold font-display text-[#F8F8F6] truncate"
              >
                {currentVideo.title}
              </h2>
            </div>
          </div>

          {/* Mode Switcher & Close Button */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Mode Selector Tabs (Português) */}
            <div className="flex items-center p-1 bg-black/40 rounded-lg border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setActiveMode('platform')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                  activeMode === 'platform'
                    ? 'bg-[#C6A66B] text-[#17191C] shadow-sm'
                    : 'text-white/70 hover:text-white'
                }`}
                title="Reprodução direta na plataforma sem restrições nem anúncios"
              >
                <Tv className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Vídeo da Plataforma</span>
                <span className="sm:hidden">Plataforma</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveMode('youtube');
                  if (videoRef.current) videoRef.current.pause();
                }}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                  activeMode === 'youtube'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-white/70 hover:text-white'
                }`}
                title="Ver versão da API oficial do YouTube"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>YouTube</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C6A66B]"
              aria-label="Fechar vídeo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Selector Tabs Bar (Horizontal Carousel for switching between all 5 different videos) */}
        <div className="bg-[#131518] border-b border-white/10 px-3 sm:px-6 py-2.5 overflow-x-auto scrollbar-none flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-white/40 font-semibold uppercase tracking-wider shrink-0 mr-1">
            <Layers className="w-3.5 h-3.5 text-[#C6A66B]" />
            <span className="hidden sm:inline">Vídeos da Luminária:</span>
          </div>

          <div className="flex items-center gap-2">
            {videoList.map((vid, idx) => {
              const isCurrent = idx === selectedVideoIndex;
              return (
                <button
                  key={vid.id}
                  type="button"
                  onClick={() => {
                    setSelectedVideoIndex(idx);
                    if (videoRef.current) {
                      videoRef.current.currentTime = 0;
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                    isCurrent
                      ? 'bg-[#C6A66B] text-[#17191C] shadow-md scale-[1.02]'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCurrent ? 'bg-[#17191C] text-[#C6A66B]' : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span>{vid.shortTitle}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isCurrent ? 'bg-[#17191C]/20 text-[#17191C]' : 'bg-black/30 text-white/40'
                    }`}
                  >
                    {vid.durationFormatted}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Video Display Stage */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden group">
          {activeMode === 'platform' ? (
            /* Mode 1: 100% Unrestricted Platform Video with Custom Controls */
            <div className="relative w-full h-full flex flex-col justify-end">
              <video
                key={activeVideoPlatformUrl}
                ref={videoRef}
                src={activeVideoPlatformUrl}
                poster={currentVideo.thumbnail}
                playsInline
                autoPlay
                loop
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onClick={togglePlay}
                className="w-full h-full object-cover cursor-pointer"
              />

              {/* Center Play/Pause Indicator Overlay when Paused */}
              {!isPlaying && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer backdrop-blur-xs transition-opacity"
                >
                  <div className="w-16 h-16 rounded-full bg-[#C6A66B] text-[#17191C] flex items-center justify-center shadow-2xl hover:scale-105 transition-transform">
                    <Play className="w-8 h-8 fill-current translate-x-0.5" />
                  </div>
                </div>
              )}

              {/* Prev / Next Quick Switching Hover Overlays */}
              <button
                type="button"
                onClick={handlePrevVideo}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-[#C6A66B] text-white hover:text-[#17191C] border border-white/20 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-xs"
                title="Vídeo Anterior da Luminária"
                aria-label="Vídeo anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNextVideo}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-[#C6A66B] text-white hover:text-[#17191C] border border-white/20 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-xs"
                title="Próximo Vídeo da Luminária"
                aria-label="Próximo vídeo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dynamic Portuguese Feature Overlay Tag */}
              <div className="absolute top-4 left-4 pointer-events-none max-w-sm">
                <div className="px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-[#C6A66B]/50 flex items-center gap-2 shadow-lg animate-in fade-in duration-300">
                  <span className="w-2 h-2 rounded-full bg-[#C6A66B] animate-ping shrink-0" />
                  <span className="text-xs font-bold text-[#F8F8F6]">{currentVideo.category}:</span>
                  <span className="text-xs text-[#C6A66B] truncate">{currentVideo.title}</span>
                </div>
              </div>

              {/* Unrestricted Platform Badge */}
              <div className="absolute top-4 right-4 pointer-events-none">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  100% Sem Restrições
                </span>
              </div>

              {/* Custom Player Controls Bar in Portuguese */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3 sm:p-4 space-y-2 opacity-95 hover:opacity-100 transition-opacity">
                {/* Seek Bar */}
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-white/70 tabular-nums">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 12}
                    step="0.1"
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#C6A66B]"
                    aria-label="Barra de reprodução do vídeo"
                  />
                  <span className="text-[11px] font-mono text-white/70 tabular-nums">
                    {formatTime(duration)}
                  </span>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="p-1.5 rounded text-white hover:text-[#C6A66B] hover:bg-white/10 transition-colors cursor-pointer"
                      title={isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo'}
                      aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                    </button>

                    <button
                      type="button"
                      onClick={handleRestart}
                      className="p-1.5 rounded text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      title="Reiniciar vídeo"
                      aria-label="Reiniciar vídeo"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={toggleMute}
                      className="p-1.5 rounded text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      title={isMuted ? 'Activar som' : 'Desactivar som'}
                      aria-label={isMuted ? 'Activar som' : 'Desactivar som'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    {/* Prev/Next buttons in controls */}
                    <div className="hidden sm:flex items-center gap-1 border-l border-white/15 pl-2 ml-1">
                      <button
                        type="button"
                        onClick={handlePrevVideo}
                        className="px-2 py-1 rounded text-[11px] font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Anterior</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleNextVideo}
                        className="px-2 py-1 rounded text-[11px] font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1"
                      >
                        <span>Próximo ({selectedVideoIndex + 1}/{videoList.length})</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="hidden md:inline text-white/60 text-[11px]">
                      Áudio & Legendas em Português
                    </span>

                    <button
                      type="button"
                      onClick={handleFullscreen}
                      className="p-1.5 rounded text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      title="Ecrã completo"
                      aria-label="Ecrã completo"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Mode 2: YouTube API Embed with Fallback to Platform Video */
            <div className="relative w-full h-full">
              <iframe
                src={embedUrl}
                title={videoInfo?.title || currentVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
              <div className="absolute bottom-3 left-3 pointer-events-auto">
                <button
                  type="button"
                  onClick={() => setActiveMode('platform')}
                  className="px-3 py-1.5 rounded-lg bg-black/85 hover:bg-[#C6A66B] hover:text-[#17191C] text-white text-xs font-semibold border border-white/20 transition-all flex items-center gap-1.5 shadow-lg cursor-pointer"
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span>Em caso de bloqueio ou restrição, ver na Plataforma (Sem restrições)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Video Information & Highlights in Portuguese */}
        <div className="p-4 sm:p-5 bg-[#17191C] border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#C6A66B]/15 text-[#C6A66B] border border-[#C6A66B]/30 uppercase tracking-wider">
                {currentVideo.category}
              </span>
              {currentVideo.keyBenefits.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/10 text-white/90 border border-white/10"
                >
                  <Sparkles className="w-3 h-3 text-[#C6A66B]" />
                  {b}
                </span>
              ))}
            </div>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              {currentVideo.description}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-wrap">
            {onGoToCheckout && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onGoToCheckout();
                }}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#17191C] bg-[#C6A66B] hover:bg-[#d8b87c] active:scale-[0.98] transition-all rounded-md shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Pedir Luminária</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer text-center"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
