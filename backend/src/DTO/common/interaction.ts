import type { ICustomerInteraction } from "../../interfaces/customer/ICustomer"

export interface CustomerInteraction {
    customerId: string
    designId: string
    action: "View" | "Save" | "Hire"
    weight: number
}


export type CustomerInteractionPopulated = Omit<ICustomerInteraction, "designId"> & {
    designId: {embedding:number[]}
}