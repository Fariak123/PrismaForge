import { useEditorStore } from "./editor.store";

export function useSelectedNode() {
  return useEditorStore((state) =>
    state.nodes.find(
      (node) =>
        node.id === state.selectedNodeId
    )
  );
}