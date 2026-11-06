import { useEffect, useRef, useState } from 'react'

interface MusicPlayerProps {
    doorOpened: boolean
    lang: 'ky' | 'ru'
}

const TRACKS = [
    'https://res.cloudinary.com/r1wg3apd/video/upload/v1784972129/indila1_y2j2yu.mp3',
    'https://res.cloudinary.com/r1wg3apd/video/upload/v1784972428/indila2_ojn2gg.mp3'
]

const LABELS = {
    ky: {
        on: 'МУЗЫКА КҮЙҮК',
        off: 'МУЗЫКА ӨЧҮК',
    },
    ru: {
        on: 'МУЗЫКА ВКЛ',
        off: 'МУЗЫКА ВЫКЛ',
    }
}

export default function MusicPlayer({ doorOpened, lang }: MusicPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(true)
    const [trackIdx, setTrackIdx] = useState(0)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const userInteracted = useRef(false)
    const isPlayingRef = useRef(true)

    // Keep play state ref synced to avoid stale closures in gesture listeners
    useEffect(() => {
        isPlayingRef.current = isPlaying
    }, [isPlaying])

    // Initialize audio
    useEffect(() => {
        const audio = new Audio(TRACKS[0])
        audio.preload = 'auto'
        audioRef.current = audio

        const handleEnded = () => {
            setTrackIdx(1)
        }

        audio.addEventListener('ended', handleEnded)

        return () => {
            audio.pause()
            audio.removeEventListener('ended', handleEnded)
        }
    }, [])

    // Handle track changing
    useEffect(() => {
        if (!audioRef.current) return
        if (trackIdx === 1) {
            audioRef.current.src = TRACKS[1]
            audioRef.current.loop = true
            // If it was playing, resume playing on the new track
            if (isPlaying) {
                audioRef.current.play().catch(err => console.log('Playback error:', err))
            }
        }
    }, [trackIdx])

    const tryPlay = () => {
        if (!audioRef.current) return
        audioRef.current.play()
            .then(() => {
                setIsPlaying(true)
            })
            .catch(err => {
                console.log('Play blocked by browser:', err)
            })
    }

    // Autoplay handler on any user gesture (triggered on the absolute first interaction)
    useEffect(() => {
        const handleGesture = () => {
            if (userInteracted.current) return
            userInteracted.current = true
            if (isPlayingRef.current) {
                tryPlay()
            }
            cleanup()
        }

        const cleanup = () => {
            window.removeEventListener('click', handleGesture)
            window.removeEventListener('touchstart', handleGesture)
            window.removeEventListener('mousedown', handleGesture)
            window.removeEventListener('pointerdown', handleGesture)
        }

        window.addEventListener('click', handleGesture)
        window.addEventListener('touchstart', handleGesture)
        window.addEventListener('mousedown', handleGesture, { passive: true })
        window.addEventListener('pointerdown', handleGesture, { passive: true })

        return cleanup
    }, [])

    // Try to play immediately when the component mounts (on intro start)
    useEffect(() => {
        tryPlay()
    }, [])

    // Trigger play when door is opened
    useEffect(() => {
        if (doorOpened) {
            tryPlay()
        }
    }, [doorOpened])

    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation() // Prevent triggering body scroll/navigation
        if (!audioRef.current) return
        if (isPlaying) {
            audioRef.current.pause()
            setIsPlaying(false)
        } else {
            tryPlay()
        }
    }

    const currentLabel = LABELS[lang] || LABELS.ru

    return (
        <div
            onClick={togglePlay}
            style={{
                position: 'fixed',
                top: 24,
                left: 28,
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: 'rgba(253,246,240,0.9)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--border-accent)',
                padding: '8px 14px',
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                transition: 'all 0.4s var(--ease-silk)',
                userSelect: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            }}
        >
            {/* Equalizer Wave Container */}
            <div className={isPlaying ? 'eq-playing' : ''} style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '16px', width: '17px' }}>
                <div className="eq-bar" style={{ height: isPlaying ? undefined : '4px' }} />
                <div className="eq-bar" style={{ height: isPlaying ? undefined : '7px' }} />
                <div className="eq-bar" style={{ height: isPlaying ? undefined : '3px' }} />
                <div className="eq-bar" style={{ height: isPlaying ? undefined : '6px' }} />
            </div>

            {/* Labels and Song details */}
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <span style={{ fontSize: '0.65rem', letterSpacing: '0.14em', color: 'var(--accent)', fontWeight: 600, lineHeight: 1.2 }}>
                    {isPlaying ? currentLabel.on : currentLabel.off}
                </span>
                <span style={{ fontSize: '0.52rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '110px', marginTop: '2px', letterSpacing: '0.04em' }}>
                    Love Story · Indila
                </span>
            </div>
        </div>
    )
}
