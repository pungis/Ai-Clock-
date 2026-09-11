type FlipCardProps = {
  value: string;
  label?: string;
  variant?: "default" | "wide";
};

export function FlipCard({ value, label, variant = "default" }: FlipCardProps) {
  return (
    <span
      className={`flip-card flip-card--${variant}`}
      aria-label={label ? `${label}: ${value}` : value}
    >
      <span className="flip-card__top">{value}</span>
      <span className="flip-card__bottom">{value}</span>
      <span className="flip-card__hinge" aria-hidden="true" />
    </span>
  );
}
