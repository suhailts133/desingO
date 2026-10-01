const features = [
    { n: "01", title: "Verified designers", body: "Every designer's ID, experience and education are reviewed by our team before they can take on work." },
    { n: "02", title: "Pay per milestone", body: "Each service is paid for as it opens, and funds are released only when you approve the result." },
    { n: "03", title: "Dispute protection", body: "If something goes wrong, either side can raise a ticket. Our team can issue a refund, partial refund or warning, or end the contract." },
    { n: "04", title: "AI design ideas", body: "Describe your space and get a design concept, alongside matching work from real designers." },
    { n: "05", title: "Picks that fit you", body: "Customers see designs that match their taste. Designers see jobs that match their style." },
    { n: "06", title: "No obligation upfront", body: "Either side can decline at the proposal stage. Nothing is paid until a contract is agreed." },
];

export default function FeatureStrip() {
    return (
        <section className="border-y border-surface-border bg-bg-raised">
            <div className="mx-auto max-w-7xl px-6 py-20">
                <div className="mb-12 max-w-[46ch]">
                    <p className="mb-2.5 text-sm text-accent">Why designO</p>
                    <h2 className="font-Jost-Semibold text-3xl leading-tight text-text-primary sm:text-4xl">
                        Built so both sides feel safe starting
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((f) => (
                        <div key={f.n}>
                            <div className="font-Jost-Semibold text-3xl text-accent">{f.n}</div>
                            <h3 className="mt-2 font-Jost-Semibold text-text-primary">{f.title}</h3>
                            <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{f.body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
