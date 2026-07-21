import { motion } from 'framer-motion';

const toneIcon = {
  accent: 'bg-accent-soft text-accent',
  warning: 'bg-[rgba(217,119,6,0.14)] text-warning',
  info: 'bg-[rgba(2,132,199,0.14)] text-info',
  danger: 'bg-[rgba(220,38,38,0.14)] text-danger',
  success: 'bg-[rgba(5,150,105,0.14)] text-success',
};

function DashboardCard({ title, value, subtitle, icon, tone = 'accent', delay = 0 }) {
  return (
    <motion.div
      className="glass flex items-start gap-[0.95rem] rounded-xl p-[1.15rem] transition-shadow duration-[180ms] ease-in-out hover:shadow-md"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -3 }}
    >
      <div
        className={`grid size-11 shrink-0 place-items-center rounded-[14px] ${toneIcon[tone] || toneIcon.accent}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-[0.8rem] font-semibold text-fg-muted">{title}</p>
        <h3 className="mt-[0.2rem] text-[1.45rem] font-[750] tracking-[-0.02em]">{value}</h3>
        {subtitle && (
          <p className="mt-[0.35rem] max-w-[180px] truncate text-[0.78rem] text-fg-secondary">
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default DashboardCard;
