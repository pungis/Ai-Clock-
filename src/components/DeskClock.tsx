import { useElapsedTime } from "../hooks/useElapsedTime";
import type { ModelRelease } from "../types/release";
import { DatePlaque } from "./DatePlaque";
import { FlipCard } from "./FlipCard";

function padTime(value: number): string {
  return String(value).padStart(2, "0");
}

const releaseDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

type DeskClockProps = {
  release?: ModelRelease;
};

export function DeskClock({ release }: DeskClockProps) {
  const elapsedTime = useElapsedTime(release?.releasedAt);
  const days = String(elapsedTime.days);
  const hours = padTime(elapsedTime.hours);
  const minutes = padTime(elapsedTime.minutes);
  const seconds = padTime(elapsedTime.seconds);
  const plaqueValue = release
    ? `${release.modelName} - ${releaseDateFormatter.format(new Date(release.releasedAt))}`
    : "Waiting for verified data";

  return (
    <section className="desk-clock" aria-label="Time since latest model release">
      <div className="desk-clock__crest" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="desk-clock__face">
        <p className="desk-clock__label">Time since latest tracked release</p>
        <div className="flip-time flip-time--elapsed" aria-live="off">
          <div className="flip-unit flip-unit--days">
            <FlipCard value={days} label="Days" variant="wide" />
            <span>Days</span>
          </div>
          <div className="flip-unit">
            <FlipCard value={hours} label="Hours" />
            <span>Hours</span>
          </div>
          <div className="flip-unit">
            <FlipCard value={minutes} label="Minutes" />
            <span>Minutes</span>
          </div>
          <div className="flip-unit">
            <FlipCard value={seconds} label="Seconds" />
            <span>Seconds</span>
          </div>
        </div>
        <DatePlaque label="Counting from" value={plaqueValue} />
      </div>
      <div className="desk-clock__base" aria-hidden="true" />
    </section>
  );
}
