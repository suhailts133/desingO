
import { useNavigate } from "react-router-dom"
import type { GetMyHireDesignerRequestResponseDTO } from "../myHireDesignerRequestInterface"

type Props = {
    request: GetMyHireDesignerRequestResponseDTO
}

const statusStyles: Record<GetMyHireDesignerRequestResponseDTO["status"], string> = {
    Pending: "bg-yellow-50 text-yellow-900 border-yellow-200",
    Accepted: "bg-green-50 text-green-900 border-green-200",
    Rejected: "bg-red-50 text-red-900 border-red-200",
}

export default function MyHireRequestCard({ request }: Props) {
    const { id, length, width, ceilingHeight, unit, notes, status, rejectionReason, services, coverImage, designName, designId, createdOn, timeLine, } = request

    const navigate = useNavigate()

    const getDesignDetail = (id: string) => {
        navigate(`/designs/${id}`)
    }

    const dimensions = [
        `${length} x ${width} ${unit}`,
        ceilingHeight ? `H: ${ceilingHeight} ${unit}` : null,
    ]
        .filter(Boolean)
        .join(" · ")

    return (
        <div className="group bg-off-white w-full rounded-xl border border-blush-light/40 overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">

            <div className="relative overflow-hidden h-52">
                <button
                    onClick={() => getDesignDetail(designId)}
                    className="w-full h-full cursor-pointer"
                    aria-label={`View details for ${designName}`}
                >
                    <img
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-115"
                        src={coverImage}
                        alt={designName}
                    />
                </button>

                <span className="absolute bottom-3 left-3 text-xxs font-semibold tracking-widest uppercase bg-snow-white text-blush-deep px-2.5 py-1 rounded-full border border-blush-light/40">
                    {dimensions}
                </span>

                <span className={`absolute top-3 right-3 text-xxs font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full border bg-snow-white ${statusStyles[status]}`}>
                    {status}
                </span>
            </div>

            <div className="px-4 pt-3.5 pb-4 flex flex-col gap-2">

                <div className="flex flex-wrap gap-1.5">
                    <span className="text-xxs font-semibold tracking-wide uppercase px-2.5 py-0.75 rounded-full bg-soft-black/10 text-soft-black/70 border border-soft-black/10">
                        {timeLine}
                    </span>
                    {services.map((s, idx) => (
                        <span
                            key={idx}
                            className="text-xxs font-semibold tracking-wide uppercase px-2.5 py-0.75 rounded-full bg-blush-pale text-blush-deep border border-blush-light/70"
                        >
                            {s}
                        </span>
                    ))}
                </div>

                <a onClick={() => getDesignDetail(designId)} className="cursor-pointer">
                    <h3 className="text-md font-semibold leading-snug text-soft-black hover:text-blush-deep transition-colors duration-200 truncate">
                        {designName}
                    </h3>
                </a>

                {notes && (
                    <p className="text-xs text-soft-black/70 leading-relaxed line-clamp-2">{notes}</p>
                )}

                <p className="text-xxs text-soft-black">{createdOn}</p>

                {status === "Rejected" && rejectionReason && (
                    <div className="bg-red-50 border-l-2 border-red-400 rounded px-3 py-2">
                        <p className="text-xxs font-semibold uppercase tracking-wide text-red-800 mb-0.5">Rejection reason</p>
                        <p className="text-xs text-red-700 leading-relaxed">{rejectionReason}</p>
                    </div>
                )}

            </div>
        </div>
    )
}