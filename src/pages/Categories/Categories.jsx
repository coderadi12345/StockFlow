import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineTag } from 'react-icons/hi2';
import Breadcrumb from '../../components/common/Breadcrumb';
import SearchBar from '../../components/ui/SearchBar';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { CardSkeleton } from '../../components/loaders/skeletons';
import { useProducts } from '../../hooks/useProducts';
import { capitalize, formatNumber } from '../../utils/helpers';

function Categories() {
  const { products, categories, loading, error, fetchProducts } = useProducts();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState('all');

  const categoryStats = useMemo(() => {
    return categories
      .map((cat) => {
        const items = products.filter((p) => p.category === cat);
        const stock = items.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
        const avgPrice =
          items.length === 0
            ? 0
            : items.reduce((sum, p) => sum + (Number(p.price) || 0), 0) / items.length;
        return {
          name: cat,
          count: items.length,
          stock,
          avgPrice,
          thumbnail: items[0]?.thumbnail,
        };
      })
      .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b.count - a.count);
  }, [categories, products, search]);

  const filteredProducts = useMemo(() => {
    if (selected === 'all') return products.slice(0, 12);
    return products.filter((p) => p.category === selected);
  }, [products, selected]);

  if (error && !categories.length) {
    return <ErrorState message={error} onRetry={fetchProducts} />;
  }

  const cardClass = (active) =>
    `glass cursor-pointer rounded-xl border border-transparent p-4 text-left text-inherit ${
      active ? 'border-accent shadow-[0_0_0_3px_var(--accent-soft)]' : ''
    }`;

  return (
    <div className="page flex flex-col gap-[1.15rem]">
      <Breadcrumb items={[{ label: 'Categories' }]} />

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.55rem,2.4vw,2rem)] tracking-[-0.03em]">
            Categories
          </h1>
          <p className="mt-1 text-fg-muted">
            Browse inventory by category and drill into product groups.
          </p>
        </div>
        <SearchBar
          value={search}
          onChange={setSearch}
          onDebouncedChange={setSearch}
          placeholder="Search categories…"
        />
      </header>

      {loading ? (
        <CardSkeleton count={8} />
      ) : categoryStats.length === 0 ? (
        <EmptyState
          icon={<HiOutlineTag size={28} />}
          title="No categories found"
          description="Try a different search term."
          actionLabel="Clear search"
          onAction={() => setSearch('')}
        />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-[0.85rem]">
          <motion.button
            type="button"
            className={cardClass(selected === 'all')}
            onClick={() => setSelected('all')}
            whileHover={{ y: -3 }}
          >
            <div className="mb-3 grid size-12 place-items-center overflow-hidden rounded-[14px] bg-accent-soft text-accent">
              <HiOutlineTag size={20} />
            </div>
            <h3 className="mb-1 text-[0.98rem]">All products</h3>
            <p className="text-[0.78rem] text-fg-muted">
              {formatNumber(products.length)} items
            </p>
          </motion.button>

          {categoryStats.map((cat, index) => (
            <motion.button
              type="button"
              key={cat.name}
              className={cardClass(selected === cat.name)}
              onClick={() => setSelected(cat.name)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.03, 0.3) }}
              whileHover={{ y: -3 }}
            >
              <div className="mb-3 grid size-12 place-items-center overflow-hidden rounded-[14px] bg-accent-soft text-accent">
                {cat.thumbnail ? (
                  <img src={cat.thumbnail} alt="" className="size-full object-cover" />
                ) : (
                  <HiOutlineTag size={20} />
                )}
              </div>
              <h3 className="mb-1 text-[0.98rem]">{capitalize(cat.name)}</h3>
              <p className="text-[0.78rem] text-fg-muted">
                {formatNumber(cat.count)} products · {formatNumber(cat.stock)} units
              </p>
            </motion.button>
          ))}
        </div>
      )}

      <section className="glass rounded-xl p-[1.1rem]">
        <div className="mb-[0.85rem] flex items-center justify-between">
          <h2>
            {selected === 'all' ? 'Featured products' : capitalize(selected)}
          </h2>
          <Link
            to={
              selected === 'all'
                ? '/products'
                : `/products?category=${encodeURIComponent(selected)}`
            }
            className="text-[0.85rem] font-[650] text-accent"
          >
            View in products
          </Link>
        </div>

        <div className="flex flex-col">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="grid grid-cols-[48px_1fr_auto] items-center gap-[0.85rem] border-b border-border py-[0.7rem] px-[0.2rem] last:border-b-0"
            >
              <img
                src={product.thumbnail}
                alt=""
                className="size-12 rounded-[10px] object-cover"
              />
              <div>
                <strong className="block text-[0.9rem]">{product.title}</strong>
                <small className="text-fg-muted">{capitalize(product.category)}</small>
              </div>
              <span className="font-bold text-accent">
                ${Number(product.price).toFixed(2)}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Categories;
