import { useState } from "react"
import { useDisputeServices } from "../disputeServices"

export const useReportIssue = () => {
    const { isReporting, reporIssue } = useDisputeServices()
    const [ReportError, setReportError] = useState<string | null>(null)

    const handleReportIssue = async (formData: FormData) => {
        setReportError(null)
        const result = await reporIssue(formData)

        if (!result.success) {
            setReportError(result.message as string)
            setTimeout(() => setReportError(""), 3000)
        }
        return result
    }

    return {
        isReporting,
        handleReportIssue,
        ReportError
    }

}