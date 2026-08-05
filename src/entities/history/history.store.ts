import { create } from 'zustand';
import type { SchemaSnapshot } from './history.types';
import { useSchemaStore } from '../schema/schema.store';

interface HistoryState {
  past: SchemaSnapshot[];
  future: SchemaSnapshot[];

  push: (snapshot: SchemaSnapshot) => void;

  undo: () => void;

  redo: () => void;

  clear: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  past: [],
  future: [],

  push: (snapshot) =>
    set((state) => ({
      past: [...state.past, structuredClone(snapshot)],
      future: [],
    })),

  undo: () => {
    const history = get();

    if (history.past.length === 0) return;

    const schema = useSchemaStore.getState();

    const current = schema.getSnapshot();

    const previous = history.past.at(-1)!;

    schema.replaceSnapshot(previous);

    set({
      past: history.past.slice(0, -1),

      future: [current, ...history.future],
    });
  },

  redo: () => {
    const history = get();

    if (history.future.length === 0) return;

    const schema = useSchemaStore.getState();

    const current = schema.getSnapshot();

    const next = history.future[0];

    schema.replaceSnapshot(next);

    set({
      past: [...history.past, current],

      future: history.future.slice(1),
    });
  },

  clear: () =>
    set({
      past: [],
      future: [],
    }),
}));
