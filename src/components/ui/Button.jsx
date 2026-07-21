import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary:
    'bg-accent text-white shadow-[0_8px_20px_rgba(15,118,110,0.25)] hover:bg-accent-hover',
  secondary: 'bg-bg-muted text-fg border-border hover:border-border-strong',
  ghost: 'bg-transparent text-fg-secondary hover:bg-bg-muted hover:text-fg',
  danger: 'bg-danger text-white',
  outline: 'bg-transparent border-border-strong text-fg hover:border-accent hover:text-accent',
};

const sizes = {
  sm: 'h-[34px] px-[0.85rem] text-[0.85rem]',
  md: 'h-[42px] px-[1.1rem] text-[0.92rem]',
  lg: 'h-12 px-[1.35rem] text-base',
};

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    type = 'button',
    className = '',
    ...props
  },
  ref
) {
  return (
    <motion.button
      ref={ref}
      type={type}
      className={[
        'inline-flex items-center justify-center gap-2 border border-transparent rounded-md font-semibold cursor-pointer whitespace-nowrap transition-[background,border-color,color,box-shadow] duration-[180ms] ease-in-out disabled:opacity-55 disabled:cursor-not-allowed',
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled || loading}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      whileHover={{ y: disabled || loading ? 0 : -1 }}
      {...props}
    >
      {loading ? (
        <span
          className="size-4 rounded-full border-2 border-white/35 border-t-white animate-spin"
          aria-hidden
        />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!loading && rightIcon}
    </motion.button>
  );
});

export default Button;
