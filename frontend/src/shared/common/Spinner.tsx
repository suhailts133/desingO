export default function Spinner() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex-1 w-full h-full min-h-[50vh] flex items-center justify-center"
    >
      <div className="w-16 h-16 rounded-full border-[5px] border-surface-border border-t-accent animate-spin [animation-duration:0.4s]" />
    </div>
  );
}
