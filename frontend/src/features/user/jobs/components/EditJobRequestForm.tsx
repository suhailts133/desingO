import { useEffect, useState, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { AlertCircle, CheckCircle2, ImageIcon, Plus, X } from 'lucide-react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

import { useGetAJobRequestDetailQuery } from '../jobEndpoints';
import { useEditJobRequest } from '../hooks/useEditJobRequest';
import { editJobRequestValidation } from '../../../../validations/customerValidation';
import type { EditJobRequestFields, EditRoomMeasurement } from '../jobInterface';
import type { SelectOption } from '../../../designer/designs/designInterface';

import { STYLE_OPTIONS, PROPERTY_OPTIONS, SPACE_OPTIONS, SERVICE_OPTIONS } from '../../../designer/designs/designData';
import { TIMELINE_OPTIONS, UNIT_OPTIONS } from '../jobData';
import { INDIAN_STATES } from '../../../designer/designerVerification/indianStates';

// Reusable Components
import { InputField } from '../../../../shared/form/InputField';
import { TextAreaField } from '../../../../shared/form/TextAreaField';
import { ReactSelectField } from '../../../../shared/form/ReactSelectField';
import { SelectField } from '../../../../shared/form/SelectField';
import RoomMeasurementsSection from '../components/RoomMeasurementsSection';
import SubmitButton from '../../../../shared/common/SubmitButton';
import { useHandleResponse } from '../../../../helpers/useHandleResponse';

type ExistingReferenceItem = { type: 'existing'; path: string; filename: string };
type NewReferenceItem = { type: 'new'; file: File; preview: string };
type ReferenceItem = ExistingReferenceItem | NewReferenceItem;

const labelToOption = (label: string, options: SelectOption[]): SelectOption =>
    options.find(opt => opt.label === label) ?? { value: label, label };

const labelsToOptions = (labels: string[], options: SelectOption[]): SelectOption[] =>
    labels.map(label => labelToOption(label, options));

export default function EditJobRequestForm() {
    const { id } = useParams<{ id: string }>();

    const { data, isLoading: isFetching, error } = useGetAJobRequestDetailQuery(id!, { skip: !id });
    const { handleUpdation, isEditing } = useEditJobRequest();

    
    const [referenceImages, setReferenceImages] = useState<ReferenceItem[]>([]);

    const methods = useForm<EditJobRequestFields>({ 
        resolver: joiResolver(editJobRequestValidation),
        defaultValues: { rooms: [] }
    });

    const { register, control, handleSubmit, reset, formState: { errors } } = methods;
    const defaultData = data?.data;

    useEffect(() => {
        if (!defaultData) return;
        reset({
            projectTitle: defaultData.projectTitle,
            description: defaultData.description,
            city: defaultData.city,
            district: defaultData.district,
            state: defaultData.state,
            phone: defaultData.phone,
            minBudget: Number(defaultData.minBudget),
            maxBudget: Number(defaultData.maxBudget),
            designStyles: labelsToOptions(defaultData.designStyles, STYLE_OPTIONS),
            services: labelsToOptions(defaultData.services, SERVICE_OPTIONS),
            propertyType: labelToOption(defaultData.propertyType, PROPERTY_OPTIONS),
            timeline: labelToOption(defaultData.timeline, TIMELINE_OPTIONS),
            rooms: defaultData.rooms.map((room: EditRoomMeasurement) => ({
                spaceType: labelToOption(room.spaceType, SPACE_OPTIONS),
                length: room.length,
                width: room.width,
                ceilingHeight: room.ceilingHeight ?? '',
                unit: labelToOption(room.unit, UNIT_OPTIONS),
                notes: room.notes ?? '',
            })),
        });
    }, [defaultData, reset]);

  
    useEffect(() => {
        if (!defaultData) return;
        setReferenceImages(
            (defaultData.referenceImages ?? []).map((img: any) => ({
                type: 'existing' as const,
                path: img.path,
                filename: img.filename,
            }))
        );
    }, [defaultData]);

    useEffect(() => {
        return () => {
            referenceImages.forEach(item => {
                if (item.type === 'new') URL.revokeObjectURL(item.preview);
            });
        };
    }, [referenceImages]); 
    const handleResponse = useHandleResponse()
    

    const handleReferenceUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const slotsLeft = 10 - referenceImages.length;
        setReferenceImages(prev => [
            ...prev,
            ...files.slice(0, slotsLeft).map(file => ({
                type: 'new' as const,
                file,
                preview: URL.createObjectURL(file),
            })),
        ]);
        e.target.value = '';
    };

    const handleRemoveReference = (index: number) => {
        setReferenceImages(prev => {
            const item = prev[index];
            if (item.type === 'new') URL.revokeObjectURL(item.preview);
            return prev.filter((_, i) => i !== index);
        });
    };


    const onSubmit = async (fields: EditJobRequestFields) => {
        const formData = new FormData();

        formData.append('projectTitle', fields.projectTitle);
        formData.append('description', fields.description);
        formData.append('city', fields.city);
        formData.append('district', fields.district);
        formData.append('state', fields.state);
        formData.append('phone', fields.phone);
        formData.append('minBudget', String(fields.minBudget));
        formData.append('maxBudget', String(fields.maxBudget));
        formData.append('propertyType', fields.propertyType.label);
        formData.append('timeline', fields.timeline.label);

        fields.designStyles.forEach(({ label }, i) => formData.append(`designStyles[${i}]`, label));
        fields.services.forEach(({ label }, i) => formData.append(`services[${i}]`, label));

        fields.rooms.forEach((room, i) => {
            formData.append(`rooms[${i}][spaceType]`, room.spaceType.label);
            formData.append(`rooms[${i}][length]`, String(room.length));
            formData.append(`rooms[${i}][width]`, String(room.width));
            formData.append(`rooms[${i}][unit]`, room.unit.label);
            if (room.ceilingHeight) formData.append(`rooms[${i}][ceilingHeight]`, String(room.ceilingHeight));
            if (room.notes) formData.append(`rooms[${i}][notes]`, room.notes);
        });

        const keptImages: { path: string; filename: string }[] = [];
        referenceImages.forEach(item => {
            if (item.type === 'existing') {
                keptImages.push({ path: item.path, filename: item.filename });
            } else {
                formData.append('referenceImages', item.file);
            }
        });

        keptImages.forEach((img, i) => {
            formData.append(`oldReferences[${i}][path]`, img.path);
            formData.append(`oldReferences[${i}][filename]`, img.filename);
        });

        const result = await handleUpdation({ formdata: formData, id: id! });
        handleResponse(result.success, "Update successfull", result.message, "/customer/jobs")
    };

    if (isFetching) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-gray-400">
                    <svg className="size-8 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <p className="text-sm">Loading job request...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-sm text-red-500 flex items-center gap-2">
                    <AlertCircle size={16} /> Failed to load job request.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex justify-center items-start py-10 px-4">
            <div className="w-full max-w-2xl bg-white/50 backdrop-blur-2xl shadow-blush/30 rounded-xl shadow-2xl p-8">

                <h2 className="text-4xl font-semibold text-center font-Dynalight-Regular mb-2 text-soft-black">designO</h2>
                <p className="text-center text-gray-400 font-Jost-Semibold mb-8 text-sm uppercase tracking-widest">Edit Job Request</p>

                {/* FormProvider added to support RoomMeasurementsSection */}
                <FormProvider {...methods}>
                    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                        
                        {/* CLEANED UP BASIC INPUTS */}
                        <InputField label="Project Title" placeholder="e.g. Modern Living Room Redesign" registration={register('projectTitle')} error={errors.projectTitle?.message} />
                        <TextAreaField label="Description" placeholder="Describe your vision, requirements, or anything the designer should know..." registration={register('description')} error={errors.description?.message} />
                        <ReactSelectField label="Property Type" name="propertyType" control={control} placeholder="Select property type..." options={PROPERTY_OPTIONS} error={errors.propertyType?.message} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ReactSelectField label="Design Styles" name="designStyles" isMulti control={control} placeholder="Select preferred styles..." options={STYLE_OPTIONS} error={errors.designStyles?.message} />
                            <ReactSelectField label="Services" name="services" isMulti control={control} options={SERVICE_OPTIONS} error={errors.services?.message} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <SelectField label="State" registration={register('state')} options={INDIAN_STATES} error={errors.state?.message} />
                            <InputField label="District" placeholder="e.g. Ernakulam" registration={register('district')} error={errors.district?.message} />
                            <InputField label="City" placeholder="e.g. Kochi" registration={register('city')} error={errors.city?.message} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Phone" placeholder="+91 XXXXX XXXXX" registration={register('phone')} error={errors.phone?.message} />
                            <ReactSelectField label="Project Timeline" name="timeline" control={control} placeholder="Select a timeline..." options={TIMELINE_OPTIONS} error={errors.timeline?.message} />
                            <InputField type="number" label="Minimum Budget (₹)" placeholder="e.g. 50000" registration={register('minBudget', { valueAsNumber: true })} error={errors.minBudget?.message} />
                            <InputField type="number" label="Maximum Budget (₹)" placeholder="e.g. 200000" registration={register('maxBudget', { valueAsNumber: true })} error={errors.maxBudget?.message} />
                        </div>

                        <hr className="my-6 border-gray-100" />

                        {/* REUSABLE ROOMS COMPONENT */}
                        <RoomMeasurementsSection />

                        {/* 100% UNTOUCHED IMAGE COMPONENT UI */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-Jost-Semibold text-gray-700">
                                    Reference Images <span className="text-gray-400 font-normal">(Optional)</span>
                                </label>
                                <span className="text-xs text-gray-400">{referenceImages.length} / 10</span>
                            </div>

                            {referenceImages.length < 10 && (
                                <>
                                    <label htmlFor="referenceEdit" className="flex items-center gap-3 w-full border border-gray-300 rounded-lg px-4 py-2 cursor-pointer hover:border-primary transition-colors">
                                        <div className="bg-gray-100 p-1.5 rounded-md">
                                            <ImageIcon className="h-4 w-4 text-gray-500" />
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-sm text-gray-700 font-medium">Add Reference Photos</span>
                                            <span className="text-[11px] text-gray-400 truncate">
                                                {referenceImages.length > 0 ? `${referenceImages.length} selected — up to ${10 - referenceImages.length} more` : 'Select one or more images...'}
                                            </span>
                                        </div>
                                        <Plus className="h-5 w-5 text-gray-400 ml-auto shrink-0" />
                                    </label>
                                    <input type="file" id="referenceEdit" multiple hidden accept="image/*" onChange={handleReferenceUpload} />
                                </>
                            )}

                            {referenceImages.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    {referenceImages.map((item, index) => {
                                        const src = item.type === 'existing' ? item.path : item.preview;
                                        const isNew = item.type === 'new';
                                        return (
                                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-white shadow-sm group">
                                                <Zoom>
                                                    <img src={src} className="w-full h-full object-cover" alt={`Reference ${index + 1}`} />
                                                </Zoom>
                                                <span className={`absolute top-1 left-1 z-10 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${isNew ? 'bg-green-500' : 'bg-gray-500/70'}`}>
                                                    {isNew ? 'New' : 'Saved'}
                                                </span>
                                                <button type="button" onClick={() => handleRemoveReference(index)} className="absolute top-1 right-1 z-10 bg-red-500/90 hover:bg-red-600 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                
                      <SubmitButton isLoading={isEditing} label="Upate Job Request" loadingLabel="updating" type="submit" />
                    </form>
                </FormProvider>

              
            </div>
        </div>
    );
}