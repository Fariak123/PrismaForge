import { create } from 'zustand';

interface EditorStore {
  highlightedNodeId: string | null;
  highlightedColumnId: string | null;

  highlightNode: (id: string | null) => void;
  highlightColumn: (id: string | null) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  highlightedNodeId: null,
  highlightedColumnId: null,

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
  
  highlightColumn: (id) => {
  set({
    highlightedColumnId: id,
  });

  if (id) {
    setTimeout(() => {
      set({
        highlightedColumnId: null,
      });
    }, 1000);
  }
},
}));
