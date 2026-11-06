import type { Lang } from '../../lib/i18n'

interface LangToggleProps {
    lang: Lang
    onChange: (l: Lang) => void
}

export default function LangToggle({ lang, onChange }: LangToggleProps) {
    return (
        <div
            style={{
                position: 'fixed', top: 24, right: 28, zIndex: 1000,
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(253,246,240,0.9)', backdropFilter: 'blur(12px)',
                border: '1px solid var(--border-accent)', padding: '8px 16px',
                fontFamily: 'var(--font-sans)', fontSize: '0.78rem', letterSpacing: '0.2em',
            }}
        >
            <button
                onClick={() => onChange('ky')}
                style={{
                    background: 'none', border: 'none',
                    fontFamily: 'var(--font-sans)', fontSize: '0.76rem', letterSpacing: '0.18em',
                    color: lang === 'ky' ? 'var(--accent)' : 'var(--text-muted)',
                    fontWeight: lang === 'ky' ? 600 : 400,
                    cursor: 'pointer', padding: 0,
                    transition: 'color 0.3s var(--ease-silk)',
                }}
            >КЫР</button>
            <span style={{ color: 'var(--border-accent)' }}>|</span>
            <button
                onClick={() => onChange('ru')}
                style={{
                    background: 'none', border: 'none',
                    fontFamily: 'var(--font-sans)', fontSize: '0.76rem', letterSpacing: '0.18em',
                    color: lang === 'ru' ? 'var(--accent)' : 'var(--text-muted)',
                    fontWeight: lang === 'ru' ? 600 : 400,
                    cursor: 'pointer', padding: 0,
                    transition: 'color 0.3s var(--ease-silk)',
                }}
            >РУС</button>
        </div>
    )
}
