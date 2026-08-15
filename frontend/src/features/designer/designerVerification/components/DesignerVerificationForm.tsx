import { joiResolver } from "@hookform/resolvers/joi"
import type { IDesignerProfile } from "../designerVerificationInterFace"
import { useForm, useFieldArray } from "react-hook-form"
import { DesignerprofileValidations } from "../../../../validations/designerVerificationValidation"
import { INDIAN_STATES } from "../indianStates"
import { Plus, Trash2 } from "lucide-react"
import { useDesignerVerification } from "../hooks/useDesignerVerification"
import { InputField } from "../../../../shared/form/InputField"
import { SelectField } from "../../../../shared/form/SelectField"
import { FileInputField } from "../../../../shared/form/FileInputField"
import { TextAreaField } from "../../../../shared/form/TextAreaField"
import SubmitButton from "../../../../shared/common/SubmitButton"
import { useHandleResponse } from "../../../../helpers/useHandleResponse"

export default function DesignerVerificationForm() {
  const { register, handleSubmit, watch, control, formState: { errors } } = useForm<IDesignerProfile>({
    resolver: joiResolver(DesignerprofileValidations, { abortEarly: false, allowUnknown: false }),
    mode: "onBlur"
  })
  const watchedGovtId = watch("governmentIdImage");
  const { handleVerification, isLoading } = useDesignerVerification()
  const handleResponse = useHandleResponse()
  const {
    fields: educationFields,
    append: educationAppend,
    remove: educationRemove
  } = useFieldArray({ control, name: "education" })

  const {
    fields: workExperienceFields,
    append: workExperienceAppend,
    remove: workExperienceRemove
  } = useFieldArray({ control, name: "workExperience" })

  const onSubmit = async (data: IDesignerProfile) => {
    const formData = new FormData()
    formData.append("phone", data.phone)
    formData.append("state", data.state)
    formData.append("district", data.district)
    formData.append("city", data.city)
    formData.append("governmentIdType", data.governmentIdType)
    formData.append("portfolioUrl", data.portfolioUrl)
    formData.append("bio", data.bio)

    const govtIdImage = data.governmentIdImage?.[0]
    if (govtIdImage) formData.append("governmentIdImage", govtIdImage)

    data.education.forEach((edu, index) => {
      formData.append(`education[${index}][institutionName]`, edu.institutionName)
      formData.append(`education[${index}][courseName]`, edu.courseName)
      formData.append(`education[${index}][completionYear]`, String(edu.completionYear))
      const certImage = edu.certificateImage?.[0]
      if (certImage) formData.append("educationImages", certImage)
    })

    data.workExperience?.forEach((work, index) => {
      formData.append(`workExperience[${index}][companyName]`, work.companyName)
      formData.append(`workExperience[${index}][role]`, work.role)
      formData.append(`workExperience[${index}][yearsOfExperience]`, String(work.yearsOfExperience))
      const proofImage = work.proofImage?.[0]
      if (proofImage) formData.append("workExperienceImages", proofImage)
    })

    const result = await handleVerification(formData)
    handleResponse(result.success, "Designer application submitted successfully.", result.message, "/")
  }

  return (
    <div className="max-w-2xl w-full bg-white/50 backdrop-blur-2xl shadow-blush/30 rounded-xl shadow-2xl p-8">
      <h2 className="text-4xl font-semibold text-soft-black mb-6 text-center font-Dynalight-Regular">designO</h2>
      <p className="text-center text-lg font-Jost-Semibold text-gray-500 mb-6">
        Create Your Designer Account
      </p>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

        <div className="grid grid-cols-2 gap-4">
          <InputField placeholder="Enter Your Phone Number" label="Phone" type="number" registration={register("phone")} error={errors.phone?.message} />
          <SelectField label="State" placeholder="Select your state" registration={register("state")} error={errors.state?.message} options={INDIAN_STATES} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputField placeholder="Enter Your District" label="District" type="text" registration={register("district")} error={errors.district?.message} />
          <InputField placeholder="Enter Your City" label="City" type="text" registration={register("city")} error={errors.city?.message} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">GOVT ID Type</label>
            <select {...register("governmentIdType")} className="auth-input" defaultValue="">
              <option value="" disabled>Select your GOVT ID type</option>
              <option value="aadhar_card">Aadhar Card</option>
              <option value="driving_licence">Driving Licence</option>
            </select>
            <p className="text-sm text-error">{errors.governmentIdType?.message}</p>
          </div>

          <FileInputField label="GOVT ID Image" fileName={watchedGovtId?.[0]?.name} registration={register("governmentIdImage")} error={errors.governmentIdImage?.message} />

        </div>


        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-Jost-Semibold text-gray-700">Education</label>
            {educationFields.length < 4 && (
              <button
                type="button"
                onClick={() => educationAppend({
                  institutionName: "",
                  courseName: "",
                  completionYear: "" as unknown as number,
                  certificateImage: "" as unknown as FileList
                })}
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <Plus size={16} /> Add
              </button>
            )}
          </div>

          {educationFields.map((field, index) => {
            const certImage = watch(`education.${index}.certificateImage`);
            return (
              <div key={field.id} className="space-y-3 border border-gray-400 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-Jost-Semibold text-gray-600">Education {index + 1}</p>
                  <button type="button" onClick={() => educationRemove(index)} className="text-error hover:opacity-70">
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputField placeholder="Enter Institution Name" type="text" label="Institution Name" registration={register(`education.${index}.institutionName`)} error={errors.education?.[index]?.institutionName?.message} />
                  <InputField placeholder="Enter Course Name" type="text" label="Course Name" registration={register(`education.${index}.courseName`)} error={errors.education?.[index]?.courseName?.message} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputField min={1970} max={new Date().getFullYear()} placeholder="e.g. 2022" type="number" label="pass out year" registration={register(`education.${index}.completionYear`, { valueAsNumber: true })} error={errors.education?.[index]?.completionYear?.message} />
                  <FileInputField label="Certificate Image" placeholder="Choose certificate..." fileName={certImage?.[0]?.name} registration={register(`education.${index}.certificateImage`)} error={errors.education?.[index]?.certificateImage?.message} />
                </div>
              </div>
            )
          })}

          <p className="text-sm text-error">{errors.education?.message}</p>
        </div>


        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-Jost-Semibold text-gray-700">
              Work Experience <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            {workExperienceFields.length < 4 && (
              <button
                type="button"
                onClick={() => workExperienceAppend({
                  companyName: "",
                  role: "",
                  yearsOfExperience: "" as unknown as number,
                  proofImage: "" as unknown as FileList
                })}
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <Plus size={16} /> Add
              </button>
            )}
          </div>

          {workExperienceFields.map((field, index) => {
            const workExp = watch(`workExperience.${index}.proofImage`);
            return (
              <div key={field.id} className="space-y-3 border border-gray-400 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-Jost-Semibold text-gray-600">Experience {index + 1}</p>
                  <button type="button" onClick={() => workExperienceRemove(index)} className="text-error hover:opacity-70">
                    <Trash2 size={16} />
                  </button>
                </div>


                <div className="grid grid-cols-2 gap-4">
                  <InputField placeholder="Enter Company Name" type="text" label="Company Name" registration={register(`workExperience.${index}.companyName`)} error={errors.workExperience?.[index]?.companyName?.message} />
                  <InputField placeholder="Enter your Role" type="text" label="Role" registration={register(`workExperience.${index}.role`)} error={errors.workExperience?.[index]?.role?.message} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputField min={0} max={50} placeholder="e.g. 2" type="number" label="Years of Experience" registration={register(`workExperience.${index}.yearsOfExperience`, { valueAsNumber: true })} error={errors.workExperience?.[index]?.yearsOfExperience?.message} />
                  <FileInputField label="Proof Image" placeholder="Choose proof of experience..." fileName={workExp?.[0]?.name} registration={register(`workExperience.${index}.proofImage`)} error={errors.workExperience?.[index]?.proofImage?.message} />
                </div>
              </div>
            )
          })}
        </div>

        <InputField label="Portfolio URL" registration={register("portfolioUrl")} type="url" placeholder="https://yourportfolio.com" error={errors.portfolioUrl?.message} />
        <TextAreaField label="Bio" placeholder="Enter your bio" rows={4} registration={register("bio")} error={errors.bio?.message} />

        <SubmitButton isLoading={isLoading} label="Submit" loadingLabel="Verifying" type="submit" />


      </form>

    </div>
  )
}