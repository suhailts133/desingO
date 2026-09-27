export default function GlowBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
      style={{
        background: `
          radial-gradient(ellipse 70% 60% at 82% 8%, red, transparent 60%),
          radial-gradient(ellipse 60% 50% at 10% 100%, blue, transparent 60%)
        `,
      }}
    />
  );
}