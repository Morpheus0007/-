import { motion } from 'framer-motion'
import type { Translations } from '../../lib/i18n'

// August 2026: first weekday is Saturday (index=5 in Mon-starting week)
const FIRST_DAY_OFFSET = 5
const DAYS_IN_MONTH = 31
const SPECIAL_DAY = 29

function buildCalendarIcs(): void {
    const icsContent = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//KyzUzatuu//EN',
        'BEGIN:VEVENT',
        'DTSTART:20260829T090000Z', 'DTEND:20260829T140000Z',
        'SUMMARY:Кыз Узатуу — Elena',
        'DESCRIPTION:Приглашение на проводы невесты Елены',
        'LOCATION:Бишкек\\, Кыргызстан',
        'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n')
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'kyz-uzatuu-elena-2026.ics'
    document.body.appendChild(a); a.click()
    document.body.removeChild(a); URL.revokeObjectURL(url)
}

interface CalendarSectionProps {
    t: Translations
    isActive: boolean
}

const containerV = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}
const itemV = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 120, damping: 18 } },
}

export default function CalendarSection({ t, isActive }: CalendarSectionProps) {
    const emptyCells = Array.from({ length: FIRST_DAY_OFFSET })
    const days = Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1)

    return (
        <section
            id="calendar-page"
            className={`page-section ${isActive ? 'page-active' : ''}`}
            style={{ background: 'var(--bg-base)' }}
            data-anim="left"
        >
            <motion.div
                style={{ maxWidth: 480, width: '100%', position: 'relative', zIndex: 2 }}
                variants={containerV}
                initial="hidden"
                animate={isActive ? 'visible' : 'hidden'}
            >
                {/* Eyebrow */}
                <motion.span variants={itemV} className="mi-eyebrow" style={{ textAlign: 'center', display: 'block' }}>
                    {t.dateEyebrow}
                </motion.span>

                {/* Calendar card */}
                <motion.div variants={itemV} style={{
                    background: 'rgba(255,249,244,.9)', border: '1px solid var(--border-accent)',
                    padding: 24, backdropFilter: 'blur(8px)',
                }}>
                    <div style={{ textAlign: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.57rem', fontWeight: 300, fontStyle: 'italic', color: 'var(--text-primary)' }}>
                            {t.calMonth}
                        </span>
                    </div>

                    {/* Weekday headers */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, marginBottom: 8 }}>
                        {t.calWeek.map(d => (
                            <span key={d} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'center', padding: '4px 0' }}>{d}</span>
                        ))}
                    </div>

                    {/* Day cells */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2 }}>
                        {emptyCells.map((_, i) => (
                            <div key={`e${i}`} style={{ opacity: 0 }} />
                        ))}
                        {days.map(d => (
                            <div
                                key={d}
                                className={d === SPECIAL_DAY ? 'cal-day special' : 'cal-day'}
                                style={{
                                    textAlign: 'center',
                                    fontFamily: 'var(--font-sans)', fontSize: '0.87rem',
                                    color: d === SPECIAL_DAY ? '#fff' : 'var(--text-muted)',
                                    padding: '7px 2px', position: 'relative',
                                }}
                            >
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Add to calendar */}
                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                        <button
                            onClick={buildCalendarIcs}
                            className="mi-btn"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                padding: '10px 22px', border: '1px solid var(--accent)', color: 'var(--accent)',
                                fontFamily: 'var(--font-sans)', fontSize: '0.76rem', letterSpacing: '0.2em',
                                textTransform: 'uppercase', background: 'transparent', cursor: 'pointer',
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            <span>{t.addCalBtn}</span>
                        </button>
                    </div>
                </motion.div>

                {/* Calendar flowers */}
                <motion.div variants={itemV} style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16, opacity: 0.85 }} aria-hidden>
                    <svg width="70" height="62" viewBox="0 0 70 62">
                        <path d="M35 62 L35 32" stroke="var(--accent-dim)" strokeWidth="1.3" fill="none" opacity="0.65" />
                        <g transform="translate(35,16)">
                            {[0, 51.4, 102.8, 154.2, 205.6, 257, 308.4].map((r, i) => (
                                <ellipse key={i} rx="4" ry="12" fill="var(--accent-light)" opacity="0.9" transform={`rotate(${r})`} />
                            ))}
                            <circle r="5" fill="var(--accent)" opacity="0.95" />
                        </g>
                    </svg>
                </motion.div>
            </motion.div>
        </section>
    )
}
