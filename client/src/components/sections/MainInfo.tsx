import { motion } from 'framer-motion'
import type { Translations } from '../../lib/i18n'
import { useCountdown } from '../../hooks/useCountdown'
import { FlowerA, FlowerB, FlowerC, SideVineA } from '../ui/Ornaments'

const TARGET = new Date('2026-08-29T15:00:00+06:00')

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.22, delayChildren: 0.2 } },
}
const itemVariants = {
    hidden: { opacity: 0, y: 36 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: [0.25, 1, 0.2, 1] } },
}

interface MainInfoProps {
    t: Translations
    lang: string
    isActive: boolean
}

export default function MainInfo({ t, lang, isActive }: MainInfoProps) {
    const { days, hours, minutes, seconds, isOver } = useCountdown(TARGET)

    return (
        <section
            id="main-info"
            className={`page-section ${isActive ? 'page-active' : ''}`}
            style={{ background: 'var(--bg-base)' }}
            data-anim="up"
        >
            <SideVineA />

            {/* Floating orbs */}
            <div className="float-ornament" style={{ width: 300, height: 300, background: 'radial-gradient(circle,rgba(212,165,201,.2) 0%,transparent 70%)', top: -80, right: -80, animation: 'floatAnim 8s ease-in-out infinite' }} />
            <div className="float-ornament" style={{ width: 200, height: 200, background: 'radial-gradient(circle,rgba(232,180,184,.25) 0%,transparent 70%)', top: '30%', left: -60, animation: 'floatAnim 10s ease-in-out 2s infinite' }} />

            <motion.div
                style={{ textAlign: 'center', position: 'relative', zIndex: 2, width: '100%' }}
                variants={containerVariants}
                initial="hidden"
                animate={isActive ? 'visible' : 'hidden'}
            >
                {/* Flowers */}
                <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 10 }} aria-hidden>
                    <FlowerA size={26} />
                    <FlowerB size={30} />
                </motion.div>

                {/* Name */}
                <motion.h1 variants={itemVariants} style={{
                    fontFamily: 'var(--font-script)', fontSize: 'clamp(5.4rem,26vw,11rem)',
                    color: 'var(--accent-dim)', lineHeight: 1,
                    textShadow: '0 2px 30px rgba(160,107,60,.2)',
                }}>Elena</motion.h1>

                <motion.p variants={itemVariants} style={{
                    fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400,
                    fontSize: 'clamp(1.5rem,7vw,2.6rem)', letterSpacing: '0.28em',
                    textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 10,
                }}>{t.brideSub}</motion.p>

                <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 10, marginBottom: 0 }} aria-hidden>
                    <FlowerC size={24} />
                </motion.div>

                {/* Date row */}
                <motion.div variants={itemVariants} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24,
                    padding: '32px 0', maxWidth: 480, margin: '0 auto',
                }}>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.2rem,4.6vw,1.9rem)', fontWeight: 300, fontStyle: 'italic', color: 'var(--text-muted)' }}>{t.saturday}</span>
                    </div>
                    <div style={{ flexShrink: 0, textAlign: 'center', position: 'relative' }}>
                        <span style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(4.4rem,15vw,7.6rem)', fontWeight: 300, color: 'var(--accent)', lineHeight: 1, display: 'block' }}>29</span>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.2rem,4.6vw,1.9rem)', fontWeight: 300, fontStyle: 'italic', color: 'var(--text-muted)' }}>{t.august}</span>
                    </div>
                </motion.div>

                {/* Countdown */}
                {!isOver && (
                    <motion.div variants={itemVariants} style={{
                        maxWidth: 480, margin: '0 auto', textAlign: 'center',
                        padding: '32px 24px', border: '1px solid var(--border)',
                        background: 'rgba(255,245,239,.6)', backdropFilter: 'blur(6px)',
                    }}>
                        <span className="mi-eyebrow" style={{ marginBottom: 20 }}>{t.timeRemaining}</span>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                            {[
                                { val: days, label: lang === 'ky' ? 'күн' : 'дней' },
                                { val: hours, label: lang === 'ky' ? 'саат' : 'часов' },
                                { val: minutes, label: 'мин' },
                                { val: seconds, label: 'сек' },
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 56 }}>
                                        <span className="countdown-num">{String(item.val).padStart(2, '0')}</span>
                                        <span className="countdown-label">{item.label}</span>
                                    </div>
                                    {i < 3 && <span className="countdown-sep">:</span>}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </section>
    )
}
