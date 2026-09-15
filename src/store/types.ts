export type LegacyData = Record<string, unknown>;

export interface Migration {
  fromVersion: number;
  toVersion: number;
  migrate: (data: LegacyData) => LegacyData;
}
