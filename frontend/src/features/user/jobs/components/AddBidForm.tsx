
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();


interface Props {
    onClose: () => void;
    jobId:string
}


export default function ApplyForJob({ onClose,jobId }: Props) {
    const isApplying = true
    const onSubmit = () => {
        // console.log(data)
        // onClose()

    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-in zoom-in duration-200">
                <h2 className="text-4xl font-semibold text-soft-black mb-6 text-center font-Dynalight-Regular">designO</h2>
                <p className="text-center text-lg font-Jost-Semibold text-gray-500 mb-6">Do you want to apply for this job?</p>


                <div className="flex flex-col gap-3 pt-4">
                    {!isApplying ? (<button

                        className="auth-button"
                        onClick={onSubmit}>
                        Apply
                    </button>) : (
                        <button
                            type="submit"
                            disabled={isApplying}
                            className="auth-disabled-button">

                            <svg className="mr-2 size-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>

                            Applying
                        </button>
                    )}
                    <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-800 text-sm font-medium">Cancel</button>
                </div>
            </div>
        </div>
    )
}
