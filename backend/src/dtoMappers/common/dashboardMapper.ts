import type { AdminDashboardDTO, AdminOngoingDisputeDTOs, PendingStatusType, PendingVerificationRequests } from "../../DTO/admin/adminDashboard";
import type { CustomerDashboardDTO, DesignerDashboardDTO, OngoingDisputeDTOs, OngoingProposalDTOs, PendingProposalDTOs } from "../../DTO/common/dashboard";
import type { DisputePopulateProposal } from "../../DTO/proposal/dispute";
import type { IProposalSourcePopulated } from "../../DTO/proposal/proposal";
import type { IUser } from "../../interfaces/auth/IUser";
import type { ITransaction } from "../../interfaces/base/ITransaction";
import type { IActiveJob } from "../../interfaces/customer/ICustomer";
import type { IDesignerPopulated } from "../../interfaces/designer/IDesigner";
import type { IDispute } from "../../interfaces/proposal/IDispute";
import type { IReview } from "../../interfaces/proposal/IProposal";
import { ACTIVE_JOB_STATUS } from "../../shared/enums/commonEnums";
import { CONTRACT_STATUS, DISPUTE_STATUS, ServiceStatus } from "../../shared/enums/proposalEnums";

export class DashboardMapper {



    static adminDashboardDTO(dispute: IDispute[], activeUserCount: number, pendingRequests: IDesignerPopulated[], commision: ITransaction[], activeJobCount: number): AdminDashboardDTO {
        const totalCommision = commision.reduce((acc, cur) => acc + cur.amount, 0)
        const pendingDesignerVerificationRequsts: PendingVerificationRequests[] = pendingRequests.map(e => {
            return {
                id: e.id,
                email: e.userId.email,
                name: e.userId.full_name,
                status: e.status as PendingStatusType

            }
        })
        const pendingDisputes: AdminOngoingDisputeDTOs[] = dispute.map(e => {
            return {
                id: e.id,
                type: e.type,
                reason: e.reason,
                status: e.status

            }
        })
        return {
            activeUsersCount: activeUserCount,
            activeJobCount: activeJobCount,
            totalCommision,
            disputes: pendingDisputes,
            designerVerificationRequests: pendingDesignerVerificationRequsts,
        }
    }

    static customerDashboardDTO(user: IUser, proposals: IProposalSourcePopulated[], disputes: DisputePopulateProposal[], activeJobsCount: number, totalJobCount: number): CustomerDashboardDTO {

        const completedJobCount = proposals.filter(p => p.contractStatus === CONTRACT_STATUS.COMPLETED).length;
        const moneyHeld = proposals.reduce((sum, p) => sum + p.currentAmountHeld, 0);

        const totalMoneySpent = proposals.reduce((total, proposal) => {
            const proposalTotal = proposal.services.reduce((sum, service) => sum + service.price, 0);
            return total + proposalTotal;
        }, 0);

        const ongoingDisputes: OngoingDisputeDTOs[] = disputes.filter(d => d.status !== DISPUTE_STATUS.RESOLVED && d.status !== DISPUTE_STATUS.TERMINATED)
            .map(d => ({
                proposalId: d.proposalId.id,
                sourceId: d.proposalId.sourceId.toString(),
                activeJobId: d.proposalId.activeJobId.toString(),
                sourceType: d.proposalId.sourceType,
                type: d.type,
                reason: d.reason,
                status: d.status,
            }));

        const ongoingProposals: OngoingProposalDTOs[] = proposals
            .filter(p => p.contractStatus !== CONTRACT_STATUS.TERMINATED)
            .flatMap(p => p.services.filter(s => s.status !== ServiceStatus.COMPLETED && s.status !== ServiceStatus.LOCKED)
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
            totalMoneySpent,
            totalJobCount,
            activJobCount: activeJobsCount,
            name: user.full_name,
            wallet: user.wallet,
            moneyHeld,
            completedJobCount,
            ongoingDisputes,
            ongoingProposals,
        };


    }

    static designerDashboardDTO(designCount: number, user: IUser, proposals: IProposalSourcePopulated[], reviews: IReview[], disputes: DisputePopulateProposal[], activeJobs: IActiveJob[]): DesignerDashboardDTO {

        const rating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

        const moneyHeld = proposals.reduce((sum, p) => sum + p.currentAmountHeld, 0);

        const completedJobCount = proposals.filter(p => p.contractStatus === CONTRACT_STATUS.COMPLETED).length;

        const activJobCount = activeJobs.filter(aj => aj.status === ACTIVE_JOB_STATUS.ACTIVE).length


        const pendingProposals: PendingProposalDTOs[] = activeJobs
            .map(aj => ({
                sourceId: aj.sourceId.toString(),
                sourceType: aj.sourceType,
                activeJobId: aj.id,
                jobName: aj.sourceName,
                proposalStatus: aj.proposalStatus,
            }));


        const ongoingDisputes: OngoingDisputeDTOs[] = disputes.filter(d => d.status !== DISPUTE_STATUS.RESOLVED && d.status !== DISPUTE_STATUS.TERMINATED)
            .map(d => ({
                proposalId: d.proposalId.id,
                sourceId: d.proposalId.sourceId.toString(),
                activeJobId: d.proposalId.activeJobId.toString(),
                sourceType: d.proposalId.sourceType,
                type: d.type,
                reason: d.reason,
                status: d.status,
            }));

        const ongoingProposals: OngoingProposalDTOs[] = proposals
            .filter(p => p.contractStatus !== CONTRACT_STATUS.TERMINATED)
            .flatMap(p => p.services.filter(s => s.status !== ServiceStatus.COMPLETED && s.status !== ServiceStatus.LOCKED)
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