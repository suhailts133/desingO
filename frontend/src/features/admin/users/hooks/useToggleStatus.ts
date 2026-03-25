import { useState } from "react"
import type { ToggleStatusPayload } from "../adminUserInterface"
import { useAdminUserServices } from "../adminUserServices"

export const useToggleStatus = () => {
    const [error, setError] = useState<string | null>(null)
    const [toggle, setToggle] = useState<boolean | null>(null)
    const { toggleStatus, isToggling } = useAdminUserServices()

    const handleToggling = async (payload: ToggleStatusPayload) => {
        setError(null)
        setToggle(null)
        const result = await toggleStatus(payload)
        if (result?.success) {
            setToggle(result.data?.is_blocked as boolean)
        } else {
            setError(result?.message as string)
        }
    }

    return { handleToggling, isToggling, error, toggle }
}