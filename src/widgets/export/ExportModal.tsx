import { Copy, Download, FileCode, X } from 'lucide-react';
import CodeViewer from './CodeViewer';
import { useEffect, useState } from 'react';

interface ExportModalProps {
  prisma: string;
  onClose: () => void;
}

export default function ExportModal({ prisma, onClose }: ExportModalProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(prisma);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  function handleDownload() {
    const blob = new Blob([prisma], {
      type: 'text/plain',
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');

    a.href = url;
    a.download = 'schema.prisma';
    a.click();

    URL.revokeObjectURL(url);
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/70
        backdrop-blur-sm
      "
    >
      <div
        className="
          flex
          h-[85vh]
          w-[950px]
          max-w-[95vw]
          flex-col
          overflow-hidden
          rounded-xl
          border
          border-zinc-800
          bg-zinc-950
          shadow-2xl
        "
      >
        {/* Header */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-zinc-800
            px-6
            py-4
          "
        >
          <div className="flex items-center border-b border-zinc-800">
            <div
              className="
            flex
            items-center
            gap-2
            border-r
            border-zinc-800
            bg-zinc-900
            px-4
            py-3
            "
            >
              <FileCode size={16} className="text-sky-400" />
              <span className="text-sm text-zinc-200">schema.prisma</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="
              rounded-md
              p-2
              text-zinc-400
              transition
              hover:bg-zinc-800
              hover:text-white
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* Code */}

        <div className="flex-1 overflow-auto bg-zinc-950">
          <div className="flex-1 overflow-auto bg-zinc-950">
            <CodeViewer code={prisma} />
          </div>
        </div>

        {/* Footer */}

        <div
          className="
            flex
            justify-end
            gap-3
            border-t
            border-zinc-800
            p-5
          "
        >
          <button
            onClick={handleCopy}
            className="
              flex
              items-center
              gap-2
              rounded-lg
              border
              border-zinc-700
              px-4
              py-2
              text-sm
              text-zinc-300
              transition
              hover:border-blue-500
              hover:text-white
            "
          >
            <Copy size={16} />
            {copied ? 'Copied!' : 'Copy'}
          </button>

          <button
            onClick={handleDownload}
            className="
              flex
              items-center
              gap-2
              rounded-lg
              border
              border-zinc-700
              px-4
              py-2
              text-sm
              text-zinc-300
              transition
              hover:border-blue-500
              hover:text-white
            "
          >
            <Download size={16} />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
