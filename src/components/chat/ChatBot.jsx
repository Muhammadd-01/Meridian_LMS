import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { X, SendHorizontal, RotateCcw, Star, Clock, ArrowUpRight, MessageCircle } from 'lucide-react'
import Markdown from '../common/Markdown'
import SmartImage from '../common/SmartImage'
import mark from '../../assets/logos/meridian-mark.png'
import { getBotReply, WELCOME_CHIPS } from './knowledgeBase'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useScrolledPast } from '../../hooks/useScrolledPast'
import { cn } from '../../utils/cn'

const STORE_KEY = 'meridian.v1.chat'
let messageSeq = 0
const newId = () => `m${Date.now().toString(36)}${(messageSeq += 1)}`

function welcome(user) {
  return {
    id: 'welcome',
    from: 'bot',
    text: `Hi${user ? ` ${user.name.split(' ')[0]}` : ''}! I’m **Meri**, Meridian’s learning assistant. Ask me about courses, ISO auditor and safety training, services, certificates or how this site works.`,
    chips: WELCOME_CHIPS,
  }
}

function loadMessages() {
  try {
    const raw = window.sessionStorage.getItem(STORE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return Array.isArray(parsed) && parsed.length ? parsed : null
  } catch {
    return null
  }
}

function CourseChip({ course, onNavigate }) {
  return (
    <Link to={`/courses/${course.slug}`} onClick={onNavigate} className="group flex items-center gap-3 rounded-xl border border-line bg-white p-2 transition-all hover:-translate-y-0.5 hover:border-info/50 hover:shadow-md">
      <SmartImage src={course.thumbnail} alt="" seed={course.id} className="h-12 w-12 shrink-0 rounded-lg" imgClassName="transition-transform duration-300 group-hover:scale-110" />
      <span className="min-w-0 flex-1">
        <span className="line-clamp-1 text-[13px] font-semibold text-ink group-hover:text-primary">{course.title}</span>
        <span className="mt-0.5 flex items-center gap-2 text-[11px] text-muted">
          <span className="inline-flex items-center gap-0.5"><Star className="h-3 w-3 fill-accent text-accent" aria-hidden="true" />{course.rating?.toFixed(1)}</span>
          <span className="inline-flex items-center gap-0.5"><Clock className="h-3 w-3" aria-hidden="true" />{course.durationHours}h</span>
          <span>{course.difficulty}</span>
        </span>
      </span>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" aria-hidden="true" />
    </Link>
  )
}

/**
 * Floating help assistant. Answers come from a predefined, rule-based knowledge base and the
 * live catalogue (see knowledgeBase.js) — no AI service or server is used.
 */
export default function ChatBot() {
  const data = useData()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  // Sits in the corner, then moves up to make room for the back-to-top button.
  const lifted = useScrolledPast()
  const [messages, setMessages] = useState(() => loadMessages() || [welcome(user)])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [unread, setUnread] = useState(() => !loadMessages())
  const listRef = useRef(null)
  const inputRef = useRef(null)
  const timers = useRef([])

  useEffect(() => {
    try { window.sessionStorage.setItem(STORE_KEY, JSON.stringify(messages.slice(-40))) } catch { /* ignore */ }
  }, [messages])

  useEffect(() => {
    if (!open) return
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing, open])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const send = (text) => {
    const value = text.trim()
    if (!value || typing) return
    setMessages((m) => [...m, { id: newId(), from: 'user', text: value }])
    setInput('')
    setTyping(true)
    const reply = getBotReply(value, data, { user })
    const delay = 450 + Math.min(700, (reply.text || '').length * 3)
    timers.current.push(setTimeout(() => {
      setTyping(false)
      setMessages((m) => [...m, { id: newId(), from: 'bot', ...reply, courses: (reply.courses || []).map((c) => c.id) }])
    }, delay))
  }

  const reset = () => {
    timers.current.forEach(clearTimeout)
    setTyping(false)
    setMessages([welcome(user)])
  }

  const closeOnSmallScreens = () => {
    if (window.innerWidth < 640) setOpen(false)
  }

  const last = messages[messages.length - 1]

  return (
    <>
      {open && (
        <section
          role="dialog"
          aria-label="Meridian assistant chat"
          className={cn('fixed right-3 z-[60] flex h-[min(72vh,580px)] w-[calc(100vw-1.5rem)] origin-bottom-right animate-pop-in flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-[0_30px_70px_-20px_rgb(9_63_80/0.55)] transition-[bottom] duration-300 ease-out sm:right-5 sm:w-[390px]', lifted ? 'bottom-[9.5rem]' : 'bottom-[5.5rem]')}
          onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false) }}
        >
          <header className="relative flex items-center gap-3 overflow-hidden bg-gradient-to-br from-deep via-primary to-secondary px-4 py-3.5 text-white">
            <div className="pointer-events-none absolute inset-0 bg-dots-light" aria-hidden="true" />
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white p-1.5 shadow-md">
              <img src={mark} alt="" className="h-full w-full object-contain" />
              <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#22c55e]" aria-hidden="true" />
            </span>
            <div className="relative min-w-0 flex-1">
              <h2 className="text-[15px] font-bold text-white">Meri · Meridian assistant</h2>
              <p className="truncate text-xs text-white/75">Courses, ISO & HSE training, and site help</p>
            </div>
            <button type="button" onClick={reset} className="relative rounded-lg p-2 text-white/80 transition hover:rotate-[-45deg] hover:bg-white/15 hover:text-white" aria-label="Restart conversation" title="Restart conversation">
              <RotateCcw className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => setOpen(false)} className="relative rounded-lg p-2 text-white/80 transition hover:rotate-90 hover:bg-white/15 hover:text-white" aria-label="Close chat">
              <X className="h-5 w-5" />
            </button>
          </header>

          <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-slate-50 to-white px-4 py-4 scrollbar-thin" aria-live="polite" aria-relevant="additions">
            {messages.map((m) => (
              <div key={m.id} className={cn('flex animate-slide-up gap-2', m.from === 'user' ? 'justify-end' : 'justify-start')}>
                {m.from === 'bot' && <img src={mark} alt="" className="mt-1 h-7 w-7 shrink-0 rounded-full bg-white object-contain p-0.5 ring-1 ring-line" />}
                <div className={cn('max-w-[85%] space-y-2', m.from === 'user' && 'items-end')}>
                  <div className={cn(
                    'rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-6 shadow-sm',
                    m.from === 'user' ? 'rounded-br-md bg-gradient-to-br from-primary to-deep text-white' : 'rounded-bl-md border border-line bg-white text-slate-700',
                  )}>
                    {m.from === 'user' ? m.text : <Markdown content={m.text} className="text-[13.5px] leading-6 [&_li]:my-0.5 [&_ol]:my-1 [&_ol]:pl-4 [&_p]:my-1 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_ul]:my-1 [&_ul]:pl-4" />}
                  </div>
                  {m.courses?.length > 0 && (
                    <div className="space-y-2">
                      {m.courses.map((id) => data.courses.find((c) => c.id === id)).filter(Boolean).map((c) => <CourseChip key={c.id} course={c} onNavigate={closeOnSmallScreens} />)}
                    </div>
                  )}
                  {m.links?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {m.links.map((l) => (
                        <Link key={l.to + l.label} to={l.to} onClick={closeOnSmallScreens} className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white">
                          {l.label}<ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex items-center gap-2" aria-label="Meri is typing">
                <img src={mark} alt="" className="h-7 w-7 rounded-full bg-white object-contain p-0.5 ring-1 ring-line" />
                <span className="flex gap-1 rounded-2xl rounded-bl-md border border-line bg-white px-3.5 py-3">
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-secondary" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-secondary" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-secondary" />
                </span>
              </div>
            )}
          </div>

          {last?.from === 'bot' && last.chips?.length > 0 && !typing && (
            <div className="no-scrollbar flex gap-1.5 overflow-x-auto border-t border-line bg-white px-3 py-2">
              {last.chips.map((chip) => (
                <button key={chip} type="button" onClick={() => send(chip)} className="shrink-0 rounded-full border border-primary/25 bg-white px-3 py-1.5 text-xs font-semibold text-primary transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white">
                  {chip}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); send(input) }} className="flex items-center gap-2 border-t border-line bg-white p-3">
            <label htmlFor="chat-input" className="sr-only">Ask Meri a question</label>
            <input
              id="chat-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about courses, ISO, certificates…"
              autoComplete="off"
              className="min-w-0 flex-1 rounded-full border border-line bg-slate-50 px-4 py-2.5 text-sm text-ink placeholder:text-slate-400 focus:border-info focus:bg-white focus:ring-2 focus:ring-info/20 focus:outline-none"
            />
            <button type="submit" disabled={!input.trim() || typing} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-[#e07100] text-ink shadow-md transition-transform hover:scale-110 disabled:scale-100 disabled:opacity-40" aria-label="Send message">
              <SendHorizontal className="h-4 w-4" />
            </button>
          </form>
          <p className="bg-white px-4 pb-2 text-center text-[10.5px] text-slate-400">Automated assistant with predefined answers — not a live agent.</p>
        </section>
      )}

      <button
        type="button"
        onClick={() => { setOpen((o) => !o); setUnread(false) }}
        aria-expanded={open}
        aria-label={open ? 'Close Meridian assistant' : 'Open Meridian assistant chat'}
        className={cn(
          'no-print group fixed right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary via-secondary to-deep text-white shadow-[0_14px_30px_-10px_rgb(9_63_80/0.7)] transition-[bottom,transform] duration-300 ease-out hover:scale-110',
          lifted ? 'bottom-[5.25rem]' : 'bottom-5',
          !open && unread && 'animate-pulse-ring',
        )}
      >
        <span className={cn('absolute transition-all duration-300', open ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0')}><X className="h-6 w-6" aria-hidden="true" /></span>
        <span className={cn('absolute transition-all duration-300', open ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100')}><MessageCircle className="h-6 w-6" aria-hidden="true" /></span>
        {!open && unread && <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-ink ring-2 ring-white">1</span>}
        {!open && (
          <span className="pointer-events-none absolute right-16 hidden rounded-xl bg-deep px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 sm:block">
            Need help? Ask Meri
          </span>
        )}
      </button>
    </>
  )
}
