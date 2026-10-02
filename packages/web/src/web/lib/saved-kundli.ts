import { useCallback, useEffect, useState } from "react";
import type { BirthInput } from "./kundli";

export type SavedKundli = BirthInput & { id: string; createdAt: number };

const KEY = "astroj.saved-kundlis.v1";
const EVT = "astroj:saved-kundlis";

function read(): SavedKundli[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SavedKundli[]) : [];
  } catch {
    return [];
  }
}

function write(list: SavedKundli[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(EVT));
}

export function getSaved(id: string) {
  return read().find((k) => k.id === id) ?? null;
}

export function saveKundli(input: BirthInput): SavedKundli {
  const item: SavedKundli = { ...input, id: Math.random().toString(36).slice(2, 10), createdAt: Date.now() };
  write([item, ...read()]);
  return item;
}

export function useSavedKundlis() {
  const [list, setList] = useState<SavedKundli[]>([]);

  useEffect(() => {
    const sync = () => setList(read());
    sync();
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const remove = useCallback((id: string) => write(read().filter((k) => k.id !== id)), []);

  return { list, remove };
}
