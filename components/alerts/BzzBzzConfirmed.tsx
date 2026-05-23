'use client'
import { motion } from 'framer-motion'
import { spring } from '@/lib/tokens'
import { BeeLogo } from '@/components/ui/BeeLogo'
import { ConfettiBurst } from '@/components/feedback/ConfettiBurst'
import type { FinalStatus } from '@/lib/api/types'

interface BzzBzzConfirmedProps {
  apiaryName: string
  finalStatus: FinalStatus
}

const STATUS_LABEL: Partial<Record<FinalStatus, string>> = {
  confirmed_call: 'apel telefonic',
  confirmed_sms: 'SMS',
  confirmed_app: 'aplicație',
}

export function BzzBzzConfirmed({ apiaryName, finalStatus }: BzzBzzConfirmedProps) {
  const via = STATUS_LABEL[finalStatus]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={spring}
      className="relative bg-safe/10 border border-safe/25 rounded-[16px] p-6 text-center overflow-visible"
    >
      <ConfettiBurst active />
      <BeeLogo size={80} aria-hidden className="mx-auto mb-4" />
      <h2 className="text-xl font-bold text-safe mb-2 tracking-[-0.015em]">
        Stupii sunt în siguranță!
      </h2>
      <p className="text-[13.5px] text-ink-soft">
        <span className="font-semibold text-ink">{apiaryName}</span>
        {via && <> · Confirmat prin {via}</>}
      </p>
    </motion.div>
  )
}
