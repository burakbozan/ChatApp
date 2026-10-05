import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Hash, LoaderCircle, LogOut, Send, Signal, SignalZero, Smile, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useChatRoom } from '../hooks/useChatRoom'
import RoomSidebar from './RoomSidebar'

const roomNames = {
  general: 'general',
  design: 'design',
  engineering: 'engineering',
  random: 'random',
}

function formatTime(value) {
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date(value))
}

function getSenderId(sender) {
  return String(sender?._id || sender?.id || sender || '')
}

function Avatar({ name, size = 'normal', online = false }) {
  const palette = ['bg-[#e8ad8e] text-[#513626]', 'bg-[#a9c1e9] text-[#2f466a]', 'bg-[#d9b5ce] text-[#5d3651]', 'bg-[#c4d99c] text-[#3d5128]']
  const color = palette[(name || 'a').toLowerCase().charCodeAt(0) % palette.length]

  return (
    <span className={`relative grid shrink-0 place-items-center rounded-full font-bold ${size === 'small' ? 'size-8 text-[10px]' : 'size-9 text-xs'} ${color}`}>
      {(name || '?').slice(0, 1).toUpperCase()}
      {online && <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-[#73a969]" />}
    </span>
  )
}

function Message({ message, own }) {
  const sender = typeof message.sender === 'object' ? message.sender : null
  const name = sender?.username || (own ? 'You' : 'A room member')

  return (
    <article className={`message-enter flex gap-3 ${own ? 'flex-row-reverse' : ''}`}>
      {!own && <Avatar name={name} size="small" />}
      <div className={`max-w-[min(78%,620px)] ${own ? 'text-right' : ''}`}>
        <div className={`mb-1.5 flex items-baseline gap-2 ${own ? 'justify-end' : ''}`}>
          <span className="text-xs font-bold text-[#405349]">{name}</span>
          <time className="text-[10px] text-[#a0aaa2]" dateTime={message.createdAt}>{formatTime(message.createdAt)}</time>
        </div>
        <p className={`whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-[13px] leading-[1.65] ${own ? 'rounded-tr-md bg-[#e7f3d8] text-[#294032]' : 'rounded-tl-md bg-white text-[#405047] shadow-[0_2px_10px_rgba(34,53,42,0.045)]'}`}>
          {message.content}
        </p>
      </div>
    </article>
  )
}

function OnlineList({ users, currentUser }) {
  return (
    <aside className="hidden w-[238px] shrink-0 border-l border-[#e6e9e1] bg-[#fafbf7] px-5 pt-7 xl:block">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-display text-sm font-semibold text-[#293e34]">In this room</h2>
          <p className="mt-1 text-[11px] text-[#97a198]">People around right now</p>
        </div>
        <span className="rounded-md bg-[#edf2e8] px-2 py-1 text-[10px] font-bold text-[#597957]">{users.length} online</span>
      </div>
      <div className="space-y-1">
        {users.map((person) => (
          <div key={person.id} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-[#f0f2ec]">
            <Avatar name={person.username} size="small" online />
            <span className="min-w-0 flex-1 truncate text-xs font-medium text-[#526158]">{person.username}{person.id === currentUser?.id ? ' (you)' : ''}</span>
            <span className="size-1.5 rounded-full bg-[#73a969]" />
          </div>
        ))}
        {users.length === 0 && <p className="px-2 py-3 text-xs text-[#9ba59d]">Connecting to the room…</p>}
      </div>
    </aside>
  )
}

function MessageComposer({ onSend, onTyping, disabled, roomName }) {
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const typingTimer = useRef(null)

  async function submit(event) {
    event.preventDefault()
    const text = content.trim()
    if (!text || sending || disabled) return
    setSending(true)
    setError('')
    onTyping(false)
    try {
      await onSend(text)
      setContent('')
    } catch (sendError) {
      setError(sendError.message)
    } finally {
      setSending(false)
    }
  }

  function change(event) {
    const nextValue = event.target.value
    setContent(nextValue)
    onTyping(Boolean(nextValue.trim()))
    clearTimeout(typingTimer.current)
    if (nextValue.trim()) typingTimer.current = setTimeout(() => onTyping(false), 1600)
  }

  useEffect(() => () => clearTimeout(typingTimer.current), [])

  return (
    <div className="border-t border-[#e8ebe3] bg-white px-4 pb-4 pt-3 sm:px-7 sm:pb-6">
      {error && <p role="alert" className="mb-2 text-xs text-[#a54e33]">{error}</p>}
      <form className="flex items-end gap-3 rounded-2xl border border-[#dce3d9] bg-[#fbfcf9] p-2 pl-4 transition focus-within:border-[#93aa8d] focus-within:ring-4 focus-within:ring-[#5d8055]/10" onSubmit={submit}>
        <textarea aria-label="Write a message" className="max-h-32 min-h-10 flex-1 resize-none self-center bg-transparent py-2 text-[13px] leading-5 text-[#293e34] outline-none placeholder:text-[#a3ada4]" maxLength={5000} onChange={change} onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            event.currentTarget.form.requestSubmit()
          }
        }} placeholder={`Message #${roomName}`} value={content} />
        <button aria-label="Add emoji" className="mb-0.5 grid size-9 shrink-0 place-items-center rounded-xl text-[#91a096] hover:bg-[#eef1eb] hover:text-[#536c59]" onClick={() => setContent((value) => `${value}🙂`)} type="button"><Smile size={18} /></button>
        <button aria-label="Send message" className="mb-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-[#173b32] text-white transition hover:bg-[#245447] disabled:bg-[#c7d0c8]" disabled={!content.trim() || sending || disabled} type="submit">
          {sending ? <LoaderCircle className="animate-spin" size={17} /> : <Send size={16} />}
        </button>
      </form>
      <div className="mt-2 flex items-center justify-between px-1 text-[10px] text-[#a0aaa2]">
        <span>Enter to send <span className="mx-1 text-[#d0d6cf]">|</span> Shift + Enter for a new line</span>
        <span>{content.length}/5000</span>
      </div>
    </div>
  )
}

export default function ChatRoom({ roomId }) {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const { messages, onlineUsers, typingUsers, connection, error, sendMessage, sendTyping } = useChatRoom(roomId, token)
  const messageEnd = useRef(null)
  const roomName = roomNames[roomId] || roomId

  useEffect(() => {
    messageEnd.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, typingUsers])

  return (
    <main className="flex h-[100dvh] min-h-[520px] overflow-hidden bg-white text-[#172a24]">
      <RoomSidebar />
      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-[#e8ebe3] px-4 sm:px-7">
          <div className="relative flex min-w-0 items-center gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Hash className="hidden text-[#8ea184] sm:block" size={17} />
                <h1 className="truncate font-display text-base font-semibold text-[#253a30]">{roomName}</h1>
                <ChevronDown className="text-[#a0aaa2] sm:hidden" size={15} />
              </div>
              <p className="mt-0.5 truncate text-[11px] text-[#9aa49c]">A good place to catch up</p>
            </div>
            <select aria-label="Choose a room" className="absolute inset-0 h-full w-full opacity-0 sm:hidden" onChange={(event) => navigate(`/chat/${event.target.value}`)} value={roomId}>
              {Object.keys(roomNames).map((id) => <option key={id} value={id}>{id}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <span className={`flex items-center gap-1.5 text-[11px] font-semibold ${connection === 'connected' ? 'text-[#63845a]' : 'text-[#b7794a]'}`}>
              {connection === 'connected' ? <Signal size={14} /> : <SignalZero size={14} />}
              <span className="hidden sm:inline">{connection === 'connected' ? 'Live' : connection === 'connecting' ? 'Connecting' : 'Reconnecting'}</span>
            </span>
            <span className="flex items-center gap-1.5 rounded-lg bg-[#f1f4ee] px-2.5 py-1.5 text-[11px] font-semibold text-[#617269] xl:hidden">
              <Users size={14} /> {onlineUsers.length}
            </span>
            <button aria-label="Sign out" className="grid size-8 place-items-center rounded-lg text-[#8c9990] hover:bg-[#f0e9e4] hover:text-[#a54e33] md:hidden" onClick={logout} title="Sign out"><LogOut size={16} /></button>
          </div>
        </header>

        {error && <div className="border-b border-[#f0d2c4] bg-[#fff7f2] px-5 py-2 text-xs text-[#9b482f]">{error}</div>}

        <div className="flex min-h-0 flex-1">
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto bg-[#f7f8f3] px-4 py-6 sm:px-7">
              <div className="mx-auto flex min-h-full max-w-[760px] flex-col justify-end gap-5">
                {messages.length === 0 && (
                  <div className="page-enter my-auto flex flex-col items-center justify-center py-16 text-center">
                    <span className="mb-5 grid size-14 place-items-center rounded-2xl bg-[#e8efdf] text-[#648055]"><Hash size={24} /></span>
                    <p className="font-display text-xl font-semibold text-[#31463a]">The start of something good.</p>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-[#8a978e]">Say hello to the room. The best conversations start somewhere.</p>
                  </div>
                )}
                {messages.map((message) => (
                  <Message key={message._id || message.id} message={message} own={getSenderId(message.sender) === String(user?.id)} />
                ))}
                {typingUsers.length > 0 && (
                  <div className="flex items-center gap-2 pl-1 text-[11px] text-[#829086]">
                    <span className="flex gap-1 rounded-full bg-white px-3 py-2 shadow-[0_2px_10px_rgba(34,53,42,0.045)]">
                      <span className="typing-dot size-1.5 rounded-full bg-[#77916d]" />
                      <span className="typing-dot size-1.5 rounded-full bg-[#77916d]" />
                      <span className="typing-dot size-1.5 rounded-full bg-[#77916d]" />
                    </span>
                    <span>{typingUsers.map((person) => person.username).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing</span>
                  </div>
                )}
                <div ref={messageEnd} />
              </div>
            </div>
            <MessageComposer disabled={connection !== 'connected'} onSend={sendMessage} onTyping={sendTyping} roomName={roomName} />
          </div>
          <OnlineList currentUser={user} users={onlineUsers} />
        </div>
      </section>
    </main>
  )
}
