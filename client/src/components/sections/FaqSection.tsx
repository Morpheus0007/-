import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Translations } from '../../lib/i18n'
import { FlowerA, FlowerC, SideVineA } from '../ui/Ornaments'

interface FaqSectionProps {
    t: Translations
    isActive: boolean
}

export default function FaqSection({ t, isActive }: FaqSectionProps) {
    const [openIdx, setOpenIdx] = useState<number | null>(null)

    const faqs = [
        { q: t.faq1Q, a: t.faq1A },
        { q: t.faq2Q, a: t.faq2A },
        { q: t.faq3Q, a: t.faq3A },
    ]

    return (
        <section
            id="faq-page"
            className={`page-section ${isActive ? 'page-active' : ''}`}
            style={{ background: 'var(--bg-surface)' }}
            data-anim="left"
        >
            <SideVineA />

            <motion.div
                style={{ maxWidth: 520, width: '100%', position: 'relative', zIndex: 2, textAlign: 'center' }}
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6 }}
            >
                <span className="mi-eyebrow">{t.faqEyebrow}</span>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 28 }} aria-hidden>
                    <FlowerA size={18} />
                    <FlowerC size={18} />
                </div>

                <div style={{ textAlign: 'left' }}>
                    {faqs.map((faq, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 16 }}
                            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            style={{
                                border: '1px solid var(--border)', marginBottom: 8,
                                background: 'rgba(255,249,244,.7)', backdropFilter: 'blur(4px)',
                            }}
                        >
                            <button
                                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                                aria-expanded={openIdx === i}
                                style={{
                                    width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '18px 20px',
                                    background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                                    fontFamily: 'var(--font-sans)', fontSize: '1.03rem', color: 'var(--text-primary)',
                                    letterSpacing: '0.03em',
                                }}
                            >
                                <span style={{ flex: 1, paddingRight: 12 }}>{faq.q}</span>
                                <motion.svg
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                                    width="20" height="20"
                                    style={{ flexShrink: 0, color: 'var(--accent)' }}
                                    animate={{ rotate: openIdx === i ? 45 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </motion.svg>
                            </button>

                            <AnimatePresence>
                                {openIdx === i && (
                                    <motion.div
                                        key="body"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <p style={{
                                            padding: '0 20px 18px',
                                            fontFamily: 'var(--font-sans)', fontSize: '0.99rem', color: 'var(--text-muted)',
                                            lineHeight: 1.7, letterSpacing: '0.02em',
                                        }}>
                                            {faq.a}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    )
}
