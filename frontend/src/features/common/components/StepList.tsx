type Step = {
    title: string;
    body: string;
};

type StepListProps = {
    label: string;
    tag: string;
    tagTone: "success" | "warning";
    steps: Step[];
};

export default function StepList({ label, tag, tagTone, steps }: StepListProps) {
    const tagClasses =
        tagTone === "success"
            ? "bg-success-tint text-success-text"
            : "bg-warning-tint text-warning-text";

    return (
        <div>
            <div className="mb-6 flex items-center gap-2.5 text-sm font-medium text-text-primary">
                <span className={`rounded-full px-2.5 py-0.5 text-xs ${tagClasses}`}>{tag}</span>
                {label}
            </div>

            <ol className="relative">
                {steps.map((step, i) => {
                    const isLast = i === steps.length - 1;
                    return (
                        <li key={step.title} className="relative pb-8 pl-11 last:pb-0">
                            {!isLast && (
                                <span className="absolute bottom-0 left-3.75 top-8 w-px bg-surface-border" />
                            )}
                            <span className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-surface-border bg-surface text-sm text-text-muted">
                                {i + 1}
                            </span>
                            <h3 className="font-medium text-text-primary">{step.title}</h3>
                            <p className="mt-1 text-sm leading-relaxed text-text-muted">{step.body}</p>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}