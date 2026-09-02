import mongoose, { type QueryOptions } from "mongoose";
import type { CustomerInteraction, CustomerInteractionPopulated } from "../../DTO/common/interaction";
import type { ICustomerInteraction } from "../../interfaces/customer/ICustomer";
import type { ICustomerInteractionRepository } from "../../interfaces/customer/ICustomerRepository";
import { CustomerInteractionModel } from "../../models/user/customerInteractionModel";
import { BaseRepository } from "../baseRepository";
import { DESIGIN_INTERACTION_TYPE } from "../../shared/enums/interactionEnum";

export class CustomerInteractionRepository extends BaseRepository<ICustomerInteraction> implements ICustomerInteractionRepository {
    constructor() {
        super(CustomerInteractionModel)
    }


    async createInteraction(data: CustomerInteraction): Promise<ICustomerInteraction> {
        return await this.create({
            ...data,
            customerId: new mongoose.Types.ObjectId(data.customerId),
            designId: new mongoose.Types.ObjectId(data.designId),
        })
    }


    async getRecentInteractios(customerId: string): Promise<CustomerInteractionPopulated[]> {
        const options: QueryOptions<ICustomerInteraction> = {
            sort: { createdAt: -1 },
            limit: 50,
            populate: {
                path: 'designId',
                select: 'embedding'
            }
        };
        const result = await this.find({ customerId }, options)
        console.log(result)
        return result as unknown as CustomerInteractionPopulated[];
    }

    async getSavedDesignids(customerId: string): Promise<string[]> {
        const result = await this.find({ customerId, action: DESIGIN_INTERACTION_TYPE.SAVE })
        return result.map(interaction => interaction.designId.toString())
    }
}