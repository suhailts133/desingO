interface AIPromptInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export default function AIPromptInput({ value, onChange, disabled }: AIPromptInputProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      rows={4}
      placeholder="e.g. A modern kitchen with warm wood tones and a marble island"
      className="w-full resize-none rounded-lg bg-surface-hover border border-surface-border text-text-primary placeholder-text-faint p-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    />
  );
}