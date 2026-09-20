import mongoose, { type ClientSession } from "mongoose";
import type { floorPlanRepoDTO } from "../../DTO/proposal/floorplans";
import type { IFloorPlan, IFloorPlanRepository } from "../../interfaces/proposal/IFloorPlan";
import { FloorPlanModel } from "../../models/proposal/floorPlansModel";
import { BaseRepository } from "../baseRepository";

export class FloorPlansRepository extends BaseRepository<IFloorPlan> implements IFloorPlanRepository {
  constructor() {
    super(FloorPlanModel);
  }

  async createFloorPlan(data: floorPlanRepoDTO): Promise<IFloorPlan> {
    const { proposalId, ...rest } = data;
    return await this.create({
      ...rest,
      proposalId: new mongoose.Types.ObjectId(proposalId),
    });
  }

  async getFloorPlan(id: string): Promise<IFloorPlan | null> {
    return await this.findById(id);
  }

  async updateFloorPlan(id: string, data: Partial<IFloorPlan>, session?: ClientSession): Promise<IFloorPlan | null> {
    return await this.update(id, data, session);
  }

  async getAllFloorPlan(proposalId: string): Promise<IFloorPlan[]> {
    return await this.find({ proposalId });
  }
}
