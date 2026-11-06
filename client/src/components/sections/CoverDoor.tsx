import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useState, useCallback } from 'react'
import type { Translations } from '../../lib/i18n'
import { FlowerA, FlowerB, SideVineA } from '../ui/Ornaments'

interface CoverDoorProps {
    t: Translations
    onOpen: () => void
    isOpened: boolean
}

export default function CoverDoor({ t, onOpen, isOpened }: CoverDoorProps) {
    const [isOpening, setIsOpening] = useState(false)
    const shouldReduceMotion = useReducedMotion()

    const handleOpen = useCallback(() => {
        if (isOpened || isOpening) return
        if (navigator.vibrate) navigator.vibrate([12, 60, 25])
        setIsOpening(true)
        setTimeout(() => {
            setIsOpening(false)
            onOpen()
            setTimeout(() => {
                const burst = (window as unknown as Record<string, unknown>).__spawnPetalBurst
                if (typeof burst === 'function') burst()
            }, 900)
        }, 480)
    }, [isOpened, isOpening, onOpen])

    const panelTransition = shouldReduceMotion
        ? { duration: 0.9 }
        : { type: 'spring' as const, stiffness: 28, damping: 16, mass: 1.4 }

    return (
        <section
            id="cover"
            className="cover-section"
            style={{
                minHeight: '100dvh', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden',
                background: 'linear-gradient(145deg,#fdf0e8 0%,#fde8f0 40%,#f5e0f8 100%)',
            }}
        >
            {/* Background */}
            <div style={{
                position: 'absolute', inset: 0, zIndex: 0,
                background: 'radial-gradient(ellipse 60% 40% at 20% 20%,rgba(212,165,201,.35) 0%,transparent 70%),radial-gradient(ellipse 50% 50% at 80% 80%,rgba(232,180,184,.30) 0%,transparent 70%)',
            }} />

            {/* Corner ornaments */}
            {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map(pos => (
                <div key={pos} aria-hidden style={{
                    position: 'absolute',
                    width: 150, height: 150,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Cpath d='M12 12 Q80 12 12 80' stroke='%23a06b3c' stroke-width='1.8' fill='none' opacity='0.85'/%3E%3Cpath d='M12 12 Q12 80 80 12' stroke='%23a06b3c' stroke-width='1.8' fill='none' opacity='0.85'/%3E%3Ccircle cx='12' cy='12' r='4' fill='%23a06b3c' opacity='0.9'/%3E%3C/svg%3E")`,
                    backgroundSize: 'contain', backgroundRepeat: 'no-repeat',
                    top: pos.includes('top') ? 20 : undefined,
                    bottom: pos.includes('bottom') ? 20 : undefined,
                    left: pos.includes('left') ? 20 : undefined,
                    right: pos.includes('right') ? 20 : undefined,
                    transform: pos === 'top-right' ? 'scaleX(-1)' : pos === 'bottom-left' ? 'scaleY(-1)' : pos === 'bottom-right' ? 'scale(-1)' : undefined,
                }} />
            ))}

            {/* Full-screen door wrapper */}
            <div
                className={`door-wrapper ${isOpening ? 'opening' : ''} ${isOpened ? 'opened' : ''}`}
                style={{ position: 'absolute', inset: 0, width: '100vw', height: '100dvh' }}
            >
                {/* Vignette */}
                <div className="door-vignette" style={{
                    position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none',
                    background: 'radial-gradient(ellipse at 50% 50%,transparent 40%,rgba(20,12,6,.55) 100%)',
                }} />

                {/* Door frame */}
                <div className="door-frame" style={{ position: 'relative', width: '100vw', height: '100dvh' }}>

                    {/* Invitation card behind doors */}
                    <div style={{
                        position: 'absolute', inset: 0, zIndex: 2,
                        background: 'linear-gradient(135deg,#fff9f4 0%,#fdf0e8 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: 24,
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg,transparent,var(--accent),transparent)', margin: '0 auto 8px' }} />
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 4 }}>{t.letterEyebrow}</p>
                            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.23rem', fontWeight: 300, fontStyle: 'italic', color: 'var(--text-primary)', marginBottom: 6 }}>{t.letterTitle}</h2>
                            <div style={{ width: 30, height: 1, background: 'var(--accent-dim)', margin: '6px auto' }} />
                            <p style={{ fontFamily: 'var(--font-script)', fontSize: '1.79rem', color: 'var(--accent-dim)' }}>Elena</p>
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.62rem', letterSpacing: '0.2em', color: 'var(--text-muted)', marginTop: 4 }}>29 · VIII · 2026</p>
                        </div>
                    </div>

                    {/* Left panel */}
                    <motion.div
                        className="door-panel leaf-left"
                        onClick={handleOpen}
                        style={{
                            position: 'absolute', top: 0, left: 0, bottom: 0, width: '50%',
                            background: 'linear-gradient(170deg,#f7e6d5 0%,#edcfaf 100%)',
                            borderRight: '0.5px solid rgba(200,149,108,.35)',
                            zIndex: 10, cursor: 'pointer',
                            transformOrigin: 'left center',
                        }}
                        animate={{ rotateY: isOpened ? -148 : 0 }}
                        transition={panelTransition}
                    >
                        <div style={{ position: 'absolute', inset: 16, border: '1px dashed rgba(200,149,108,.3)', pointerEvents: 'none' }} />
                        {/* Knob */}
                        <div style={{
                            width: 14, height: 14, borderRadius: '50%',
                            background: 'radial-gradient(circle at 35% 35%,#f7dfc8,#c8956c 60%,#a06b3c)',
                            boxShadow: '0 2px 5px rgba(160,107,60,.4)',
                            position: 'absolute', top: '50%', right: 6, transform: 'translateY(-50%)',
                        }} />
                        {/* Decorative text on panel — single large "E" visible */}
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontFamily: 'var(--font-script)', fontSize: 'clamp(4rem,12vw,8rem)', color: 'rgba(200,149,108,0.18)', userSelect: 'none', lineHeight: 1 }}>E</span>
                        </div>
                    </motion.div>

                    {/* Right panel */}
                    <motion.div
                        className="door-panel leaf-right"
                        onClick={handleOpen}
                        style={{
                            position: 'absolute', top: 0, right: 0, bottom: 0, width: '50%',
                            background: 'linear-gradient(190deg,#f7e6d5 0%,#edcfaf 100%)',
                            borderLeft: '0.5px solid rgba(200,149,108,.35)',
                            zIndex: 10, cursor: 'pointer',
                            transformOrigin: 'right center',
                        }}
                        animate={{ rotateY: isOpened ? 148 : 0 }}
                        transition={panelTransition}
                    >
                        <div style={{ position: 'absolute', inset: 16, border: '1px dashed rgba(200,149,108,.3)', pointerEvents: 'none' }} />
                        <div style={{
                            width: 14, height: 14, borderRadius: '50%',
                            background: 'radial-gradient(circle at 35% 35%,#f7dfc8,#c8956c 60%,#a06b3c)',
                            boxShadow: '0 2px 5px rgba(160,107,60,.4)',
                            position: 'absolute', top: '50%', left: 6, transform: 'translateY(-50%)',
                        }} />
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontFamily: 'var(--font-script)', fontSize: 'clamp(4rem,12vw,8rem)', color: 'rgba(200,149,108,0.18)', userSelect: 'none', lineHeight: 1 }}>l</span>
                        </div>
                    </motion.div>

                    {/* Warm light bloom */}
                    <div className="door-light" style={{
                        position: 'absolute', inset: 0, zIndex: 6, pointerEvents: 'none',
                        background: 'radial-gradient(circle at 50% 45%,rgba(255,248,232,1) 0%,rgba(248,214,190,.65) 35%,transparent 75%)',
                    }} />

                    {/* Wax seal — centred monogram */}
                    <AnimatePresence>
                        {!isOpened && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%,-50%)',
                                    zIndex: 18,
                                }}
                            >
                                <motion.div
                                    className="wax-seal"
                                    onClick={handleOpen}
                                    style={{
                                        filter: 'drop-shadow(0 6px 16px rgba(160,107,60,.45))',
                                        cursor: 'pointer',
                                    }}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.6, opacity: 0 }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                                >
                                    <svg viewBox="0 0 80 80" width="180" height="180">
                                        <circle cx="40" cy="40" r="38" fill="#c8956c" stroke="#a06b3c" strokeWidth="1.5" />
                                        <circle cx="40" cy="40" r="30" fill="none" stroke="#f5e6d0" strokeWidth="0.8" strokeDasharray="3 3" />
                                        <text x="40" y="44" textAnchor="middle" fontFamily="Great Vibes" fontSize="34" fill="#f5e6d0">E</text>
                                        <text x="40" y="57" textAnchor="middle" fontFamily="Montserrat" fontSize="7" fill="#f5e6d0" letterSpacing="2">КЫЗ УЗАТУУ</text>
                                    </svg>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Arch frame SVG overlay */}
                    <div style={{ position: 'absolute', inset: 0, zIndex: 22, pointerEvents: 'none' }} aria-hidden>
                        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M6 100 L6 26 C6 12 26 4 50 4 C74 4 94 12 94 26 L94 100" fill="none" stroke="#c8956c" strokeWidth="0.6" opacity="0.75" />
                            <path d="M46 4 L50 -1.5 L54 4 L52 9 L48 9 Z" fill="#c8956c" opacity="0.85" />
                            <circle cx="50" cy="5.5" r="1.1" fill="#f5e6d0" opacity="0.9" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Cover text — above door, reveals after open */}
            <div style={{
                position: 'absolute', top: 'calc(8% + env(safe-area-inset-top,0px))',
                width: '100%', zIndex: 25, pointerEvents: 'none',
                padding: '0 24px', boxSizing: 'border-box', textAlign: 'center',
            }}>
                <p
                    className={`curtain-reveal ${isOpened ? 'visible' : ''}`}
                    style={{
                        fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.4rem,7vw,3.8rem)',
                        fontWeight: 300, fontStyle: 'italic', color: 'var(--text-primary)',
                        letterSpacing: '0.04em', lineHeight: 1.2,
                    }}
                >
                    {t.coverLabel}
                </p>
            </div>

            {/* Open button */}
            <AnimatePresence>
                {!isOpened && (
                    <motion.button
                        onClick={handleOpen}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        className="mi-btn"
                        style={{
                            position: 'absolute',
                            bottom: 'calc(8% + env(safe-area-inset-bottom,0px))',
                            zIndex: 25,
                            border: '1px solid var(--accent)', color: 'var(--accent)',
                            fontFamily: 'var(--font-sans)', fontSize: '0.95rem', letterSpacing: '0.25em',
                            textTransform: 'uppercase', padding: '14px 32px',
                            background: 'none', cursor: 'pointer',
                        }}
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M3 12h18M3 6h18M3 18h18" />
                            </svg>
                            {t.openBtn}
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Side vines */}
            <SideVineA />

            {/* Flowers decorative bottom */}
            <div style={{ position: 'absolute', bottom: 150, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 12, zIndex: 2, pointerEvents: 'none' }} aria-hidden>
                <FlowerA size={20} />
                <FlowerB size={24} />
                <FlowerA size={20} />
            </div>
        </section>
    )
}
