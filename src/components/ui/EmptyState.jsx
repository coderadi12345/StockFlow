import { motion } from 'framer-motion';
import Button from './Button';

function EmptyState({
  icon,
  title = 'Nothing here yet',
  description = 'Try adjusting your filters or add a new item.',
  actionLabel,
  onAction,
}) {
  return (
    <motion.div
      className="glass flex flex-col items-center gap-[0.65rem] rounded-xl px-6 py-12 text-center"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {icon && (
        <div className="mb-[0.35rem] grid size-16 place-items-center rounded-[18px] bg-accent-soft text-accent">
          {icon}
        </div>
      )}
      <h3 className="text-[1.15rem] font-bold">{title}</h3>
      <p className="mb-2 max-w-[360px] text-fg-muted">{description}</p>
      {actionLabel && onAction && <Button onClick={onAction}>{actionLabel}</Button>}
    </motion.div>
  );
}

export default EmptyState;
