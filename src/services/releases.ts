import type { ModelRelease } from "../types/release";

export async function getReleases(): Promise<ModelRelease[]> {
  const response = await fetch("/releases.json");

  if (!response.ok) {
    throw new Error(`Could not load releases: ${response.status}`);
  }

  const releases = (await response.json()) as ModelRelease[];

  return releases.sort(
    (first, second) =>
      new Date(second.releasedAt).getTime() -
      new Date(first.releasedAt).getTime(),
  );
}

export function getLatestVerifiedRelease(
  releases: ModelRelease[],
): ModelRelease | undefined {
  return releases.find((release) => release.status === "verified");
}
