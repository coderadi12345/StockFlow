import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { label, error, hint, leftIcon, rightIcon, className = '', id, ...props },
  ref
) {
  const inputId = id || props.name;

  return (
    <div className={`flex w-full flex-col gap-[0.4rem] ${className}`}>
      {label && (
        <label className="text-[0.85rem] font-semibold text-fg-secondary" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="pointer-events-none absolute left-[0.85rem] inline-flex text-fg-muted">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            'h-11 w-full rounded-md border bg-input px-[0.9rem] py-[0.7rem] outline-none transition-[border-color,box-shadow] duration-[180ms] ease-in-out focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)]',
            error ? 'border-danger' : 'border-border',
            leftIcon ? 'pl-10' : '',
            rightIcon ? 'pr-10' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-[0.85rem] inline-flex cursor-pointer text-fg-muted">
            {rightIcon}
          </span>
        )}
      </div>
      {error && <p className="text-[0.78rem] text-danger">{error}</p>}
      {!error && hint && <p className="text-[0.78rem] text-fg-muted">{hint}</p>}
    </div>
  );
});

export default Input;
