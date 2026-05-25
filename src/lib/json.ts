import { datasetKeys } from './datasetRegistry';
import { getAllDatasets, getDataset, saveDataset } from './storage';
import type { DatasetKey } from '../types/dataset';

function assertDatasetKey(datasetKey: string): asserts datasetKey is DatasetKey {
  if (!datasetKeys.includes(datasetKey as DatasetKey)) {
    throw new Error(`Unknown datasetKey: ${datasetKey}`);
  }
}

export function downloadJson(filename: string, data: unknown): void {
  const text = JSON.stringify(data, null, 2);
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('Download is only available in browser environment.');
  }
  const blob = new Blob([text], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function parseJsonText<T>(text: string): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error('Invalid JSON text.');
  }
}

export function validateDatasetJson(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function validateBackupJson(value: unknown): value is Record<string, unknown[]> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return Object.entries(record).every(([key, dataset]) => datasetKeys.includes(key as DatasetKey) && Array.isArray(dataset));
}

export function exportDataset(datasetKey: string): string {
  assertDatasetKey(datasetKey);
  const dataset = getDataset<unknown>(datasetKey);
  return JSON.stringify(dataset, null, 2);
}

export function importDataset(datasetKey: string, jsonText: string): void {
  assertDatasetKey(datasetKey);
  const parsed = parseJsonText<unknown>(jsonText);
  if (!validateDatasetJson(parsed)) {
    throw new Error('Dataset JSON must be an array.');
  }
  saveDataset(datasetKey, parsed);
}

export function exportAllDatasets(): string {
  return JSON.stringify(getAllDatasets(), null, 2);
}

export function importAllDatasets(jsonText: string): void {
  const parsed = parseJsonText<unknown>(jsonText);
  if (!validateBackupJson(parsed)) {
    throw new Error('Backup JSON must be an object with datasetKey => array mappings.');
  }

  Object.entries(parsed).forEach(([key, dataset]) => {
    saveDataset(key, dataset);
  });
}
