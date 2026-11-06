import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Translations } from '../../lib/i18n'
import { FlowerC, FlowerStem, FrameCorners, SideVineA } from '../ui/Ornaments'

interface ClosingSectionProps {
    t: Translations
    isActive: boolean
}

export default function ClosingSection({ t, isActive }: ClosingSectionProps) {
    const [shareUrl, setShareUrl] = useState('')

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setShareUrl(window.location.origin + window.location.pathname)
        }
    }, [])

    return (
        <section
            id="closing-page"
            className={`page-section ${isActive ? 'page-active' : ''}`}
            style={{
                background: 'linear-gradient(180deg,var(--bg-base) 0%,var(--bg-petal) 100%)',
            }}
            data-anim="fade"
        >
            <SideVineA />

            <motion.div
                className="ornate-frame"
                style={{
                    position: 'relative', width: '100%', maxWidth: 520, zIndex: 2, textAlign: 'center',
                    background: 'rgba(255,249,244,.2)', border: '1px solid var(--border)',
                }}
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.8 }}
            >
                <FrameCorners />

                {/* Minimalist arcs & dots upper-left */}
                <svg
                    className="sec-orn sec-orn-arcs corner-tl"
                    viewBox="0 0 64 64" fill="none" aria-hidden
                    style={{
                        position: 'absolute', top: 20, left: 20, width: 88, height: 88,
                        transition: 'transform 0.4s var(--ease-silk), opacity 0.4s', opacity: 0.85,
                    }}
                >
                    <path d="M8 56 Q8 8 56 8" stroke="var(--accent)" strokeWidth="0.8" fill="none" />
                    <path d="M14 56 Q14 14 56 14" stroke="var(--accent-rose)" strokeWidth="0.6" fill="none" opacity="0.7" />
                    <path d="M22 56 Q22 22 56 22" stroke="var(--accent-pink)" strokeWidth="0.5" fill="none" opacity="0.6" />
                    <circle cx="8" cy="8" r="2.5" fill="var(--accent)" />
                    <circle cx="20" cy="10" r="1.5" fill="var(--accent-rose)" />
                    <circle cx="10" cy="22" r="1.5" fill="var(--accent-pink)" />
                    <circle cx="32" cy="8" r="1" fill="var(--accent)" opacity="0.4" />
                    <circle cx="8" cy="34" r="1" fill="var(--accent)" opacity="0.4" />
                </svg>

                {/* Names Row (Separated) */}
                <div
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: 16, marginTop: 40, marginBottom: 28, width: '100%',
                    }}
                >
                    {/* Left Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <svg width="60" height="30" viewBox="0 0 60 30" fill="none">
                            <path d="M50 15 C30 15, 20 25, 10 15 C20 15, 30 5, 50 15" stroke="var(--accent)" strokeWidth="0.8" />
                            <path d="M40 15 C25 15, 20 20, 15 15" stroke="var(--accent-dim)" strokeWidth="0.6" />
                            <circle cx="10" cy="15" r="2" fill="var(--accent)" />
                        </svg>
                        <span style={{ fontFamily: 'var(--font-script)', fontSize: 'clamp(1.6rem, 5vw, 2.5rem)', color: 'var(--accent-dim)', whiteSpace: 'nowrap' }}>
                            Канат
                        </span>
                    </div>

                    {/* Gold Mid */}
                    <div style={{ flexShrink: 0 }}>
                        <svg width="80" height="24" viewBox="0 0 80 24" fill="none">
                            <path d="M0 12 L30 12" stroke="var(--accent-dim)" strokeWidth="0.5" strokeDasharray="2 3" />
                            <circle cx="40" cy="12" r="3" fill="none" stroke="var(--accent)" strokeWidth="1" />
                            <circle cx="40" cy="12" r="1.2" fill="var(--accent)" />
                            <path d="M50 12 L80 12" stroke="var(--accent-dim)" strokeWidth="0.5" strokeDasharray="2 3" />
                        </svg>
                    </div>

                    {/* Right Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontFamily: 'var(--font-script)', fontSize: 'clamp(1.6rem, 5vw, 2.5rem)', color: 'var(--accent-dim)', whiteSpace: 'nowrap' }}>
                            Алтынай
                        </span>
                        <svg width="60" height="30" viewBox="0 0 60 30" fill="none" style={{ transform: 'rotate(180deg)' }}>
                            <path d="M50 15 C30 15, 20 25, 10 15 C20 15, 30 5, 50 15" stroke="var(--accent)" strokeWidth="0.8" />
                            <path d="M40 15 C25 15, 20 20, 15 15" stroke="var(--accent-dim)" strokeWidth="0.6" />
                            <circle cx="10" cy="15" r="2" fill="var(--accent)" />
                        </svg>
                    </div>
                </div>

                {/* Flowers */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 20 }} aria-hidden>
                    <FlowerStem size={18} />
                    <FlowerC size={20} />
                    <FlowerStem size={18} flip />
                </div>

                {/* Respectful Text */}
                <p style={{
                    fontFamily: 'var(--font-serif)', fontSize: '1.24rem', fontStyle: 'italic',
                    color: 'var(--text-primary)', marginBottom: 8,
                }}>
                    {t.closingText}
                </p>
                <p style={{
                    fontFamily: 'var(--font-sans)', fontSize: '0.88rem', letterSpacing: '0.04em',
                    lineHeight: 1.6, color: 'var(--text-muted)', maxWidth: 360, margin: '0 auto 36px',
                }}>
                    {t.closingSubtext}
                </p>

                {/* Social Blocks */}
                <div style={{
                    display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center',
                    gap: 16, width: '100%', marginBottom: 32,
                }}>
                    {/* Instagram Button */}
                    <a
                        href="https://www.instagram.com/lenain_nn?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-square-link"
                        style={{
                            position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            width: 'min(38vw, 140px)', height: 'min(38vw, 140px)', border: '1px solid var(--border)',
                            background: 'rgba(255,255,255,0.4)', textDecoration: 'none', color: 'var(--text-primary)',
                            borderRadius: 2, padding: 12,
                        }}
                    >
                        <div className="square-link-border" />
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ color: 'var(--accent)', marginBottom: 8 }}>
                            <rect x="2" y="2" width="20" height="20" rx="5" />
                            <circle cx="12" cy="12" r="4.5" />
                            <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" />
                        </svg>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                            Instagram
                        </span>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.67rem', color: 'var(--text-muted)', marginTop: 4 }}>
                            @lenain_nn
                        </span>
                    </a>

                    {/* QR Share */}
                    {shareUrl && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, margin: '0 8px' }}>
                            <div style={{
                                padding: 6, background: '#fff', border: '1px solid var(--border)',
                                boxShadow: '0 4px 12px rgba(61,43,31,0.06)', borderRadius: 2,
                            }}>
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=84&color=3d2b1f&bgcolor=ffffff&data=${encodeURIComponent(shareUrl)}`}
                                    alt="QR Share"
                                    style={{ display: 'block', width: 84, height: 84 }}
                                />
                            </div>
                            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.66rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                                {t.shareLabel}
                            </span>
                        </div>
                    )}

                    {/* WhatsApp Button */}
                    <a
                        href="https://wa.me/996700556907"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-square-link"
                        style={{
                            position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            width: 'min(38vw, 140px)', height: 'min(38vw, 140px)', border: '1px solid var(--border)',
                            background: 'rgba(255,255,255,0.4)', textDecoration: 'none', color: 'var(--text-primary)',
                            borderRadius: 2, padding: 12,
                        }}
                    >
                        <div className="square-link-border" />
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ color: 'var(--accent)', marginBottom: 8 }}>
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                        </svg>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                            WhatsApp
                        </span>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.67rem', color: 'var(--text-muted)', marginTop: 4 }}>
                            0700 556 907
                        </span>
                    </a>
                </div>

                {/* Footer ornament */}
                <div style={{ marginTop: 20, opacity: 0.55 }} aria-hidden>
                    <svg width="200" height="30" viewBox="0 0 200 30">
                        <path d="M10 15 L90 15" stroke="var(--border)" strokeWidth="0.5" />
                        <circle cx="100" cy="15" r="3" fill="var(--accent-dim)" />
                        <path d="M110 15 L190 15" stroke="var(--border)" strokeWidth="0.5" />
                    </svg>
                </div>
            </motion.div>
        </section>
    )
}
