import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  Mail,
  MoreHorizontal,
  PenLine,
  Send,
} from 'lucide-react'
import { buildConversationsFromBrands, formatChatTime } from '../data/mockChats'

function ThreadAvatar({ name, logo }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-foreground">
        {name.charAt(0)}
      </div>
    )
  }

  return (
    <div className="brand-logo-surface h-11 w-11 shrink-0 rounded-full border border-border-subtle p-1.5">
      <img
        src={logo}
        alt=""
        className="h-full w-full object-contain"
        onError={() => setFailed(true)}
      />
    </div>
  )
}

function EmptyDetailPane({ hasThreads, onComposeHint }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-10 py-16 text-center">
      <div className="relative mb-8">
        <div className="absolute -inset-4 rounded-full bg-violet-100/60 blur-2xl" />
        <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-50 to-white border border-border-subtle">
          <Mail className="h-14 w-14 text-violet-300" strokeWidth={1.25} />
          <PenLine className="absolute -right-1 bottom-2 h-8 w-8 text-foreground" strokeWidth={1.75} />
        </div>
      </div>
      <h2 className="font-display text-xl font-extrabold tracking-tight text-foreground">
        Este espacio se siente un poco… vacío
      </h2>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {hasThreads
          ? 'Seleccioná una conversación de la lista para negociar con la marca.'
          : 'Cuando confirmes un match, tu chat aparecerá acá. Podés iniciar contacto desde Propuestas y Matches.'}
      </p>
      {!hasThreads && (
        <button
          type="button"
          onClick={onComposeHint}
          className="mt-6 text-sm font-bold text-foreground underline-offset-4 hover:underline"
        >
          Ir a mis matches →
        </button>
      )}
    </div>
  )
}

function ChatThread({ conversation, onBack }) {
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState(conversation.messages)

  useEffect(() => {
    setMessages(conversation.messages)
    setDraft('')
  }, [conversation.id, conversation.messages])

  const handleSend = (e) => {
    e.preventDefault()
    if (!draft.trim()) return

    setMessages((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        sender: 'host',
        text: draft.trim(),
        at: new Date().toISOString(),
      },
    ])
    setDraft('')
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center gap-3 border-b border-border-subtle px-6 py-4">
        <button
          type="button"
          onClick={onBack}
          className="mr-1 rounded-lg p-2 text-muted-foreground hover:bg-secondary lg:hidden"
          aria-label="Volver"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <ThreadAvatar name={conversation.brandName} logo={conversation.brandLogo} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-base font-extrabold text-foreground">
            {conversation.brandName}
          </p>
          <p className="truncate text-xs text-muted-foreground">{conversation.eventTitle}</p>
        </div>
        <button
          type="button"
          className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
          aria-label="Opciones"
        >
          <MoreHorizontal className="h-5 w-5" strokeWidth={1.75} />
        </button>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
        {messages.map((msg) => {
          const isHost = msg.sender === 'host'
          return (
            <div
              key={msg.id}
              className={`flex ${isHost ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[70%] ${
                  isHost
                    ? 'bg-primary text-white'
                    : 'border border-border-subtle bg-secondary text-foreground/80'
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p
                  className={`mt-1.5 type-small ${isHost ? 'text-white/50' : 'text-muted-foreground'}`}
                >
                  {formatChatTime(msg.at)}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <form
        onSubmit={handleSend}
        className="border-t border-border-subtle px-6 py-4"
      >
        <div className="flex items-center gap-2 rounded-2xl border border-border-subtle bg-secondary px-4 py-2 focus-within:border-[#d1d5db] focus-within:bg-white">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Escribí un mensaje..."
            className="flex-1 border-0 bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white transition-opacity disabled:opacity-30"
            aria-label="Enviar"
          >
            <Send className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </form>
    </div>
  )
}

export default function ChatsView({ brands, initialBrandId, onGoToMatches }) {
  const conversations = useMemo(
    () => buildConversationsFromBrands(brands),
    [brands],
  )

  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    if (initialBrandId) {
      const conv = conversations.find((c) => c.brandId === initialBrandId)
      if (conv) setSelectedId(conv.id)
      return
    }
    if (!selectedId && conversations[0]) {
      setSelectedId(conversations[0].id)
    }
  }, [initialBrandId, conversations, selectedId])

  const selected = conversations.find((c) => c.id === selectedId)
  const hasThreads = conversations.length > 0

  return (
    <div className="min-h-full bg-secondary px-4 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-3xl border border-border-subtle bg-white shadow-sm">
        {/* Lista — estilo Meetup */}
        <aside
          className={`relative flex w-full flex-col border-border-subtle md:w-[320px] md:shrink-0 md:border-r ${
            selectedId ? 'hidden md:flex' : 'flex'
          }`}
        >
          <div className="flex items-center justify-between border-b border-border-subtle px-5 py-5">
            <h1 className="font-display text-xl font-extrabold tracking-tight text-foreground">
              Mensajes
            </h1>
            <button
              type="button"
              className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
              aria-label="Más opciones"
            >
              <MoreHorizontal className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {!hasThreads ? (
              <div className="px-5 py-12 text-center">
                <p className="text-sm text-muted-foreground">Sin conversaciones aún</p>
              </div>
            ) : (
              <ul>
                {conversations.map((thread) => {
                  const isActive = thread.id === selectedId
                  return (
                    <li key={thread.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(thread.id)}
                        className={`flex w-full items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-secondary ${
                          isActive ? 'bg-secondary' : ''
                        }`}
                      >
                        <ThreadAvatar name={thread.brandName} logo={thread.brandLogo} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="truncate font-semibold text-foreground">
                              {thread.brandName}
                            </span>
                            <span className="shrink-0 type-small text-muted-foreground">
                              {formatChatTime(thread.lastMessageAt)}
                            </span>
                          </div>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {thread.eventTitle}
                          </p>
                          <p className="mt-1 truncate text-sm text-muted-foreground">
                            {thread.lastMessage}
                          </p>
                        </div>
                        {thread.unread > 0 && (
                          <span className="mt-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 type-small font-bold text-white">
                            {thread.unread}
                          </span>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div className="absolute bottom-5 right-5">
            <button
              type="button"
              onClick={onGoToMatches}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
              aria-label="Nuevo mensaje"
              title="Ir a matches"
            >
              <PenLine className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
        </aside>

        {/* Detalle — panel derecho con sombra sutil */}
        <section
          className={`relative flex flex-1 flex-col bg-white shadow-[-12px_0_40px_-12px_rgba(0,0,0,0.08)] ${
            selectedId ? 'flex' : 'hidden md:flex'
          }`}
        >
          {selected ? (
            <ChatThread conversation={selected} onBack={() => setSelectedId(null)} />
          ) : (
            <EmptyDetailPane hasThreads={hasThreads} onComposeHint={onGoToMatches} />
          )}
        </section>
      </div>
    </div>
  )
}
