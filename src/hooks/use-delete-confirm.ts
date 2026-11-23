"use client";

import { useCallback, useState } from "react";

export interface DeleteConfirmState<T> {
  target: T | null;
  isOpen: boolean;
  requestDelete: (item: T) => void;
  close: () => void;
  setOpen: (open: boolean) => void;
}

export function useDeleteConfirm<T>(): DeleteConfirmState<T> {
  const [target, setTarget] = useState<T | null>(null);

  const requestDelete = useCallback((item: T) => {
    setTarget(item);
  }, []);

  const close = useCallback(() => {
    setTarget(null);
  }, []);

  const setOpen = useCallback((open: boolean) => {
    if (!open) {
      setTarget(null);
    }
  }, []);

  return {
    target,
    isOpen: target !== null,
    requestDelete,
    close,
    setOpen,
  };
}
