import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"
import { useSocketAuth } from "./useSocketAuth"

export function useSocket(roomId: string, enabled: boolean) {
    const { getNewToken } = useSocketAuth()
    const getNewTokenRef = useRef(getNewToken)
    const socketRef = useRef<Socket | null>(null)

    const [socket, setSocket] = useState<Socket | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Keep the ref pointed at the latest function without
    // making the effect below depend on it.
    useEffect(() => {
        getNewTokenRef.current = getNewToken
    }, [getNewToken])

    useEffect(() => {
        if (!enabled || !roomId) return
        let cancelled = false

        const connect = async () => {
            const freshToken = await getNewTokenRef.current()

            if (!freshToken) {
                setError("Session expired. Please log in again.")
                return
            }

            if (cancelled) return

            const newSocket = io(import.meta.env.VITE_BASE_URL, {
                auth: { token: freshToken },
            })
            socketRef.current = newSocket
            setSocket(newSocket)

            newSocket.on("connect", () => {
                setIsConnected(true)
                setError(null)
                newSocket.emit("join_room", { activeJobId: roomId })
            })

            newSocket.on("connect_error", async (err) => {
                if (err.message === "Token invalid" || err.message === "jwt expired") {
                    const newToken = await getNewTokenRef.current()
                    if (newToken) {
                        newSocket.auth = { token: newToken }
                        newSocket.connect()
                    } else {
                        setError("Session expired. Please log in again.")
                    }
                } else {
                    setIsConnected(false)
                    setError(err.message)
                }
            })

            newSocket.on("disconnect", () => setIsConnected(false))
        }

        connect()

        return () => {
            cancelled = true
            if (socketRef.current) {
                socketRef.current.emit("leave_room", { activeJobId: roomId })
                socketRef.current.disconnect()
                socketRef.current = null
            }
            setSocket(null)
            setIsConnected(false)
        }
    }, [roomId, enabled])

    return { socket, isConnected, error, setError }
}