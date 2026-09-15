import { LegacyData, Migration } from './types';

export function runMigrations(
  data: LegacyData,
  targetVersion: number,
  migrations: Migration[]
): LegacyData {
  if (!data || typeof data.schemaVersion !== 'number') {
    throw new Error('Invalid data: missing schemaVersion');
  }

  let currentData = data;
  const currentVersion = data.schemaVersion;

  if (currentVersion === targetVersion) {
    return currentData;
  }

  if (currentVersion > targetVersion) {
    throw new Error(
      `Cannot downgrade from version ${currentVersion} to ${targetVersion}`
    );
  }

  const sortedMigrations = [...migrations].sort(
    (a, b) => a.fromVersion - b.fromVersion
  );

  for (const migration of sortedMigrations) {
    if (
      currentData.schemaVersion === migration.fromVersion &&
      migration.toVersion <= targetVersion
    ) {
      console.log(
        `[Migration] Running migration ${migration.fromVersion} -> ${migration.toVersion}`
      );
      currentData = migration.migrate(currentData);
    }
  }

  if (currentData.schemaVersion !== targetVersion) {
    throw new Error(
      `Migration failed: expected version ${targetVersion}, got ${currentData.schemaVersion}`
    );
  }

  return currentData;
}
