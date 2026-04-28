import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Pagination from "../../../shared/common/Pagination"
import { useGetDesignerDetailQuery, useGetDesignGallaryQuery } from "../commonEndpoints"
import DesignerDetailCard from "./cards/DesignerDetailCard"
import Gallary from "./Gallary"
import { ChevronLeft } from "lucide-react"

export default function DesignerDetail() {
  const { id } = useParams<{ id: string }>()
  const [page, setPage] = useState(1)
  const navigate = useNavigate()
  const { data: designerData, isLoading: isDesignerDataLoading, error: designerDataError } = useGetDesignerDetailQuery(id!, { skip: !id })
  const { data: designData, isLoading: isDesignsLoading, error: designsError } = useGetDesignGallaryQuery({ id: id!, page }, { skip: !id })

  const designer = designerData?.data
  const design = designData?.data

  if (isDesignerDataLoading || isDesignsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-blush-deep border-t-transparent animate-spin" />
          <p className="text-xs text-soft-black/40 tracking-widest uppercase font-Jost">Loading</p>
        </div>
      </div>
    )
  }

  if (designerDataError || designsError || !design || !designer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-red-400 font-Jost">Failed to load designer.</p>
      </div>
    )
  }

  const totalPages = designData.totalPages
  const totalDesigns = designData.total
  return (
    <div className="max-w-4xl mx-auto px-5 py-10 flex flex-col gap-8">
      <button onClick={() => navigate(-1)} className="flex items-center mb-4 text-sm text-soft-black hover:underline">
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>

      <DesignerDetailCard
        designer={designer}
      />


      <div className="flex flex-col gap-5">

        <Gallary
          totalDesigns={totalDesigns}
          design={design}
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          totalItem={totalDesigns}
          whichItem="designs"
          onDecrease={() => setPage(p => p - 1)}
          onIncrease={() => setPage(p => p + 1)}
        />

      </div>

    </div>
  )
}