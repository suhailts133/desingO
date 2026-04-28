import { Search, X } from 'lucide-react'
import type { UseFormRegister } from 'react-hook-form'
import type { DesingerFilterForm } from '../commonInterface'

type Props = {
    register: UseFormRegister<DesingerFilterForm>
    onClear: () => void
}

export default function DesignerFilter({ register, onClear }: Props) {
    return (

        <div className="bg-white border-b border-gray-100 px-6 py-5">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col gap-1 mb-6">
                    <h1 className="font-semibold text-2xl text-gray-900">Browse Designers</h1>
                </div>

                <div className="flex flex-wrap items-center gap-4">

                    <div className="relative flex-1 min-w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            {...register("full_name")}
                            type="text"
                            placeholder="Search by name..."
                            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 transition-all"
                        />
                    </div>

                    <div className="ml-auto flex items-center gap-4">
                        <button
                            onClick={onClear}
                            className="text-sm text-gray-400 hover:text-red-500 flex items-center gap-1"
                        >
                            <X className="w-4 h-4" /> Clear
                        </button>
                    </div>
                </div>
            </div>
        </div>

    )
}
