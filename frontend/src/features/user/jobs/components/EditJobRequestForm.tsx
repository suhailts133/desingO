import { useEffect, useState, type ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { AlertCircle, UserCheck, ImageIcon, FileText, Plus, X, Trash2, Upload } from "lucide-react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

import { useGetAJobRequestDetailQuery } from "../jobEndpoints";
import { useEditJobRequest } from "../hooks/useEditJobRequest";
import { editJobRequestValidation } from "../../../../validations/customerValidation";
import type { IJobRequest } from "../jobInterface";
import type { SelectOption } from "../../../designer/designs/designInterface";

import SubmitButton from "../../../../shared/common/SubmitButton";
import { useHandleResponse } from "../../../../helpers/useHandleResponse";

import ProjectOverviewSection from "../components/ProjectOverviewSection";
import SpaceStatusSection from "../components/SpaceStatusSection";
import SpaceScopeSection from "../components/SpaceScopeSection";
import DeliverablesSection from "../components/DeliverablesSection";
import AestheticsAndItemsSection from "../components/AestheticsAndItemsSection";
import HouseholdProfileSection from "../components/HouseholdProfileSection";
import LocationBudgetSection from "../components/LocationBudgetSection";

const toOption = (label: string): SelectOption => ({ value: label, label });
const toOptions = (labels: string[] = []): SelectOption[] => labels.map(toOption);

type ExistingFileItem = { type: "existing"; path: string; filename: string };
type NewFileItem = { type: "new"; file: File; preview: string };
type FileItem = ExistingFileItem | NewFileItem;

export default function EditJobRequestForm() {
    const { id } = useParams<{ id: string }>();

    const { data, isLoading: isFetching, error } = useGetAJobRequestDetailQuery(id!, { skip: !id });
    const { handleUpdation, isEditing } = useEditJobRequest();
    const handleResponse = useHandleResponse();

    const job = data?.data;

    const [referenceImages, setReferenceImages] = useState<FileItem[]>([]);
    const [floorPlans, setFloorPlans] = useState<FileItem[]>([]);

    const methods = useForm<IJobRequest>({
        resolver: joiResolver(editJobRequestValidation),
    });

    const { handleSubmit, reset } = methods;

    useEffect(() => {
        if (!job) return;

        reset({
            sourceType: job.sourceType,
            designerId: job.designerId,
            designId: job.designId,

            projectType: job.projectType,
            projectTitle: job.projectTitle,
            propertyType: toOption(job.propertyType),
            description: job.description,

            renovationDetails: job.renovationDetails ?? {
                level: "ROOMS_UPGRADE",
                propertyAgeYears: "5",
                livingInDuringRenovation: false,
            },
            newbuildDetails: job.newbuildDetails ?? {
                stage: "BARE_SHELL_READY",
                vastuCompliantRequired: false,
            },

            totalCarpetArea: job.totalCarpetArea,
            areaUnit: job.areaUnit,
            selectedRooms: toOptions(job.selectedRooms),
            requiresSiteVisitMeasurement: job.requiresSiteVisitMeasurement,

            servicePackageType: "CUSTOM",
            services: toOptions(job.services),
            designStyles: toOptions(job.designStyles),
            preferredMaterials: toOptions(job.preferredMaterials),

            householdProfile: job.householdProfile,

            state: job.state,
            district: job.district,
            city: job.city,
            pincode: job.pincode,
            phone: job.phone,

            timeline: toOption(job.timeline),
            minBudget: job.minBudget,
            maxBudget: job.maxBudget,
        });
    }, [job, reset]);

    useEffect(() => {
        if (!job) return;
        setReferenceImages(
            (job.referenceImages ?? []).map((img) => ({
                type: "existing" as const,
                path: img.path,
                filename: img.filename,
            }))
        );
        setFloorPlans(
            (job.floorPlans ?? []).map((plan) => ({
                type: "existing" as const,
                path: plan.path,
                filename: plan.filename,
            }))
        );
    }, [job]);

    // Revoke object URLs on unmount / change, same as old edit form
    useEffect(() => {
        return () => {
            referenceImages.forEach((item) => {
                if (item.type === "new") URL.revokeObjectURL(item.preview);
            });
        };
    }, [referenceImages]);

    useEffect(() => {
        return () => {
            floorPlans.forEach((item) => {
                if (item.type === "new") URL.revokeObjectURL(item.preview);
            });
        };
    }, [floorPlans]);

    const handleReferenceUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const slotsLeft = 10 - referenceImages.length;
        setReferenceImages((prev) => [
            ...prev,
            ...files.slice(0, slotsLeft).map((file) => ({
                type: "new" as const,
                file,
                preview: URL.createObjectURL(file),
            })),
        ]);
        e.target.value = "";
    };

    const handleRemoveReference = (index: number) => {
        setReferenceImages((prev) => {
            const item = prev[index];
            if (item.type === "new") URL.revokeObjectURL(item.preview);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleFloorPlanUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const slotsLeft = 10 - floorPlans.length;
        setFloorPlans((prev) => [
            ...prev,
            ...files.slice(0, slotsLeft).map((file) => ({
                type: "new" as const,
                file,
                preview: URL.createObjectURL(file),
            })),
        ]);
        e.target.value = "";
    };

    const handleRemoveFloorPlan = (index: number) => {
        setFloorPlans((prev) => {
            const item = prev[index];
            if (item.type === "new") URL.revokeObjectURL(item.preview);
            return prev.filter((_, i) => i !== index);
        });
    };


    const onSubmit = async (fields: IJobRequest) => {
        const formData = new FormData();

        formData.append("projectTitle", fields.projectTitle);
        formData.append("projectType", fields.projectType);
        formData.append("description", fields.description);
        formData.append("propertyType", fields.propertyType.label);

        formData.append("totalCarpetArea", String(fields.totalCarpetArea));
        formData.append("areaUnit", fields.areaUnit);
        formData.append("requiresSiteVisitMeasurement", String(fields.requiresSiteVisitMeasurement));
        fields.selectedRooms.forEach(({ label }, i) => formData.append(`selectedRooms[${i}]`, label));

        fields.designStyles.forEach(({ label }, i) => formData.append(`designStyles[${i}]`, label));
        fields.preferredMaterials.forEach(({ label }, i) => formData.append(`preferredMaterials[${i}]`, label));
        fields.services.forEach(({ label }, i) => formData.append(`services[${i}]`, label));

        formData.append("householdProfile[adultsCount]", String(fields.householdProfile.adultsCount));
        formData.append("householdProfile[kidsCount]", String(fields.householdProfile.kidsCount));
        formData.append("householdProfile[seniorsCount]", String(fields.householdProfile.seniorsCount));
        formData.append("householdProfile[hasPets]", String(fields.householdProfile.hasPets));
        if (fields.householdProfile.petDetails) {
            formData.append("householdProfile[petDetails]", fields.householdProfile.petDetails);
        }

        if (fields.projectType === "Renovation" && fields.renovationDetails) {
            formData.append("renovationDetails[level]", fields.renovationDetails.level);
            formData.append("renovationDetails[propertyAgeYears]", fields.renovationDetails.propertyAgeYears);
            formData.append(
                "renovationDetails[livingInDuringRenovation]",
                String(fields.renovationDetails.livingInDuringRenovation)
            );
        }
        if (fields.projectType === "New_Build" && fields.newbuildDetails) {
            formData.append("newbuildDetails[stage]", fields.newbuildDetails.stage);
            formData.append(
                "newbuildDetails[vastuCompliantRequired]",
                String(fields.newbuildDetails.vastuCompliantRequired)
            );
        }

        formData.append("state", fields.state);
        formData.append("district", fields.district);
        formData.append("city", fields.city);
        formData.append("pincode", fields.pincode);
        formData.append("phone", fields.phone);
        formData.append("timeline", fields.timeline.label);
        formData.append("minBudget", String(fields.minBudget));
        formData.append("maxBudget", String(fields.maxBudget));

        const keptReferenceImages: { path: string; filename: string }[] = [];
        referenceImages.forEach((item) => {
            if (item.type === "existing") {
                keptReferenceImages.push({ path: item.path, filename: item.filename });
            } else {
                formData.append("referenceImages", item.file);
            }
        });
        keptReferenceImages.forEach((img, i) => {
            formData.append(`oldReferences[${i}][path]`, img.path);
            formData.append(`oldReferences[${i}][filename]`, img.filename);
        });

        const keptFloorPlans: { path: string; filename: string }[] = [];
        floorPlans.forEach((item) => {
            if (item.type === "existing") {
                keptFloorPlans.push({ path: item.path, filename: item.filename });
            } else {
                formData.append("floorPlans", item.file);
            }
        });
        keptFloorPlans.forEach((img, i) => {
            formData.append(`oldFloorPlans[${i}][path]`, img.path);
            formData.append(`oldFloorPlans[${i}][filename]`, img.filename);
        });
        console.log([...formData.entries()])
        const result = await handleUpdation({ formdata: formData, id: id! });
        handleResponse(result.success, "Update successful", result.message, -1);
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

    if (error || !job) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-sm text-red-500 flex items-center gap-2">
                    <AlertCircle size={16} /> Failed to load job request.
                </p>
            </div>
        );
    }

    const isDirectHire = job.sourceType === "DIRECT_HIRE";

    return (
        <div className="min-h-screen w-full flex justify-center items-start py-10 px-4 bg-seashell-tint/40">
            <div className="w-full max-w-3xl bg-snow-white shadow-2xl rounded-2xl p-6 sm:p-10 border border-blush-pale">
                <div className="text-center mb-8">
                    <h2 className="text-5xl font-semibold font-Dynalight-Regular text-soft-black">designO</h2>
                    <p className="text-soft-black/60 font-Jost-Semibold text-xs tracking-widest uppercase mt-1">
                        Edit Job Request
                    </p>

                    {isDirectHire && (
                        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-blush-pale/70 border border-blush rounded-full text-xs font-Jost-Semibold text-soft-black">
                            <UserCheck className="w-3.5 h-3.5 text-blush-deep" />
                            <span>Direct Designer Inquiry</span>
                        </div>
                    )}
                </div>

                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <ProjectOverviewSection />
                        <hr className="border-blush-pale" />

                        <SpaceStatusSection />
                        <hr className="border-blush-pale" />

                        <SpaceScopeSection hideFloorPlanUpload />

                        {/* Floor plans — local state, same pattern as old edit form's reference images */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-Jost-Semibold text-soft-black">
                                    Floor Plans <span className="text-gray-400 font-normal">(Optional)</span>
                                </label>
                                <span className="text-xs text-gray-400">{floorPlans.length} / 10</span>
                            </div>

                            {floorPlans.length < 10 && (
                                <>
                                    <label
                                        htmlFor="floorPlanEdit"
                                        className="flex items-center justify-center gap-2 border-2 border-dashed border-blush-light rounded-xl p-4 cursor-pointer hover:border-blush-deep bg-white transition-colors"
                                    >
                                        <Upload className="w-5 h-5 text-blush-deep" />
                                        <span className="text-sm text-soft-black font-medium">Click to upload Floor Plan(s)</span>
                                    </label>
                                    <input
                                        type="file"
                                        id="floorPlanEdit"
                                        multiple
                                        hidden
                                        accept="image/*,application/pdf"
                                        onChange={handleFloorPlanUpload}
                                    />
                                </>
                            )}

                            {floorPlans.length > 0 && (
                                <div className="space-y-1">
                                    {floorPlans.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg border text-xs">
                                            <span className="flex items-center gap-2 truncate text-soft-black font-medium">
                                                <FileText className="w-4 h-4 text-blush-deep shrink-0" />
                                                {item.type === "existing" ? (
                                                    <a href={item.path} target="_blank" rel="noopener noreferrer" className="truncate hover:underline">
                                                        {item.filename}
                                                    </a>
                                                ) : (
                                                    item.file.name
                                                )}
                                                <span
                                                    className={`shrink-0 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${item.type === "new" ? "bg-green-500" : "bg-gray-500/70"
                                                        }`}
                                                >
                                                    {item.type === "new" ? "New" : "Saved"}
                                                </span>
                                            </span>
                                            <button type="button" onClick={() => handleRemoveFloorPlan(index)} className="text-error hover:text-red-700">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <hr className="border-blush-pale" />

                        <DeliverablesSection />
                        <hr className="border-blush-pale" />

                        <AestheticsAndItemsSection />
                        <hr className="border-blush-pale" />

                        <HouseholdProfileSection />
                        <hr className="border-blush-pale" />

                        <LocationBudgetSection />

                        {/* Reference images — local state, same pattern as old edit form */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-Jost-Semibold text-soft-black">
                                    Reference Images <span className="text-gray-400 font-normal">(Optional)</span>
                                </label>
                                <span className="text-xs text-gray-400">{referenceImages.length} / 10</span>
                            </div>

                            {referenceImages.length < 10 && (
                                <>
                                    <label
                                        htmlFor="referenceEdit"
                                        className="flex items-center gap-3 w-full border border-gray-300 rounded-lg px-4 py-2 cursor-pointer hover:border-blush-deep transition-colors"
                                    >
                                        <div className="bg-gray-100 p-1.5 rounded-md">
                                            <ImageIcon className="h-4 w-4 text-gray-500" />
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-sm text-gray-700 font-medium">Add Reference Photos</span>
                                            <span className="text-[11px] text-gray-400 truncate">
                                                {referenceImages.length > 0
                                                    ? `${referenceImages.length} selected — up to ${10 - referenceImages.length} more`
                                                    : "Select one or more images..."}
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
                                        const src = item.type === "existing" ? item.path : item.preview;
                                        const isNew = item.type === "new";
                                        return (
                                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-white shadow-sm group">
                                                <Zoom>
                                                    <img src={src} className="w-full h-full object-cover" alt={`Reference ${index + 1}`} />
                                                </Zoom>
                                                <span
                                                    className={`absolute top-1 left-1 z-10 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${isNew ? "bg-green-500" : "bg-gray-500/70"
                                                        }`}
                                                >
                                                    {isNew ? "New" : "Saved"}
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

                        <div className="pt-4">
                            <SubmitButton isLoading={isEditing} label="Update Job Request" loadingLabel="Updating..." type="submit" />
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}