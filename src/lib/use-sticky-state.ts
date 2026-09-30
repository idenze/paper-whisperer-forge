import { useEffect, useRef, useState } from "react";

/**
 * State that survives reloads by saving to this device (localStorage).
 * Reads after mount to stay hydration-safe. Pass key=null to disable saving.
 */
export function useStickyState<T>(key: string | null, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const loaded = useRef(false);

  useEffect(() => {
    loaded.current = false;
    if (key) {
      try {
        const raw = window.localStorage.getItem(`ozituma:${key}`);
        if (raw !== null) setValue(JSON.parse(raw) as T);
      } catch { /* ignore bad saved data */ }
    }
    loaded.current = true;
  }, [key]);

  useEffect(() => {
    if (!key || !loaded.current) return;
    try { window.localStorage.setItem(`ozituma:${key}`, JSON.stringify(value)); } catch { /* storage full or blocked */ }
  }, [key, value]);

  return [value, setValue] as const;
}

export function clearSticky(key: string) {
  try { window.localStorage.removeItem(`ozituma:${key}`); } catch { /* ignore */ }
}
