import { useEffect, useId, useRef, useState } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Captions, RotateCcw, VideoOff } from 'lucide-react'
import { formatClock } from '../../utils/format'
import { cn } from '../../utils/cn'

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2]

/**
 * Custom HTML5 video player with keyboard shortcuts. It plays ordinary public media
 * files only — it does not (and cannot) play DRM-protected course content.
 */
export default function VideoPlayer({ src, poster, title, captions = [], onEnded, demoLabel = 'Demo clip' }) {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [rate, setRate] = useState(1)
  const [captionsOn, setCaptionsOn] = useState(true)
  const [error, setError] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const speedId = useId()

  const fullscreenSupported = typeof document !== 'undefined' && Boolean(document.fullscreenEnabled)

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === containerRef.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const video = () => videoRef.current

  const togglePlay = () => {
    const v = video()
    if (!v || error) return
    if (v.paused) v.play().catch(() => setError(true))
    else v.pause()
  }

  const seek = (time) => {
    const v = video()
    if (!v || !Number.isFinite(v.duration)) return
    v.currentTime = Math.max(0, Math.min(v.duration, time))
    setCurrent(v.currentTime)
  }

  const changeVolume = (value) => {
    const v = video()
    if (!v) return
    v.volume = value
    v.muted = value === 0
    setVolume(value)
    setMuted(value === 0)
  }

  const toggleMute = () => {
    const v = video()
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  const changeRate = (value) => {
    const v = video()
    if (v) v.playbackRate = value
    setRate(value)
  }

  const toggleFullscreen = () => {
    if (!fullscreenSupported) return
    if (document.fullscreenElement) document.exitFullscreen?.()
    else containerRef.current?.requestFullscreen?.()
  }

  const onKeyDown = (event) => {
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') return
    const key = event.key.toLowerCase()
    if (key === ' ' || key === 'k') {
      event.preventDefault()
      togglePlay()
    } else if (key === 'arrowright') {
      event.preventDefault()
      seek(current + 5)
    } else if (key === 'arrowleft') {
      event.preventDefault()
      seek(current - 5)
    } else if (key === 'm') toggleMute()
    else if (key === 'f') toggleFullscreen()
    else if (key === 'c' && captions.length) setCaptionsOn((c) => !c)
  }

  if (!src) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl bg-deep text-center text-white">
        <VideoOff className="h-10 w-10 text-white/60" aria-hidden="true" />
        <p className="font-semibold">Demo video placeholder</p>
        <p className="max-w-sm text-sm text-white/70">No video file is attached to this lesson in the demo. In a production course the lesson video would play here.</p>
      </div>
    )
  }

  const cue = captionsOn ? captions.find((c) => current >= c.start && current < c.end) : null
  const progressPct = duration ? (current / duration) * 100 : 0

  return (
    <div
      ref={containerRef}
      className="group relative w-full overflow-hidden rounded-xl bg-black outline-none focus-visible:ring-2 focus-visible:ring-info"
      tabIndex={0}
      role="region"
      aria-label={`Video player: ${title}. Press space to play or pause.`}
      onKeyDown={onKeyDown}
    >
      <video
        key={reloadKey}
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        preload="metadata"
        className="aspect-video w-full bg-black object-contain"
        onClick={togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration)
          e.currentTarget.playbackRate = rate
        }}
        onEnded={() => {
          setPlaying(false)
          onEnded?.()
        }}
        onError={() => setError(true)}
      />

      <span className="pointer-events-none absolute top-3 left-3 rounded-md bg-black/60 px-2 py-1 text-[11px] font-semibold tracking-wide text-white uppercase">{demoLabel}</span>

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-deep/95 p-6 text-center text-white">
          <VideoOff className="h-10 w-10 text-white/70" aria-hidden="true" />
          <p className="font-semibold">Video unavailable</p>
          <p className="max-w-sm text-sm text-white/70">The sample clip could not be loaded (you may be offline). The lesson notes below cover the same material.</p>
          <button type="button" className="btn btn-on-dark btn-sm" onClick={() => { setError(false); setReloadKey((k) => k + 1) }}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Try again
          </button>
        </div>
      )}

      {!playing && !error && (
        <button type="button" onClick={togglePlay} className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent text-ink shadow-lg transition hover:scale-105" aria-label="Play video">
          <Play className="ml-1 h-7 w-7 fill-current" aria-hidden="true" />
        </button>
      )}

      {cue && !error && (
        <div className="pointer-events-none absolute inset-x-0 bottom-16 flex justify-center px-6" aria-live="off">
          <span className="rounded bg-black/75 px-3 py-1 text-center text-sm text-white sm:text-base">{cue.text}</span>
        </div>
      )}

      {!error && (
        <div className={cn('absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-3 pt-8 pb-2 transition-opacity', playing ? 'opacity-0 group-focus-within:opacity-100 group-hover:opacity-100' : 'opacity-100')}>
          <div className="relative h-1.5 w-full">
            <div className="absolute inset-0 rounded-full bg-white/25" aria-hidden="true" />
            <div className="absolute inset-y-0 left-0 rounded-full bg-accent" style={{ width: `${progressPct}%` }} aria-hidden="true" />
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={current}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label="Seek"
              aria-valuetext={`${formatClock(current)} of ${formatClock(duration)}`}
              className="absolute inset-0 h-1.5 w-full cursor-pointer opacity-0"
            />
          </div>
          <div className="mt-2 flex items-center gap-1 text-white">
            <button type="button" onClick={togglePlay} className="rounded p-1.5 hover:bg-white/15" aria-label={playing ? 'Pause' : 'Play'}>
              {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            <button type="button" onClick={toggleMute} className="rounded p-1.5 hover:bg-white/15" aria-label={muted ? 'Unmute' : 'Mute'}>
              {muted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={(e) => changeVolume(Number(e.target.value))}
              aria-label="Volume"
              className="hidden w-20 accent-[var(--color-accent)] sm:block"
            />
            <span className="ml-2 text-xs tabular-nums text-white/85">{formatClock(current)} / {formatClock(duration)}</span>
            <div className="ml-auto flex items-center gap-1">
              <label className="sr-only" htmlFor={speedId}>Playback speed</label>
              <select
                id={speedId}
                value={rate}
                onChange={(e) => changeRate(Number(e.target.value))}
                className="rounded bg-transparent px-1 py-1 text-xs font-semibold text-white hover:bg-white/15 [&>option]:text-ink"
              >
                {SPEEDS.map((s) => <option key={s} value={s}>{s}×</option>)}
              </select>
              {captions.length > 0 && (
                <button type="button" onClick={() => setCaptionsOn((c) => !c)} className={cn('rounded p-1.5 hover:bg-white/15', captionsOn && 'text-accent')} aria-pressed={captionsOn} aria-label="Captions">
                  <Captions className="h-5 w-5" />
                </button>
              )}
              {fullscreenSupported && (
                <button type="button" onClick={toggleFullscreen} className="rounded p-1.5 hover:bg-white/15" aria-label={fullscreen ? 'Exit full screen' : 'Full screen'}>
                  {fullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
