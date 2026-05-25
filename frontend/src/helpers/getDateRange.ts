import type { DateFilter } from "../features/user/jobApplications/jobApplicationInterFace"

export const getDateRange = (
    dateFilter: DateFilter,
    startDate: Date,
    endDate: Date
) => {
    if (dateFilter === "Today") {
        const start = new Date()
        start.setHours(0, 0, 0, 0)
        const end = new Date()
        end.setHours(23, 59, 59, 999)
        return { startDate: start.toISOString(), endDate: end.toISOString() }
    }
    if (dateFilter === "Custom") {
        const start = new Date(startDate)
        start.setHours(0, 0, 0, 0)
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        return { startDate: start.toISOString(), endDate: end.toISOString() }
    }
    return { startDate: undefined, endDate: undefined }
}