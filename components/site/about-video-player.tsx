'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Loader2, AlertTriangle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedSection } from '@/components/site/animated-section'

type VideoPlayerProps = {
  videoUrl: string
  thumbnailUrl: string
  title: string
  description: string
}

export function AboutVideoPlayer({ videoUrl, thumbnailUrl, title, description }: VideoPlayerProps) {
  // Performance: Lazy load video only after user interacts (clicks Play)
  const [hasInteracted, setHasInteracted] = useState(false)
  
  // Custom video player states
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showControls, setShowControls] = useState(true)

  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize and auto-play once user interacts
  useEffect(() => {
    if (hasInteracted && videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.error('Auto-play failed:', err)
      })
    }
  }, [hasInteracted])

  // Monitor mouse movement to show/hide controls
  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    
    // Hide controls after 3 seconds of inactivity, unless paused
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }
  }

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    }
  }, [isPlaying])

  // Format time (e.g. 01:23)
  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00'
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Play/Pause toggling
  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play().catch((err) => {
        setError('Playback failed. Please try again.')
      })
    }
  }

  // Video element events
  const handlePlay = () => setIsPlaying(true)
  const handlePause = () => setIsPlaying(false)
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }
  const handleDurationChange = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }
  const handleWaiting = () => setIsLoading(true)
  const handlePlaying = () => {
    setIsLoading(false)
    setError(null)
  }
  const handleVideoError = () => {
    setIsLoading(false)
    setError('Failed to load video. It may have been deleted or the link is expired.')
  }

  // Progress Bar Seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return
    const seekTime = (parseFloat(e.target.value) / 100) * duration
    videoRef.current.currentTime = seekTime
    setCurrentTime(seekTime)
  }

  // Volume slider change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value)
    setVolume(vol)
    setIsMuted(vol === 0)
    if (videoRef.current) {
      videoRef.current.volume = vol
      videoRef.current.muted = vol === 0
    }
  }

  // Mute toggle
  const toggleMute = () => {
    if (!videoRef.current) return
    const newMute = !isMuted
    setIsMuted(newMute)
    videoRef.current.muted = newMute
    if (newMute) {
      videoRef.current.volume = 0
    } else {
      videoRef.current.volume = volume || 0.5
    }
  }

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true)
      }).catch((err) => {
        console.error('Fullscreen request failed:', err)
      })
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false)
      })
    }
  }

  // Monitor fullscreen change event from browser controls
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  return (
    <AnimatedSection className="my-24 mx-auto max-w-5xl px-4 sm:px-6">
      {/* Text Context */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0F5B4F]">Behind the Scenes</p>
        <h2 className="text-3xl font-semibold tracking-tight text-[#14221F] sm:text-4xl">
          {title}
        </h2>
        <p className="text-base leading-7 text-[#60716D]">
          {description}
        </p>
      </div>

      {/* Video Player Container */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        className="relative aspect-video w-full rounded-[2rem] overflow-hidden bg-black shadow-[0_24px_50px_-12px_rgba(15,91,79,0.16)] border border-[#DCE5E1] transition-transform duration-300 hover:scale-[1.01]"
      >
        {!hasInteracted ? (
          // Thumbnail / Poster Cover State
          <div className="relative w-full h-full">
            {thumbnailUrl ? (
              <img 
                src={thumbnailUrl} 
                alt="Summit Clean Co. video cover" 
                className="w-full h-full object-cover transition duration-700 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-[#DFEEE8] flex flex-col items-center justify-center text-[#0F5B4F]">
                <FilmCoverPlaceholder />
              </div>
            )}

            {/* Premium play overlay button */}
            <div className="absolute inset-0 bg-black/25 flex items-center justify-center transition duration-300 hover:bg-black/35">
              <button
                onClick={() => setHasInteracted(true)}
                className="group relative flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-[#0F5B4F] shadow-2xl transition duration-300 hover:scale-110 hover:bg-white active:scale-95"
                aria-label="Play company story video"
              >
                {/* Glowing ring animation */}
                <span className="absolute -inset-2 rounded-full border-2 border-white/50 animate-ping opacity-60 group-hover:opacity-100 duration-1000" />
                <Play className="h-8 w-8 fill-current ml-1 transition-transform group-hover:scale-105" />
              </button>
            </div>
          </div>
        ) : (
          // Video Mounted & Playing State
          <div className="relative w-full h-full flex items-center justify-center">
            <video
              ref={videoRef}
              src={videoUrl}
              onClick={togglePlay}
              onPlay={handlePlay}
              onPause={handlePause}
              onTimeUpdate={handleTimeUpdate}
              onDurationChange={handleDurationChange}
              onWaiting={handleWaiting}
              onPlaying={handlePlaying}
              onError={handleVideoError}
              playsInline
              className="w-full h-full object-cover cursor-pointer"
            />

            {/* Loading Spinner */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/35 backdrop-blur-sm pointer-events-none">
                <Loader2 className="h-10 w-10 text-white animate-spin" />
              </div>
            )}

            {/* Error Message Screen */}
            {error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 text-white p-6 text-center">
                <AlertTriangle className="h-12 w-12 text-[#E7C858] mb-3 animate-bounce" />
                <p className="font-semibold text-lg">{error}</p>
                <button 
                  onClick={() => {
                    setError(null);
                    if (videoRef.current) {
                      videoRef.current.load();
                      videoRef.current.play().catch(() => {});
                    }
                  }}
                  className="mt-4 px-5 py-2 rounded-full bg-[#E7C858] text-[#14221F] font-semibold text-xs transition hover:scale-105"
                >
                  Try Reloading
                </button>
              </div>
            )}

            {/* Custom Video Controls HUD */}
            <div className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 transition-opacity duration-300 ${
              showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}>
              <div className="space-y-4">
                {/* Progress bar / Scrubber */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-white/90 tabular-nums">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={duration ? (currentTime / duration) * 100 : 0}
                    onChange={handleSeek}
                    className="flex-1 h-1.5 rounded-full appearance-none bg-white/30 cursor-pointer outline-none transition hover:bg-white/45 accent-[#E7C858] [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#E7C858] [&::-webkit-slider-thumb]:mt-[-5px]"
                  />
                  <span className="text-xs font-semibold text-white/90 tabular-nums">
                    {formatTime(duration)}
                  </span>
                </div>

                {/* HUD Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Play/Pause Button */}
                    <button
                      onClick={togglePlay}
                      className="text-white hover:text-[#E7C858] transition duration-200"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
                    </button>

                    {/* Mute/Volume controls */}
                    <div className="flex items-center gap-2 group/volume">
                      <button
                        onClick={toggleMute}
                        className="text-white hover:text-[#E7C858] transition duration-200"
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-0 opacity-0 transition-all duration-300 group-hover/volume:w-20 group-hover/volume:opacity-100 h-1 rounded-full appearance-none bg-white/30 accent-[#E7C858] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                      />
                    </div>
                  </div>

                  {/* Fullscreen Button */}
                  <button
                    onClick={toggleFullscreen}
                    className="text-white hover:text-[#E7C858] transition duration-200"
                    aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                  >
                    {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA Section below the video */}
      <div className="mt-12 flex flex-col items-center justify-center text-center space-y-4">
        <p className="text-sm font-medium text-[#60716D] max-w-md">
          Ready to experience the Summit Clean difference? Get an instant free quote for your space.
        </p>
        <Button 
          asChild 
          variant="glow" 
          size="lg" 
          className="rounded-full shadow-lg group"
        >
          <Link href="/quote" className="flex items-center gap-2">
            Get a Free Quote
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </AnimatedSection>
  )
}

function FilmCoverPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#DFEEE8] text-[#0F5B4F] mb-4">
        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
          <line x1="7" y1="2" x2="7" y2="22" />
          <line x1="17" y1="2" x2="17" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="2" y1="7" x2="7" y2="7" />
          <line x1="2" y1="17" x2="7" y2="17" />
          <line x1="17" y1="17" x2="22" y2="17" />
          <line x1="17" y1="7" x2="22" y2="7" />
        </svg>
      </div>
      <p className="font-semibold text-lg text-[#14221F]">More Than Cleaning — We Care About Your Space</p>
      <p className="text-xs text-[#60716D] mt-1 max-w-[280px]">Watch a walkthrough of our professional cleaning teams at work</p>
    </div>
  )
}
