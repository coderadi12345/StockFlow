import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import { APP_NAME } from '../../constants';

function NotFound() {
  return (
    <div
      className="grid min-h-screen place-items-center p-6"
      style={{ background: 'var(--bg-hero)' }}
    >
      <motion.div
        className="glass w-[min(100%,460px)] rounded-xl px-7 py-9 text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="font-display text-[1.6rem] text-accent">{APP_NAME}</p>
        <h1 className="my-[0.35rem] mb-3 text-[4.5rem] leading-none tracking-[-0.06em]">
          404
        </h1>
        <p className="mb-[1.35rem] text-fg-muted">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col items-center gap-3">
          <Link to="/dashboard">
            <Button>Go to dashboard</Button>
          </Link>
          <Link
            to="/products"
            className="text-[0.9rem] font-semibold text-fg-secondary hover:text-accent"
          >
            Browse products
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default NotFound;
