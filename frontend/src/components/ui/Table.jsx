import { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

function sortData(data, sortKey, sortDir) {
  if (!sortKey) return data;
  return [...data].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    let cmp;
    if (typeof av === 'number' && typeof bv === 'number') {
      cmp = av - bv;
    } else {
      cmp = String(av).localeCompare(String(bv), undefined, { sensitivity: 'base' });
    }
    return sortDir === 'desc' ? -cmp : cmp;
  });
}

export function Table({ columns, data, onRowClick }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = sortData(data, sortKey, sortDir);

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
      <table className="min-w-full text-sm">
        <thead className="border-b border-white/10">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                className="px-5 py-3.5 text-left font-semibold text-muted uppercase tracking-wider text-xs cursor-pointer select-none hover:text-white transition-colors"
              >
                <span className="flex items-center gap-1">
                  {col.label}
                  {sortKey === col.key ? (
                    sortDir === 'asc'
                      ? <ChevronUp size={12} className="text-blue-400" />
                      : <ChevronDown size={12} className="text-blue-400" />
                  ) : (
                    <ChevronsUpDown size={12} className="text-white/20" />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-12 text-muted">
                No data found
              </td>
            </tr>
          ) : (
            sorted.map((row, i) => (
              <tr
                key={row.id ?? i}
                onClick={() => onRowClick?.(row)}
                className={`transition-colors duration-150 ${onRowClick ? 'cursor-pointer hover:bg-white/5' : 'hover:bg-white/3'}`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-3.5 text-foreground">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
