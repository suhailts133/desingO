import { joiResolver } from '@hookform/resolvers/joi';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useEffect, useState, type ChangeEvent } from 'react';
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { ImageIcon, Plus, X } from 'lucide-react';
import SubmitButton from '../../../shared/common/SubmitButton';
import { disputeRaiseBodyValidation } from '../../../validations/disputeValidation';
import type { DisputeFormDTO } from '../proposalInterface';

const animatedComponents = makeAnimated();

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: DisputeFormDTO) => void;
    isLoading: boolean;
};

const DISPUTE_TYPE_OPTIONS = [
    { value: 'quality', label: 'Quality Issue' },
    { value: 'incomplete', label: 'Incomplete Work' },
    { value: 'delay', label: 'Delay' },
    { value: 'other', label: 'Other' },
];

export default function DisputeForm({ isOpen, onClose, onConfirm ,isLoading}: Props) {
    if (!isOpen) return null;

    const [evidencePreviews, setEvidencePreviews] = useState<string[]>([]);

    const { register, handleSubmit, control, watch, formState: { errors } } = useForm<DisputeFormDTO>({
        resolver: joiResolver(disputeRaiseBodyValidation),
        mode: 'onBlur',
        defaultValues: { evidence: [] }
    });

    const { fields, append, remove } = useFieldArray({ control, name: "evidence" });
    const watchedEvidence = watch("evidence");

    useEffect(() => {
        if (!watchedEvidence) return;
        const previews = watchedEvidence
            .filter(item => item.file && item.file[0])
            .map(item => URL.createObjectURL(item.file[0]));
        setEvidencePreviews(previews);
        return () => previews.forEach(url => URL.revokeObjectURL(url));
    }, [watchedEvidence]);

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
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-in zoom-in duration-200">
                <h2 className="text-4xl font-semibold text-soft-black mb-6 text-center font-Dynalight-Regular">designO</h2>
                <p className="text-center text-lg font-Jost-Semibold text-gray-500 mb-6">Raise a Dispute</p>

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Type of Dispute</label>
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} isMulti={false} options={DISPUTE_TYPE_OPTIONS} components={animatedComponents} className="text-sm" placeholder="Select a type..." />
                            )}
                        />
                        {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Reason</label>
                        <textarea
                            {...register("reason")}
                            rows={4}
                            className="auth-input w-full resize-none"
                            placeholder="Describe the issue in detail (min. 10 characters)..."
                        />
                        {errors.reason && <p className="text-xs text-red-500 mt-1">{errors.reason.message}</p>}
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-Jost-Semibold text-gray-700">Evidence</label>

                        {fields.length < 10 && (
                            <>
                                <label
                                    htmlFor="disputeEvidence"
                                    className="flex items-center gap-3 w-full border border-gray-300 rounded-lg px-4 py-2 cursor-pointer hover:border-primary transition-colors"
                                >
                                    <div className="bg-gray-100 p-1.5 rounded-md">
                                        <ImageIcon className="h-4 w-4 text-gray-500" />
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-sm text-gray-700 font-medium">Upload Evidence</span>
                                        <span className="text-[11px] text-gray-400 truncate">
                                            {fields.length > 0 ? `${fields.length} images selected` : "Select one or more images..."}
                                        </span>
                                    </div>
                                    <Plus className="h-5 w-5 text-gray-400 ml-auto shrink-0" />
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
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="relative aspect-square rounded-lg overflow-hidden bg-white shadow-sm group">
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
                                                    className="absolute top-1 right-1 z-10 bg-red-500/90 hover:bg-red-600 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
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
                            <p className="text-xs text-red-500 mt-1">{errors.evidence.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <SubmitButton type='submit' isLoading={isLoading} label='Submit Dispute' loadingLabel='Submitting' />
                        <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-800 text-sm font-medium">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}