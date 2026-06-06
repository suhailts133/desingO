// chatUtils.ts
import type { Message } from "../proposalInterface"

export function getInitials(name: string): string {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

export function formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export function groupByDate(messages: Message[]) {
    const groups: Record<string, Message[]> = {}
    for (const msg of messages) {
        const date = new Date(msg.createdAt)
        const key = date.toDateString()
        if (!groups[key]) groups[key] = []
        groups[key].push(msg)
    }
    return groups
}

export function formatDateLabel(dateStr: string): string {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return "Today"
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday"
    return date.toLocaleDateString([], { day: "numeric", month: "long", year: "numeric" })
}