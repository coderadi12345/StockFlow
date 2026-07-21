import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiStar } from 'react-icons/hi2';
import Badge from '../ui/Badge';
import { formatCurrency, capitalize } from '../../utils/helpers';
import { LOW_STOCK_THRESHOLD } from '../../constants';

function ProductCard({ product, index = 0 }) {
  const stockVariant =
    product.stock <= 0 ? 'danger' : product.stock < LOW_STOCK_THRESHOLD ? 'warning' : 'success';
  const stockLabel =
    product.stock <= 0
      ? 'Out of stock'
      : product.stock < LOW_STOCK_THRESHOLD
        ? 'Low stock'
        : 'In stock';

  return (
    <motion.article
      className="group glass overflow-hidden rounded-xl transition-shadow duration-[180ms] ease-in-out hover:shadow-md"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.3) }}
      whileHover={{ y: -4 }}
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative aspect-4/3 overflow-hidden bg-bg-muted">
          <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-[350ms] ease-in-out group-hover:scale-105"
          />
          <Badge variant={stockVariant} className="absolute top-3 left-3">
            {stockLabel}
          </Badge>
        </div>
        <div className="px-4 pt-[0.95rem] pb-[1.1rem]">
          <p className="mb-[0.35rem] text-[0.72rem] font-[650] tracking-[0.06em] text-fg-muted uppercase">
            {capitalize(product.category)}
          </p>
          <h3 className="line-clamp-2 min-h-[2.7em] text-[0.98rem] leading-[1.35] font-bold">
            {product.title}
          </h3>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[1.05rem] font-[750] text-accent">
              {formatCurrency(product.price)}
            </span>
            <span className="inline-flex items-center gap-1 text-[0.85rem] font-[650] text-warning">
              <HiStar /> {Number(product.rating || 0).toFixed(1)}
            </span>
          </div>
          <p className="mt-[0.45rem] text-[0.78rem] text-fg-muted">{product.stock} units</p>
        </div>
      </Link>
    </motion.article>
  );
}

export default ProductCard;
