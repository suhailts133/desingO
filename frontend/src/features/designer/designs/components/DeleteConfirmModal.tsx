import SubmitButton from "../../../../shared/common/SubmitButton"

type Props = {
    isOpen: boolean,
    onConfirm: () => void
    onClose: () => void
    isLoading: boolean,

    text: string
}

export default function DeleteConfirmModal({ isOpen, onClose, isLoading, text }: Props) {
    if (!isOpen) {
        return null
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/60 backdrop-blur-md">
            <div className="relative w-full max-w-md bg-surface rounded-2xl shadow-2xl p-8 animate-in zoom-in duration-200">
                <h2 className="text-4xl font-semibold text-accent mb-6 text-center font-Dynalight-Regular">designO</h2>
                <div className="text-center space-y-4">
                    <p className="text-xl font-Jost-Semibold text-text-primary">Confirm Deletion?</p>
                    <p className="text-text-muted">{text} </p>

                    <div className="flex flex-col gap-3 pt-6">
                        <SubmitButton
                            isLoading={isLoading}
                            label="Confirm & delete"
                            loadingLabel="Deleting"
                            type="submit" />
                        <button onClick={onClose} className="text-text-muted hover:text-text-faint text-sm font-medium">Go Back</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
