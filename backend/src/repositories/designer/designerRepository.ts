import mongoose from "mongoose";
import type { DesignerVerificationDTO } from "../../DTO/designer/designerVerificationDTOs.js";
import type { IDesigner } from "../../interfaces/designer/IDesigner.js";
import type { IDesignerRepository } from "../../interfaces/designer/IDesignerRepository.js";
import { DesignerModel } from "../../models/designer/designerModel.js";
import { BaseRepository } from "../baseRepository.js";
import type { DesignerUpdateRequestDTO } from "../../DTO/profile/profileDTO.js";

export class DesignerRepository extends BaseRepository<IDesigner> implements IDesignerRepository {
    constructor() {
        super(DesignerModel)
    }

    async createDesignerRequest(data: DesignerVerificationDTO): Promise<boolean> {
        const result = await this.create({
            ...data,
            userId: new mongoose.Types.ObjectId(data.userId)
        });
        return !!result
    }


    async getDesigner(userId: string): Promise<IDesigner | null> {
        const result = await this.findOne({ userId });
        if (!result) {
            return null
        }
        return result
    }

    async updateDesigner(designerId: string, data: DesignerUpdateRequestDTO): Promise<IDesigner | null> {
        const result = await this.update(designerId, data);
        if (!result) {
            return null
        }
        return result
    }

}