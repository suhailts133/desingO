import { joiResolver } from "@hookform/resolvers/joi"
import type { IDesignerProfile } from "../designerVerificationInterFace"
import { useForm, useFieldArray } from "react-hook-form"
import { DesignerprofileValidations } from "../../../../validations/designerVerificationValidation"
import { INDIAN_STATES } from "../indianStates"
import { Plus, Trash2 } from "lucide-react"
import { useDesignerVerification } from "../hooks/useDesignerVerification"

export default function DesignerVerificationForm() {
  const { register, handleSubmit, watch, control, formState: { errors } } = useForm<IDesignerProfile>({
    resolver: joiResolver(DesignerprofileValidations, { abortEarly: false, allowUnknown: false }),
    mode: "onBlur"
  })
  const { handleVerification, designerError, designerSuccess, isLoading } = useDesignerVerification()

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

    await handleVerification(formData)
  }

  return (
    <div className="max-w-2xl w-full bg-white/50 backdrop-blur-2xl shadow-blush/30 rounded-xl shadow-2xl p-8">
      <h2 className="text-4xl font-semibold text-soft-black mb-6 text-center font-Dynalight-Regular">designO</h2>
      <p className="text-center text-lg font-Jost-Semibold text-gray-500 mb-6">
        Create Your Designer Account
      </p>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>


        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Phone</label>
            <input
              {...register("phone")}
              type="text"
              className="auth-input"
              placeholder="Enter Your Phone Number"
            />
            <p className="text-sm text-error">{errors.phone?.message}</p>
          </div>
          <div>
            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">State</label>
            <select {...register("state")} className="auth-input" defaultValue="">
              <option value="" disabled>Select your state</option>
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            <p className="text-sm text-error">{errors.state?.message}</p>
          </div>
        </div>


        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">District</label>
            <input
              {...register("district")}
              type="text"
              className="auth-input"
              placeholder="Enter Your District"
            />
            <p className="text-sm text-error">{errors.district?.message}</p>
          </div>
          <div>
            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">City</label>
            <input
              {...register("city")}
              type="text"
              className="auth-input"
              placeholder="Enter Your City"
            />
            <p className="text-sm text-error">{errors.city?.message}</p>
          </div>
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
          <div>
            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">GOVT ID Image</label>
            <label
              htmlFor="governmentIdImage"
              className="flex items-center gap-3 w-full border border-gray-300 rounded-lg px-4 py-2 cursor-pointer hover:border-primary transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <span className="text-sm text-gray-400 truncate">
                {(watch("governmentIdImage"))?.[0]?.name ?? "Choose an image..."}
              </span>
            </label>
            <input
              {...register("governmentIdImage")}
              id="governmentIdImage"
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/webp"
              className="hidden"
            />
            <p className="text-sm text-error">{errors.governmentIdImage?.message}</p>
          </div>
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

          {educationFields.map((field, index) => (
            <div key={field.id} className="space-y-3 border border-gray-400 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-Jost-Semibold text-gray-600">Education {index + 1}</p>
                <button type="button" onClick={() => educationRemove(index)} className="text-error hover:opacity-70">
                  <Trash2 size={16} />
                </button>
              </div>


              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Institution Name</label>
                  <input
                    {...register(`education.${index}.institutionName`)}
                    type="text"
                    className="auth-input"
                    placeholder="Enter Institution Name"
                  />
                  <p className="text-sm text-error">{errors.education?.[index]?.institutionName?.message}</p>
                </div>
                <div>
                  <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Course Name</label>
                  <input
                    {...register(`education.${index}.courseName`)}
                    type="text"
                    className="auth-input"
                    placeholder="Enter Course Name"
                  />
                  <p className="text-sm text-error">{errors.education?.[index]?.courseName?.message}</p>
                </div>
              </div>


              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Completion Year</label>
                  <input
                    {...register(`education.${index}.completionYear`, { valueAsNumber: true })}
                    type="number"
                    className="auth-input"
                    placeholder="e.g. 2022"
                    min={1970}
                    max={new Date().getFullYear()}
                  />
                  <p className="text-sm text-error">{errors.education?.[index]?.completionYear?.message}</p>
                </div>
                <div>
                  <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Certificate Image</label>
                  <label
                    htmlFor={`certificateImage-${index}`}
                    className="flex items-center gap-3 w-full border border-gray-300 rounded-lg px-4 py-2 cursor-pointer hover:border-primary transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span className="text-sm text-gray-400 truncate">
                      {watch(`education.${index}.certificateImage`)?.[0]?.name ?? "Choose an image..."}
                    </span>
                  </label>
                  <input
                    {...register(`education.${index}.certificateImage`)}
                    id={`certificateImage-${index}`}
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    className="hidden"
                  />
                  <p className="text-sm text-error">{errors.education?.[index]?.certificateImage?.message}</p>
                </div>
              </div>
            </div>
          ))}

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

          {workExperienceFields.map((field, index) => (
            <div key={field.id} className="space-y-3 border border-gray-400 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-Jost-Semibold text-gray-600">Experience {index + 1}</p>
                <button type="button" onClick={() => workExperienceRemove(index)} className="text-error hover:opacity-70">
                  <Trash2 size={16} />
                </button>
              </div>


              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Company Name</label>
                  <input
                    {...register(`workExperience.${index}.companyName`)}
                    type="text"
                    className="auth-input"
                    placeholder="Enter Company Name"
                  />
                  <p className="text-sm text-error">{errors.workExperience?.[index]?.companyName?.message}</p>
                </div>
                <div>
                  <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Role</label>
                  <input
                    {...register(`workExperience.${index}.role`)}
                    type="text"
                    className="auth-input"
                    placeholder="Enter Your Role"
                  />
                  <p className="text-sm text-error">{errors.workExperience?.[index]?.role?.message}</p>
                </div>
              </div>


              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Years of Experience</label>
                  <input
                    {...register(`workExperience.${index}.yearsOfExperience`, { valueAsNumber: true })}
                    type="number"
                    className="auth-input"
                    placeholder="e.g. 2"
                    min={0}
                    max={50}
                  />
                  <p className="text-sm text-error">{errors.workExperience?.[index]?.yearsOfExperience?.message}</p>
                </div>
                <div>
                  <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">
                    Proof Image
                  </label>
                  <label
                    htmlFor={`proofImage-${index}`}
                    className="flex items-center gap-3 w-full border border-gray-300 rounded-lg px-4 py-2 cursor-pointer hover:border-primary transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span className="text-sm text-gray-400 truncate">
                      {watch(`workExperience.${index}.proofImage`)?.[0]?.name ?? "Choose an image..."}
                    </span>
                  </label>
                  <input
                    {...register(`workExperience.${index}.proofImage`)}
                    id={`proofImage-${index}`}
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    className="hidden"
                  />
                  <p className="text-sm text-error">{errors.workExperience?.[index]?.proofImage?.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* portfolio url */}
        <div>
          <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Portfolio URL</label>
          <input
            {...register("portfolioUrl")}
            type="text"
            className="auth-input"
            placeholder="https://yourportfolio.com"
          />
          <p className="text-sm text-error">{errors.portfolioUrl?.message}</p>
        </div>

        {/* bio */}
        <div>
          <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Bio</label>
          <textarea
            {...register("bio")}
            className="auth-input"
            placeholder="Enter your bio"
            rows={4}
          />
          <p className="text-sm text-error">{errors.bio?.message}</p>
        </div>

        {!isLoading ? (
          <button type="submit" className="auth-button">Submit</button>
        ) : (
          <button type="submit" disabled={isLoading} className="auth-disabled-button">
            <svg className="mr-2 size-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Verifying
          </button>
        )}

      </form>
      {designerError && <p className="text-sm text-error text-center">{designerError}</p>}
      {designerSuccess && <p className="text-sm text-success text-center">{designerSuccess}</p>}
    </div>
  )
}