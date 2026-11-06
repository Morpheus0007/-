import { useState, useEffect, useRef, useTransition } from 'react'
import { i18n, type Lang } from './lib/i18n'

/* Components */
import FloatingPetals from './components/ui/FloatingPetals'
import LangToggle from './components/ui/LangToggle'
import MusicPlayer from './components/ui/MusicPlayer'
import ParticleIntro from './components/sections/ParticleIntro'
import CoverDoor from './components/sections/CoverDoor'
import PhotoSection from './components/sections/PhotoSection'
import MainInfo from './components/sections/MainInfo'
import InviteSection from './components/sections/InviteSection'
import CalendarSection from './components/sections/CalendarSection'
import VenueSection from './components/sections/VenueSection'
import CollageSection from './components/sections/CollageSection'
import ProgramSection from './components/sections/ProgramSection'
import FaqSection from './components/sections/FaqSection'
import RsvpSection from './components/sections/RsvpSection'
import ClosingSection from './components/sections/ClosingSection'

// SECTIONS[0] = cover, SECTIONS[1] = photo-section, ... SECTIONS[10] = closing-page
// The sections-track holds all 11 slides; translateY(-idx * 100dvh) scrolls to the right one.
const SECTIONS = [
  'cover',
  'photo-section',
  'main-info',
  'invite-page',
  'calendar-page',
  'venue-page',
  'collage-page',
  'program-page',
  'faq-page',
  'rsvp-page',
  'closing-page',
] as const

// Темп непрерывного плавного авто-движения (мс на секцию) — единый темп без рывков
const AUTOPLAY_PACE_MS = 8000

// Последний слайд, до которого идёт авто-движение (RSVP = index 9)
const AUTOPLAY_LAST_IDX = 9

