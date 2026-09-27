const features = [
    { n: "01", title: "For homeowners", body: "See real past work before you commit, and only pay once a designer is chosen." },
    { n: "02", title: "For designers", body: "Apply to jobs that fit your style, or let a strong portfolio bring work to you." },
    { n: "03", title: "No obligation", body: "Either side can decline at the proposal stage — nothing's owed until work starts." },
];

export default function FeatureStrip() {
    return (
        <section className="border-y border-surface-border bg-bg-raised">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-20 sm:grid-cols-3">
                {features.map((f) => (
                    <div key={f.n}>
                        <div className="font-Jost-Semibold text-3xl text-accent">{f.n}</div>
                        <h3 className="mt-2 font-Jost-Semibold text-text-primary">{f.title}</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{f.body}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}