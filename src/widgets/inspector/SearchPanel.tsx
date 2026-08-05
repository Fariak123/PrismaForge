import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { useSchemaStore } from '../../entities/schema/schema.store';

interface Props {
  onSelect: (tableId: string) => void;
}

export default function SearchPanel({ onSelect }: Props) {
  const [query, setQuery] = useState('');

  const tables = useSchemaStore((s) => s.tables);

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();

    return tables.filter((table) => table.name.toLowerCase().includes(q));
  }, [query, tables]);

  return (
    <div className="sticky top-0 z-10border-b border-zinc-800 bg-zinc-950 p-4">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
        />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && results.length > 0) {
              onSelect(results[0].id);
              setQuery('');
            }

            if (e.key === 'Escape') {
              setQuery('');
            }
          }}
          placeholder="Search tables..."
          className="
            h-10
            w-full
            rounded-lg
            border
            border-zinc-800
            bg-zinc-900
            pl-10
            pr-3
            text-sm
            text-zinc-200
            outline-none
            transition
            focus:border-blue-500
          "
        />
      </div>

      {results.length > 0 && (
        <div
          className="
            mt-3
            max-h-64
            space-y-1
            overflow-y-auto
          "
        >
          {results.map((table) => (
            <button
              key={table.id}
              onClick={() => {
                onSelect(table.id);
                setQuery('');
              }}
              className="
                flex
                w-full
                items-center
                justify-between
                rounded-md
                px-3
                py-2
                text-left
                text-sm
                text-zinc-300
                transition

                hover:bg-zinc-800
                hover:text-white
              "
            >
              <span>{table.name}</span>

              <span className="text-xs text-zinc-500">
                {table.columns.length} cols
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
