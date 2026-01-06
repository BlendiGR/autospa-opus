"use client";

import { useState, useCallback } from "react";

/**
 * Manages loading, success, and error states for asynchronous operations.
 *
 * @param initialState - Initial loading state (default: false)
 * @returns Object containing loading/success/error states and helper functions
 */
export function useLoading(initialState: boolean = false) {
  const [loading, setLoading] = useState(initialState);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const withLoading = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setServerError(null);
    try {
      return await fn();
    } finally {
      setLoading(false);
    }
  }, []);

  const startLoading = useCallback(() => {
    setLoading(true);
    setServerError(null);
  }, []);

  const stopLoading = useCallback(() => {
    setLoading(false);
  }, []);

  const resetState = useCallback(() => {
    setLoading(false);
    setSuccess(false);
    setServerError(null);
  }, []);

  return {
    loading,
    setLoading,
    success,
    setSuccess,
    serverError,
    setServerError,
    withLoading,
    startLoading,
    stopLoading,
    resetState,
  };
}
