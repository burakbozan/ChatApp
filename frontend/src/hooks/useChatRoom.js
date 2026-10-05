import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../services/api'
import { connectToChat } from '../services/socket'

function messageId(message) {
  return String(message._id || message.id)
}

function mergeMessages(current, incoming) {
  const messages = new Map(current.map((message) => [messageId(message), message]))
  incoming.forEach((message) => messages.set(messageId(message), message))
  return [...messages.values()].sort((first, second) => (
    new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime()
  ))
}

export function useChatRoom(roomId, token) {
  const [messages, setMessages] = useState([])
  const [onlineUsers, setOnlineUsers] = useState([])
  const [typingUsers, setTypingUsers] = useState([])
  const [connection, setConnection] = useState('connecting')
  const [error, setError] = useState('')
  const socketRef = useRef(null)
  const typingTimers = useRef(new Map())

  useEffect(() => {
    if (!roomId || !token) return undefined

    let active = true
    const activeTypingTimers = typingTimers.current

    const socket = connectToChat(token)
    socketRef.current = socket

    socket.on('connect', () => {
      if (active) setConnection('connected')
      socket.emit('room:join', roomId, (result) => {
        if (!active) return
        if (result?.error) setError(result.error)
      })
    })
    socket.on('disconnect', () => active && setConnection('disconnected'))
    socket.on('connect_error', (connectError) => {
      if (active) {
        setConnection('disconnected')
        setError(connectError.message === 'Invalid or expired token'
          ? connectError.message
          : 'Can\'t reach the chat server. Check that the backend is running.')
      }
    })
    socket.on('message:new', (message) => {
      if (active && message.roomId === roomId) setMessages((current) => mergeMessages(current, [message]))
    })
    socket.on('room:users', (users) => active && setOnlineUsers(users))
    socket.on('room:typing', ({ user, isTyping }) => {
      if (!active || !user?.id) return
      const timer = typingTimers.current.get(user.id)
      if (timer) clearTimeout(timer)
      if (isTyping) {
        typingTimers.current.set(user.id, setTimeout(() => {
          setTypingUsers((current) => current.filter((typingUser) => typingUser.id !== user.id))
          typingTimers.current.delete(user.id)
        }, 3500))
        setTypingUsers((current) => current.some((typingUser) => typingUser.id === user.id)
          ? current
          : [...current, user])
      } else {
        typingTimers.current.delete(user.id)
        setTypingUsers((current) => current.filter((typingUser) => typingUser.id !== user.id))
      }
    })

    api.getMessages(roomId, token)
      .then(({ messages: history }) => active && setMessages((current) => mergeMessages(current, history)))
      .catch((fetchError) => active && setError(fetchError.name === 'TypeError'
        ? 'Could not load room history. Check that the backend is running.'
        : fetchError.message))

    return () => {
      active = false
      activeTypingTimers.forEach(clearTimeout)
      activeTypingTimers.clear()
      socket.disconnect()
      socketRef.current = null
    }
  }, [roomId, token])

  const sendMessage = useCallback((content) => new Promise((resolve, reject) => {
    const socket = socketRef.current
    if (!socket?.connected) return reject(new Error('Reconnecting to chat. Try again in a moment.'))

    socket.emit('message:send', { roomId, content }, (result) => {
      if (result?.error) reject(new Error(result.error))
      else resolve(result?.message)
    })
  }), [roomId])

  const sendTyping = useCallback((isTyping) => {
    socketRef.current?.emit('room:typing', { roomId, isTyping })
  }, [roomId])

  return { messages, onlineUsers, typingUsers, connection, error, sendMessage, sendTyping }
}
