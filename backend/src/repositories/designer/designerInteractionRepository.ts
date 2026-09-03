import mongoose from "mongoose";
import type { DesignerInteraction, DesignerInteractionPopulated } from "../../DTO/common/interaction";
import type { IDesignerInteraction } from "../../interfaces/designer/IDesigner";
import type { IDesignerInteractionRepository } from "../../interfaces/designer/IDesignerRepository";
import { designerInteractionModel } from "../../models/designer/deignerInteractionModel";
import { BaseRepository } from "../baseRepository";

export class DesignerInteractionRepository extends BaseRepository<IDesignerInteraction> implements IDesignerInteractionRepository {
    constructor() {
        super(designerInteractionModel)
    }

    async createInteraction(data: DesignerInteraction): Promise<IDesignerInteraction> {
        return await this.create({
            ...data,
            designerId: new mongoose.Types.ObjectId(data.designerId),
            jobId: new mongoose.Types.ObjectId(data.jobId),
        })
    }

    async getRecentInteractios(designerId: string): Promise<DesignerInteractionPopulated[]> {
        return await this._model.find({ designerId })
            .sort({ createdAt: -1 })
            .limit(50)
            .populate<{ jobId: { embedding: number[] } }>("jobId", "embedding");
    }
}