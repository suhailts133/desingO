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
        DESIGNER_APPLICATION_REJECTED: 'Designer Application Rejected',
        DESIGNER_APPLICATION_APPROVED: 'Designer Application Approved',
    },
    NOTIFICATION: {
        NOT_FOUND: 'Notification not found'
    },
    NOTIFICATION_MESSAGES: {
        JOB_APPLICATION: (jobName: string) => `Got new job application request for ${jobName}`,
        HIRE_DESIGER: (jobName: string) => `Got new hire request request  ${jobName}`,
      PROPOSAL: (jobName: string, status: "Accepted" | "Rejected") => `Proposal for ${jobName} was ${status}`,
      DESIGNER_APPLICATION: (status: "Approved" | "Rejected") => `Designer Application was ${status} check email for further info.`,

    }
} as const;
