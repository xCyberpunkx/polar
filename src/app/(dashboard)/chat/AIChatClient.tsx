'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const STARTERS = [
  'How am I doing based on my recent data?',
  'What do my sleep patterns say about my mood?',
  'Explain how my medications work together',
  'What should I watch out for this week?',
  'Help me understand my last episode',
  'What are the signs I might be getting manic?',
]

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '16px',
    }}>
      {!isUser && (
        <div style={{
          width: '28px', height: '28px', borderRadius: '8px', background: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, marginRight: '10px', marginTop: '2px',
          fontSize: '12px', fontWeight: '700', color: 'white',
        }}>
          P
        </div>
      )}
      <div style={{
        maxWidth: '75%',
        padding: '12px 16px',
        borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        background: isUser ? 'var(--accent)' : 'var(--surface)',
        border: isUser ? 'none' : '1px solid var(--border)',
        fontSize: '14px',
        lineHeight: '1.7',
        color: isUser ? 'white' : 'var(--text)',
        whiteSpace: 'pre-wrap',
      }}>
        {msg.content}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
      <div style={{
        width: '28px', height: '28px', borderRadius: '8px', background: 'var(--accent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, fontSize: '12px', fontWeight: '700', color: 'white',
      }}>P</div>
      <div style={{ display: 'flex', gap: '4px', padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px 16px 16px 4px' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-3)',
            animation: 'pulse 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`,
          }} />
        ))}
      </div>
      <style>{`@keyframes pulse { 0%,80%,100%{opacity:0.3} 40%{opacity:1} }`}</style>
    </div>
  )
}

export function AIChatClient({ hasData }: { hasData: boolean }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: hasData
        ? "Hi. I'm Polar's AI companion — I have access to your tracking data and I'm here to help you make sense of it.\n\nYou can ask me anything: how your mood patterns look, what your data says about your sleep, how your medications interact, or just talk through how you're feeling. What's on your mind?"
        : "Hi. I'm Polar's AI companion. I don't have any tracking data from you yet — start with a daily pulse check-in and I'll be able to give you much more personalized responses.\n\nThat said, I'm still here. Ask me anything about bipolar disorder, your medications, or what to expect from treatment.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send(text?: string) {
    const content = text || input.trim()
    if (!content || loading) return

    const userMsg: Message = { role: 'user', content }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })
      const data = await res.json()
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please check your internet and try again.' }])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const showStarters = messages.length === 1

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '4px 0 16px',
        display: 'flex', flexDirection: 'column',
      }}>
        {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Starter suggestions */}
      {showStarters && !loading && (
        <div style={{ flexShrink: 0, marginBottom: '14px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '8px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Suggested questions
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {STARTERS.map(s => (
              <button key={s} onClick={() => send(s)} style={{
                padding: '7px 13px', background: 'var(--surface-2)',
                border: '1px solid var(--border)', borderRadius: '20px',
                fontSize: '13px', color: 'var(--text-2)', cursor: 'pointer',
                fontFamily: 'inherit', transition: 'all 0.1s', textAlign: 'left',
              }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{
        flexShrink: 0,
        display: 'flex', gap: '10px', alignItems: 'flex-end',
        padding: '14px 16px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
      }}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask anything... (Enter to send, Shift+Enter for new line)"
          rows={1}
          style={{
            flex: 1, background: 'none', border: 'none', outline: 'none',
            color: 'var(--text)', fontSize: '14px', fontFamily: 'inherit',
            resize: 'none', lineHeight: '1.5', maxHeight: '120px', overflowY: 'auto',
          }}
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          style={{
            width: '36px', height: '36px', borderRadius: '8px',
            background: input.trim() && !loading ? 'var(--accent)' : 'var(--border-2)',
            border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'all 0.15s',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 8h12M10 4l6 4-6 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
