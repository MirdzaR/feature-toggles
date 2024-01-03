export interface FeatureToggle {
  id: number;
  displayName?: string;
  technicalName: string;
  expiresOn?: string;
  description?: string;
  inverted: boolean;
  customerIds: string[];
  archived: boolean;
}
