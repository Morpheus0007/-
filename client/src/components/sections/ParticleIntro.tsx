import { useEffect, useRef } from 'react'

/* ─── Palette colours ─── */
const PALETTE = [
    { r: 200, g: 149, b: 108 },
    { r: 232, g: 197, b: 160 },
    { r: 212, g: 165, b: 201 },
    { r: 232, g: 180, b: 184 },
    { r: 160, g: 107, b: 60 },
    { r: 248, g: 228, b: 210 },
]

interface Color { r: number; g: number; b: number }

class PIParticle {
    x = 0; y = 0; tx = 0; ty = 0
    vx = 0; vy = 0
    startColor: Color = { r: 200, g: 149, b: 108 }
    targetColor: Color = { r: 200, g: 149, b: 108 }
    colorW = 1
    blendRate: number
    maxSpeed: number
    maxForce: number
    size: number
    killed = false
    canvasW = 0; canvasH = 0

    constructor(cw: number, ch: number) {
        this.canvasW = cw; this.canvasH = ch
        this.x = Math.random() * cw; this.y = Math.random() * ch
        const c = PALETTE[Math.floor(Math.random() * PALETTE.length)]
        this.startColor = { ...c }; this.targetColor = { ...c }
        this.blendRate = Math.random() * 0.04 + 0.02
        this.maxSpeed = Math.random() * 6.5 + 6.0
        this.maxForce = this.maxSpeed * 0.12
        this.size = Math.random() * 1.8 + 0.8
    }

    setTarget(tx: number, ty: number, color: Color) {
        this.tx = tx; this.ty = ty
        this.startColor = {
            r: Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorW),
            g: Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorW),
            b: Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorW),
        }
        this.targetColor = { ...color }
        this.colorW = 0; this.killed = false
    }

    kill() {
        if (this.killed) return
        const angle = Math.random() * Math.PI * 2
        const dist = (this.canvasW + this.canvasH)
        this.tx = this.canvasW / 2 + Math.cos(angle) * dist
        this.ty = this.canvasH / 2 + Math.sin(angle) * dist
        this.startColor = {
            r: Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorW),
            g: Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorW),
            b: Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorW),
        }
        this.targetColor = { r: 13, g: 6, b: 8 }
        this.colorW = 0; this.killed = true
    }

    update() {
        const dx = this.tx - this.x, dy = this.ty - this.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const prox = dist < 80 ? dist / 80 : 1
        const spd = this.maxSpeed * prox
        const mag = dist || 1
        const sx = (dx / mag) * spd - this.vx
        const sy = (dy / mag) * spd - this.vy
        const sm = Math.sqrt(sx * sx + sy * sy) || 1
        this.vx += (sx / sm) * this.maxForce
        this.vy += (sy / sm) * this.maxForce
        this.x += this.vx; this.y += this.vy
        if (this.colorW < 1) this.colorW = Math.min(1, this.colorW + this.blendRate)
    }

    draw(ctx: CanvasRenderingContext2D) {
        const r = Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorW)
        const g = Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorW)
        const b = Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorW)
        ctx.fillStyle = `rgb(${r},${g},${b})`
        ctx.fillRect(this.x, this.y, this.size, this.size)
    }

    isOutOfBounds() {
        return this.x < -20 || this.x > this.canvasW + 20 || this.y < -20 || this.y > this.canvasH + 20
    }
}

function buildWordTargets(word: string, cw: number, ch: number): { x: number; y: number }[] {
    const off = document.createElement('canvas')
    off.width = cw; off.height = ch
    const octx = off.getContext('2d')!
    // Larger font sizing that stays highly readable but prominent on both phone and desktop
    const baseFontSize = Math.min(cw / 4.2, ch / 8, 120)
    const fontSize = word.length > 8 ? baseFontSize * 0.75 : baseFontSize
    octx.fillStyle = '#ffffff'
    octx.font = `italic ${fontSize}px 'Cormorant Garamond', serif`
    octx.textAlign = 'center'; octx.textBaseline = 'middle'
    octx.fillText(word, cw / 2, ch / 2)
    const imgData = octx.getImageData(0, 0, cw, ch)
    const pixels = imgData.data
    const coords: { x: number; y: number }[] = []
    // Decreased step spacing to scan more pixels and produce many more particles (dense and clear rendering)
    const STEP = 3
    for (let i = 0; i < pixels.length; i += STEP * 4) {
        if (pixels[i + 3] > 0) {
            coords.push({ x: (i / 4) % cw, y: Math.floor((i / 4) / cw) })
        }
    }
    // shuffle
    for (let i = coords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [coords[i], coords[j]] = [coords[j], coords[i]]
    }
    return coords
}

