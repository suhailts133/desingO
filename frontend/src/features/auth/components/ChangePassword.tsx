import { joiResolver } from "@hookform/resolvers/joi"
import { useForm } from "react-hook-form"
import type { IPassword } from "../authInterfaces"
import { changePasswordValidations } from "../../../validations/authValidations"
import { useChangePassword } from "../hooks/useChangePassword"
import { useLocation } from "react-router-dom"
import { InputField } from "../../../shared/form/InputField"
import SubmitButton from "../../../shared/common/SubmitButton"


export default function ChangePassword() {
  const { register, handleSubmit, formState: { errors } } = useForm<IPassword>({
    resolver: joiResolver(changePasswordValidations, { abortEarly: false, allowUnknown: false }),
    mode: "onBlur"
  })
  const location = useLocation();
  const email = location.state?.email
  const { handleChangePassword, error, isLoading } = useChangePassword()

  const onSubmit = async (data: IPassword) => {
    await handleChangePassword({password:data.password,email})
  }

  return (
    <div className="max-w-md w-full bg-surface backdrop-blur-2xl  border border-surface-border rounded-xl p-8">
      <h2 className="text-4xl font-semibold  text-accent mb-6 text-center font-Dynalight-Regular">designO</h2>

      <p className="text-center text-lg font-Jost-Semibold text-text-muted mb-6">
        Change password
      </p>
      <form className="space-y-4 " onSubmit={handleSubmit(onSubmit)}>
            <InputField label="Password" placeholder="********" showPasswordToggle={true} registration={register("password")} error={errors.password?.message}/>
        <InputField label="confirm Password" placeholder="********" showPasswordToggle={true} registration={register("confirmPassword")} error={errors.password?.message} />
        <SubmitButton type="submit" label="change Password" loadingLabel="Changing password" isLoading={isLoading} />
      </form>
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  )
}
