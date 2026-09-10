import type { AggregatedBucketRaw, AllTransactionDTO, ReportBucketDto, ReportFilters, ReportResponseDto, TransactionPopulated } from "../../DTO/common/transaction";
import type { TransactionType } from "../../interfaces/base/ITransaction";


export class TransactionMapper {

    static toTransactionDTOList(data: TransactionPopulated[]): AllTransactionDTO[] {
        return data.map(d => ({
            id: d.id,
            amount: d.amount,
            sourceName:d.sourceUserId.full_name,
            sourceId:d.sourceUserId.id,
            sourceRole:d.sourceUserId.role,
            designationName:d.destinationUserId.full_name,
            destinationId:d.destinationUserId.id,
            destinationRole:d.destinationUserId.role,
            type: d.type
        }));
    }


    private static emptyTypeTotals(): Record<TransactionType, number> {
        return {
            Payment: 0,
            Commission: 0,
            Payout: 0,
            Refund: 0,
        };
    }


    static toAggregationReport(raw: AggregatedBucketRaw[], filters: ReportFilters): ReportResponseDto {
        const bucketsByPeriod = new Map<string, ReportBucketDto>();
        const summaryByType = this.emptyTypeTotals();
        let grandTotal = 0;

        for (const row of raw) {
            const { period, type } = row._id;
            let bucket = bucketsByPeriod.get(period);

        
            if (!bucket) {
                bucket = {
                    period,
                    total: 0,
                    count: 0,
                    ...this.emptyTypeTotals(),
                };
                bucketsByPeriod.set(period, bucket);
            }

            bucket[type] += row.totalAmount;
            bucket.total += row.totalAmount;
            bucket.count += row.count;

            summaryByType[type] += row.totalAmount;
            grandTotal += row.totalAmount;
        }

        const data = Array.from(bucketsByPeriod.values()).sort((a, b) =>
            a.period.localeCompare(b.period)
        );

        return {
            groupBy: filters.groupBy,
            from: filters.from,
            to: filters.to,
            data,
            summary: { total: grandTotal, byType: summaryByType },
        };
    }
}