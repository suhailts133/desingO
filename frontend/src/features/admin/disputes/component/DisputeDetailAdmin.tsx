import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import type { DisputeStatus } from "../../../proposal/proposalInterface";
import { useGetDisputeDetailQuery } from "../adminDispueEndpoint";
import DisputeVerdictModal from "./DisputeVerditModal";
import type { DisputeSolutionDTO, DisputeSolutionResponseDTO } from "../adminDisputeInterface";
import { useDisputeVerdit } from "../hooks/useDisputeVerdit";
import toast from "react-hot-toast";

const statusColors: Record<DisputeStatus, string> = {
  "Open": "bg-error-tint text-error border-error-tint",
  "Under Review": "bg-warning-tint text-warning-text border-warning-tint",
  "Redo": "bg-warning-tint text-warning-text border-warning-tint",
  "Awaiting Confirmation": "bg-warning-tint text-warning-text border-warning-tint",
  "Resolved": "bg-success-tint text-success-text border-success-tint",
  "Terminated": "bg-surface-hover text-text-faint border-surface-border",
};

const escrowStatusColors: Record<string, string> = {
  "Held": "bg-surface-hover text-text-faint border-surface-border",
  "Released": "bg-success-tint text-success-text border-success-tint",
  "Refunded": "bg-surface-hover text-text-primary border-surface-border",
  "Disputed": "bg-error-tint text-error border-error-tint",
};

