import { useCallback, useMemo, useState } from 'react';
import { datasetKeys } from '../lib/datasetRegistry';
import { getDataset, hasLocalDataset, resetDataset as resetLocalDataset, saveDataset } from '../lib/storage';
import type { DatasetKey, LocalDatasetState } from '../types/dataset';

function assertDatasetKey(datasetKey: string): asserts datasetKey is DatasetKey {
  if (!datasetKeys.includes(datasetKey as DatasetKey)) {
    throw new Error(`Unknown datasetKey: ${datasetKey}`);
  }
}

export function useLocalDataset<T = unknown>(datasetKey: string) {
  assertDatasetKey(datasetKey);

  const [state, setState] = useState<LocalDatasetState<T>>(() => {
    try {
      return {
        data: getDataset<T>(datasetKey),
        isUsingLocalData: hasLocalDataset(datasetKey),
        error: null,
      };
    } catch (error) {
      return {
        data: getDataset<T>(datasetKey),
        isUsingLocalData: false,
        error: (error as Error).message,
      };
    }
  });

  const setData = useCallback((updater: T[] | ((prev: T[]) => T[])) => {
    setState((prev) => {
      const nextData = typeof updater === 'function' ? (updater as (prev: T[]) => T[])(prev.data) : updater;
      return { ...prev, data: nextData, error: null };
    });
  }, []);

  const saveData = useCallback(() => {
    try {
      saveDataset(datasetKey, state.data);
      setState((prev) => ({ ...prev, isUsingLocalData: true, error: null }));
    } catch (error) {
      setState((prev) => ({ ...prev, error: (error as Error).message }));
    }
  }, [datasetKey, state.data]);

  const resetData = useCallback(() => {
    try {
      resetLocalDataset(datasetKey);
      setState({
        data: getDataset<T>(datasetKey),
        isUsingLocalData: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, error: (error as Error).message }));
    }
  }, [datasetKey]);

  return useMemo(
    () => ({
      data: state.data,
      setData,
      saveData,
      resetData,
      isUsingLocalData: state.isUsingLocalData,
      error: state.error,
    }),
    [resetData, saveData, setData, state.data, state.error, state.isUsingLocalData],
  );
}
