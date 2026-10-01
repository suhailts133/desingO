import StepList from "./StepList";

const jobPostSteps = [
    { title: "Post your job", body: "Describe the space, style, budget and the services you need. Upload floor plans, or request a site visit." },
    { title: "Designers apply", body: "Verified designers apply to your job with their approach and rate." },
    { title: "Accept or reject applications", body: "Compare portfolios and reviews. Accept the designer you want and decline the rest." },
    { title: "Designer sends a proposal", body: "Services, prices, timeline and site visit date, all in one proposal." },
    { title: "Approve the proposal", body: "Accept it and work begins. Not quite right? Reject it and the designer redoes it." },
];
const portfolioSteps = [
    { title: "Designers showcase their work", body: "Finished projects and specialties, all on one profile." },
    { title: "Send a hire request", body: "Found someone whose work fits? Send them your brief." },
    { title: "Designer accepts or declines", body: "They respond based on their availability." },
    { title: "Designer sends a proposal", body: "Services, prices, timeline and site visit date, all in one proposal." },
    { title: "Approve the proposal", body: "Accept it and work begins. Not quite right? Reject it and the designer redoes it." },
];
const milestoneSteps = [
    { title: "Pay", body: "Each service opens for payment in turn." },
    { title: "Designer delivers", body: "Work starts once the floor plan is approved or the site is visited." },
    { title: "You review", body: "Approve it, or request a revision. Every version is kept." },
    { title: "Funds released", body: "The designer is paid only after you approve." },
    { title: "Next service", body: "Repeat until the last service. Then the project is complete." },
];

export default function HowItWorks() {
    return (
        <section id="how" className="mx-auto max-w-7xl px-6 py-20">
            <div className="mb-13 max-w-[46ch]">
                <p className="mb-2.5 text-sm text-accent">How it works</p>
                <h2 className="font-Jost-Semibold text-3xl leading-tight text-text-primary sm:text-4xl">
                    Two ways to start a project
                </h2>
                <p className="mt-3.5 leading-relaxed text-text-muted">
                    Whichever direction you come from, nothing begins until both sides agree on a contract.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
                <StepList label="Post a job" tag="Customer-led" tagTone="accent" steps={jobPostSteps} />
                <StepList label="Browse portfolios" tag="Designer-led" tagTone="neutral" steps={portfolioSteps} />
            </div>

            <div className="my-2 flex justify-center">
                <div className="h-10 w-px bg-surface-border" />
            </div>

            <div className="rounded-lg border border-accent bg-accent-tint px-7 py-8">
                <div className="mb-6 text-center">
                    <h3 className="font-Jost-Semibold text-lg text-accent-tint-text">
                        Then, milestone by milestone
                    </h3>
                    <p className="mt-1.5 text-sm text-text-muted">
                        You only pay for the service in front of you, and funds move only when you approve.
                    </p>
                </div>

                <ol className="grid grid-cols-1 gap-6 sm:grid-cols-5">
                    {milestoneSteps.map((s, i) => (
                        <li key={s.title} className="text-center sm:text-left">
                            <span className="mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-medium text-text-on-accent sm:mx-0">
                                {i + 1}
                            </span>
                            <h4 className="text-sm font-medium text-text-primary">{s.title}</h4>
                            <p className="mt-1 text-xs leading-relaxed text-text-muted">{s.body}</p>
                        </li>
                    ))}
                </ol>

                <p className="mt-6 border-t border-accent/30 pt-4 text-center text-xs text-text-muted">
                    Something wrong? Either side can raise a dispute, and our team steps in.
                </p>
            </div>
        </section>
    );
}