export default function DisputeDetailAdmin() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetDisputeDetailQuery(id!, { skip: !id });
  const { handleVerditSubmit, isSubmitting } = useDisputeVerdit();

  const [verdictOpen, setVerdictOpen] = useState(false);
  const [verdictResult, setVerdictResult] = useState<DisputeSolutionResponseDTO | null>(null);

  const dispute = data?.data;

  if (isLoading) return <div className="p-10 text-center animate-pulse text-text-faint">Loading dispute...</div>;
  if (error || !dispute) return <div className="p-10 text-center text-error font-Jost-Semibold">Dispute not found.</div>;

  const status = verdictResult?.status ?? dispute.status;
  const canTerminate = verdictResult?.canTerminate ?? dispute.canTerminate;
  const refundAmount = verdictResult?.refundAmount ?? undefined;
  const resolution = verdictResult?.resolution ?? dispute.resolution;
  const resolutionType = verdictResult?.resolutionType ?? dispute.resolutionType;
  const service = dispute.currentService;

  const onVerdictConfirm = async (data: DisputeSolutionDTO) => {
    const result = await handleVerditSubmit(data);
    if (result.success) {
      toast.success("Successfully given your report")
      setVerdictResult(result.data ?? null);
      setVerdictOpen(false);
    } else {
      toast.error(result.message ?? "Something went wrong")
    }
  };

  return (
    <div className="font-Jost-Regular h-full">
      <button onClick={() => navigate(-1)} className="mb-4 text-sm text-text-primary hover:text-accent-hover transition-colors">
        ← Back
      </button>

      <div className="max-w-7xl mx-auto space-y-8 pb-10">

        <div className="bg-surface rounded-2xl p-6 border border-surface-border flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-Jost-Semibold text-text-primary">{dispute.type}</h1>
              <span className={`px-4 py-1 rounded-full text-sm font-medium border ${statusColors[status]}`}>
                {status}
              </span>
            </div>

            {status !== "Open" && (
              <div
                className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg w-fit border ${canTerminate
                    ? "bg-success-tint text-success-text border-success-tint"
                    : "bg-surface-hover text-text-faint border-surface-border"
                  }`}
              >
                <span className={`w-2 h-2 rounded-full ${canTerminate ? "bg-success" : "bg-text-faint"}`} />
                {canTerminate
                  ? "The reporter is eligible to terminate this contract."
                  : "The reporter is not eligible to terminate this contract."}
              </div>
            )}
          </div>

          {status !== "Resolved" && (
            <button
              onClick={() => setVerdictOpen(true)}
              className="px-6 py-2.5 bg-accent text-text-on-accent rounded-xl hover:bg-accent-hover active:bg-accent-active transition-all font-medium"
            >
              Give Verdict
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8">

          {/* Parties */}
          <section className="bg-surface rounded-2xl border border-surface-border overflow-hidden">
            <div className="p-6 border-b border-surface-border bg-surface-hover">
              <h2 className="text-xl font-Jost-Semibold text-text-primary">Parties Involved</h2>
            </div>
            <div className="p-8 grid md:grid-cols-2 gap-8">
              <div className="flex items-center gap-4">
                {dispute.customerImage ? (
                  <img src={dispute.customerImage} alt={dispute.customerName} className="w-16 h-16 rounded-full object-cover border border-surface-border" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-surface-hover border-2 border-surface-border flex items-center justify-center text-text-faint font-Jost-Semibold text-xl">
                    {dispute.customerName?.[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <span className="bg-accent-tint px-2 py-0.5 rounded text-xs font-bold text-accent-tint-text">CUSTOMER</span>
                  <p className="text-lg font-Jost-Semibold text-text-primary mt-1">{dispute.customerName}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {dispute.designerImage ? (
                  <img src={dispute.designerImage} alt={dispute.designerName} className="w-16 h-16 rounded-full object-cover border border-surface-border" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-surface-hover border-2 border-surface-border flex items-center justify-center text-text-faint font-Jost-Semibold text-xl">
                    {dispute.designerName?.[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <span className="bg-accent-tint px-2 py-0.5 rounded text-xs font-bold text-accent-tint-text">DESIGNER</span>
                  <p className="text-lg font-Jost-Semibold text-text-primary mt-1">{dispute.designerName}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Dispute details */}
          <section className="bg-surface rounded-2xl border border-surface-border overflow-hidden">
            <div className="p-6 border-b border-surface-border bg-surface-hover">
              <h2 className="text-xl font-Jost-Semibold text-text-primary">Dispute Details</h2>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs uppercase tracking-wider text-text-faint font-bold">Raised By</label>
                  <p className="text-lg text-text-primary mt-1">{dispute.raisedBy}</p>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-text-faint font-bold">Type</label>
                  <p className="text-lg text-text-primary mt-1">{dispute.type}</p>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-text-faint font-bold">Raised On</label>
                  <p className="text-lg text-text-primary mt-1">{new Date(dispute.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-text-faint font-bold">Reason</label>
                <p className="text-lg text-text-primary leading-relaxed mt-1">{dispute.reason}</p>
              </div>

              {dispute.evidence.length > 0 && (
                <div>
                  <label className="text-xs uppercase tracking-wider text-text-faint font-bold mb-2 block">
                    Evidence ({dispute.evidence.length})
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {dispute.evidence.map((url, i) => (
                      <Zoom key={i}>
                        <img
                          src={url}
                          alt={`evidence-${i}`}
                          className="w-full h-40 object-cover rounded-xl border border-surface-border cursor-zoom-in hover:scale-105 hover:border-accent transition-transform"
                        />
                      </Zoom>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Disputed service */}
          <section className="bg-surface rounded-2xl border border-surface-border overflow-hidden">
            <div className="p-6 border-b border-surface-border bg-surface-hover">
              <h2 className="text-xl font-Jost-Semibold text-text-primary">Disputed Service</h2>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h3 className="text-xl font-Jost-Semibold text-text-primary">{service.serviceName}</h3>
                <span className="px-3 py-1 rounded-full text-xs font-medium border bg-surface-hover text-text-muted border-surface-border">
                  {service.serviceStatus}
                </span>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <label className="text-xs uppercase tracking-wider text-text-faint font-bold">Agreed Price</label>
                  <p className="text-lg text-text-primary mt-1">₹{service.price}</p>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-text-faint font-bold">Execution Price</label>
                  <p className="text-lg text-text-primary mt-1">₹{service.executionPrice}</p>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-text-faint font-bold">Version</label>
                  <p className="text-lg text-text-primary mt-1">v{service.currentVersion}</p>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-text-faint font-bold">Escrow Status</label>
                  {service.escrowStatus ? (
                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium border ${escrowStatusColors[service.escrowStatus] ?? "bg-surface-hover text-text-muted border-surface-border"}`}>
                      {service.escrowStatus}
                    </span>
                  ) : (
                    <p className="text-lg text-text-faint mt-1">—</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs uppercase tracking-wider text-text-faint font-bold">Expected Delivery</label>
                  <p className="text-lg text-text-primary mt-1">{new Date(service.expectedDeliveryDate).toLocaleDateString()}</p>
                </div>
                {service.actualDeliveryDate && (
                  <div>
                    <label className="text-xs uppercase tracking-wider text-text-faint font-bold">Actual Delivery</label>
                    <p className="text-lg text-text-primary mt-1">{new Date(service.actualDeliveryDate).toLocaleDateString()}</p>
                  </div>
                )}
                {service.paidAt && (
                  <div>
                    <label className="text-xs uppercase tracking-wider text-text-faint font-bold">Paid At</label>
                    <p className="text-lg text-text-primary mt-1">{new Date(service.paidAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              {(service.amountHeld !== undefined || service.platformCommission !== undefined || service.designerPayout !== undefined) && (
                <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-surface-border">
                  {service.amountHeld !== undefined && (
                    <div>
                      <label className="text-xs uppercase tracking-wider text-text-faint font-bold">Amount Held</label>
                      <p className="text-lg text-text-primary mt-1">₹{service.amountHeld}</p>
                    </div>
                  )}
                  {service.platformCommission !== undefined && (
                    <div>
                      <label className="text-xs uppercase tracking-wider text-text-faint font-bold">Platform Commission</label>
                      <p className="text-lg text-text-primary mt-1">₹{service.platformCommission}</p>
                    </div>
                  )}
                  {service.designerPayout !== undefined && (
                    <div>
                      <label className="text-xs uppercase tracking-wider text-text-faint font-bold">Designer Payout</label>
                      <p className="text-lg text-text-primary mt-1">₹{service.designerPayout}</p>
                    </div>
                  )}
                </div>
              )}

              {service.uploadedImages && service.uploadedImages.length > 0 && (
                <div>
                  <label className="text-xs uppercase tracking-wider text-text-faint font-bold mb-2 block">
                    Uploaded Outputs ({service.uploadedImages.length})
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {service.uploadedImages.map((url, i) => (
                      <Zoom key={i}>
                        <img
                          src={url}
                          alt={`output-${i}`}
                          className="w-full h-40 object-cover rounded-xl border border-surface-border cursor-zoom-in hover:scale-105 hover:border-accent transition-transform"
                        />
                      </Zoom>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Verdict / resolution */}
          {status === "Awaiting Confirmation" && resolution && (
            <section className="bg-success-tint rounded-2xl border border-success-tint overflow-hidden">
              <div className="p-6 border-b border-success-tint/50">
                <h2 className="text-xl font-Jost-Semibold text-success-text">Verdict</h2>
              </div>
              <div className="p-8 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-success font-bold">Resolution Type</label>
                    <p className="text-lg text-success-text mt-1">{resolutionType}</p>
                  </div>
                  {refundAmount !== undefined && refundAmount > 0 && (
                    <div>
                      <label className="text-xs uppercase tracking-wider text-success font-bold">Refund Amount</label>
                      <p className="text-lg text-success-text mt-1">₹{refundAmount}</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-success font-bold">Details</label>
                  <p className="text-lg text-success-text leading-relaxed mt-1">{resolution}</p>
                </div>
              </div>
            </section>
          )}

        </div>
      </div>

      <DisputeVerdictModal
        disputeId={dispute.id}
        isOpen={verdictOpen}
        onClose={() => setVerdictOpen(false)}
        onConfirm={onVerdictConfirm}
        isLoading={isSubmitting}
      />
    </div>
  );
}