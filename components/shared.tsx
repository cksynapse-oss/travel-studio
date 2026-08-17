"use client"

import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "motion/react"
import { Check, Bookmark, X } from "lucide-react"
import { useStore } from "@/lib/store"
import type { ReactNode } from "react"

export function Avatar({
  src,
  name,
  size = 40,
  ring,
  className,
}: {
  src: string
  name: string
  size?: number
  ring?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        "relative inline-block shrink-0 overflow-hidden rounded-full bg-muted",
        ring && "ring-2 ring-copper/60 ring-offset-2 ring-offset-background",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src || "/placeholder.svg"} alt={name} className="h-full w-full object-cover" crossOrigin="anonymous" />
    </span>
  )
}

export function Chip({
  children,
  active,
  onClick,
  className,
}: {
  children: ReactNode
  active?: boolean
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/30",
        className,
      )}
    >
      {children}
    </button>
  )
}

export function SourceChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium text-accent-foreground">
      {children}
    </span>
  )
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground", className)}>
      {children}
    </span>
  )
}

export function Stat({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-serif text-2xl leading-none text-foreground">{value}</span>
      <span className="mt-1 text-[12px] text-muted-foreground">{label}</span>
    </div>
  )
}

export function Meta({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px] text-muted-foreground">
      {items.map((it, i) => (
        <span key={i} className="inline-flex items-center gap-1.5">
          {i > 0 && <span className="text-muted-foreground/50">·</span>}
          {it}
        </span>
      ))}
    </div>
  )
}

const MARKER_STYLES: Record<string, string> = {
  experience: "bg-primary text-primary-foreground",
  lore: "bg-copper text-copper-foreground",
  place: "bg-card text-foreground border border-border",
  hidden: "bg-foreground text-background",
  partner: "bg-copper text-copper-foreground",
}

export function MarkerDot({ type, className }: { type: string; className?: string }) {
  return <span className={cn("inline-block h-2.5 w-2.5 rounded-full", MARKER_STYLES[type]?.split(" ")[0], className)} />
}

/** Tactile save button — transforms Save -> Saved with subtle motion. */
export function SaveButton({
  kind,
  id,
  label = "Save",
  full,
  size = "md",
}: {
  kind: "place" | "experience" | "lore" | "artifact"
  id: string
  label?: string
  full?: boolean
  size?: "sm" | "md"
}) {
  const { isSaved, toggleSave } = useStore()
  const saved = isSaved(kind, id)
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        toggleSave(kind, id)
      }}
      className={cn(
        "group relative inline-flex items-center justify-center gap-1.5 overflow-hidden rounded-full border font-medium transition-colors",
        size === "sm" ? "px-3 py-1.5 text-[12px]" : "px-4 py-2 text-[13px]",
        full && "w-full",
        saved
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:border-primary/50",
      )}
      aria-pressed={saved}
    >
      <AnimatePresence mode="wait" initial={false}>
        {saved ? (
          <motion.span
            key="saved"
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="inline-flex items-center gap-1.5"
          >
            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
            Saved to Manali
          </motion.span>
        ) : (
          <motion.span
            key="save"
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="inline-flex items-center gap-1.5"
          >
            <Bookmark className="h-3.5 w-3.5" />
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

/** Bottom sheet used across map + detail surfaces. */
export function BottomSheet({
  children,
  onClose,
  title,
}: {
  children: ReactNode
  onClose: () => void
  title?: string
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <motion.div
        className="absolute inset-0 bg-foreground/30 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-border bg-card shadow-2xl sm:rounded-3xl"
        initial={{ y: "100%", opacity: 0.6 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0.4 }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
      >
        <div className="flex items-center justify-between px-5 pb-2 pt-3">
          <span className="mx-auto h-1 w-10 rounded-full bg-border sm:hidden" />
          {title && <span className="hidden font-serif text-lg sm:block">{title}</span>}
          <button
            onClick={onClose}
            className="absolute right-4 top-3.5 rounded-full bg-secondary p-1.5 text-secondary-foreground transition-colors hover:bg-muted"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="no-scrollbar overflow-y-auto">{children}</div>
      </motion.div>
    </div>
  )
}

export function GhostButton({
  children,
  onClick,
  className,
}: {
  children: ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-[13px] font-medium text-foreground transition-colors hover:border-foreground/30",
        className,
      )}
    >
      {children}
    </button>
  )
}

export function PrimaryButton({
  children,
  onClick,
  full,
  className,
}: {
  children: ReactNode
  onClick?: () => void
  full?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground transition-transform hover:brightness-105 active:scale-[0.98]",
        full && "w-full",
        className,
      )}
    >
      {children}
    </button>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string
  title: string
  action?: ReactNode
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        {eyebrow && <Eyebrow className="mb-1.5 block">{eyebrow}</Eyebrow>}
        <h2 className="font-serif text-xl leading-tight text-foreground text-balance sm:text-2xl">{title}</h2>
      </div>
      {action}
    </div>
  )
}

export function DemoLabel() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
      Demo data
    </span>
  )
}
