import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { Check, X } from "lucide-react";
import type { DisputeStatus } from "../../../proposal/proposalInterface";
import { useGetDisputeDetailQuery } from "../adminDispueEndpoint";
import DisputeVerdictModal from "./DisputeVerditModal";
import type { DisputeSolutionDTO, DisputeSolutionResponseDTO } from "../adminDisputeInterface";
import { useDisputeVerdit } from "../hooks/useDisputeVerdit";
import toast from "react-hot-toast";

const statusColors: Record<DisputeStatus, string> = {
  "Open": "bg-red-100 text-red-700 border-red-300",
  "Under Review": "bg-blue-100 text-blue-700 border-blue-300",
  "Redo": "bg-amber-100 text-amber-700 border-amber-300",
  "Awaiting Confirmation": "bg-purple-100 text-purple-700 border-purple-300",
  "Resolved": "bg-green-100 text-green-700 border-green-300",
};

const escrowStatusColors: Record<string, string> = {
  "Held": "bg-amber-50 text-amber-700 border-amber-200",
  "Released": "bg-green-50 text-green-700 border-green-200",
  "Refunded": "bg-blue-50 text-blue-700 border-blue-200",
  "Disputed": "bg-red-50 text-red-700 border-red-200",
};

export default function DisputeDetailAdmin() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetDisputeDetailQuery(id!, { skip: !id });
  const { handleVerditSubmit, isSubmitting } = useDisputeVerdit();

  const [verdictOpen, setVerdictOpen] = useState(false);
  const [verdictResult, setVerdictResult] = useState<DisputeSolutionResponseDTO | null>(null);

  const dispute = data?.data;

  if (isLoading) return <div className="p-10 text-center animate-pulse text-gray-400">Loading dispute...</div>;
  if (error || !dispute) return <div className="p-10 text-center text-red-500 font-Jost-Semibold">Dispute not found.</div>;

  const status = verdictResult?.status ?? dispute.status;
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
      <button onClick={() => navigate(-1)} className="mb-4 text-sm text-soft-black hover:underline">
        ← Back
      </button>

      <div className="max-w-7xl mx-auto space-y-8 pb-10">

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-Jost-Semibold text-gray-900">{dispute.type}</h1>
            <span className={`px-4 py-1 rounded-full text-sm font-medium border ${statusColors[status]}`}>
              {status}
            </span>
          </div>

          {status !== "Resolved" && (
            <button
              onClick={() => setVerdictOpen(true)}
              className="px-6 py-2.5 bg-soft-black text-white rounded-xl hover:opacity-90 transition-all font-medium shadow-sm"
            >
              Give Verdict
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8">

          {/* Parties */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/30">
              <h2 className="text-xl font-Jost-Semibold">Parties Involved</h2>
            </div>
            <div className="p-8 grid md:grid-cols-2 gap-8">
              <div className="flex items-center gap-4">
                {dispute.customerImage ? (
                  <img src={dispute.customerImage} alt={dispute.customerName} className="w-16 h-16 rounded-full object-cover border border-gray-100" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blush/20 flex items-center justify-center text-blush-deep font-Jost-Semibold text-xl">
                    {dispute.customerName?.[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <span className="bg-blush/20 px-2 py-0.5 rounded text-xs font-bold text-blush-deep">CUSTOMER</span>
                  <p className="text-lg font-Jost-Semibold text-gray-900 mt-1">{dispute.customerName}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {dispute.designerImage ? (
                  <img src={dispute.designerImage} alt={dispute.designerName} className="w-16 h-16 rounded-full object-cover border border-gray-100" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-peach/20 flex items-center justify-center text-peach font-Jost-Semibold text-xl">
                    {dispute.designerName?.[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <span className="bg-peach/20 px-2 py-0.5 rounded text-xs font-bold text-peach">DESIGNER</span>
                  <p className="text-lg font-Jost-Semibold text-gray-900 mt-1">{dispute.designerName}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Dispute details */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/30">
              <h2 className="text-xl font-Jost-Semibold">Dispute Details</h2>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Raised By</label>
                  <p className="text-lg text-gray-700 mt-1">{dispute.raisedBy}</p>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Type</label>
                  <p className="text-lg text-gray-700 mt-1">{dispute.type}</p>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Raised On</label>
                  <p className="text-lg text-gray-700 mt-1">{new Date(dispute.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Reason</label>
                <p className="text-lg text-gray-700 leading-relaxed mt-1">{dispute.reason}</p>
              </div>

              {dispute.evidence.length > 0 && (
                <div>
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2 block">
                    Evidence ({dispute.evidence.length})
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {dispute.evidence.map((url, i) => (
                      <Zoom key={i}>
                        <img
                          src={url}
                          alt={`evidence-${i}`}
                          className="w-full h-40 object-cover rounded-xl shadow-sm cursor-zoom-in hover:scale-105 transition-transform"
                        />
                      </Zoom>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Disputed service */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/30">
              <h2 className="text-xl font-Jost-Semibold">Disputed Service</h2>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h3 className="text-xl font-Jost-Semibold text-gray-900">{service.serviceName}</h3>
                <span className="px-3 py-1 rounded-full text-xs font-medium border bg-gray-50 text-gray-600 border-gray-200">
                  {service.serviceStatus}
                </span>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Agreed Price</label>
                  <p className="text-lg text-gray-700 mt-1">₹{service.price}</p>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Execution Price</label>
                  <p className="text-lg text-gray-700 mt-1">₹{service.executionPrice}</p>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Version</label>
                  <p className="text-lg text-gray-700 mt-1">v{service.currentVersion}</p>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Escrow Status</label>
                  {service.escrowStatus ? (
                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium border ${escrowStatusColors[service.escrowStatus] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>
                      {service.escrowStatus}
                    </span>
                  ) : (
                    <p className="text-lg text-gray-400 mt-1">—</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Expected Delivery</label>
                  <p className="text-lg text-gray-700 mt-1">{new Date(service.expectedDeliveryDate).toLocaleDateString()}</p>
                </div>
                {service.actualDeliveryDate && (
                  <div>
                    <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Actual Delivery</label>
                    <p className="text-lg text-gray-700 mt-1">{new Date(service.actualDeliveryDate).toLocaleDateString()}</p>
                  </div>
                )}
                {service.paidAt && (
                  <div>
                    <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Paid At</label>
                    <p className="text-lg text-gray-700 mt-1">{new Date(service.paidAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              {(service.amountHeld !== undefined || service.platformCommission !== undefined || service.designerPayout !== undefined) && (
                <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-gray-50">
                  {service.amountHeld !== undefined && (
                    <div>
                      <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Amount Held</label>
                      <p className="text-lg text-gray-700 mt-1">₹{service.amountHeld}</p>
                    </div>
                  )}
                  {service.platformCommission !== undefined && (
                    <div>
                      <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Platform Commission</label>
                      <p className="text-lg text-gray-700 mt-1">₹{service.platformCommission}</p>
                    </div>
                  )}
                  {service.designerPayout !== undefined && (
                    <div>
                      <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Designer Payout</label>
                      <p className="text-lg text-gray-700 mt-1">₹{service.designerPayout}</p>
                    </div>
                  )}
                </div>
              )}

              {service.uploadedImages && service.uploadedImages.length > 0 && (
                <div>
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2 block">
                    Uploaded Outputs ({service.uploadedImages.length})
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {service.uploadedImages.map((url, i) => (
                      <Zoom key={i}>
                        <img
                          src={url}
                          alt={`output-${i}`}
                          className="w-full h-40 object-cover rounded-xl shadow-sm cursor-zoom-in hover:scale-105 transition-transform"
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
            <section className="bg-green-50 rounded-2xl border border-green-200 overflow-hidden">
              <div className="p-6 border-b border-green-100">
                <h2 className="text-xl font-Jost-Semibold text-green-800">Verdict</h2>
              </div>
              <div className="p-8 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-green-600 font-bold">Resolution Type</label>
                    <p className="text-lg text-green-800 mt-1">{resolutionType}</p>
                  </div>
                  {!!refundAmount && (
                    <div>
                      <label className="text-xs uppercase tracking-wider text-green-600 font-bold">Refund Amount</label>
                      <p className="text-lg text-green-800 mt-1">₹{refundAmount}</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-green-600 font-bold">Details</label>
                  <p className="text-lg text-green-800 leading-relaxed mt-1">{resolution}</p>
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