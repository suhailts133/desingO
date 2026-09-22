import { joiResolver } from '@hookform/resolvers/joi';
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form';
import { useEffect, useMemo, type ChangeEvent } from 'react';
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import Select from "react-select";
import type { StylesConfig } from "react-select";
import makeAnimated from "react-select/animated";
import { ImageIcon, Plus, X } from 'lucide-react';
import SubmitButton from '../../../shared/common/SubmitButton';
import { disputeRaiseBodyValidation } from '../../../validations/disputeValidation';
import type { DisputeFormDTO } from '../proposalInterface';
import { selectStyles } from '../../../shared/filter/selectStyle';

const animatedComponents = makeAnimated();

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: DisputeFormDTO) => void;
    isLoading: boolean;
};

type DisputeTypeOption = { value: string; label: string };

const DISPUTE_TYPE_OPTIONS: DisputeTypeOption[] = [
    { value: 'quality', label: 'Quality Issue' },
    { value: 'incomplete', label: 'Incomplete Work' },
    { value: 'delay', label: 'Delay' },
    { value: 'other', label: 'Other' },
];

export default function DisputeForm({ isOpen, onClose, onConfirm, isLoading }: Props) {

    const { register, handleSubmit, control, formState: { errors } } = useForm<DisputeFormDTO>({
        resolver: joiResolver(disputeRaiseBodyValidation),
        mode: 'onBlur',
        defaultValues: { evidence: [] }
    });

    const { fields, append, remove } = useFieldArray({ control, name: "evidence" });
    const watchedEvidence = useWatch({ control, name: "evidence" });

    const evidencePreviews = useMemo(() =>
        (watchedEvidence ?? [])
            .filter(item => item.file && item.file[0])
            .map(item => URL.createObjectURL(item.file[0])),
        [watchedEvidence]);

    useEffect(() => {
        return () => evidencePreviews.forEach(url => URL.revokeObjectURL(url));
    }, [evidencePreviews]);

    if (!isOpen) return null;
    const handleGalleryUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        selectedFiles.forEach(file => append({ file: [file] }));
        e.target.value = "";
    };

    const onSubmit = (data: DisputeFormDTO) => {
        onConfirm(data);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-surface border border-surface-border rounded-2xl p-8 animate-in zoom-in duration-200">
                <h2 className="text-4xl font-semibold text-text-primary mb-6 text-center font-Dynalight-Regular">designO</h2>
                <p className="text-center text-lg font-Jost-Semibold text-text-faint mb-6">Raise a Dispute</p>

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label className="block text-sm font-Jost-Semibold text-text-primary mb-1">Type of Dispute</label>
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    isMulti={false}
                                    options={DISPUTE_TYPE_OPTIONS}
                                    components={animatedComponents}
                                    className="text-sm"
                                    placeholder="Select a type..."
                                    styles={selectStyles as StylesConfig<DisputeTypeOption, false>}
                                />
                            )}
                        />
                        {errors.type && <p className="text-xs text-error mt-1">{errors.type.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-Jost-Semibold text-text-primary mb-1">Reason</label>
                        <textarea
                            {...register("reason")}
                            rows={4}
                            className="auth-input w-full resize-none"
                            placeholder="Describe the issue in detail (min. 10 characters)..."
                        />
                        {errors.reason && <p className="text-xs text-error mt-1">{errors.reason.message}</p>}
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-Jost-Semibold text-text-primary">Evidence</label>

                        {fields.length < 10 && (
                            <>
                                <label
                                    htmlFor="disputeEvidence"
                                    className="flex items-center gap-3 w-full border border-surface-border rounded-lg px-4 py-2 cursor-pointer hover:border-accent transition-colors"
                                >
                                    <div className="bg-surface-hover p-1.5 rounded-md">
                                        <ImageIcon className="h-4 w-4 text-text-faint" />
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-sm text-text-primary font-medium">Upload Evidence</span>
                                        <span className="text-[11px] text-text-faint truncate">
                                            {fields.length > 0 ? `${fields.length} images selected` : "Select one or more images..."}
                                        </span>
                                    </div>
                                    <Plus className="h-5 w-5 text-text-faint ml-auto shrink-0" />
                                </label>

                                <input
                                    type="file"
                                    id="disputeEvidence"
                                    multiple
                                    hidden
                                    onChange={handleGalleryUpload}
                                />
                            </>
                        )}

                        {fields.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-surface-hover rounded-xl border border-dashed border-surface-border">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="relative aspect-square rounded-lg overflow-hidden bg-surface border border-surface-border group">
                                        {evidencePreviews[index] ? (
                                            <>
                                                <Zoom>
                                                    <img
                                                        src={evidencePreviews[index]}
                                                        className="w-full h-full object-fill"
                                                        alt={`evidence-${index}`}
                                                    />
                                                </Zoom>
                                                <button
                                                    type="button"
                                                    onClick={() => remove(index)}
                                                    className="absolute top-1 right-1 z-10 bg-error/90 hover:bg-error text-text-on-accent p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        )}

                        {errors.evidence && (
                            <p className="text-xs text-error mt-1">{errors.evidence.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <SubmitButton type='submit' isLoading={isLoading} label='Submit Dispute' loadingLabel='Submitting' />
                        <button type="button" onClick={onClose} className="text-text-faint hover:text-text-primary text-sm font-medium">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}