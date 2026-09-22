import { joiResolver } from '@hookform/resolvers/joi';
import { useForm, useWatch } from 'react-hook-form';
import { disputeSolutionValidation } from '../../../../validations/disputeValidation';
import type { DisputeSolutionDTO } from '../adminDisputeInterface';
import SubmitButton from '../../../../shared/common/SubmitButton';

type Props = {
  disputeId: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: DisputeSolutionDTO) => void;
  isLoading: boolean
};

const RESOLUTION_TYPE_OPTIONS = [
  { value: "Refund", label: "Refund" },
  { value: "Redo", label: "Request Redo" },
  { value: "Warning", label: "Issue Warning" },
  { value: "Dismissed", label: "Dismiss Dispute" },
  { value: "Full_Refund", label: "Full Refund" },
];

export default function DisputeVerdictModal({ disputeId, isOpen, onClose, onConfirm, isLoading }: Props) {

  const { register, handleSubmit, control, formState: { errors } } = useForm<DisputeSolutionDTO>({
    resolver: joiResolver(disputeSolutionValidation),
    mode: "onBlur",
    defaultValues: { disputeId, resolutionType: "", resolution: "", refundAmount: 0, canTerminate: false }
  });

  const resolutionType = useWatch({ control, name: "resolutionType" })

  if (!isOpen) return null;

  const onVerdictSubmit = async (data: DisputeSolutionDTO) => {
    onConfirm({ ...data, disputeId });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-surface rounded-2xl border border-surface-border p-8 animate-in zoom-in duration-200">
        <h2 className="text-4xl font-semibold text-text-primary mb-6 text-center font-Dynalight-Regular">designO</h2>
        <p className="text-center text-lg font-Jost-Semibold text-text-muted mb-6">Resolve Dispute</p>

        <form className="space-y-4" onSubmit={handleSubmit(onVerdictSubmit)}>
          <div>
            <label className="block text-sm font-Jost-Semibold text-text-primary mb-1">Resolution Type</label>
            <select 
              {...register("resolutionType")} 
              className="w-full bg-surface-hover border border-surface-border text-text-primary placeholder-text-faint focus:border-accent focus:ring-1 focus:ring-accent rounded-lg p-2.5 outline-none transition-colors"
            >
              <option value="">Select a resolution...</option>
              {RESOLUTION_TYPE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {errors.resolutionType && <p className="text-sm text-error mt-1">{errors.resolutionType.message}</p>}
          </div>

          {resolutionType === "Refund" && (
            <div>
              <label className="block text-sm font-Jost-Semibold text-text-primary mb-1">Refund Amount</label>
              <input
                type="number"
                step="0.01"
                {...register("refundAmount", { valueAsNumber: true })}
                className="w-full bg-surface-hover border border-surface-border text-text-primary placeholder-text-faint focus:border-accent focus:ring-1 focus:ring-accent rounded-lg p-2.5 outline-none transition-colors"
                placeholder="0.00"
              />
              {errors.refundAmount && <p className="text-sm text-error mt-1">{errors.refundAmount.message}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-Jost-Semibold text-text-primary mb-1">Explain the resolution</label>
            <textarea
              {...register("resolution")}
              className="min-h-30 pt-3 w-full bg-surface-hover border border-surface-border text-text-primary placeholder-text-faint focus:border-accent focus:ring-1 focus:ring-accent rounded-lg p-2.5 outline-none transition-colors"
              placeholder="Describe the verdict and reasoning for both parties..."
            />
            {errors.resolution && <p className="text-sm text-error mt-1">{errors.resolution.message}</p>}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="canTerminate"
              {...register("canTerminate")}
              className="w-4 h-4 bg-surface-hover border-surface-border text-accent focus:ring-accent rounded cursor-pointer"
            />
            <label htmlFor="canTerminate" className="text-sm font-Jost-Semibold text-text-primary cursor-pointer select-none">
              Terminate Contract
            </label>
          </div>
          {errors.canTerminate && <p className="text-sm text-error mt-1">{errors.canTerminate.message}</p>}

          <div className="flex flex-col gap-3 pt-4">
            <SubmitButton type='submit' isLoading={isLoading} label='Confirm Verdict' loadingLabel='Submitting' />
            <button type="button" onClick={onClose} className="text-text-muted hover:text-text-primary text-sm font-medium transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}