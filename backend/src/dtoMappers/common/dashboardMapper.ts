import type { DesignerDashboardDTO, OngoingDisputeDTOs, OngoingProposalDTOs, PendingProposalDTOs } from "../../DTO/common/dashboard";
import type { DisputePopulateProposal } from "../../DTO/proposal/dispute";
import type { IProposalSourcePopulated } from "../../DTO/proposal/proposal";
import type { IUser } from "../../interfaces/auth/IUser";
import type { IActiveJob } from "../../interfaces/customer/ICustomer";
import type { IReview } from "../../interfaces/proposal/IProposal";
import { ACTIVE_JOB_PROPOSAL_STATUS, ACTIVE_JOB_STATUS } from "../../shared/enums/commonEnums";
import { CONTRACT_STATUS, DISPUTE_STATUS, ServiceStatus } from "../../shared/enums/proposalEnums";

export class DashboardMapper {

    static designerDashboardDTO(designCount: number, user: IUser, proposals: IProposalSourcePopulated[], reviews: IReview[], disputes: DisputePopulateProposal[], activeJobs: IActiveJob[]): DesignerDashboardDTO {

        const rating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

        const moneyHeld = proposals.reduce((sum, p) => sum + p.currentAmountHeld, 0);

        const completedJobCount = proposals.filter(p => p.contractStatus === CONTRACT_STATUS.COMPLETED).length;

        const activJobCount = activeJobs.filter(aj => aj.status === ACTIVE_JOB_STATUS.ACTIVE).length


        const pendingProposals: PendingProposalDTOs[] = activeJobs.filter(aj => aj.proposalStatus !== ACTIVE_JOB_PROPOSAL_STATUS.CREATED)
            .map(aj => ({
                sourceId: aj.sourceId.toString(),
                sourceType: aj.sourceType,
                activeJobId: aj.id,
                jobName: aj.sourceName,
                proposalStatus: aj.proposalStatus,
            }));


        const ongoingDisputes: OngoingDisputeDTOs[] = disputes.filter(d => d.status !== DISPUTE_STATUS.RESOLVED)
            .map(d => ({
                proposalId: d.proposalId.id,
                sourceId: d.proposalId.sourceId.toString(),
                activeJobId: d.proposalId.activeJobId.toString(),
                sourceType: d.proposalId.sourceType,
                type: d.type,
                reason: d.reason,
                status: d.status,
            }));

        const ongoingProposals: OngoingProposalDTOs[] = proposals.flatMap(p => p.services.filter(s => s.status !== ServiceStatus.COMPLETED && s.status !== ServiceStatus.LOCKED)
            .map(s => ({
                proposalId: p.id,
                activeJobId: p.activeJobId.toString(),
                jobId: p.sourceId.id,
                sourceType: p.sourceId.sourceType,
                jobName: p.sourceName,
                serviceName: s.serviceName,
                status: s.status,
                paymentStatus: s.paymentStatus,
            }))
        );

        return {
            userId: user.id,
            rating,
            activJobCount,
            name: user.full_name,
            wallet: user.wallet,
            moneyHeld,
            completedJobCount,
            designCount,
            pendingProposals,
            ongoingDisputes,
            ongoingProposals,
        };
    }
}