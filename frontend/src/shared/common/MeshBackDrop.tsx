import { useTheme } from "../../app/themeContext";

export default function MeshBackdrop() {
  const { theme } = useTheme();
  if (theme !== "light") return null;
   return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
      style={{
        background: `radial-gradient(ellipse 55% 45% at 50% 0%, color-mix(in srgb, var(--color-accent) 16%, transparent), transparent 65%)`,
      }}
    />
  );
}
