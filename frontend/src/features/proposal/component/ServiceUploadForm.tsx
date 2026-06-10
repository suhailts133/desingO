import { joiResolver } from '@hookform/resolvers/joi';
import { useForm, useFieldArray } from 'react-hook-form';
import type { IServiceResult } from '../proposalInterface';
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import SubmitButton from '../../../shared/common/SubmitButton';
import { serviceResultUploadValidatin } from '../../../validations/proposalValidation';
import { ImageIcon, Plus, X } from 'lucide-react';
import { useEffect, useState, type ChangeEvent } from 'react';

type Props = {
    sourceId: string;
    serviceNumber: number;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: IServiceResult) => void; 
    isLoading: boolean;
};

export default function ServiceUploadForm({ onClose, isOpen, onConfirm, isLoading }: Props) {
    if (!isOpen) return null;

    const [outputPreviews, setOutputPreviews] = useState<string[]>([]);

    const {  handleSubmit, control, watch, formState: { errors } } = useForm<IServiceResult>({
        resolver: joiResolver(serviceResultUploadValidatin),
        mode: 'onBlur',
        defaultValues: { serviceResult: [] }
    });

    const { fields, append, remove } = useFieldArray({ control, name: "serviceResult" });

    const watchedResults = watch("serviceResult");

    useEffect(() => {
        if (!watchedResults) return;

        const previews = watchedResults
            .filter(item => item.file && item.file[0])
            .map(item => URL.createObjectURL(item.file[0]));

        setOutputPreviews(previews);

        return () => previews.forEach(url => URL.revokeObjectURL(url));
    }, [watchedResults]);

    const handleGalleryUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        selectedFiles.forEach(file => {
            append({ file: [file] });
        });
        e.target.value = "";
    };

    const onSubmit = (data: IServiceResult) => { 
        onConfirm(data);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-in zoom-in duration-200">
                <h2 className="text-4xl font-semibold text-soft-black mb-6 text-center font-Dynalight-Regular">designO</h2>
                <p className="text-center text-lg font-Jost-Semibold text-gray-500 mb-6">Upload Outputs</p>

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <label className="block text-sm font-Jost-Semibold text-gray-700">Outputs</label>

                        {fields.length < 10 && (
                            <>
                                <label
                                    htmlFor="serviceOutput" 
                                    className="flex items-center gap-3 w-full border border-gray-300 rounded-lg px-4 py-2 cursor-pointer hover:border-primary transition-colors"
                                >
                                    <div className="bg-gray-100 p-1.5 rounded-md">
                                        <ImageIcon className="h-4 w-4 text-gray-500" />
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-sm text-gray-700 font-medium">Upload Output</span>
                                        <span className="text-[11px] text-gray-400 truncate">
                                            {fields.length > 0 ? `${fields.length} images selected` : "Select one or more images..."}
                                        </span>
                                    </div>
                                    <Plus className="h-5 w-5 text-gray-400 ml-auto shrink-0" />
                                </label>

                                <input
                                    type="file"
                                    id="serviceOutput" 
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
                                        {outputPreviews[index] ? (
                                            <>
                                                <Zoom>
                                                    <img
                                                        src={outputPreviews[index]}
                                                        className="w-full h-full object-fill"
                                                        alt={`service-result-${index}`}
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

                        {errors.serviceResult && (
                            <p className="text-xs text-red-500 mt-1">{errors.serviceResult.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <SubmitButton type='submit' isLoading={isLoading} label='Submit' loadingLabel='Submitting' />
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
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