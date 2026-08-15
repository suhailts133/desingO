import { useForm, FormProvider } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { jobRequestValidation } from "../../../../validations/customerValidation";
import { STYLE_OPTIONS, PROPERTY_OPTIONS, SERVICE_OPTIONS } from "../../../designer/designs/designData";
import { TIMELINE_OPTIONS } from "../jobData";
import { INDIAN_STATES } from "../../../designer/designerVerification/indianStates";
import { usePostJob } from "../hooks/usePostJob";

import type { IJobRequest } from "../jobInterface";

import SubmitButton from "../../../../shared/common/SubmitButton";
import { InputField } from "../../../../shared/form/InputField";
import { TextAreaField } from "../../../../shared/form/TextAreaField";
import { ReactSelectField } from "../../../../shared/form/ReactSelectField";
import { SelectField } from "../../../../shared/form/SelectField";
import { createJobFormData } from "../../../../helpers/formHelpers/createJobFromData";
import RoomMeasurementsSection from "../components/RoomMeasurementsSection";
import ReferenceImagesSection from "../components/ReferenceImagesSection";
import { useHandleResponse } from "../../../../helpers/useHandleResponse";


export default function JobRequestForm() {
    const methods = useForm<IJobRequest>({
        defaultValues: { rooms: [], refrenceImages: [] },
        resolver: joiResolver(jobRequestValidation),
    });
    const handleResponse = useHandleResponse()

    const { handleSubmission, isLoading } = usePostJob();
    const { register, control, handleSubmit, formState: { errors } } = methods;

    const onSubmit = async (data: IJobRequest) => {
        const formData = createJobFormData(data);
        const resullt = await handleSubmission(formData);
        handleResponse(resullt.success, "Job Posted Successfully", resullt.message, "/customer/jobs")
    };

    return (
        <div className="min-h-screen w-full flex justify-center items-start py-10 px-4">
            <div className="w-full max-w-2xl bg-white/50 backdrop-blur-2xl shadow-blush/30 rounded-xl shadow-2xl p-8">
                <h2 className="text-4xl font-semibold text-center font-Dynalight-Regular mb-2 text-soft-black">designO</h2>
                <p className="text-center text-gray-400 font-Jost-Semibold mb-8 text-sm uppercase tracking-widest">Post a Job Request</p>

                <FormProvider {...methods}>
                    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                   
                        <InputField label="Project Title" placeholder="e.g. Modern Living Room Redesign" registration={register("projectTitle")} error={errors.projectTitle?.message} />
                        <TextAreaField label="Description" placeholder="Describe your vision, requirements, or anything the designer should know..." registration={register("description")} error={errors.description?.message} />
                        <ReactSelectField label="Property Type" name="propertyType" control={control} placeholder="Select property type..." options={PROPERTY_OPTIONS} error={errors.propertyType?.message} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ReactSelectField label="Design Styles" name="designStyles" isMulti={true} control={control} options={STYLE_OPTIONS} error={errors.designStyles?.message} />
                            <ReactSelectField label="Services" name="services" isMulti={true} control={control} options={SERVICE_OPTIONS} error={errors.services?.message} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <SelectField label="State" registration={register("state")} error={errors.state?.message} options={INDIAN_STATES} />
                            <InputField label="District" registration={register("district")} error={errors.district?.message} />
                            <InputField label="City" registration={register("city")} error={errors.city?.message} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Phone" placeholder="+91 XXXXXXXXXX" registration={register("phone")} error={errors.phone?.message} />
                            <ReactSelectField label="Project Timeline" name="timeline" control={control} options={TIMELINE_OPTIONS} error={errors.timeline?.message} />
                            <InputField type="number" placeholder="5000"  label="Minimum Budget (₹)" registration={register("minBudget", { valueAsNumber: true })} error={errors.minBudget?.message} />
                            <InputField type="number" placeholder="10000" label="Max Budget (₹)" registration={register("maxBudget", { valueAsNumber: true })} error={errors.maxBudget?.message} />
                        </div>

                        <hr className="my-6 border-gray-100" />

                        <RoomMeasurementsSection />
                        <ReferenceImagesSection />

                        <SubmitButton isLoading={isLoading} label="Post Job Request" loadingLabel="Posting" type="submit" />
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}