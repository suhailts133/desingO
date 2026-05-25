import { useNavigate, useParams } from 'react-router-dom';
import { useGetAJobRequestDetailQuery } from '../jobEndpoints';
import { useEffect, useState, type ChangeEvent } from 'react';
import type { SelectOption } from '../../../designer/designs/designInterface';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { editJobRequestValidation } from '../../../../validations/customerValidation';
import type { EditJobRequestFields, EditRoomMeasurement } from '../jobInterface';
import { STYLE_OPTIONS, PROPERTY_OPTIONS, SPACE_OPTIONS, SERVICE_OPTIONS } from '../../../designer/designs/designData';
import { TIMELINE_OPTIONS, UNIT_OPTIONS } from '../jobData';
import { INDIAN_STATES } from '../../../designer/designerVerification/indianStates';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { AlertCircle, CheckCircle2, ImageIcon, Plus, Ruler, Trash, X } from 'lucide-react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { useEditJobRequest } from '../hooks/useEditJobRequest';

const animatedComponents = makeAnimated();



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
    const { handleUpdation, isEditing, updateError, updateSuccess } = useEditJobRequest();


    const [referenceImages, setReferenceImages] = useState<ReferenceItem[]>([]);


    const { register, control, handleSubmit, reset, formState: { errors }, } = useForm<EditJobRequestFields>({ resolver: joiResolver(editJobRequestValidation) });

    const {
        fields: roomFields,
        append: roomAppend,
        remove: roomRemove,
    } = useFieldArray({ control, name: 'rooms' });

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
    }, []);

    const navigate = useNavigate()

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


    const addRoom = () => {
        roomAppend({
            spaceType: SPACE_OPTIONS[0],
            length: '',
            width: '',
            ceilingHeight: '',
            unit: { value: 'ft', label: 'ft' },
            notes: '',
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

        fields.designStyles.forEach(({ label }, i) =>
            formData.append(`designStyles[${i}]`, label)
        );
        fields.services.forEach(({ label }, i) =>
            formData.append(`services[${i}]`, label)
        );

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


        await handleUpdation({ formdata: formData, id: id! });

    };

return (
        <div className="min-h-screen w-full flex justify-center items-start py-10 px-4">
            <div className="w-full max-w-2xl bg-white/50 backdrop-blur-2xl shadow-blush/30 rounded-xl shadow-2xl p-8">

                <h2 className="text-4xl font-semibold text-center font-Dynalight-Regular mb-2 text-soft-black">designO</h2>
                <p className="text-center text-gray-400 font-Jost-Semibold mb-8 text-sm uppercase tracking-widest">Edit Job Request</p>

                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

                    {/* Project Title */}
                    <div>
                        <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Project Title</label>
                        <input
                            {...register('projectTitle')}
                            className="auth-input w-full"
                            placeholder="e.g. Modern Living Room Redesign"
                        />
                        {errors.projectTitle && <p className="text-xs text-red-500 mt-1">{errors.projectTitle.message}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Description</label>
                        <textarea
                            {...register('description')}
                            rows={3}
                            className="auth-input w-full"
                            placeholder="Describe your vision, requirements, or anything the designer should know..."
                        />
                        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
                    </div>

                    {/* Property Type */}
                    <div>
                        <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Property Type</label>
                        <Controller
                            name="propertyType"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} isMulti={false} options={PROPERTY_OPTIONS} components={animatedComponents} className="text-sm" placeholder="Select property type..." />
                            )}
                        />
                        {errors.propertyType && <p className="text-xs text-red-500 mt-1">{errors.propertyType.message}</p>}
                    </div>

                    {/* Design Styles & Services */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Design Styles</label>
                            <Controller
                                name="designStyles"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} isMulti options={STYLE_OPTIONS} components={animatedComponents} className="text-sm" placeholder="Select preferred styles..." />
                                )}
                            />
                            {errors.designStyles && <p className="text-xs text-red-500 mt-1">{errors.designStyles.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Services</label>
                            <Controller
                                name="services"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} isMulti options={SERVICE_OPTIONS} components={animatedComponents} className="text-sm" />
                                )}
                            />
                            {errors.services && <p className="text-xs text-red-500 mt-1">{errors.services.message}</p>}
                        </div>
                    </div>

                    {/* State, District, City */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">State</label>
                            <select {...register('state')} className="auth-input">
                                <option value="" disabled>Select your state</option>
                                {INDIAN_STATES.map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                            {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">District</label>
                            <input {...register('district')} className="auth-input w-full" placeholder="e.g. Ernakulam" />
                            {errors.district && <p className="text-xs text-red-500 mt-1">{errors.district.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">City</label>
                            <input {...register('city')} className="auth-input w-full" placeholder="e.g. Kochi" />
                            {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
                        </div>
                    </div>

                    {/* Phone & Timeline */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Phone</label>
                            <input {...register('phone')} className="auth-input w-full" placeholder="+91 XXXXX XXXXX" />
                            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Project Timeline</label>
                            <Controller
                                name="timeline"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} isMulti={false} options={TIMELINE_OPTIONS} components={animatedComponents} className="text-sm" placeholder="Select a timeline..." />
                                )}
                            />
                            {errors.timeline && <p className="text-xs text-red-500 mt-1">{errors.timeline.message}</p>}
                        </div>
                    </div>

                    {/* Budget */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Minimum Budget (₹)</label>
                            <input type="number" {...register('minBudget', { valueAsNumber: true })} className="auth-input w-full" placeholder="e.g. 50000" />
                            {errors.minBudget && <p className="text-xs text-red-500 mt-1">{errors.minBudget.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Maximum Budget (₹)</label>
                            <input type="number" {...register('maxBudget', { valueAsNumber: true })} className="auth-input w-full" placeholder="e.g. 200000" />
                            {errors.maxBudget && <p className="text-xs text-red-500 mt-1">{errors.maxBudget.message}</p>}
                        </div>
                    </div>

                    <hr className="my-6 border-gray-100" />

                    {/* Rooms */}
                    <div className="space-y-4">
                        <label className="block text-sm font-Jost-Semibold text-gray-700">Room Measurements</label>

                        <button
                            type="button"
                            onClick={addRoom}
                            className="flex items-center gap-3 w-full border border-gray-300 rounded-lg px-4 py-2 cursor-pointer hover:border-primary transition-colors"
                        >
                            <div className="bg-gray-100 p-1.5 rounded-md">
                                <Ruler className="h-4 w-4 text-gray-500" />
                            </div>
                            <div className="flex flex-col overflow-hidden text-left">
                                <span className="text-sm text-gray-700 font-medium">Add a Room</span>
                                <span className="text-[11px] text-gray-400">
                                    {roomFields.length > 0 ? `${roomFields.length} room${roomFields.length > 1 ? 's' : ''} added` : 'Select a space and enter measurements...'}
                                </span>
                            </div>
                            <Plus className="h-5 w-5 text-gray-400 ml-auto shrink-0" />
                        </button>

                        {errors.rooms && <p className="text-xs text-red-500 mt-1">{errors.rooms.message}</p>}

                        {roomFields.length > 0 && (
                            <div className="space-y-4">
                                {roomFields.map((field, index) => (
                                    <div key={field.id} className="relative p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 space-y-3">
                                        <button
                                            type="button"
                                            onClick={() => roomRemove(index)}
                                            className="absolute top-3 right-3 text-white p-1"
                                        >
                                            <Trash size={12} className="text-error" />
                                        </button>

                                        <div>
                                            <label className="block text-xs font-Jost-Semibold text-gray-600 mb-1">Space Type</label>
                                            <Controller
                                                name={`rooms.${index}.spaceType`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Select {...field} isMulti={false} options={SPACE_OPTIONS} components={animatedComponents} className="text-sm" placeholder="e.g. Living Room" />
                                                )}
                                            />
                                            {errors.rooms?.[index]?.spaceType && (
                                                <p className="text-xs text-red-500 mt-1">{errors.rooms[index].spaceType?.message}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            <div>
                                                <label className="block text-xs font-Jost-Semibold text-gray-600 mb-1">Length</label>
                                                <input type="number" {...register(`rooms.${index}.length`)} className="auth-input w-full" placeholder="0" />
                                                {errors.rooms?.[index]?.length && (
                                                    <p className="text-xs text-red-500 mt-1">{errors.rooms[index].length?.message}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-Jost-Semibold text-gray-600 mb-1">Width</label>
                                                <input type="number" {...register(`rooms.${index}.width`)} className="auth-input w-full" placeholder="0" />
                                                {errors.rooms?.[index]?.width && (
                                                    <p className="text-xs text-red-500 mt-1">{errors.rooms[index].width?.message}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-Jost-Semibold text-gray-600 mb-1">Ceiling Height</label>
                                                <input type="number" {...register(`rooms.${index}.ceilingHeight`)} className="auth-input w-full" placeholder="0" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-Jost-Semibold text-gray-600 mb-1">Unit</label>
                                                <Controller
                                                    name={`rooms.${index}.unit`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select {...field} isMulti={false} options={UNIT_OPTIONS} components={animatedComponents} className="text-sm" />
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-Jost-Semibold text-gray-600 mb-1">
                                                Notes <span className="text-gray-400 font-normal">(optional)</span>
                                            </label>
                                            <input {...register(`rooms.${index}.notes`)} className="auth-input w-full" placeholder="e.g. Has a bay window on the north wall" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Reference Images */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-Jost-Semibold text-gray-700">
                                Reference Images <span className="text-gray-400 font-normal">(Optional)</span>
                            </label>
                            <span className="text-xs text-gray-400">{referenceImages.length} / 10</span>
                        </div>

                        {referenceImages.length < 10 && (
                            <>
                                <label
                                    htmlFor="referenceEdit"
                                    className="flex items-center gap-3 w-full border border-gray-300 rounded-lg px-4 py-2 cursor-pointer hover:border-primary transition-colors"
                                >
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
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveReference(index)}
                                                className="absolute top-1 right-1 z-10 bg-red-500/90 hover:bg-red-600 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {!isEditing ? (
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="w-full py-2.5 rounded-lg border border-gray-300 text-gray-600 font-Jost-Semibold text-sm hover:bg-gray-100 hover:border-gray-400 hover:text-gray-800 transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="auth-button">
                                Save Changes
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                type="button"
                                disabled
                                className="w-full py-2.5 rounded-lg border border-gray-200 text-gray-300 font-Jost-Semibold text-sm cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button type="button" disabled className="auth-disabled-button flex items-center justify-center gap-2">
                                <svg className="size-5 animate-spin shrink-0" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Saving...
                            </button>
                        </div>
                    )}

                </form>

                {updateError && <p className="flex items-center gap-1 text-sm text-error text-center mt-3"><AlertCircle size={14} /> {updateError}</p>}
                {updateSuccess && <p className="flex items-center gap-1 text-sm text-success text-center mt-3"><CheckCircle2 size={14} /> {updateSuccess}</p>}
            </div>
        </div>
    );
}