import { forwardRef } from 'react';

const Select = forwardRef(function Select(
  { label, error, hint, options = [], placeholder, className = '', id, ...props },
  ref
) {
  const selectId = id || props.name;

  return (
    <div className={`flex w-full flex-col gap-[0.4rem] ${className}`}>
      {label && (
        <label className="text-[0.85rem] font-semibold text-fg-secondary" htmlFor={selectId}>
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={[
          'h-11 w-full cursor-pointer appearance-none rounded-md border bg-input px-[0.9rem] py-[0.7rem] pr-[2.2rem] outline-none transition-[border-color,box-shadow] duration-[180ms] ease-in-out focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)]',
          error ? 'border-danger' : 'border-border',
          "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%6494a3b8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")] bg-size-[auto] bg-position-[right_0.75rem_center] bg-no-repeat",
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-[0.78rem] text-danger">{error}</p>}
      {!error && hint && <p className="text-[0.78rem] text-fg-muted">{hint}</p>}
    </div>
  );
});

export default Select;
