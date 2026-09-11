type DatePlaqueProps = {
  label: string;
  value: string;
};

export function DatePlaque({ label, value }: DatePlaqueProps) {
  return (
    <div className="date-plaque">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
