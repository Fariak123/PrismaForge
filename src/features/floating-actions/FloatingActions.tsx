import { LayoutGrid, ScanSearch, LocateFixed } from 'lucide-react';

import FloatingActionButton from './FloatingActionButton';

interface Props {
  onAutoLayout: () => void;

  onFitView: () => void;

  onCenter: () => void;
}

export default function FloatingActions({
  onAutoLayout,

  onFitView,

  onCenter,
}: Props) {
  return (
    <div
      className="
        absolute

        left-4
        bottom-4

        z-20

        flex
        flex-col
        gap-2
      "
    >
      <FloatingActionButton
        icon={<LayoutGrid size={18} />}

        label="Auto Layout"

        onClick={onAutoLayout}
      />

      <FloatingActionButton
        icon={<ScanSearch size={18} />}

        label="Fit View"

        onClick={onFitView}
      />

      <FloatingActionButton
        icon={<LocateFixed size={18} />}

        label="Center"

        onClick={onCenter}
      />
    </div>
  );
}
