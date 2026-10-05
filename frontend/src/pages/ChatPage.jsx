import { useParams } from 'react-router-dom'
import ChatRoom from '../components/ChatRoom'

export default function ChatPage() {
  const { roomId = 'general' } = useParams()
  return <ChatRoom key={roomId} roomId={roomId} />
}
