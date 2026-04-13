type Props = {
    isOpen: boolean,
    onConfirm: () => void
    onClose: () => void
    isLoading: boolean,
    heading:string
    text:string,
    buttonText:string,
    buttonLoadingText:string,

}

export default function ConfirmModal({ isOpen, onConfirm, onClose, isLoading, text, heading, buttonLoadingText, buttonText }: Props) {
    if (!isOpen) {
        return null
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-in zoom-in duration-200">
                <h2 className="text-4xl font-semibold text-soft-black mb-6 text-center font-Dynalight-Regular">designO</h2>
                <div className="text-center space-y-4">
                    <p className="text-xl font-Jost-Semibold text-gray-800">{heading}</p>
                    <p className="text-gray-500">{text} </p>

                    <div className="flex flex-col gap-3 pt-6">
                        {!isLoading ? (<button
                            type="submit"
                            onClick={onConfirm}
                            className="auth-button">
                            {buttonText}
                        </button>) : (
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="auth-disabled-button">

                                <svg className="mr-2 size-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>

                                
                                {buttonLoadingText}
                            </button>
                        )}
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-sm font-medium">Go Back</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
