import type { ModelRelease } from "../types/release";

type TimelineItemProps = {
  release: ModelRelease;
};

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

export function TimelineItem({ release }: TimelineItemProps) {
  const releasedAt = new Date(release.releasedAt);

  return (
    <li className="timeline-item">
      <time dateTime={release.releasedAt}>
        <span>{releasedAt.getFullYear()}</span>
        <strong>{monthFormatter.format(releasedAt)}</strong>
      </time>
      <article>
        <div className="timeline-item__header">
          <h3>{release.modelName}</h3>
          <span>{release.company}</span>
        </div>
        <p>{release.summary}</p>
        <div className="timeline-item__footer">
          <span>{release.category}</span>
          <a href={release.sourceUrl} target="_blank" rel="noreferrer">
            Source
          </a>
        </div>
      </article>
    </li>
  );
}
