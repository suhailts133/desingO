import type { ServiceItem } from "../../DTO/proposal/proposal.js";
import { RESPONSE_CODE } from "../enums/statusCode.js";
import { AppError } from "../errors/appError.js";
import { PROPOSAL_MESSAGES } from "../messages/proposalMessages.js";

export function validateServiceOrders(services: ServiceItem[]): void {
    if (services.length === 0) {
        throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.SERVICES_REQUIRED, RESPONSE_CODE.BAD_REQUEST);
    }
    const orders = services.map(s => s.order).sort((a, b) => a - b);

    if (orders[0] !== 1) {
        throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.SERVICE_ORDER_MUST_START_FROM_ONE, RESPONSE_CODE.BAD_REQUEST);
    }


    for (let i = 1; i < orders.length; i++) {
        const prev = orders[i - 1] as number;
        const curr = orders[i] as number;
        if (curr !== prev + 1) {
            throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.SERVICE_ORDER_NOT_CONTINUOUS, RESPONSE_CODE.BAD_REQUEST);
        }
    }

}