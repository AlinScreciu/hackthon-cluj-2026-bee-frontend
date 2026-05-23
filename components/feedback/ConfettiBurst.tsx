'use client'
import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

const COLORS = ['#FFEF5F', '#EEA727', '#40288C', '#16A34A', '#85489D', '#FFEF5F']

export function ConfettiBurst({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const firedRef = useRef(false)

  useEffect(() => {
    if (!active || reduced || firedRef.current || !ref.current) return
    firedRef.current = true
    const container = ref.current

    for (let i = 0; i < 6; i++) {
      const dot = document.createElement('div')
      const angle = (i / 6) * 360
      const dist = 32 + Math.random() * 20
      const dx = Math.cos((angle * Math.PI) / 180) * dist
      const dy = Math.sin((angle * Math.PI) / 180) * dist

      dot.style.cssText = `
        position:absolute; width:8px; height:8px; border-radius:50%;
        background:${COLORS[i]};
        top:50%; left:50%; transform:translate(-50%,-50%);
        pointer-events:none; z-index:50;
      `
      container.appendChild(dot)

      dot.animate([
        { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0)`, opacity: 0 },
      ], { duration: 600, easing: 'ease-out', fill: 'forwards' }).onfinish = () => dot.remove()
    }
  }, [active, reduced])

  return <div ref={ref} className="absolute inset-0 pointer-events-none overflow-visible" aria-hidden="true" />
}
