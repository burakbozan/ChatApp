import { io } from 'socket.io-client'
import { socketUrl } from './api'

export function connectToChat(token) {
  return io(socketUrl, {
    auth: { token },
    transports: ['websocket', 'polling'],
  })
}
