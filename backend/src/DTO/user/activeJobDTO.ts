import type { IUser } from "../../interfaces/auth/IUser.js";
import type { IActiveJob, IHireDesigner, IJobRequest } from "../../interfaces/customer/ICustomer.js";

export type ActiveJobPopulateAll = Omit<IActiveJob, "userId" | "designerId" | "sourceId" | "sourceType"> & {
    userId: IUser
    designerId: IUser
} & (
        {
            sourceType: 'jobRequest'
            sourceId: IJobRequest
        } |
        {
            sourceType: 'direct_hire'
            sourceId: IHireDesigner
        }
    )


export interface CreateActiveJobDTO {
    userId: string
    designerId: string
    sourceType: 'jobRequest' | 'direct_hire'
    sourceId: string
}