/* SVG ornament reused throughout sections */

export function FlowerA({ size = 26 }: { size?: number }) {
    return (
        <svg className="text-flower" width={size} height={size} viewBox="0 0 32 32" aria-hidden>
            <circle cx="16" cy="16" r="3" fill="var(--accent)" />
            <ellipse cx="16" cy="7" rx="3" ry="5" fill="var(--accent-dim)" opacity="0.7" />
            <ellipse cx="16" cy="25" rx="3" ry="5" fill="var(--accent-dim)" opacity="0.7" />
            <ellipse cx="7" cy="16" rx="5" ry="3" fill="var(--accent-dim)" opacity="0.7" />
            <ellipse cx="25" cy="16" rx="5" ry="3" fill="var(--accent-dim)" opacity="0.7" />
        </svg>
    )
}

export function FlowerB({ size = 30 }: { size?: number }) {
    return (
        <svg className="text-flower rev" width={size} height={size} viewBox="0 0 32 32" aria-hidden>
            <g transform="translate(16,16)">
                <ellipse rx="6" ry="10" fill="var(--accent-rose)" opacity="0.75" />
                <ellipse rx="6" ry="10" fill="var(--accent-pink)" opacity="0.7" transform="rotate(72)" />
                <ellipse rx="6" ry="10" fill="var(--accent-rose)" opacity="0.7" transform="rotate(144)" />
                <ellipse rx="6" ry="10" fill="var(--accent-pink)" opacity="0.75" transform="rotate(216)" />
                <ellipse rx="6" ry="10" fill="var(--accent-rose)" opacity="0.7" transform="rotate(288)" />
                <circle r="3.2" fill="var(--accent-dim)" />
            </g>
        </svg>
    )
}

export function FlowerC({ size = 24 }: { size?: number }) {
    return (
        <svg className="text-flower" width={size} height={size} viewBox="0 0 32 32" aria-hidden>
            <g transform="translate(16,16)">
                <ellipse rx="2.4" ry="9" fill="var(--accent-light)" opacity="0.85" />
                <ellipse rx="2.4" ry="9" fill="var(--accent-light)" opacity="0.85" transform="rotate(45)" />
                <ellipse rx="2.4" ry="9" fill="var(--accent-light)" opacity="0.85" transform="rotate(90)" />
                <ellipse rx="2.4" ry="9" fill="var(--accent-light)" opacity="0.85" transform="rotate(135)" />
                <circle r="4" fill="var(--accent)" />
            </g>
        </svg>
    )
}

export function FlowerStem({ size = 28, flip = false }: { size?: number; flip?: boolean }) {
    return (
        <svg className="text-flower" width={size * 0.7} height={size} viewBox="0 0 24 34" aria-hidden
            style={flip ? { transform: 'scaleX(-1)' } : undefined}>
            <path d="M12 34 L12 14" stroke="var(--accent-dim)" strokeWidth="1.3" fill="none" opacity="0.6" />
            <g transform="translate(12,9)">
                <ellipse rx="5" ry="8" fill="var(--accent-pink)" opacity="0.75" />
                <ellipse rx="5" ry="8" fill="var(--accent-rose)" opacity="0.7" transform="rotate(60)" />
                <ellipse rx="5" ry="8" fill="var(--accent-pink)" opacity="0.7" transform="rotate(120)" />
                <circle r="2.6" fill="var(--accent-dim)" />
            </g>
        </svg>
    )
}

export function DividerOrnament() {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, maxWidth: 300, margin: '0 auto 40px', position: 'relative', zIndex: 2 }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,transparent,var(--accent-dim),transparent)' }} />
            <FlowerA size={32} />
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,transparent,var(--accent-dim),transparent)' }} />
        </div>
    )
}

export function SideVineA() {
    const svg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='54' height='200' viewBox='0 0 54 200'%3E%3Cpath d='M27 0 Q10 35 27 70 T27 140 Q10 170 27 200' stroke='%23a06b3c' stroke-width='1.6' fill='none' opacity='0.75'/%3E%3Cg transform='translate(27,35)'%3E%3Ccircle r='5' fill='%23e8b4b8' opacity='0.8'/%3E%3Ccircle cx='-7' cy='-3' r='3' fill='%23d4a5c9' opacity='0.65'/%3E%3Ccircle cx='7' cy='-3' r='3' fill='%23d4a5c9' opacity='0.65'/%3E%3Ccircle cx='0' cy='-8' r='3' fill='%23e8b4b8' opacity='0.65'/%3E%3Ccircle cx='0' cy='6' r='3' fill='%23e8c5a0' opacity='0.6'/%3E%3C/g%3E%3Cpath d='M27 55 q-16 -4 -20 6' stroke='%23c8956c' stroke-width='1.2' fill='none' opacity='0.55'/%3E%3Cpath d='M27 95 q16 -4 20 6' stroke='%23c8956c' stroke-width='1.2' fill='none' opacity='0.55'/%3E%3Cg transform='translate(27,155)'%3E%3Ccircle r='4.5' fill='%23c8956c' opacity='0.75'/%3E%3Ccircle cx='-6' cy='-3' r='2.6' fill='%23e8c5a0' opacity='0.6'/%3E%3Ccircle cx='6' cy='-3' r='2.6' fill='%23e8c5a0' opacity='0.6'/%3E%3Ccircle cx='0' cy='6' r='2.6' fill='%23d4a5c9' opacity='0.6'/%3E%3C/g%3E%3C/svg%3E")`
    return (
        <>
            <div className="side-vine left" aria-hidden style={{ backgroundImage: svg }} />
            <div className="side-vine right" aria-hidden style={{ backgroundImage: svg }} />
        </>
    )
}

export function FrameCorners() {
    return (
        <>
            {(['tl', 'tr', 'bl', 'br'] as const).map(pos => (
                <span key={pos} aria-hidden style={{
                    position: 'absolute',
                    width: 52, height: 52,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='52' height='52' viewBox='0 0 52 52'%3E%3Cpath d='M2 2 Q34 2 2 34' stroke='%23a06b3c' stroke-width='1.6' fill='none' opacity='0.85'/%3E%3Cpath d='M2 2 Q2 34 34 2' stroke='%23a06b3c' stroke-width='1.6' fill='none' opacity='0.85'/%3E%3Cpath d='M9 9 Q26 9 9 26' stroke='%23c8956c' stroke-width='1.1' fill='none' opacity='0.6'/%3E%3Ccircle cx='2' cy='2' r='2.6' fill='%23a06b3c' opacity='0.9'/%3E%3C/svg%3E")`,
                    backgroundSize: 'contain', backgroundRepeat: 'no-repeat',
                    pointerEvents: 'none',
                    top: pos.includes('t') ? -4 : undefined,
                    bottom: pos.includes('b') ? -4 : undefined,
                    left: pos.includes('l') ? -4 : undefined,
                    right: pos.includes('r') ? -4 : undefined,
                    transform: pos === 'tr' ? 'scaleX(-1)' : pos === 'bl' ? 'scaleY(-1)' : pos === 'br' ? 'scale(-1)' : undefined,
                }} />
            ))}
        </>
    )
}
