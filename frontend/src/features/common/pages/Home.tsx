import ActiveJobCard from "../../../shared/common/ActiveJobCard";

export default function Home() {


  return (
    <div className="m-6">
      home
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <ActiveJobCard data={{
          id: "job_001",
          sourceType: "jobRequest",
          sourceName: "Living Room Redesign",
          sourceId: "src_9f3a21bc",
          profileImage:"https://cdn-front.freepik.com/home/anon-rvmp/creative-suite/photography/change-location.webp",
          userName: "Arjun Menon",
          status: "Active",
          startedAt: "12 May 2025",
          proposalStatus:"CREATED"
        }} />

      </div>
    </div>
  )
}
