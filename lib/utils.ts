import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const MAX_SEATS_PER_COHORT = 20

type RateEntry = { count: number; reset: number }
const globalStore = (globalThis as any)
if (!globalStore.__rateMap) globalStore.__rateMap = new Map<string, RateEntry>()
const rateMap: Map<string, RateEntry> = globalStore.__rateMap

export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const entry = rateMap.get(key)
  if (entry && now < entry.reset) {
    if (entry.count >= limit) {
      return { allowed: false, remaining: 0, reset: entry.reset }
    }
    entry.count += 1
    rateMap.set(key, entry)
    return { allowed: true, remaining: limit - entry.count, reset: entry.reset }
  }
  rateMap.set(key, { count: 1, reset: now + windowMs })
  return { allowed: true, remaining: limit - 1, reset: now + windowMs }
}

export function getClientKey(req: Request) {
  const xf = req.headers.get("x-forwarded-for") || ""
  const ip = xf.split(",")[0].trim() || req.headers.get("x-real-ip") || ""
  const ua = req.headers.get("user-agent") || ""
  return ip || ua
}

export function sanitizeText(s: unknown) {
  if (typeof s !== "string") return ""
  return s.replace(/<[^>]*>/g, "").replace(/[\u0000-\u001F\u007F]/g, "").trim()
}

export function digitsOnly(s: unknown) {
  if (typeof s !== "string") return ""
  return s.replace(/[^0-9]/g, "")
}
