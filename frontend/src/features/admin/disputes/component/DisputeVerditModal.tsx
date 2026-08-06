import { joiResolver } from '@hookform/resolvers/joi';
import { useForm } from 'react-hook-form';
import { disputeSolutionValidation } from '../../../../validations/disputeValidation';
import type { DisputeSolutionDTO } from '../adminDisputeInterface';
import SubmitButton from '../../../../shared/common/SubmitButton';


type Props = {
    disputeId: string;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: DisputeSolutionDTO) => void;
    isLoading:boolean

};

const RESOLUTION_TYPE_OPTIONS = [
    { value: "Refund", label: "Refund" },
    { value: "Redo", label: "Request Redo" },
    { value: "Warning", label: "Issue Warning" },
    { value: "Dismissed", label: "Dismiss Dispute" },
    { value: "Full_Refund", label: "Full Refund" },

];

export default function DisputeVerdictModal({ disputeId, isOpen, onClose, onConfirm,isLoading }: Props) {
    if (!isOpen) return null;

    const { register, handleSubmit, watch, formState: { errors } } = useForm<DisputeSolutionDTO>({
        resolver: joiResolver(disputeSolutionValidation),
        mode: "onBlur",
        defaultValues: { disputeId, resolutionType: "", resolution: "", refundAmount: 0 }
    });

    const resolutionType = watch("resolutionType");

    const onVerdictSubmit = async (data: DisputeSolutionDTO) => {
        onConfirm({ ...data, disputeId });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-in zoom-in duration-200">
                <h2 className="text-4xl font-semibold text-soft-black mb-6 text-center font-Dynalight-Regular">designO</h2>
                <p className="text-center text-lg font-Jost-Semibold text-gray-500 mb-6">Resolve Dispute</p>

                <form className="space-y-4" onSubmit={handleSubmit(onVerdictSubmit)}>
                    <div>
                        <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Resolution Type</label>
                        <select {...register("resolutionType")} className="auth-input w-full">
                            <option value="">Select a resolution...</option>
                            {RESOLUTION_TYPE_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        {errors.resolutionType && <p className="text-sm text-red-500 mt-1">{errors.resolutionType.message}</p>}
                    </div>

                    {resolutionType === "Refund" && (
                        <div>
                            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Refund Amount</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register("refundAmount", { valueAsNumber: true })}
                                className="auth-input w-full"
                                placeholder="0.00"
                            />
                            {errors.refundAmount && <p className="text-sm text-red-500 mt-1">{errors.refundAmount.message}</p>}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Explain the resolution</label>
                        <textarea
                            {...register("resolution")}
                            className="auth-input min-h-30 pt-3"
                            placeholder="Describe the verdict and reasoning for both parties..."
                        />
                        {errors.resolution && <p className="text-sm text-red-500 mt-1">{errors.resolution.message}</p>}
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <SubmitButton type='submit' isLoading={isLoading} label='Confirm Verdict' loadingLabel='Submitting' />
                    
                        <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-800 text-sm font-medium">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}