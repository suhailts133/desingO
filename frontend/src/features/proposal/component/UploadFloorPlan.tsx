import { joiResolver } from '@hookform/resolvers/joi';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { type ChangeEvent } from 'react';
import { FileText, Plus, X } from 'lucide-react';
import SubmitButton from '../../../shared/common/SubmitButton';
import type { FloorPlans } from '../proposalInterface';
import { floorPlanValidation } from '../../../validations/floorPlanValidation';


type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: FloorPlans) => void;
    isLoading: boolean;
    title: "upload" | "update"
};

export default function UploadFloorPlan({ title, isOpen, onClose, onConfirm, isLoading }: Props) {

    const { handleSubmit, control, formState: { errors } } = useForm<FloorPlans>({
        resolver: joiResolver(floorPlanValidation),
        mode: 'onBlur',
        defaultValues: { floorPlans: [] }
    });

    const { fields, append, remove } = useFieldArray({ control, name: "floorPlans" });
    const watchedFloorPlans = useWatch({ control, name: "floorPlans" });

    if (!isOpen) return null;
    const handlePdfUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        const remainingSlots = 10 - fields.length;
        const filesToAdd = selectedFiles.slice(0, remainingSlots);

        filesToAdd.forEach(file => append({ file: [file] }));
        e.target.value = "";
    };

    const onSubmit = (data: FloorPlans) => {
        onConfirm(data);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-in zoom-in duration-200">
                <h2 className="text-4xl font-semibold text-soft-black mb-6 text-center font-Dynalight-Regular">designO</h2>
                <p className="text-center text-lg font-Jost-Semibold text-gray-500 mb-6">{title === "upload" ? "Upload" : "Update"} Floor Plans</p>

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-3">
                        <label className="block text-sm font-Jost-Semibold text-gray-700">Floor Plan Documents (PDF)</label>

                        {fields.length < 10 && (
                            <>
                                <label
                                    htmlFor="floorPlanUpload"
                                    className="flex items-center gap-3 w-full border border-gray-300 rounded-lg px-4 py-3 cursor-pointer hover:border-primary transition-colors"
                                >
                                    <div className="bg-red-50 p-2 rounded-md">
                                        <FileText className="h-5 w-5 text-red-500" />
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-sm text-gray-700 font-medium">Select PDF Files</span>
                                        <span className="text-[11px] text-gray-400 truncate">
                                            {fields.length > 0 ? `${fields.length}/10 PDFs attached` : "Upload up to 10 PDF documents"}
                                        </span>
                                    </div>
                                    <Plus className="h-5 w-5 text-gray-400 ml-auto shrink-0" />
                                </label>

                                <input
                                    type="file"
                                    id="floorPlanUpload"
                                    accept="application/pdf"
                                    multiple
                                    hidden
                                    onChange={handlePdfUpload}
                                />
                            </>
                        )}

                        {fields.length > 0 && (
                            <div className="max-h-56 overflow-y-auto space-y-2 p-3 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                {fields.map((field, index) => {
                                    const fileItem = watchedFloorPlans?.[index]?.file?.[0];
                                    const fileName = fileItem?.name || `Floor_Plan_${index + 1}.pdf`;
                                    const fileSize = fileItem ? `${(fileItem.size / (1024 * 1024)).toFixed(2)} MB` : '';

                                    return (
                                        <div
                                            key={field.id}
                                            className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-gray-100 shadow-sm"
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                                <FileText className="h-5 w-5 text-red-500 shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="text-xs font-medium text-gray-700 truncate" title={fileName}>
                                                        {fileName}
                                                    </p>
                                                    {fileSize && (
                                                        <span className="text-xxs text-gray-400">{fileSize}</span>
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors shrink-0"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {errors.floorPlans && (
                            <p className="text-xs text-red-500 mt-1">{errors.floorPlans.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <SubmitButton
                            type="submit"
                            isLoading={isLoading}
                            label={title === "upload" ? "Upload Plans" : "Update plans"}
                            loadingLabel="Submiting..."
                        />
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-800 text-sm font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}