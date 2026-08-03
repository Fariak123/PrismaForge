import { create } from 'zustand';

interface EditorStore {
  highlightedNodeId: string | null;

  highlightNode: (id: string | null) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  highlightedNodeId: null,

  highlightNode: (id) => {
    set({
      highlightedNodeId: id,
    });
    if (id) {
      setTimeout(() => {
        set({
          highlightedNodeId: null,
        });
      }, 1000);
    }
  },
}));
