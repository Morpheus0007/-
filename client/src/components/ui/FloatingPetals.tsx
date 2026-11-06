import { useEffect, useRef } from 'react'

const MAX_PETALS = 50

function spawnPetal(container: HTMLElement, burst = false) {
    if (container.children.length >= MAX_PETALS) return

    const petal = document.createElement('div')
    petal.className = 'petal'

    const startX = burst ? (38 + Math.random() * 24) : Math.random() * 100
    const duration = burst ? (3 + Math.random() * 4) : 5 + Math.random() * 10
    const delay = burst ? Math.random() * 0.35 : Math.random() * 12
    const size = burst ? (7 + Math.random() * 12) : 5 + Math.random() * 14
    const hues = ['#f4c2c2', '#e8c5e0', '#e8b4b8', '#d4a5c9', '#f0d5bb', '#fde8f0', '#f9d5e5']
    const hue = hues[Math.floor(Math.random() * hues.length)]
    const rotation = Math.random() * 360

    petal.style.cssText = `
    left: ${startX}vw;
    width: ${size}px;
    height: ${size * 1.4}px;
    background: radial-gradient(ellipse at 30% 40%, ${hue}, #d4a5c9);
    animation-duration: ${duration}s;
    animation-delay: ${delay}s;
    transform: rotate(${rotation}deg);
    opacity: ${0.4 + Math.random() * 0.4};
  `
    container.appendChild(petal)
    setTimeout(() => petal.remove(), (duration + delay + 1) * 1000)
}

export default function FloatingPetals() {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const el = containerRef.current!

        for (let i = 0; i < 35; i++) spawnPetal(el)
        const interval = setInterval(() => {
            if (!document.hidden) spawnPetal(el)
        }, 800)

        // scroll petal burst
        let lastScrollY = 0
        const onScroll = () => {
            const scrolled = window.scrollY
            if (Math.abs(scrolled - lastScrollY) > 200) {
                for (let i = 0; i < 5; i++) spawnPetal(el, true)
                lastScrollY = scrolled
            }
        }
        window.addEventListener('scroll', onScroll, { passive: true })

            // expose burst function for door open
            ; (window as unknown as Record<string, unknown>).__spawnPetalBurst = () => {
                for (let i = 0; i < 30; i++) setTimeout(() => spawnPetal(el, true), i * 45)
            }

        return () => {
            clearInterval(interval)
            window.removeEventListener('scroll', onScroll)
        }
    }, [])

    return <div className="petals-container" ref={containerRef} aria-hidden="true" />
}
