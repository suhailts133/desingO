import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useGetDesignerRequestQuery } from "../adminDesignerVerificationEndpoints";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css"
import type { AdminDesignerReject } from "../adminDesignerVerificationInterfaces";
import { joiResolver } from "@hookform/resolvers/joi";
import { adminDesignerReject } from "../../../../validations/adminValidations";
import { useApproveOrRejectDesigner } from "../hooks/useApproveOrRejectDesigner";
import { Check, X } from "lucide-react"


export default function DesignerVerificationDetails() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetDesignerRequestQuery(id!, { skip: !id });
  const { handleApproveOrReject, isApprovalLoading, approvalError, approvalSuccess, status } = useApproveOrRejectDesigner()
  const [modalType, setModalType] = useState<"approve" | "reject" | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<AdminDesignerReject>({
    resolver: joiResolver(adminDesignerReject),
    mode: "onBlur"
  });
  const navigate = useNavigate()
  const designerRequest = data?.data;
  if (isLoading) return <div className="p-10 text-center animate-pulse text-text-faint">Loading Application...</div>;
  if (error || !designerRequest) return <div className="p-10 text-center text-error font-Jost-Semibold">Application not found.</div>;
  const designerStatus = status ? status : designerRequest.status

  const onRejectSubmit = async (data: AdminDesignerReject) => {
    const success = await handleApproveOrReject({ id: id as string, status: "Rejected", rejectionReason: data.rejectionReason })
    if (success) {
      setModalType(null);
    }
  };

  const handleApprove = async () => {

    const success = await handleApproveOrReject({ id: id as string, status: "Approved" })
    if (success) {
      setModalType(null);
    }
  };

  const statusColors = {
    Pending: "bg-warning-tint text-warning-text",
    Approved: "bg-success-tint text-success-text",
    Rejected: "bg-error-tint text-error-text",
  };

  return (
    <div className="font-Jost-Regular h-full">
      <button onClick={() => navigate(-1)} className="mb-4 text-sm text-text-primary hover:underline">
        ← Back
      </button>
      <div className="max-w-7xl mx-auto space-y-8 pb-10">

        <div className="bg-surface rounded-2xl p-6 border border-surface-border flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-Jost-Semibold text-text-primary">{designerRequest.full_name}</h1>
            <span className={`px-4 py-1 rounded-full text-sm font-medium ${statusColors[designerStatus as keyof typeof statusColors]}`}>
              {designerStatus}
            </span>
          </div>

          {designerStatus === "Pending" && (
            <div className="flex gap-3">
              <button
                onClick={() => setModalType('approve')}
                className="px-6 py-2.5 bg-success text-text-on-accent rounded-xl hover:opacity-90 transition-all font-medium"
              >
                Approve Request
              </button>
              <button
                onClick={() => setModalType('reject')}
                className="px-6 py-2.5 bg-surface text-error border border-error rounded-xl hover:bg-error-tint transition-all font-medium"
              >
                Reject
              </button>
            </div>
          )}
        </div>


        {approvalError && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-error-tint border border-error text-error-text animate-in fade-in zoom-in duration-200">
            <X />
            <p className="text-sm font-medium leading-tight">{approvalError}</p>
          </div>
        )}


        {approvalSuccess && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-success-tint border border-success text-success-text animate-in fade-in zoom-in duration-200">
            <Check />
            <p className="text-sm font-medium leading-tight">{approvalSuccess}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8">

          <section className="bg-surface rounded-2xl border border-surface-border overflow-hidden">
            <div className="p-6 border-b border-surface-border bg-surface-hover">
              <h2 className="text-xl font-Jost-Semibold text-text-primary">Professional Overview & Identity</h2>
            </div>
            <div className="p-8 grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div>
                  <label className="text-xs uppercase tracking-wider text-text-faint font-bold">Biography</label>
                  <p className="text-lg text-text-primary leading-relaxed mt-1">{designerRequest.bio}</p>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-text-faint font-bold">Portfolio Link</label>
                  <a href={designerRequest.Portfolio} target="_blank" rel="noopener noreferrer" className="block text-accent text-lg hover:text-accent-hover hover:underline mt-1">{designerRequest.Portfolio}</a>
                </div>

                <p className="text-sm font-Jost-Semibold text-text-primary tracking-wide uppercase">Identity Document: {designerRequest.govtIdType}</p>

              </div>

              <Zoom>
                <img
                  src={designerRequest.govtIdImage}
                  alt="Govt ID"
                  className="w-full h-75 object-contain rounded-xl border border-surface-border"
                />
              </Zoom>

            </div>
          </section>


          <section className="space-y-4">
            <h2 className="text-2xl font-Jost-Semibold px-2 text-text-primary">Educational Qualifications</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {designerRequest.education.map((edu, i) => (
                <div key={i} className="bg-surface p-8 rounded-2xl border border-surface-border flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-3">
                    <span className="bg-surface-hover px-3 py-1 rounded text-xs font-bold text-text-faint">QUALIFICATION {i + 1}</span>
                    <h3 className="text-xl font-Jost-Semibold text-text-primary">{edu.courseName}</h3>
                    <p className="text-text-muted">{edu.institutionName}</p>
                    <p className="text-sm font-medium text-text-faint italic">Graduated: {edu.completionYear}</p>
                  </div>
                  <div className="md:w-48">
                    <Zoom>
                      <img src={edu.certification} className="w-full h-full object-cover rounded-lg border border-surface-border cursor-zoom-in hover:scale-105 transition-transform" alt="Certificate" />
                    </Zoom>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-Jost-Semibold px-2 text-text-primary">Professional Experience</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {designerRequest.workExperience.map((work, i) => (
                <div key={i} className="bg-surface p-8 rounded-2xl border border-surface-border flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-3">
                    <span className="bg-accent-tint px-3 py-1 rounded text-xs font-bold text-accent-tint-text">EXPERIENCE {i + 1}</span>
                    <h3 className="text-xl font-Jost-Semibold text-text-primary">{work.role}</h3>
                    <p className="text-text-muted">{work.companyName}</p>
                    <p className="text-text-faint font-medium">{work.yearsOfExperience} Years of Service</p>
                  </div>
                  <div className="md:w-48">
                    <Zoom>
                      <img src={work.proof} className="w-full h-full object-cover rounded-lg border border-surface-border hover:scale-105 transition-transform" alt="Experience Proof" />
                    </Zoom>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>


      {modalType === 'reject' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-surface border border-surface-border rounded-2xl p-8 animate-in zoom-in duration-200">
            <h2 className="text-4xl font-semibold text-text-primary mb-6 text-center font-Dynalight-Regular">designO</h2>
            <p className="text-center text-lg font-Jost-Semibold text-text-faint mb-6">Rejection Reason</p>

            <form className="space-y-4" onSubmit={handleSubmit(onRejectSubmit)}>
              <div>
                <label className="block text-sm font-Jost-Semibold text-text-primary mb-1">Explain the reason</label>
                <textarea
                  {...register("rejectionReason")}
                  className="auth-input min-h-30 pt-3"
                  placeholder="Tell the designer why their request was rejected..."
                />
                {errors.rejectionReason && <p className="text-sm text-error mt-1">{errors.rejectionReason.message}</p>}
              </div>

              <div className="flex flex-col gap-3 pt-4">
                {!isApprovalLoading ? (<button
                  type="submit"
                  className="auth-button">
                  Confirm & Reject
                </button>) : (
                  <button
                    type="submit"
                    disabled={isApprovalLoading}
                    className="auth-disabled-button">

                    <svg className="mr-2 size-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>

                    Rejecting
                  </button>
                )}
                <button type="button" onClick={() => setModalType(null)} className="text-text-faint hover:text-text-primary text-sm font-medium">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}


      {modalType === 'approve' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-surface border border-surface-border rounded-2xl p-8 animate-in zoom-in duration-200">
            <h2 className="text-4xl font-semibold text-text-primary mb-6 text-center font-Dynalight-Regular">designO</h2>
            <div className="text-center space-y-4">
              <p className="text-xl font-Jost-Semibold text-text-primary">Confirm Approval?</p>
              <p className="text-text-muted">The designer will be notified and granted access to the platform.</p>

              <div className="flex flex-col gap-3 pt-6">
                {!isApprovalLoading ? (<button
                  type="submit"
                  onClick={() => handleApprove()}
                  className="auth-button">
                  Confirm & Approve
                </button>) : (
                  <button
                    type="submit"
                    disabled={isApprovalLoading}
                    className="auth-disabled-button flex items-center justify-center gap-2">

                    <svg className="mr-2 size-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>

                    Approving
                  </button>
                )}
                <button onClick={() => setModalType(null)} className="text-text-faint hover:text-text-primary text-sm font-medium">Go Back</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}