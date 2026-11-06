import { motion } from 'framer-motion'
import type { Translations } from '../../lib/i18n'
import { FlowerB } from '../ui/Ornaments'

interface VenueSectionProps {
    t: Translations
    isActive: boolean
}

const containerV = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.22, delayChildren: 0.15 } },
}
const itemV = {
    hidden: { opacity: 0, y: 36 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: [0.25, 1, 0.2, 1] } },
}
const zoomV = {
    hidden: { opacity: 0, scale: 0.93 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1.1, ease: [0.25, 1, 0.2, 1] } },
}

export default function VenueSection({ t, isActive }: VenueSectionProps) {
    return (
        <section
            id="venue-page"
            className={`page-section ${isActive ? 'page-active' : ''}`}
            style={{ background: 'var(--bg-surface)' }}
            data-anim="right"
        >
            <motion.div
                style={{ maxWidth: 520, width: '100%', position: 'relative', zIndex: 2, textAlign: 'center' }}
                variants={containerV}
                initial="hidden"
                animate={isActive ? 'visible' : 'hidden'}
            >
                {/* Eyebrow */}
                <motion.span variants={itemV} className="mi-eyebrow" style={{ fontSize: '1.12rem', letterSpacing: '0.28em', marginBottom: 18 }}>
                    {t.venueEyebrow}
                </motion.span>

                <motion.div variants={itemV} style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }} aria-hidden>
                    <FlowerB size={22} />
                </motion.div>

                {/* Venue card */}
                <motion.div
                    variants={zoomV}
                    className="venue-card"
                    style={{ border: '1px solid var(--border-accent)', overflow: 'hidden', background: 'var(--bg-raised)' }}
                    whileHover={{ y: -4 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                >
                    {/* Photo */}
                    <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: 'linear-gradient(135deg,#f5dfc8 0%,#f0c8d8 100%)' }}>
                        <img
                            src="https://i.ibb.co/vRx5Jc3/restaurant.png"
                            alt="Restaurant"
                            loading="lazy"
                            className="venue-photo"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.9s var(--ease-silk)' }}
                            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(61,43,31,.5) 0%,transparent 60%)' }} />
                    </div>

                    {/* Info */}
                    <div style={{ padding: '20px 24px' }}>
                        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.46rem', fontWeight: 300, fontStyle: 'italic', color: 'var(--text-primary)', marginBottom: 6 }}>
                            {t.venueName}
                        </h3>
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.99rem', color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 16 }}>
                            {t.venueAddress}
                        </p>
                        <a
                            href="https://2gis.kg/bishkek/firm/70000001022288533"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mi-btn"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                padding: '12px 28px', border: '1px solid var(--accent)', color: 'var(--accent)',
                                fontFamily: 'var(--font-sans)', fontSize: '0.81rem', letterSpacing: '0.22em',
                                textTransform: 'uppercase', textDecoration: 'none', background: 'transparent', cursor: 'pointer',
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            <span>{t.mapBtn}</span>
                        </a>
                    </div>
                </motion.div>

                {/* Location pin ornament */}
                <motion.div variants={itemV} style={{ marginTop: 24, opacity: 0.6 }} aria-hidden>
                    <svg width="200" height="30" viewBox="0 0 200 30">
                        <path d="M10 15 L90 15" stroke="var(--border)" strokeWidth="0.5" />
                        <circle cx="100" cy="15" r="3" fill="var(--accent-dim)" />
                        <path d="M110 15 L190 15" stroke="var(--border)" strokeWidth="0.5" />
                    </svg>
                </motion.div>
            </motion.div>
        </section>
    )
}
