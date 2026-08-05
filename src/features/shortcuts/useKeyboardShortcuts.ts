import { useEffect } from 'react';

interface Shortcuts {
  save?: () => void;
  newPorject?: () => void;
  open?: () => void;
  undo?: () => void;
  redo?: () => void;
  delete?: () => void;
  fitView?: () => void;
  search?: () => void;
}

export function useKeyboardShortcuts({
  save,
  newPorject,
  open,
  undo,
  redo,
  fitView,
}: Shortcuts) {

  useEffect(() => {

    const handler = (event: KeyboardEvent) => {

      const ctrl =
        event.ctrlKey || event.metaKey;


      // Ignore typing in inputs

      const target =
        event.target as HTMLElement;

      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA'
      ) {
        return;
      }


      if (ctrl && event.key === 's') {
        event.preventDefault();
        save?.();
      }


      if (ctrl && event.key === 'n') {
        event.preventDefault();
        newPorject?.();
      }


      if (ctrl && event.key === 'o') {
        event.preventDefault();
        open?.();
      }


      if (ctrl && event.key === 'z') {

        event.preventDefault();

        if (event.shiftKey) {
          redo?.();
        } else {
          undo?.();
        }

      }


      if (event.key.toLowerCase() === 'f') {
        fitView?.();
      }

    };


    window.addEventListener(
      'keydown',
      handler
    );


    return () =>
      window.removeEventListener(
        'keydown',
        handler
      );

  }, [
    save,
    open,
    undo,
    redo,
    fitView,
  ]);
}