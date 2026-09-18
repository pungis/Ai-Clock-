import { type CSSProperties, useEffect, useMemo, useState } from "react";
import { DeskClock } from "./components/DeskClock";
import { LatestRelease } from "./components/LatestRelease";
import { ReleaseTimeline } from "./components/ReleaseTimeline";
import { getLatestVerifiedRelease, getReleases } from "./services/releases";
import type { ModelRelease } from "./types/release";

function App() {
  const [releases, setReleases] = useState<ModelRelease[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    getReleases()
      .then((loadedReleases) => {
        if (isMounted) {
          setReleases(loadedReleases);
        }
      })
      .catch((caughtError: unknown) => {
        if (isMounted) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Could not load releases.",
          );
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const latestRelease = useMemo(
    () => getLatestVerifiedRelease(releases),
    [releases],
  );
  const radioScaleRows = [
    {
      className: "frequency",
      labels: ["540", "600", "700", "800", "900", "1000", "1100", "1200", "1400", "1600"],
    },
    {
      className: "city",
      labels: ["London", "Paris", "Józefin", "Berlin", "Roma", "Warszawa", "Józefin", "Moscow", "Hilversum"],
    },
    {
      className: "home",
      labels: ["Józefin", "Józefin", "Józefin", "Józefin", "Józefin"],
    },
    {
      className: "city reverse",
      labels: ["Prague", "Vienna", "Brussels", "Stockholm", "Lisbon", "Madrid"],
    },
    {
      className: "frequency narrow",
      labels: ["49m", "41m", "31m", "25m", "19m", "16m", "13m", "11m"],
    },
    {
      className: "city",
      labels: ["Budapest", "Józefin", "Milano", "Toulouse", "Luxembourg", "BBC", "Józefin", "Oslo", "Athens"],
    },
    {
      className: "city reverse",
      labels: ["Zurich", "Cairo", "Ankara", "Dublin", "Helsinki", "Belgrade"],
    },
    {
      className: "frequency",
      labels: ["88", "92", "96", "100", "104", "108", "LW", "MW", "SW"],
    },
    {
      className: "city",
      labels: ["Copenhagen", "Reykjavik", "Sofia", "Bucharest", "Monaco", "Lyon"],
    },
  ];

  return (
    <>
      <div className="ambient-radio-scale" aria-hidden="true">
        <div className="ambient-radio-scale__needle" />
        {radioScaleRows.map((row, rowIndex) => (
          <div
            className={`ambient-radio-scale__track ${row.className
              .split(" ")
              .map((className) => `ambient-radio-scale__track--${className}`)
              .join(" ")}`}
            key={`${row.className}-${rowIndex}`}
            style={{ "--scale-row": rowIndex } as CSSProperties}
          >
            {[...row.labels, ...row.labels, ...row.labels, ...row.labels].map((label, labelIndex) => (
              <span
                className={label === "Józefin" ? "ambient-radio-scale__home-station" : undefined}
                key={`${label}-${labelIndex}`}
              >
                {label}
              </span>
            ))}
          </div>
        ))}
      </div>

      <main className="app-shell">
        <section className="hero" aria-labelledby="page-title">
          <div className="hero__copy">
            <p className="eyebrow">AI Clock</p>
            <h1 id="page-title">
              <span>Modern release</span>
              <span>watch</span>
            </h1>
            <p className="hero__intro">
              Tune the dial. Track the drops. See how long the AI hype machine
              can keep its mouth shut.
            </p>
            <LatestRelease release={latestRelease} />
          </div>
          <DeskClock release={latestRelease} />
        </section>

        {error ? <p className="data-error">{error}</p> : null}

        <ReleaseTimeline releases={releases} />

        <footer className="site-footer">
          <span>Created by elmo</span>
          <a href="https://github.com/pungis" target="_blank" rel="noreferrer">
            Contact: GitHub @pungis
          </a>
        </footer>
      </main>
    </>
  );
}

export default App;
