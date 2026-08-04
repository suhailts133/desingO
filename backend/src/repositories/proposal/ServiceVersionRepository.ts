import mongoose from "mongoose";
import type { CreateServiceVersionRepoDTO, VersionAcceptOrRejectDTO } from "../../DTO/proposal/version";
import type { IServiceVersion } from "../../interfaces/proposal/IProposal";
import type { IServiceVersionRepository } from "../../interfaces/proposal/IProposalRepository";
import { ServiceVersionModel } from "../../models/proposal/serviceVersionModal";
import { BaseRepository } from "../baseRepository";

export class ServiceVersionRepository extends BaseRepository<IServiceVersion> implements IServiceVersionRepository {
    constructor() {
        super(ServiceVersionModel)
    }



    async acceptOrRejectVersion(data: VersionAcceptOrRejectDTO): Promise<IServiceVersion | null> {
        const { versionId, ...updateFields } = data;
        return await this.update(versionId, updateFields);
    }

    async createVersion(data: CreateServiceVersionRepoDTO): Promise<IServiceVersion> {
        return await this.create({
            ...data,
            proposalId: new mongoose.Types.ObjectId(data.proposalId),
            sourceId:new mongoose.Types.ObjectId(data.sourceId)
        })
    }


    async findAllVersions(sourceId: string): Promise<IServiceVersion[]> {
        return await this.find({ sourceId })
    }

    async findVersion(versionId: string): Promise<IServiceVersion | null> {
        return await this.findById(versionId);
    }
}