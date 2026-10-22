/**
 * One labelled input, with its error wired to the label through
 * `aria-describedby` so the message is announced with the field rather than
 * floating free.
 *
 * The lead form (ContactForm) and the accounting-trial form (TrialForm) each
 * used to carry a private copy of this, so every accessibility or RTL fix had
 * to be made twice. The ROI calculator's sliders are a different control and
 * keep their own markup.
 *
 * No hooks and no browser APIs: it renders inside either form's client
 * boundary without one of its own.
 */
export default function Field({
  id,
  errorId,
  label,
  hint,
  error,
  value,
  onValue,
  ...props
}: {
  id: string;
  /** The error message's id, referenced from the input while there is one. */
  errorId: string;
  label: string;
  /** A short qualifier after the label, in brackets, e.g. "optional". */
  hint?: string;
  error?: string;
  value: string;
  onValue: (value: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "id">) {
  return (
    <label className="flex flex-col gap-1.5" htmlFor={id}>
      <span className="flex items-baseline gap-2">
        <span className="text-sm font-medium text-ink-2">{label}</span>
        {hint ? <span className="text-xs text-ink-dim">({hint})</span> : null}
      </span>
      <input
        {...props}
        id={id}
        value={value}
        onChange={(e) => onValue(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`rounded-xl border bg-surface-2 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-dim/70 focus:border-caramel disabled:opacity-60 ${
          error ? "border-danger" : "border-line"
        }`}
      />
      {error ? (
        <span id={errorId} className="text-xs text-danger">
          {error}
        </span>
      ) : null}
    </label>
  );
}
