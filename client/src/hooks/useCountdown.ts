import { useEffect, useRef, useState } from 'react'

interface UseCountdownResult {
    days: number
    hours: number
    minutes: number
    seconds: number
    isOver: boolean
}

export function useCountdown(targetDate: Date): UseCountdownResult {
    const [timeLeft, setTimeLeft] = useState<UseCountdownResult>(() => calc(targetDate))
    const rafRef = useRef<number | null>(null)

    function calc(target: Date): UseCountdownResult {
        const diff = target.getTime() - Date.now()
        if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true }
        return {
            days: Math.floor(diff / 86400000),
            hours: Math.floor((diff % 86400000) / 3600000),
            minutes: Math.floor((diff % 3600000) / 60000),
            seconds: Math.floor((diff % 60000) / 1000),
            isOver: false,
        }
    }

    useEffect(() => {
        let lastSec = -1
        function tick() {
            const s = Math.floor((targetDate.getTime() - Date.now()) / 1000)
            if (s !== lastSec) {
                lastSec = s
                setTimeLeft(calc(targetDate))
            }
            rafRef.current = requestAnimationFrame(tick)
        }
        rafRef.current = requestAnimationFrame(tick)
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
    }, [targetDate])

    return timeLeft
}