interface ParticleIntroProps {
    onDone: () => void
    lang: 'ky' | 'ru'
    skipLabel: string
}

export default function ParticleIntro({ onDone, skipLabel }: ParticleIntroProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animRef = useRef<number | null>(null)

    useEffect(() => {
        // Respect prefers-reduced-motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            onDone(); return
        }

        const canvas = canvasRef.current!
        let particles: PIParticle[] = []
        let wordIdx = 0
        let frameCount = 0
        // Removed the last 'Elena' so it ends after '29 Август'
        const WORDS = ['Елена', 'Кыз Узатуу', '29 Август']
        // Скорость смены слов (кадры анимации, 60 fps: 90 = 1.5 сек на слово)
        const WORD_FRAMES = 90

        function resize() {
            // Set canvas size to the full page bounds
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()

        function nextWord(idx: number) {
            const word = WORDS[idx % WORDS.length]
            const cw = canvas.width, ch = canvas.height
            const color = PALETTE[idx % PALETTE.length]
            const coords = buildWordTargets(word, cw, ch)
            let pIdx = 0
            for (const { x, y } of coords) {
                if (pIdx < particles.length) {
                    particles[pIdx].setTarget(x, y, color)
                } else {
                    const p = new PIParticle(cw, ch)
                    // Spawn coordinates initialized randomly inside screen boundaries
                    p.x = Math.random() * cw
                    p.y = Math.random() * ch
                    p.setTarget(x, y, color)
                    particles.push(p)
                }
                pIdx++
            }
            for (let i = pIdx; i < particles.length; i++) particles[i].kill()
        }

        function animate() {
            const ctx = canvas.getContext('2d')!
            ctx.fillStyle = 'rgba(13,6,8,0.12)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i]
                p.update(); p.draw(ctx)
                if (p.killed && p.isOutOfBounds()) particles.splice(i, 1)
            }
            frameCount++
            if (frameCount % WORD_FRAMES === 0) {
                wordIdx = (wordIdx + 1) % WORDS.length
                nextWord(wordIdx)
                if (frameCount >= WORD_FRAMES * WORDS.length) {
                    setTimeout(onDone, 400); return
                }
            }
            animRef.current = requestAnimationFrame(animate)
        }

        const onResize = () => { resize(); nextWord(wordIdx) }
        window.addEventListener('resize', onResize)

        nextWord(0)
        animRef.current = requestAnimationFrame(animate)

        return () => {
            if (animRef.current) cancelAnimationFrame(animRef.current)
            window.removeEventListener('resize', onResize)
        }
    }, [onDone])

    return (
        <div className="particle-intro" id="particleIntro" aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 100000, background: '#0d0608' }}>
            <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 1 }} />

            {/* Beautiful elegant frame on the whole page */}
            <div style={{
                position: 'absolute',
                inset: '16px',
                border: '1.5px solid rgba(200, 149, 108, 0.4)',
                pointerEvents: 'none',
                zIndex: 2,
            }} />
            <div style={{
                position: 'absolute',
                inset: '12px',
                border: '0.5px dashed rgba(200, 149, 108, 0.25)',
                pointerEvents: 'none',
                zIndex: 2,
            }} />

            <button
                onClick={onDone}
                style={{
                    position: 'absolute', bottom: 28, right: 24,
                    background: 'rgba(13, 6, 8, 0.65)', border: '1px solid rgba(200,149,108,0.45)',
                    color: 'rgba(200,149,108,0.85)', fontFamily: 'var(--font-sans)',
                    fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase',
                    padding: '10px 20px', cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    zIndex: 10,
                    borderRadius: '2px',
                }}
                onMouseEnter={e => {
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.color = 'rgba(255,255,255,1)'
                    el.style.borderColor = 'rgba(200,149,108,1)'
                    el.style.background = 'rgba(200,149,108,0.15)'
                }}
                onMouseLeave={e => {
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.color = 'rgba(200,149,108,0.85)'
                    el.style.borderColor = 'rgba(200,149,108,0.45)'
                    el.style.background = 'rgba(13, 6, 8, 0.65)'
                }}
            >
                {skipLabel}
            </button>
        </div>
    )
}
