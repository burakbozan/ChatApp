import { Hash, LogOut, MessageCircle, Plus, Sparkles } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const rooms = [
  { id: 'general', label: 'general', color: '#c7f36a' },
  { id: 'design', label: 'design', color: '#eea27d' },
  { id: 'engineering', label: 'engineering', color: '#9bb8ed' },
  { id: 'random', label: 'random', color: '#e6aeca' },
]

export default function RoomSidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="hidden w-[260px] shrink-0 flex-col border-r border-[#e6e9e1] bg-[#fafbf7] md:flex">
      <div className="flex h-[72px] items-center gap-3 border-b border-[#e6e9e1] px-5">
        <span className="grid size-9 place-items-center rounded-xl bg-[#173b32] text-[#c7f36a]"><MessageCircle size={19} strokeWidth={2.4} /></span>
        <span className="font-display text-[17px] font-bold text-[#173b32]">commonroom</span>
        <span className="ml-auto grid size-7 place-items-center rounded-lg text-[#a1aaa2] hover:bg-[#eef1e9] hover:text-[#4b6256]" title="Room settings"><Sparkles size={15} /></span>
      </div>

      <div className="px-4 pt-7">
        <div className="mb-3 flex items-center justify-between px-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#98a39a]">Your rooms</span>
          <button aria-label="Add a room" className="grid size-6 place-items-center rounded-md text-[#9ca79e] hover:bg-[#edf0e8] hover:text-[#314a3e]" title="Add a room"><Plus size={15} /></button>
        </div>
        <nav aria-label="Chat rooms" className="space-y-1">
          {rooms.map((room) => (
            <NavLink key={room.id} className={({ isActive }) => `group flex h-10 items-center gap-3 rounded-lg px-3 text-[13px] font-medium no-underline transition ${isActive ? 'bg-[#e9eee5] text-[#173b32]' : 'text-[#758078] hover:bg-[#f0f2ec] hover:text-[#314a3e]'}`} to={`/chat/${room.id}`}>
              <Hash size={16} strokeWidth={2} style={{ color: room.color }} />
              <span>{room.label}</span>
              {room.id === 'general' && <span className="ml-auto size-1.5 rounded-full bg-[#75a968]" />}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto border-t border-[#e6e9e1] p-4">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#e9b48f] text-xs font-bold text-[#503223]">{user?.username?.slice(0, 1).toUpperCase()}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#34483f]">{user?.username}</p>
            <p className="text-[11px] text-[#94a097]">Here with your people</p>
          </div>
          <button aria-label="Sign out" className="grid size-8 place-items-center rounded-lg text-[#8c9990] hover:bg-[#f0e9e4] hover:text-[#a54e33]" onClick={logout} title="Sign out"><LogOut size={16} /></button>
        </div>
      </div>
    </aside>
  )
}
