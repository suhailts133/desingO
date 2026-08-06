
import type { AllDisputeAdminDTO, DisputeAdminFilters, DisputeDetailAdminDTO, DisputeSolutionDTO, DisputeSolutionResponseDTO } from "../../DTO/proposal/dispute";
import type { IApiResponse, IApiResponseWithPagination } from "../base/IApiResponse";

export interface IAdminDisputeService {
    getAllDispute(filter?: DisputeAdminFilters): Promise<IApiResponseWithPagination<AllDisputeAdminDTO[]>>
    getDisputeDetail(id: string): Promise<IApiResponse<DisputeDetailAdminDTO>>
    disputeSolution(data: DisputeSolutionDTO): Promise<IApiResponse<DisputeSolutionResponseDTO>>
}