export const SOCKET_MESSAGES = {
    CHAT: {
        CANNOT_CHAT: 'Chat is only available for active jobs',
        NOT_PARTICIPANT: 'You are not a participant in this chat'
    },
    NOTIFICATION_TITLES: {
        MESSAGE: 'New Message',
        JOB_APPLICATION: 'New Job Application',
        HIRE_REQUEST: 'New Hire Request',
        PROPOSAL_ACCEPTED: 'Proposal Accepted',
        PROPOSAL_REJECTED: 'Proposal Rejected',
    },
    NOTIFICATION: {
        NOT_FOUND: 'Notification not found'
    },
    NOTIFICATION_MESSAGES: {
        JOB_APPLICATION:(jobName:string) =>`Got new job application request for ${jobName}`,
        HIRE_DESIGER:(jobName:string) =>`Got new hire request request  ${jobName}`
    }
} as const;