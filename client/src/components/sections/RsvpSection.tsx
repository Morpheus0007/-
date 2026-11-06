import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Translations } from '../../lib/i18n'
import { FlowerB, FrameCorners, SideVineA } from '../ui/Ornaments'

interface RsvpSectionProps {
    t: Translations
    isActive: boolean
    lang: 'ky' | 'ru'
}

interface RsvpData {
    name: string
    phone: string
    attending: string
    count: number | ''
    names: string
    needs: string
    wish: string
    lang: string
}

export default function RsvpSection({ t, isActive, lang }: RsvpSectionProps) {
    const [attending, setAttending] = useState<boolean | null>(null)
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [count, setCount] = useState<number | ''>('')
    const [names, setNames] = useState('')
    const [needs, setNeeds] = useState('')
    const [wish, setWish] = useState('')

    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const SHEET_URL = import.meta.env.VITE_GOOGLE_SHEET_URL as string | undefined

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return
        if (!phone.trim()) return
        if (attending === null) return

        setLoading(true)

        const rsvpData: RsvpData = {
            name: name.trim(),
            phone: phone.trim(),
            attending: attending ? 'Келем' : 'Келбейм',
            count: attending ? (count || 1) : '',
            names: attending ? names.trim() : '',
            needs: attending ? needs.trim() : '',
            wish: wish.trim(),
            lang,
        }

        try {
            if (SHEET_URL) {
                // Direct GAS submission (useful for pure static deployment)
                const params = new URLSearchParams({
                    name: rsvpData.name,
                    phone: rsvpData.phone,
                    attending: rsvpData.attending,
                    count: String(rsvpData.count),
                    names: rsvpData.names,
                    needs: rsvpData.needs,
                    wish: rsvpData.wish,
                    lang: rsvpData.lang,
                    submittedAt: new Date().toISOString(),
                    userAgent: navigator.userAgent.slice(0, 300),
                })
                const res = await fetch(SHEET_URL, {
                    method: 'POST',
                    body: params,
                })
                const json = await res.json().catch(() => ({ ok: false }))
                if (json.ok === false) throw new Error(json.error || 'Apps Script error')
            } else {
                // Server-side express API (useful for Node deployment)
                const res = await fetch('/api/rsvp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(rsvpData),
                })
                if (!res.ok) {
                    throw new Error('RSVP request failed with status ' + res.status)
                }
            }
            setSubmitted(true)
        } catch (err) {
            console.error('RSVP submission failed, falling back to WhatsApp:', err)

            // Fallback: send via WhatsApp so the answer never gets lost
            const lines = [
                'RSVP — Elena, 29.08.2026',
                `ФИО: ${rsvpData.name}`,
                `Телефон: ${rsvpData.phone}`,
                `Катышуу: ${rsvpData.attending}`,
            ]
            if (attending) {
                if (rsvpData.count) lines.push(`Канча киши: ${rsvpData.count}`)
                if (rsvpData.names) lines.push(`Коноктор: ${rsvpData.names}`)
                if (rsvpData.needs) lines.push(`Өзгөчө суроолор: ${rsvpData.needs}`)
            }
            if (rsvpData.wish) lines.push(`Тилек: ${rsvpData.wish}`)
            const waUrl = `https://wa.me/996700556907?text=${encodeURIComponent(lines.join('\n'))}`
            window.open(waUrl, '_blank', 'noopener')
            setSubmitted(true)
        } finally {
            setLoading(false)
        }
    }


    return (
        <section
            id="rsvp-page"
            className={`page-section ${isActive ? 'page-active' : ''}`}
            style={{ background: 'var(--bg-base)' }}
            data-anim="up"
        >
            <SideVineA />

            <motion.div
                className="ornate-frame"
                style={{
                    width: '100%', maxWidth: 520, zIndex: 2, textAlign: 'center',
                    background: 'rgba(255,249,244,.9)', border: '1px solid var(--border-accent)',
                    backdropFilter: 'blur(8px)',
                }}
                initial={{ opacity: 0, y: 32 }}
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
                transition={{ duration: 0.6 }}
            >
                <FrameCorners />

                <span className="mi-eyebrow rsvp-eyebrow">{t.rsvpEyebrow}</span>
                <h2 className="mi-heading rsvp-heading" style={{ fontSize: 'clamp(2.5rem, 6vw, 3.8rem)', marginBottom: 12 }}>
                    {t.rsvpHead}
                </h2>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }} aria-hidden>
                    <FlowerB size={20} />
                </div>

                <AnimatePresence mode="wait">
                    {!submitted ? (
                        <motion.form
                            id="rsvpForm"
                            key="form"
                            onSubmit={handleSubmit}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ textAlign: 'left', maxWidth: 440, margin: '0 auto', width: '100%' }}
                        >
                            {/* Name */}
                            <div className="form-field" style={{ marginBottom: 20 }}>
                                <label
                                    htmlFor="guestName"
                                    style={{
                                        display: 'block',
                                        marginBottom: 6,
                                        fontFamily: 'var(--font-sans)',
                                        fontSize: '0.78rem',
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        color: 'var(--text-muted)',
                                        fontWeight: 500,
                                    }}
                                >{t.rsvpName}</label>
                                <input
                                    type="text"
                                    id="guestName"
                                    className="form-input"
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    style={{
                                        width: '100%',
                                        background: 'rgba(255, 255, 255, 0.85)',
                                        border: '1px solid rgba(200, 149, 108, 0.25)',
                                        borderRadius: '8px',
                                        padding: '12px 14px',
                                        fontFamily: 'var(--font-sans)',
                                        fontSize: '1rem',
                                        color: 'var(--text-primary)',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        transition: 'border-color 0.3s, box-shadow 0.3s',
                                    }}
                                    onFocus={e => {
                                        e.currentTarget.style.borderColor = 'var(--accent)'
                                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200, 149, 108, 0.15)'
                                    }}
                                    onBlur={e => {
                                        e.currentTarget.style.borderColor = 'rgba(200, 149, 108, 0.25)'
                                        e.currentTarget.style.boxShadow = 'none'
                                    }}
                                />
                            </div>

                            {/* Phone */}
                            <div className="form-field" style={{ marginBottom: 24 }}>
                                <label
                                    htmlFor="guestPhone"
                                    style={{
                                        display: 'block',
                                        marginBottom: 6,
                                        fontFamily: 'var(--font-sans)',
                                        fontSize: '0.78rem',
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        color: 'var(--text-muted)',
                                        fontWeight: 500,
                                    }}
                                >{t.rsvpPhone}</label>
                                <input
                                    type="tel"
                                    id="guestPhone"
                                    className="form-input"
                                    required
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    style={{
                                        width: '100%',
                                        background: 'rgba(255, 255, 255, 0.85)',
                                        border: '1px solid rgba(200, 149, 108, 0.25)',
                                        borderRadius: '8px',
                                        padding: '12px 14px',
                                        fontFamily: 'var(--font-sans)',
                                        fontSize: '1rem',
                                        color: 'var(--text-primary)',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        transition: 'border-color 0.3s, box-shadow 0.3s',
                                    }}
                                    onFocus={e => {
                                        e.currentTarget.style.borderColor = 'var(--accent)'
                                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200, 149, 108, 0.15)'
                                    }}
                                    onBlur={e => {
                                        e.currentTarget.style.borderColor = 'rgba(200, 149, 108, 0.25)'
                                        e.currentTarget.style.boxShadow = 'none'
                                    }}
                                />
                            </div>

                            {/* Attendance Choice */}
                            <div className="attendance-choice" style={{ marginBottom: 24 }}>
                                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>
                                    {t.rsvpQ}
                                </p>
                                <div className="choice-buttons" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                    <button
                                        type="button"
                                        className={`choice-btn ${attending === true ? 'active' : ''}`}
                                        onClick={() => setAttending(true)}
                                        style={{
                                            padding: '14px',
                                            border: attending === true ? '1px solid var(--accent)' : '1px solid var(--border-accent)',
                                            background: attending === true ? 'var(--accent)' : 'transparent',
                                            color: attending === true ? '#fff' : 'var(--text-primary)',
                                            fontFamily: 'var(--font-sans)', fontSize: '0.87rem', letterSpacing: '0.12em',
                                            cursor: 'pointer', transition: 'all 0.4s var(--ease-silk)',
                                            borderRadius: '8px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                                        }}
                                    >
                                        <span>{t.rsvpCome}</span>
                                        {attending === true && <span style={{ fontWeight: 'bold' }}>✓</span>}
                                    </button>
                                    <button
                                        type="button"
                                        className={`choice-btn decline ${attending === false ? 'active' : ''}`}
                                        onClick={() => setAttending(false)}
                                        style={{
                                            padding: '14px',
                                            border: attending === false ? '1px solid var(--accent)' : '1px solid var(--border-accent)',
                                            background: attending === false ? 'var(--accent)' : 'transparent',
                                            color: attending === false ? '#fff' : 'var(--text-primary)',
                                            fontFamily: 'var(--font-sans)', fontSize: '0.87rem', letterSpacing: '0.12em',
                                            cursor: 'pointer', transition: 'all 0.4s var(--ease-silk)',
                                            borderRadius: '8px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                                        }}
                                    >
                                        <span>{t.rsvpDecline}</span>
                                        {attending === false && <span style={{ fontWeight: 'bold' }}>✓</span>}
                                    </button>
                                </div>
                            </div>

                            {/* Conditional attending fields */}
                            <AnimatePresence>
                                {attending === true && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.35 }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        {/* Count */}
                                        <div className="form-field" style={{ marginBottom: 20 }}>
                                            <label
                                                htmlFor="guestCount"
                                                style={{
                                                    display: 'block',
                                                    marginBottom: 6,
                                                    fontFamily: 'var(--font-sans)',
                                                    fontSize: '0.78rem',
                                                    letterSpacing: '0.15em',
                                                    textTransform: 'uppercase',
                                                    color: 'var(--text-muted)',
                                                    fontWeight: 500,
                                                }}
                                            >{t.rsvpCount}</label>
                                            <input
                                                type="number"
                                                id="guestCount"
                                                className="form-input"
                                                min="1"
                                                max="20"
                                                placeholder=" "
                                                value={count}
                                                onChange={e => setCount(e.target.value === '' ? '' : Number(e.target.value))}
                                                style={{
                                                    width: '100%',
                                                    background: 'rgba(255, 255, 255, 0.85)',
                                                    border: '1px solid rgba(200, 149, 108, 0.25)',
                                                    borderRadius: '8px',
                                                    padding: '12px 14px',
                                                    fontFamily: 'var(--font-sans)',
                                                    fontSize: '1rem',
                                                    color: 'var(--text-primary)',
                                                    outline: 'none',
                                                    boxSizing: 'border-box',
                                                    transition: 'border-color 0.3s, box-shadow 0.3s',
                                                }}
                                                onFocus={e => {
                                                    e.currentTarget.style.borderColor = 'var(--accent)'
                                                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200, 149, 108, 0.15)'
                                                }}
                                                onBlur={e => {
                                                    e.currentTarget.style.borderColor = 'rgba(200, 149, 108, 0.25)'
                                                    e.currentTarget.style.boxShadow = 'none'
                                                }}
                                            />
                                        </div>

                                        {/* Names list */}
                                        <div className="form-field" style={{ marginBottom: 20 }}>
                                            <label
                                                htmlFor="guestNames"
                                                style={{
                                                    display: 'block',
                                                    marginBottom: 6,
                                                    fontFamily: 'var(--font-sans)',
                                                    fontSize: '0.78rem',
                                                    letterSpacing: '0.15em',
                                                    textTransform: 'uppercase',
                                                    color: 'var(--text-muted)',
                                                    fontWeight: 500,
                                                }}
                                            >{t.rsvpNames}</label>
                                            <input
                                                type="text"
                                                id="guestNames"
                                                className="form-input"
                                                placeholder=" "
                                                value={names}
                                                onChange={e => setNames(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    background: 'rgba(255, 255, 255, 0.85)',
                                                    border: '1px solid rgba(200, 149, 108, 0.25)',
                                                    borderRadius: '8px',
                                                    padding: '12px 14px',
                                                    fontFamily: 'var(--font-sans)',
                                                    fontSize: '1rem',
                                                    color: 'var(--text-primary)',
                                                    outline: 'none',
                                                    boxSizing: 'border-box',
                                                    transition: 'border-color 0.3s, box-shadow 0.3s',
                                                }}
                                                onFocus={e => {
                                                    e.currentTarget.style.borderColor = 'var(--accent)'
                                                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200, 149, 108, 0.15)'
                                                }}
                                                onBlur={e => {
                                                    e.currentTarget.style.borderColor = 'rgba(200, 149, 108, 0.25)'
                                                    e.currentTarget.style.boxShadow = 'none'
                                                }}
                                            />
                                        </div>

                                        {/* Preferences/Needs */}
                                        <div className="form-field" style={{ marginBottom: 20 }}>
                                            <label
                                                htmlFor="guestNeeds"
                                                style={{
                                                    display: 'block',
                                                    marginBottom: 6,
                                                    fontFamily: 'var(--font-sans)',
                                                    fontSize: '0.78rem',
                                                    letterSpacing: '0.15em',
                                                    textTransform: 'uppercase',
                                                    color: 'var(--text-muted)',
                                                    fontWeight: 500,
                                                }}
                                            >{t.rsvpNeeds}</label>
                                            <input
                                                type="text"
                                                id="guestNeeds"
                                                className="form-input"
                                                placeholder=" "
                                                value={needs}
                                                onChange={e => setNeeds(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    background: 'rgba(255, 255, 255, 0.85)',
                                                    border: '1px solid rgba(200, 149, 108, 0.25)',
                                                    borderRadius: '8px',
                                                    padding: '12px 14px',
                                                    fontFamily: 'var(--font-sans)',
                                                    fontSize: '1rem',
                                                    color: 'var(--text-primary)',
                                                    outline: 'none',
                                                    boxSizing: 'border-box',
                                                    transition: 'border-color 0.3s, box-shadow 0.3s',
                                                }}
                                                onFocus={e => {
                                                    e.currentTarget.style.borderColor = 'var(--accent)'
                                                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200, 149, 108, 0.15)'
                                                }}
                                                onBlur={e => {
                                                    e.currentTarget.style.borderColor = 'rgba(200, 149, 108, 0.25)'
                                                    e.currentTarget.style.boxShadow = 'none'
                                                }}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Wish textarea */}
                            <div className="form-field" style={{ marginBottom: 24, marginTop: 16 }}>
                                <label
                                    htmlFor="guestWish"
                                    style={{
                                        display: 'block',
                                        marginBottom: 6,
                                        fontFamily: 'var(--font-sans)',
                                        fontSize: '0.78rem',
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        color: 'var(--text-muted)',
                                        fontWeight: 500,
                                    }}
                                >
                                    {lang === 'ky' ? 'Каалоо-тилек' : 'Пожелание'}
                                </label>
                                <textarea
                                    id="guestWish"
                                    placeholder={t.rsvpWishPlaceholder}
                                    value={wish}
                                    onChange={e => setWish(e.target.value)}
                                    style={{
                                        width: '100%',
                                        minHeight: 90,
                                        background: 'rgba(255, 255, 255, 0.85)',
                                        border: '1px solid rgba(200, 149, 108, 0.25)',
                                        borderRadius: '8px',
                                        padding: '12px 14px',
                                        fontFamily: 'var(--font-sans)',
                                        fontSize: '0.94rem',
                                        color: 'var(--text-primary)',
                                        outline: 'none',
                                        resize: 'vertical',
                                        boxSizing: 'border-box',
                                        transition: 'border-color 0.3s, box-shadow 0.3s',
                                    }}
                                    onFocus={e => {
                                        e.currentTarget.style.borderColor = 'var(--accent)'
                                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200, 149, 108, 0.15)'
                                    }}
                                    onBlur={e => {
                                        e.currentTarget.style.borderColor = 'rgba(200, 149, 108, 0.25)'
                                        e.currentTarget.style.boxShadow = 'none'
                                    }}
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading || attending === null}
                                className="mi-btn rsvp-submit"
                                style={{
                                    width: '100%', padding: '16px',
                                    background: loading ? 'rgba(200,149,108,0.08)' : 'transparent',
                                    border: '1px solid var(--accent)', color: 'var(--accent)',
                                    fontFamily: 'var(--font-sans)', fontSize: '0.9rem', letterSpacing: '0.22em',
                                    textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
                                    borderRadius: '8px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                    transition: 'background 0.3s',
                                }}
                            >
                                {loading ? (
                                    <span className="rsvp-spinner" />
                                ) : (
                                    <span>{t.rsvpSubmit}</span>
                                )}
                            </button>
                        </motion.form>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            style={{ padding: '40px 10px', textAlign: 'center' }}
                        >
                            {/* Animated checkmark */}
                            <svg className="rsvp-check-circle" width="72" height="72" viewBox="0 0 72 72" fill="none"
                                style={{ marginBottom: 20 }}
                            >
                                <circle cx="36" cy="36" r="34" fill="rgba(200,149,108,0.12)" stroke="var(--accent)" strokeWidth="1.5" />
                                <polyline
                                    className="rsvp-check-path"
                                    points="22,37 32,47 52,26"
                                    fill="none"
                                    stroke="var(--accent)"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontStyle: 'italic', color: 'var(--text-primary)', marginBottom: 8 }}>
                                {t.rsvpThanks}
                            </p>
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                                {lang === 'ky' ? 'Жообуңуз жазылды ✓' : 'Ваш ответ записан ✓'}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </section>
    )
}
