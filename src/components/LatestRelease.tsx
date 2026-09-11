import type { ModelRelease } from "../types/release";

type LatestReleaseProps = {
  release?: ModelRelease;
};

const releaseDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

export function LatestRelease({ release }: LatestReleaseProps) {
  if (!release) {
    return (
      <section className="latest-release">
        <p className="eyebrow">Latest tracked update</p>
        <h2>No verified releases loaded</h2>
        <p>The timeline data source is empty or temporarily unavailable.</p>
      </section>
    );
  }

  return (
    <section className="latest-release" aria-labelledby="latest-release-title">
      <p className="eyebrow">Latest tracked update</p>
      <h2 id="latest-release-title">{release.modelName}</h2>
      <div className="latest-release__meta">
        <span>{release.company}</span>
        <span>{releaseDateFormatter.format(new Date(release.releasedAt))}</span>
        <span>{release.category}</span>
      </div>
      <p>{release.summary}</p>
      <a href={release.sourceUrl} target="_blank" rel="noreferrer">
        Official source
      </a>
    </section>
  );
}
