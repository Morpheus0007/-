import { motion } from 'framer-motion'
import type { Translations } from '../../lib/i18n'
import { FlowerStem, FlowerA, FrameCorners, DividerOrnament, SideVineA } from '../ui/Ornaments'

interface InviteSectionProps {
    t: Translations
    isActive: boolean
}

const containerV = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.22, delayChildren: 0.2 } },
}
const itemV = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: [0.25, 1, 0.2, 1] } },
}

export default function InviteSection({ t, isActive }: InviteSectionProps) {
    return (
        <section
            id="invite-page"
            className={`page-section ${isActive ? 'page-active' : ''}`}
            style={{ background: 'var(--bg-surface)' }}
            data-anim="right"
        >
            <SideVineA />

            <motion.div
                className="ornate-frame"
                style={{ position: 'relative', maxWidth: 520, width: '100%', zIndex: 2, textAlign: 'center', border: '1px solid var(--border)', background: 'rgba(255,245,239,.6)', backdropFilter: 'blur(6px)' }}
                variants={containerV}
                initial="hidden"
                animate={isActive ? 'visible' : 'hidden'}
            >
                <FrameCorners />

                {/* Flowers */}
                <motion.div variants={itemV} style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 10 }} aria-hidden>
                    <FlowerStem size={28} />
                    <FlowerA size={24} />
                    <FlowerStem size={28} flip />
                </motion.div>

                <motion.h2 variants={itemV} style={{
                    fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.7rem,7.5vw,4rem)',
                    fontWeight: 300, fontStyle: 'italic', color: 'var(--accent-dim)', marginBottom: 16,
                }}>
                    {t.inviteHead}
                </motion.h2>

                <motion.p variants={itemV} style={{
                    fontFamily: 'var(--font-sans)', fontSize: '1.08rem', lineHeight: 1.9,
                    color: 'var(--text-muted)', letterSpacing: '0.02em', textTransform: 'uppercase',
                }}>
                    <span style={{ display: 'block' }}>{t.inviteBody1}</span>
                    <span style={{ display: 'block' }}>{t.inviteBody2}</span>
                </motion.p>
            </motion.div>

            <DividerOrnament />
        </section>
    )
}
