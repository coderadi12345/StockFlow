import { useMemo } from 'react';
import Select from '../ui/Select';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { SORT_OPTIONS } from '../../constants';
import { capitalize } from '../../utils/helpers';

function FilterPanel({
  filters,
  onChange,
  categories = [],
  sortValue,
  onSortChange,
  onReset,
}) {
  const categoryOptions = useMemo(
    () => [
      { value: 'all', label: 'All categories' },
      ...categories.map((c) => ({ value: c, label: capitalize(c) })),
    ],
    [categories]
  );

  const handle = (key, value) => {
    onChange?.({ ...filters, [key]: value });
  };

  return (
    <div className="glass rounded-xl px-[1.1rem] py-4">
      <div className="grid grid-cols-3 gap-[0.85rem] max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
        <Select
          label="Category"
          value={filters.category || 'all'}
          onChange={(e) => handle('category', e.target.value)}
          options={categoryOptions}
        />
        <Select
          label="Sort by"
          value={sortValue}
          onChange={(e) => onSortChange?.(e.target.value)}
          options={SORT_OPTIONS}
        />
        <Input
          label="Min price"
          type="number"
          min="0"
          value={filters.minPrice ?? ''}
          onChange={(e) =>
            handle('minPrice', e.target.value === '' ? 0 : Number(e.target.value))
          }
          placeholder="0"
        />
        <Input
          label="Max price"
          type="number"
          min="0"
          value={filters.maxPrice === Infinity || filters.maxPrice == null ? '' : filters.maxPrice}
          onChange={(e) =>
            handle('maxPrice', e.target.value === '' ? Infinity : Number(e.target.value))
          }
          placeholder="Any"
        />
        <Input
          label="Min stock"
          type="number"
          min="0"
          value={filters.minStock ?? ''}
          onChange={(e) =>
            handle('minStock', e.target.value === '' ? 0 : Number(e.target.value))
          }
          placeholder="0"
        />
        <Input
          label="Min rating"
          type="number"
          min="0"
          max="5"
          step="0.1"
          value={filters.minRating ?? ''}
          onChange={(e) =>
            handle('minRating', e.target.value === '' ? 0 : Number(e.target.value))
          }
          placeholder="0"
        />
      </div>
      <div className="mt-[0.9rem] flex items-center justify-between gap-3 max-[560px]:flex-col max-[560px]:items-start">
        <label className="inline-flex cursor-pointer items-center gap-[0.45rem] text-[0.88rem] text-fg-secondary">
          <input
            type="checkbox"
            className="size-4 accent-accent"
            checked={Boolean(filters.inStockOnly)}
            onChange={(e) => handle('inStockOnly', e.target.checked)}
          />
          In stock only
        </label>
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset filters
        </Button>
      </div>
    </div>
  );
}

export default FilterPanel;
