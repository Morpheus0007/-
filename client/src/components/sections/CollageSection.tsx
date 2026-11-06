import { motion } from 'framer-motion'
import type { Translations } from '../../lib/i18n'

const PHOTOS = [
    { src: 'https://i.ibb.co/rRB0kwMk/collag1.jpg', cls: 'collage-main', anim: 'left' },
    { src: 'https://i.ibb.co/F42zBGvn/collag2.jpg', cls: 'collage-sm', anim: 'right' },
    { src: 'https://i.ibb.co/xSXR25ff/collag3.jpg', cls: 'collage-sm', anim: 'right' },
]

interface CollageSectionProps {
    t: Translations
    isActive: boolean
}

export default function CollageSection({ t, isActive }: CollageSectionProps) {
    return (
        <section
            id="collage-page"
            className={`page-section ${isActive ? 'page-active' : ''}`}
            style={{ background: 'var(--bg-surface)', padding: '72px 24px 80px' }}
            data-anim="fade"
        >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
                <motion.span
                    className="mi-eyebrow"
                    initial={{ opacity: 0, y: 16 }}
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                    transition={{ duration: 0.6 }}
                >
                    {t.atmosphereEyebrow}
                </motion.span>
                <motion.h2
                    style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.4rem,6vw,3.6rem)', fontWeight: 300, color: 'var(--text-primary)', margin: 0, lineHeight: 1.15 }}
                    initial={{ opacity: 0, y: 16 }}
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    {t.atmosphereTitle}
                </motion.h2>
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gridTemplateRows: 'auto auto', gap: 10, maxWidth: 860, width: '100%', margin: '0 auto' }}>
                {PHOTOS.map((p, i) => (
                    <motion.div
                        key={p.src}
                        className={`collage-item ${p.cls}`}
                        style={{
                            gridColumn: i === 0 ? '1' : '2',
                            gridRow: i === 0 ? '1 / 3' : undefined,
                            aspectRatio: i === 0 ? '2/3' : '4/3',
                            position: 'relative', overflow: 'hidden',
                            border: '1px solid var(--border)', background: 'var(--bg-surface)',
                            transition: 'border-color 0.4s,transform 0.45s,box-shadow 0.45s',
                        }}
                        initial={{ opacity: 0, x: p.anim === 'left' ? -40 : 40 }}
                        animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: p.anim === 'left' ? -40 : 40 }}
                        transition={{ duration: 0.7, delay: i * 0.12 }}
                    >
                        <img
                            src={p.src}
                            alt="Той залы"
                            loading="lazy"
                            className="collage-img"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s var(--ease-silk)' }}
                            onError={e => { (e.currentTarget.parentElement as HTMLElement).style.background = 'linear-gradient(135deg,#f5dfc8,#e8c5e0)' }}
                        />
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
