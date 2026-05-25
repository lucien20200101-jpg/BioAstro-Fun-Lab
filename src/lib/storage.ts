import { datasetKeys, getDefaultDataset } from './datasetRegistry';
import type { DatasetKey } from '../types/dataset';

const STORAGE_PREFIX = 'bioastro.dataset:';

function isBrowserEnv(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function toStorageKey(datasetKey: DatasetKey): string {
  return `${STORAGE_PREFIX}${datasetKey}`;
}

function assertDatasetKey(datasetKey: string): asserts datasetKey is DatasetKey {
  if (!datasetKeys.includes(datasetKey as DatasetKey)) {
    throw new Error(`Unknown datasetKey: ${datasetKey}`);
  }
}

export function hasLocalDataset(datasetKey: string): boolean {
  assertDatasetKey(datasetKey);
  if (!isBrowserEnv()) return false;
  try {
    return window.localStorage.getItem(toStorageKey(datasetKey)) !== null;
  } catch {
    return false;
  }
}

export function getDataset<T>(datasetKey: string): T[] {
  assertDatasetKey(datasetKey);
  if (!isBrowserEnv()) {
    return getDefaultDataset<T>(datasetKey);
  }

  const localKey = toStorageKey(datasetKey);
  try {
    const raw = window.localStorage.getItem(localKey);
    if (raw === null) {
      return getDefaultDataset<T>(datasetKey);
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error(`Invalid dataset format for ${datasetKey}. Expected array.`);
    }
    return parsed as T[];
  } catch {
    return getDefaultDataset<T>(datasetKey);
  }
}

export function saveDataset<T>(datasetKey: string, data: T[]): void {
  assertDatasetKey(datasetKey);
  if (!Array.isArray(data)) {
    throw new Error(`Invalid dataset for ${datasetKey}. Expected array.`);
  }
  if (!isBrowserEnv()) {
    throw new Error('localStorage is not available in current environment.');
  }
  try {
    window.localStorage.setItem(toStorageKey(datasetKey), JSON.stringify(data));
  } catch (error) {
    throw new Error(`Failed to save dataset ${datasetKey}: ${(error as Error).message}`);
  }
}

export function resetDataset(datasetKey: string): void {
  assertDatasetKey(datasetKey);
  if (!isBrowserEnv()) return;
  try {
    window.localStorage.removeItem(toStorageKey(datasetKey));
  } catch {
    // swallow to avoid page crash
  }
}

export function getDefaultDatasetByKey<T>(datasetKey: string): T[] {
  assertDatasetKey(datasetKey);
  return getDefaultDataset<T>(datasetKey);
}

export { getDefaultDatasetByKey as getDefaultDataset };

export function getAllDatasets(): Record<string, unknown[]> {
  return datasetKeys.reduce<Record<string, unknown[]>>((acc, key) => {
    acc[key] = getDataset<unknown>(key);
    return acc;
  }, {});
}
