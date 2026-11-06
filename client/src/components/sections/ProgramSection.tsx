import { motion } from 'framer-motion'
import type { Translations } from '../../lib/i18n'
import { FlowerStem, FrameCorners, SideVineA } from '../ui/Ornaments'

const SCHEDULE = [
    {
        time: '15:00',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
        titleKey: 'sched1Title' as const,
        subKey: 'sched1Sub' as const,
    },
    {
        time: '17:00',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                <line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
            </svg>
        ),
        titleKey: 'sched2Title' as const,
        subKey: 'sched2Sub' as const,
    },
    {
        time: '20:00',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
        ),
        titleKey: 'sched3Title' as const,
        subKey: 'sched3Sub' as const,
    },
]

interface ProgramSectionProps {
    t: Translations
    isActive: boolean
}

const containerV = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.28, delayChildren: 0.2 } },
}
const cardV = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 1.0, ease: [0.25, 1, 0.2, 1] } },
}

export default function ProgramSection({ t, isActive }: ProgramSectionProps) {
    return (
        <section
            id="program-page"
            className={`page-section ${isActive ? 'page-active' : ''}`}
            style={{ background: 'var(--bg-base)' }}
            data-anim="right"
        >
            <SideVineA />

            <motion.div
                className="ornate-frame"
                style={{ position: 'relative', maxWidth: 520, width: '100%', zIndex: 2, textAlign: 'center' }}
                variants={containerV}
                initial="hidden"
                animate={isActive ? 'visible' : 'hidden'}
            >
                <FrameCorners />

                <motion.span variants={cardV} className="mi-eyebrow">{t.schedEyebrow}</motion.span>

                <motion.div variants={cardV} style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }} aria-hidden>
                    <FlowerStem size={24} />
                </motion.div>

                {/* Timeline */}
                <div style={{ position: 'relative', padding: '32px 0 16px', textAlign: 'left' }}>
                    {/* Vertical line */}
                    <div style={{
                        position: 'absolute', left: 24, top: 0, bottom: 0, width: 2,
                        background: 'linear-gradient(to bottom,transparent,var(--accent-dim) 20%,var(--accent-dim) 80%,transparent)',
                    }} />

                    {SCHEDULE.map((item) => (
                        <motion.div
                            key={item.time}
                            variants={cardV}
                            style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 24, marginBottom: 32 }}
                            whileHover={{ x: 4 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        >
                            {/* Node */}
                            <div style={{ flexShrink: 0, width: 48, display: 'flex', justifyContent: 'center', paddingTop: 16 }}>
                                <div style={{
                                    width: 14, height: 14, borderRadius: '50%',
                                    background: 'var(--accent)', border: '3px solid var(--bg-base)',
                                    boxShadow: '0 0 0 2px var(--accent-dim)',
                                    transition: 'transform 0.4s var(--ease-expo), box-shadow 0.4s',
                                }} />
                            </div>

                            {/* Content card */}
                            <div style={{
                                flex: 1, padding: '16px 20px',
                                border: '1px solid var(--border)',
                                background: 'rgba(255,249,244,.7)', backdropFilter: 'blur(6px)',
                                transition: 'transform 0.5s var(--ease-expo),border-color 0.4s,box-shadow 0.5s',
                            }}>
                                <div style={{ color: 'var(--accent)', marginBottom: 8, opacity: 0.7 }}>{item.icon}</div>
                                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '2.13rem', fontWeight: 300, color: 'var(--accent)', display: 'block', marginBottom: 4 }}>
                                    {item.time}
                                </span>
                                <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.14rem', fontWeight: 500, letterSpacing: '0.08em', color: 'var(--text-primary)', marginBottom: 4 }}>
                                    {t[item.titleKey]}
                                </h4>
                                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                                    {t[item.subKey]}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    )
}
