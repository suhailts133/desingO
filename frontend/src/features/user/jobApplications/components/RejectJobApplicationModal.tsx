import { joiResolver } from '@hookform/resolvers/joi';
import { useForm } from 'react-hook-form';
import type { RejectionPayload } from '../jobApplicationInterFace';
import { rejectionReasonValidaiton } from '../../../../validations/jobApplicationValidation';

type props = {
    isOpen: boolean
    onClose: () => void
    onConfirm: (data: RejectionPayload) => void,
    isLoading?: boolean
}

export default function RejectJobApplicationModal({ onClose, isOpen, onConfirm, isLoading }: props) {

    const { register, handleSubmit, formState: { errors } } = useForm<RejectionPayload>({
        resolver: joiResolver(rejectionReasonValidaiton),
        mode: "onBlur"
    });
    
    if (!isOpen) {
        return null
    }
    const onRejectSubmit = async (data: RejectionPayload) => {
        onConfirm(data)

    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/60 backdrop-blur-sm">
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
                        {!isLoading ? (<button
                            type="submit"

                            className="auth-button">
                            Confirm & Reject
                        </button>) : (
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="auth-disabled-button">

                                <svg className="mr-2 size-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>

                                Rejecting
                            </button>
                        )}
                        <button type="button" onClick={onClose} className="text-text-faint hover:text-text-primary text-sm font-medium">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}