const variantMap = {
  default: 'bg-bg-muted text-fg-secondary',
  success: 'bg-[rgba(5,150,105,0.14)] text-success',
  warning: 'bg-[rgba(217,119,6,0.14)] text-warning',
  danger: 'bg-[rgba(220,38,38,0.14)] text-danger',
  info: 'bg-[rgba(2,132,199,0.14)] text-info',
  accent: 'bg-accent-soft text-accent',
};

function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-[0.55rem] py-[0.2rem] text-[0.72rem] font-[650] tracking-[0.01em] ${variantMap[variant] || variantMap.default} ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
