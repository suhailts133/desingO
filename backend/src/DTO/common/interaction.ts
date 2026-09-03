import type { ICustomerInteraction } from "../../interfaces/customer/ICustomer"
import type { IDesignerInteraction } from "../../interfaces/designer/IDesigner"

export interface CustomerInteraction {
    customerId: string
    designId: string
    action: "View" | "Save" | "Hire"
    weight: number
}
export interface DesignerInteraction {
    designerId: string
    jobId: string
    action: "View" | "Applied" | "Accepted"
    weight: number
}


export type CustomerInteractionPopulated = Omit<ICustomerInteraction, "designId"> & {
    designId: { embedding: number[] }
}
export type DesignerInteractionPopulated = Omit<IDesignerInteraction, "jobId"> & {
    jobId: { embedding: number[] }
}