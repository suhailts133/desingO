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
      className="w-full resize-none rounded-lg border border-gray-200 p-3 text-sm focus:border-black focus:outline-none disabled:opacity-60"
    />
  );
}