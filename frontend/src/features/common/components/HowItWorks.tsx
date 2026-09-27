import StepList from "./StepList";

const jobPostSteps = [
    { title: "Post your job", body: "Describe the space, the style you're after, and your budget." },
    { title: "Designers apply", body: "Interested designers send proposals with their approach and rate." },
    { title: "Pick who you'll work with", body: "Review proposals, accept the one that fits, decline the rest." },
];

const portfolioSteps = [
    { title: "Designers post their work", body: "Finished projects and specialties, all on one profile." },
    { title: "You reach out", body: "Browse portfolios and message the designers whose work fits." },
    { title: "Designer responds", body: "They accept if it's a fit for them, or decline if it isn't." },
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
                    Whichever direction you come from, nothing begins until both sides say yes.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-12">
                <StepList label="Post a job" tag="Customer-led" tagTone="success" steps={jobPostSteps} />
                <StepList label="Browse portfolios" tag="Designer-led" tagTone="warning" steps={portfolioSteps} />
            </div>

            <div className="mt-2 flex justify-center">
                <div className="h-10 w-px bg-surface-border" />
            </div>

            <div className="mx-auto max-w-sm rounded-lg border border-accent bg-accent-tint px-7 py-6 text-center">
                <h3 className="font-Jost-Semibold text-lg text-accent-tint-text">Work begins</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                    You and your designer start the project, together — no fees for a declined request either way.
                </p>
            </div>
        </section>
    );
}