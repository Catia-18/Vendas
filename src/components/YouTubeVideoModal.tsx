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
  Film
} from 'lucide-react';
import { extractYouTubeId, fetchYouTubeVideoInfo, YouTubeVideoInfo } from '../services/api';

interface YouTubeVideoModalProps {
  isOpen: boolean;
  videoUrl?: string;
  platformVideoUrl?: string;
  productName?: string;
  onClose: () => void;
  onGoToCheckout?: () => void;
}

interface Chapter {
  time: number;
  label: string;
  detail: string;
}

const CHAPTERS: Chapter[] = [
  { time: 0, label: 'Apresentação', detail: 'Design UltraSlim em alumínio e acabamento fosco' },
  { time: 5, label: 'Sensor PIR', detail: 'Acendimento automático no escuro ao detectar presença' },
  { time: 10, label: 'Fixação Magnética', detail: 'Base adesiva sem furos em paredes ou móveis' },
  { time: 15, label: 'Bateria USB-C', detail: 'Recarregável, dispensa pilhas, até 60 dias de uso' },
  { time: 20, label: 'Iluminação Suave', detail: 'Luz anti-encandeamento para armários e corredores' }
];

export const YouTubeVideoModal: React.FC<YouTubeVideoModalProps> = ({
  isOpen,
  videoUrl = 'https://www.youtube.com/watch?v=L24CqW2Hx34',
  platformVideoUrl = '/assets/videos/luminaria_lumora_demonstracao.mp4',
  productName = 'Luminária LED Recarregável com Sensor de Movimento',
  onClose,
  onGoToCheckout
}) => {
  // Mode: 'platform' (Direct native video, zero restrictions) or 'youtube' (YouTube API Player)
  const [activeMode, setActiveMode] = useState<'platform' | 'youtube'>('platform');
  const [videoInfo, setVideoInfo] = useState<YouTubeVideoInfo | null>(null);

  // Native Video Player State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(25);
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);

  const videoId = extractYouTubeId(videoUrl) || 'L24CqW2Hx34';

  // Fetch YouTube API / oEmbed info when modal opens
  useEffect(() => {
    if (!isOpen) return;

    fetchYouTubeVideoInfo(videoUrl)
      .then((info) => {
        if (info) setVideoInfo(info);
      })
      .catch(() => {});
  }, [isOpen, videoUrl]);

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

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Auto-play platform video if active
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
  }, [isOpen, activeMode]);

  // Update current chapter based on video current time
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    setCurrentTime(time);

    let foundIdx = 0;
    for (let i = CHAPTERS.length - 1; i >= 0; i--) {
      if (time >= CHAPTERS[i].time) {
        foundIdx = i;
        break;
      }
    }
    setCurrentChapterIndex(foundIdx);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 25);
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

  const jumpToChapter = (chapterTime: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = chapterTime;
      setCurrentTime(chapterTime);
      if (!isPlaying) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&hl=pt`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#17191C] border border-[#C6A66B]/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-[#F8F8F6] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-36 bg-[#C6A66B]/25 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative px-4 sm:px-6 py-3.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-[#1f2327]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#C6A66B] flex items-center justify-center text-[#17191C] shadow-md font-bold">
              <Film className="w-4 h-4 text-[#17191C]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C6A66B]">
                  Vídeo da Luminária
                </span>
                <span className="text-white/30 text-xs">·</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Disponível na Plataforma
                </span>
              </div>
              <h2
                id="video-modal-title"
                className="text-sm sm:text-base font-bold font-display text-[#F8F8F6] truncate max-w-xs sm:max-w-md lg:max-w-lg"
              >
                {productName}
              </h2>
            </div>
          </div>

          {/* Mode Switcher & Close Button */}
          <div className="flex items-center gap-2">
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
                title="Reprodução direta sem restrições nem anúncios"
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Vídeo da Plataforma</span>
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
                title="Conexão com a API do YouTube"
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

        {/* Main Video Display Stage */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden group">
          {activeMode === 'platform' ? (
            /* Mode 1: 100% Unrestricted Platform Video with Custom Controls */
            <div className="relative w-full h-full flex flex-col justify-end">
              <video
                ref={videoRef}
                src={platformVideoUrl}
                poster="/src/assets/images/hero_lumora_wardrobe_1792262010537.jpg"
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

              {/* Dynamic Portuguese Feature Overlay Tag */}
              <div className="absolute top-4 left-4 pointer-events-none">
                <div className="px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-md border border-[#C6A66B]/50 flex items-center gap-2 shadow-lg animate-in fade-in duration-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold text-[#F8F8F6]">
                    {CHAPTERS[currentChapterIndex]?.label}:
                  </span>
                  <span className="text-xs text-[#C6A66B]">
                    {CHAPTERS[currentChapterIndex]?.detail}
                  </span>
                </div>
              </div>

              {/* Unrestricted Platform Badge */}
              <div className="absolute top-4 right-4 pointer-events-none">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Sem restrições · 100% Disponível
                </span>
              </div>

              {/* Custom Player Controls Bar in Portuguese */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 sm:p-4 space-y-2 opacity-95 hover:opacity-100 transition-opacity">
                {/* Seek Bar */}
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-white/70 tabular-nums">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 25}
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
                      className="p-1.5 rounded text-white hover:text-[#C6A66B] hover:bg-white/10 transition-colors"
                      title={isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo'}
                      aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                    </button>

                    <button
                      type="button"
                      onClick={handleRestart}
                      className="p-1.5 rounded text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                      title="Reiniciar vídeo"
                      aria-label="Reiniciar vídeo"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={toggleMute}
                      className="p-1.5 rounded text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                      title={isMuted ? 'Activar som' : 'Desactivar som'}
                      aria-label={isMuted ? 'Activar som' : 'Desactivar som'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="hidden sm:inline text-white/60 text-[11px]">
                      Língua Portuguesa
                    </span>

                    <button
                      type="button"
                      onClick={handleFullscreen}
                      className="p-1.5 rounded text-white/80 hover:text-white hover:bg-white/10 transition-colors"
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
                title={videoInfo?.title || 'Demonstração da Luminária LED'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
              <div className="absolute bottom-2 left-2 pointer-events-auto">
                <button
                  type="button"
                  onClick={() => setActiveMode('platform')}
                  className="px-2.5 py-1 rounded bg-black/80 hover:bg-[#C6A66B] hover:text-[#17191C] text-white/80 text-[11px] font-semibold border border-white/20 transition-colors flex items-center gap-1.5"
                >
                  <Tv className="w-3 h-3" />
                  <span>Em caso de restrição, clica aqui para ver na Plataforma</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Interactive Chapters Bar (Português) */}
        {activeMode === 'platform' && (
          <div className="px-4 py-2 bg-[#1b1e22] border-t border-white/10 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
            <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider shrink-0 mr-1">
              Capítulos:
            </span>
            {CHAPTERS.map((ch, idx) => (
              <button
                key={ch.label}
                type="button"
                onClick={() => jumpToChapter(ch.time)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all shrink-0 cursor-pointer ${
                  currentChapterIndex === idx
                    ? 'bg-[#C6A66B] text-[#17191C] font-bold shadow-xs'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {idx + 1}. {ch.label}
              </button>
            ))}
          </div>
        )}

        {/* Video Highlights & Actions Bar in Portuguese */}
        <div className="p-4 sm:p-5 bg-[#17191C] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#C6A66B]/15 text-[#C6A66B] border border-[#C6A66B]/30">
                <Radio className="w-3 h-3 animate-pulse" />
                Sensor de Movimento PIR
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/10 text-white/90">
                <Zap className="w-3 h-3 text-[#C6A66B]" />
                Recarregável USB-C
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/10 text-white/90">
                <ShieldCheck className="w-3 h-3 text-[#C6A66B]" />
                Fixação Magnética sem Furos
              </span>
            </div>
            <p className="text-xs text-white/70">
              Vê na prática o acendimento automático no escuro, a iluminação suave anti-encandeamento e a fixação magnética instantânea.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
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
                <span>Encomendar Luminária</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
