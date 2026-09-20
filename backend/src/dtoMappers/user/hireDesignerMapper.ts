import type { ProposalInputData } from "../../DTO/proposal/proposal";
import type { IJobRequestPopulated } from "../../interfaces/customer/ICustomer";


export class HireDesignerMapper {

    static toDirectHireProposalInputDTO(data: IJobRequestPopulated): ProposalInputData {
        return {
            jobId: data.id,
            maxPrice: data.maxBudget,
            minPrice: data.minBudget,
            services: data.services,
            timeLine: data.timeline,
            totalArea: data.totalCarpetArea,
            unit: data.areaUnit,
            siteVisitingRequired: data.requiresSiteVisitMeasurement
        }
    }
  
}

