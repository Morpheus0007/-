import { motion } from 'framer-motion'
import type { Translations } from '../../lib/i18n'

interface PhotoSectionProps {
    t: Translations
    isActive: boolean
}

export default function PhotoSection({ t, isActive }: PhotoSectionProps) {
    return (
        <section
            id="photo-section"
            className={`page-section ${isActive ? 'page-active' : ''}`}
            style={{ background: 'linear-gradient(180deg,#fdf0f8 0%,#fdf6f0 100%)', padding: 0 }}
            data-anim="fade"
        >
            {/* Full-viewport photo on mobile */}
            <motion.div
                className={`photo-frame ${isActive ? 'revealed' : ''}`}
                style={{
                    position: 'relative',
                    width: 'min(80vw,420px)',
                    height: 'min(80vw,520px)',
                    border: '1px solid rgba(200,149,108,.3)',
                    overflow: 'hidden',
                }}
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 1.6 }}
            >
                <img
                    src="https://i.ibb.co/35pmPh6N/image.jpg"
                    alt="Elena"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={e => { (e.currentTarget.parentElement as HTMLElement).style.background = 'linear-gradient(135deg,#f5dfc8 0%,#f0c8d8 50%,#e8c5e0 100%)' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(61,43,31,.3) 0%,transparent 60%)' }} />
                {/* Photo corners */}
                {(['tl', 'tr', 'bl', 'br'] as const).map(c => (
                    <div key={c} style={{
                        position: 'absolute', width: 24, height: 24,
                        borderColor: 'var(--accent)',
                        top: c.includes('t') ? 8 : undefined, bottom: c.includes('b') ? 8 : undefined,
                        left: c.includes('l') ? 8 : undefined, right: c.includes('r') ? 8 : undefined,
                        borderTop: c.includes('t') ? '1px solid' : undefined,
                        borderBottom: c.includes('b') ? '1px solid' : undefined,
                        borderLeft: c.includes('l') ? '1px solid' : undefined,
                        borderRight: c.includes('r') ? '1px solid' : undefined,
                    }} />
                ))}
            </motion.div>

            {/* Caption */}
            <motion.div
                className="photo-caption"
                style={{ marginTop: 20, textAlign: 'center' }}
                initial={{ opacity: 0, y: 16 }}
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 1.1, delay: 0.6 }}
            >
                <span style={{
                    fontFamily: 'var(--font-sans)', fontSize: '0.9rem',
                    letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--accent)',
                }}>{t.eyebrow1}</span>
            </motion.div>

            {/* scroll hint */}
            <div className="scroll-hint" aria-hidden>
                <div style={{ width: 1, height: 40, background: 'var(--accent-dim)', opacity: 0.5 }} />
                <svg width="16" height="24" viewBox="0 0 16 24">
                    <path d="M8 0v20M1 14l7 8 7-8" stroke="currentColor" strokeWidth="1" fill="none" />
                </svg>
            </div>
        </section>
    )
}
