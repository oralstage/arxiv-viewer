import { useState } from 'react';
import { CATEGORY_GROUPS } from '../constants';

interface Props {
  selected: string[];
  onChange: (categories: string[]) => void;
}

export function CategorySelector({ selected, onChange }: Props) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    () => new Set(CATEGORY_GROUPS.filter((g) =>
      g.categories.some((c) => selected.includes(c.id))
    ).map((g) => g.label)),
  );

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const toggleCategory = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((c) => c !== id)
        : [...selected, id],
    );
  };

  const selectAllInGroup = (groupLabel: string) => {
    const group = CATEGORY_GROUPS.find((g) => g.label === groupLabel);
    if (!group) return;
    const groupIds = group.categories.map((c) => c.id);
    const allSelected = groupIds.every((id) => selected.includes(id));
    if (allSelected) {
      onChange(selected.filter((id) => !groupIds.includes(id)));
    } else {
      const newSet = new Set([...selected, ...groupIds]);
      onChange([...newSet]);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-gray-800">Categories</h2>
        <span className="text-sm text-gray-500">{selected.length} selected</span>
      </div>
      <div className="space-y-2">
        {CATEGORY_GROUPS.map((group) => {
          const isExpanded = expandedGroups.has(group.label);
          const selectedCount = group.categories.filter((c) => selected.includes(c.id)).length;
          return (
            <div key={group.label} className="border border-gray-100 rounded">
              <button
                onClick={() => toggleGroup(group.label)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <span>
                  {group.label}
                  {selectedCount > 0 && (
                    <span className="ml-2 text-xs text-arxiv-red">({selectedCount})</span>
                  )}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isExpanded && (
                <div className="px-3 pb-3">
                  <button
                    onClick={() => selectAllInGroup(group.label)}
                    className="text-xs text-blue-600 hover:text-blue-800 mb-2"
                  >
                    Toggle all
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {group.categories.map((cat) => (
                      <label
                        key={cat.id}
                        className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 rounded px-1 py-0.5"
                      >
                        <input
                          type="checkbox"
                          checked={selected.includes(cat.id)}
                          onChange={() => toggleCategory(cat.id)}
                          className="accent-arxiv-red"
                        />
                        <span className="text-gray-700">
                          <span className="font-mono text-xs text-gray-500">{cat.id}</span>
                          {' '}{cat.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
