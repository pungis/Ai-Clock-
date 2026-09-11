export type ReleaseCategory =
  | "frontier"
  | "open-weight"
  | "reasoning"
  | "multimodal"
  | "coding";

export type ReleaseStatus = "verified" | "candidate";

export type SourceType =
  | "official-blog"
  | "hf-api"
  | "github-release"
  | "paper"
  | "manual";

export type ModelRelease = {
  id: string;
  modelName: string;
  company: string;
  releasedAt: string;
  category: ReleaseCategory;
  summary: string;
  sourceUrl: string;
  sourceType: SourceType;
  status: ReleaseStatus;
};