export default function App() {
  const [lang, setLang] = useState<Lang>('ky')
  const [, startTransition] = useTransition()
  const t = i18n[lang]

  const [isLoading, setIsLoading] = useState(true)
  const [introDone, setIntroDone] = useState(false)
  const [doorOpened, setDoorOpened] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)

  // true = slideshow is running, false = user took manual control
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)

  const isNavLockedRef = useRef(false)
  const isRsvpFocusedRef = useRef(false)
  const autoPlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Lock body scroll always (we handle navigation programmatically)
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
  }, [])

  // Parallax: update CSS variable whenever slide changes
  useEffect(() => {
    document.documentElement.style.setProperty('--parallax-offset', `${activeIdx * -12}px`)
  }, [activeIdx])

  // Preloader fade-out on mount
  useEffect(() => {
    const handleLoad = () => setTimeout(() => setIsLoading(false), 400)
    if (document.readyState === 'complete') handleLoad()
    else {
      window.addEventListener('load', handleLoad)
      return () => window.removeEventListener('load', handleLoad)
    }
  }, [])

  // Language management
  const changeLanguage = (newLang: Lang) => {
    startTransition(() => setLang(newLang))
  }

  // Navigate without lock check (for autoplay)
  const forceGoTo = (idx: number) => {
    if (idx < 0 || idx >= SECTIONS.length) return
    setActiveIdx(idx)
  }

  // Navigate with lock check (for manual control)
  const goTo = (idx: number) => {
    if (idx < 0 || idx >= SECTIONS.length) return
    if (isNavLockedRef.current) return
    interruptAutoPlay()
    isNavLockedRef.current = true
    setActiveIdx(idx)
    setTimeout(() => { isNavLockedRef.current = false }, 1800)
  }

  const goNext = () => { if (activeIdx < SECTIONS.length - 1) goTo(activeIdx + 1) }
  const goPrev = () => { if (activeIdx > 0) goTo(activeIdx - 1) }

  // Toggle or interrupt autoplay
  const toggleAutoPlay = () => {
    if (isAutoPlaying) {
      interruptAutoPlay()
    } else {
      if (activeIdx < AUTOPLAY_LAST_IDX) {
        setIsAutoPlaying(true)
      }
    }
  }

  const interruptAutoPlay = () => {
    setIsAutoPlaying(false)
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current)
      autoPlayTimerRef.current = null
    }
  }

  // Autoplay engine: непрерывный равномерный переход
  const scheduleNextAutoSlide = (fromIdx: number) => {
    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current)
    const nextIdx = fromIdx + 1
    if (nextIdx > AUTOPLAY_LAST_IDX) {
      setIsAutoPlaying(false)
      return
    }
    autoPlayTimerRef.current = setTimeout(() => {
      forceGoTo(nextIdx)
      scheduleNextAutoSlide(nextIdx)
    }, AUTOPLAY_PACE_MS)
  }

  // Door opened: start from slide 1 and begin smooth continuous autoplay
  const handleDoorOpened = () => {
    setDoorOpened(true)
    setActiveIdx(1)
    setIsAutoPlaying(true)
  }

  // When isAutoPlaying turns on, kick off the auto-scroll chain
  useEffect(() => {
    if (isAutoPlaying && doorOpened) {
      scheduleNextAutoSlide(activeIdx)
    }
    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current)
    }
  }, [isAutoPlaying, doorOpened])

  // Auto-open door fallback (5s after intro)
  useEffect(() => {
    if (!introDone) return
    const timer = setTimeout(() => {
      if (!doorOpened) handleDoorOpened()
    }, 5000)
    const cancel = () => clearTimeout(timer)
    window.addEventListener('click', cancel, { once: true })
    window.addEventListener('touchstart', cancel, { once: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('click', cancel)
      window.removeEventListener('touchstart', cancel)
    }
  }, [introDone, doorOpened])

  // Keyboard navigation — interrupts autoplay
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!doorOpened || isRsvpFocusedRef.current) return
      const tag = (document.activeElement?.tagName || '').toUpperCase()
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        interruptAutoPlay()
        goNext()
      }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        interruptAutoPlay()
        goPrev()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [doorOpened, activeIdx, isAutoPlaying])

  // Lock navigation when RSVP form is focused
  useEffect(() => {
    const onFocusIn = () => { isRsvpFocusedRef.current = true }
    const onFocusOut = () => {
      setTimeout(() => {
        const form = document.getElementById('rsvpForm')
        if (!form?.contains(document.activeElement)) isRsvpFocusedRef.current = false
      }, 200)
    }
    const form = document.getElementById('rsvpForm')
    if (form) {
      form.addEventListener('focusin', onFocusIn)
      form.addEventListener('focusout', onFocusOut)
    }
    return () => {
      if (form) {
        form.removeEventListener('focusin', onFocusIn)
        form.removeEventListener('focusout', onFocusOut)
      }
    }
  }, [doorOpened])

  // Body click/tap → either interrupt autoplay or navigate manually
  const handleBodyClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!doorOpened) return
    const target = e.target as HTMLElement

    // Always ignore UI chrome and interactive elements
    if (['BUTTON', 'INPUT', 'TEXTAREA', 'A', 'LABEL', 'SELECT'].includes(target.tagName)) return
    if (target.closest('.dots-nav,.rsvp-form,.choice-buttons,.pag-arrows,.contact-square-link,#rsvp-page,.music-player-widget')) return

    // RSVP slide: no tap-advance
    if (SECTIONS[activeIdx] === 'rsvp-page') return

    // Если идёт автоплей — случайный клик по экрану НЕ прерывает его, сайт продолжает плавный ход
    if (isAutoPlaying) return

    // В ручном режиме: Top 25% → go back, bottom 75% → go forward
    const vh = window.innerHeight
    if (e.clientY < vh * 0.25) {
      goPrev()
      return
    }
    goNext()
  }

  const progressPercent = SECTIONS.length > 1 ? (activeIdx / (SECTIONS.length - 1)) * 100 : 100

  return (
    <div
      onClick={handleBodyClick}
      style={{ height: '100dvh', width: '100vw', overflow: 'hidden', position: 'relative' }}
    >
      {/* Film grain overlay */}
      <div className="grain-overlay" />

      {/* Floating petals (above everything) */}
      {doorOpened && <FloatingPetals />}

      {/* Preloader */}
      <div className={`preloader ${!isLoading ? 'loaded' : ''}`} id="preloader">
        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 16px' }}>
            <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="40" cy="40" r="36" fill="none" stroke="var(--accent)" strokeWidth="0.5"
                strokeDasharray="226" strokeDashoffset="226"
                style={{ animation: 'drawCircle 1.6s var(--ease-expo) forwards' }} />
              <circle cx="40" cy="40" r="28" fill="none" stroke="var(--accent-dim)" strokeWidth="0.3"
                strokeDasharray="176" strokeDashoffset="176"
                style={{ animation: 'drawCircle 1.8s var(--ease-expo) 0.2s forwards' }} />
            </svg>
          </div>
          <p style={{ fontFamily: 'var(--font-script)', fontSize: '2.5rem', color: 'var(--accent)', margin: 0 }}>Elena</p>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.67rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginTop: 4 }}>
            Кыз Узатуу · 2026
          </span>
        </div>
      </div>

      {/* Particle Intro overlay */}
      {!introDone && (
        <ParticleIntro lang={lang} skipLabel={t.skip} onDone={() => setIntroDone(true)} />
      )}

      {/* Music player control at root level so it plays immediately on page load */}
      <MusicPlayer doorOpened={doorOpened} lang={lang} />

      {introDone && (
        <>
          {/* Progress bar */}
          {doorOpened && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 1001, background: 'rgba(200,149,108,0.14)' }}>
              <div className="progress-bar-fill" style={{ height: '100%', width: `${progressPercent}%` }} />
            </div>
          )}

          {/* Autoplay indicator — интерактивная плашка паузы/возобновления */}
          {doorOpened && activeIdx < AUTOPLAY_LAST_IDX && (
            <div
              className="autoplay-indicator-btn"
              onClick={toggleAutoPlay}
              style={{
                position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
                zIndex: 900, display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(61,43,31,0.72)', backdropFilter: 'blur(10px)',
                color: 'rgba(253,246,240,0.85)', fontFamily: 'var(--font-sans)',
                fontSize: '0.65rem', letterSpacing: '0.2em', padding: '8px 18px',
                border: '1px solid rgba(200,149,108,0.3)',
                animation: 'slideDown 0.5s ease both',
                cursor: 'pointer',
                borderRadius: 20,
                userSelect: 'none',
              }}
            >
              {/* Animated dots */}
              {isAutoPlaying && (
                <span style={{ display: 'flex', gap: 3 }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{
                      width: 3, height: 3, borderRadius: '50%', background: 'var(--accent)',
                      animation: `eq-bar-1 0.8s ease-in-out infinite`,
                      animationDelay: `${i * 0.15}s`,
                      display: 'inline-block',
                    }} />
                  ))}
                </span>
              )}
              {isAutoPlaying ? (lang === 'ky' ? 'Дем' : 'КИНО') : (lang === 'ky' ? 'ПАУЗА' : 'ПАУЗА')}
              <span style={{ opacity: 0.55 }}>
                · {isAutoPlaying ? (lang === 'ky' ? 'токтотуу' : 'пауза') : (lang === 'ky' ? 'улантуу' : 'продолжить')}
              </span>
            </div>
          )}

          {/* Language toggle */}
          <LangToggle lang={lang} onChange={changeLanguage} />

          {/* Dot navigation */}
          {doorOpened && (
            <nav className="dots-nav" aria-label="Sections navigation">
              {SECTIONS.map((_, i) => (
                <button key={i}
                  className={`dot-btn ${activeIdx === i ? 'active' : ''}`}
                  onClick={() => goTo(i)}
                  aria-label={`Go to section ${i + 1}`}
                />
              ))}
            </nav>
          )}

          {/* Prev / Next buttons */}
          {doorOpened && (
            <div className="pag-arrows" id="pagArrows">
              <button className="pag-arrow" onClick={goPrev} disabled={activeIdx === 0} aria-label="Previous">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                className={`pag-arrow${activeIdx < SECTIONS.length - 1 ? ' next-pulse' : ''}`}
                onClick={goNext}
                disabled={activeIdx === SECTIONS.length - 1}
                aria-label="Next"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          )}

          {/* ─── Sections track ─────────────────────────────────────────
               Непрерывное кинематографическое движение в едином темпе (linear).
               Все блоки остаются полностью видимыми (isActive={doorOpened}) и
               никогда не исчезают посреди экрана!
          ─────────────────────────────────────────────────────────────── */}
          <div
            className="sections-track"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              willChange: 'transform',
              display: 'flex',
              flexDirection: 'column',
              transform: `translateY(calc(-${activeIdx} * 100dvh))`,
              transition: isAutoPlaying
                ? `transform ${AUTOPLAY_PACE_MS}ms linear`
                : 'transform 1.8s cubic-bezier(0.25, 1, 0.2, 1)',
            }}
          >
            {/* Slot 0 – Door */}
            <CoverDoor t={t} onOpen={handleDoorOpened} isOpened={doorOpened} />

            {/* Slots 1-10 – Content: все секции видимы с открытия двери и НЕ исчезают */}
            <PhotoSection t={t} isActive={doorOpened} />
            <MainInfo t={t} lang={lang} isActive={doorOpened} />
            <InviteSection t={t} isActive={doorOpened} />
            <CalendarSection t={t} isActive={doorOpened} />
            <VenueSection t={t} isActive={doorOpened} />
            <CollageSection t={t} isActive={doorOpened} />
            <ProgramSection t={t} isActive={doorOpened} />
            <FaqSection t={t} isActive={doorOpened} />
            <RsvpSection t={t} lang={lang} isActive={doorOpened} />
            <ClosingSection t={t} isActive={doorOpened} />
          </div>
        </>
      )}
    </div>
  )
}
