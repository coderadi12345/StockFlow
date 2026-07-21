import { useEffect, useRef, useState } from 'react';
import { IoClose, IoSearch } from 'react-icons/io5';
import { useDebounce } from '../../hooks/useDebounce';
import { DEBOUNCE_MS } from '../../constants';

function SearchBar({
  value = '',
  onChange,
  onDebouncedChange,
  suggestions = [],
  onSuggestionSelect,
  placeholder = 'Search products…',
  debounceMs = DEBOUNCE_MS,
  className = '',
}) {
  const [localValue, setLocalValue] = useState(value);
  const [open, setOpen] = useState(false);
  const debounced = useDebounce(localValue, debounceMs);
  const wrapRef = useRef(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    onDebouncedChange?.(debounced);
  }, [debounced, onDebouncedChange]);

  useEffect(() => {
    const onClick = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleChange = (e) => {
    const next = e.target.value;
    setLocalValue(next);
    onChange?.(next);
    setOpen(true);
  };

  const clear = () => {
    setLocalValue('');
    onChange?.('');
    onDebouncedChange?.('');
    setOpen(false);
  };

  const showSuggestions = open && localValue.trim() && suggestions.length > 0;

  return (
    <div className={`relative w-full max-w-[420px] ${className}`} ref={wrapRef}>
      <div className="glass flex h-11 items-center gap-[0.55rem] rounded-md px-[0.85rem]">
        <IoSearch className="shrink-0 text-fg-muted" size={18} />
        <input
          type="search"
          value={localValue}
          onChange={handleChange}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          aria-label="Search"
          className="min-w-0 flex-1 border-none bg-transparent outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {localValue && (
          <button
            type="button"
            className="grid size-[26px] place-items-center rounded-sm border-none bg-bg-muted text-fg-muted cursor-pointer"
            onClick={clear}
            aria-label="Clear search"
          >
            <IoClose size={16} />
          </button>
        )}
      </div>

      {showSuggestions && (
        <ul className="glass absolute top-[calc(100%+8px)] right-0 left-0 z-40 max-h-[280px] overflow-y-auto overflow-hidden rounded-md">
          {suggestions.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className="flex w-full cursor-pointer items-center gap-3 border-none bg-transparent px-[0.85rem] py-[0.7rem] text-left hover:bg-bg-muted"
                onClick={() => {
                  onSuggestionSelect?.(item);
                  setLocalValue(item.title);
                  onChange?.(item.title);
                  setOpen(false);
                }}
              >
                <img
                  src={item.thumbnail}
                  alt=""
                  className="size-9 rounded-sm object-cover bg-bg-muted"
                />
                <span className="flex min-w-0 flex-col">
                  <strong className="truncate text-[0.88rem]">{item.title}</strong>
                  <small className="capitalize text-fg-muted">{item.category}</small>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
