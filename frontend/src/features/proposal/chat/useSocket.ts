import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"
import { useSocketAuth } from "./useSocketAuth"

export function useSocket(roomId: string, enabled: boolean) {
    const { getNewToken } = useSocketAuth()
    const socketRef = useRef<Socket | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!enabled || !roomId) return
        let cancelled = false

        const connect = async () => {
            const freshToken = await getNewToken()

            if (!freshToken) {
                setError("Session expired. Please log in again.")
                return
            }

            if (cancelled) return

            const socket = io(import.meta.env.VITE_BASE_URL, {
                auth: { token: freshToken },
            })
            socketRef.current = socket

            socket.on("connect", () => {
                setIsConnected(true)
                setError(null)
                socket.emit("join_room", { activeJobId: roomId })
            })

            socket.on("connect_error", async (err) => {
                if (err.message === "Token invalid" || err.message === "jwt expired") {
                    const newToken = await getNewToken() 
                    if (newToken) {
                        socket.auth = { token: newToken }
                        socket.connect()
                    } else {
                        setError("Session expired. Please log in again.")
                    }
                } else {
                    setIsConnected(false)
                    setError(err.message)
                }
            })

            socket.on("disconnect", () => setIsConnected(false))
        }

        connect()

        return () => {
            cancelled = true
            if (socketRef.current) {
                socketRef.current.emit("leave_room", { activeJobId: roomId })
                socketRef.current.disconnect()
                socketRef.current = null
            }
            setIsConnected(false)
        }
    }, [roomId, enabled]) 

    return { socket: socketRef.current, isConnected, error, setError }
}