import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineCube,
  HiOutlineTag,
  HiOutlineExclamationTriangle,
  HiOutlineCurrencyDollar,
  HiOutlineStar,
  HiOutlineArrowRight,
  HiOutlineLightBulb,
} from 'react-icons/hi2';
import {
  ChartCard,
  InventoryBarChart,
  CategoryPieChart,
  PriceLineChart,
} from '../../components/charts/Charts';
import DashboardCard from '../../components/common/DashboardCard';
import Breadcrumb from '../../components/common/Breadcrumb';
import ProductCard from '../../components/common/ProductCard';
import Badge from '../../components/ui/Badge';
import { CardSkeleton, ProductCardSkeleton } from '../../components/loaders/skeletons';
import ErrorState from '../../components/ui/ErrorState';
import { useAuth } from '../../hooks/useAuth';
import { useProducts } from '../../hooks/useProducts';
import { useInventory } from '../../hooks/useInventory';
import { formatCurrency, formatDate, formatNumber, capitalize } from '../../utils/helpers';
import { APP_NAME, LOW_STOCK_THRESHOLD } from '../../constants';

const activityDotClass = {
  update: 'bg-info',
  delete: 'bg-danger',
  sale: 'bg-success',
  stock: 'bg-accent',
};

const urgencyVariant = {
  critical: 'danger',
  high: 'warning',
  medium: 'info',
};

function Dashboard() {
  const { user } = useAuth();
  const {
    products,
    loading,
    error,
    stats,
    chartData,
    activity,
    fetchProducts,
    reorderSuggestions,
  } = useProducts();
  const { getSupplierById, warehouseSummaries } = useInventory();

  const recentProducts = useMemo(() => products.slice(0, 4), [products]);
  const topSuggestions = useMemo(
    () => reorderSuggestions.slice(0, 6),
    [reorderSuggestions]
  );
  const reorderValue = useMemo(
    () => topSuggestions.reduce((sum, item) => sum + item.estimatedCost, 0),
    [topSuggestions]
  );

  if (error && !products.length) {
    return <ErrorState message={error} onRetry={fetchProducts} />;
  }

  return (
    <div className="page flex flex-col gap-5">
      <Breadcrumb items={[{ label: 'Dashboard' }]} />

      <header>
        <div>
          <p className="font-display text-[1.35rem] text-accent">{APP_NAME}</p>
          <h1 className="mt-1 text-[clamp(1.6rem,2.5vw,2.1rem)] tracking-[-0.03em]">
            Good day, {user?.firstName || 'there'}
          </h1>
          <p className="mt-[0.35rem] max-w-[52ch] text-fg-muted">
            Stock health, supplier reorders, and warehouse capacity at a glance.
          </p>
        </div>
      </header>

      {loading ? (
        <CardSkeleton count={5} />
      ) : (
        <section className="grid grid-cols-5 gap-[0.9rem] max-[1200px]:grid-cols-3 max-[640px]:grid-cols-1">
          <DashboardCard
            title="Total Products"
            value={formatNumber(stats.totalProducts)}
            icon={<HiOutlineCube size={20} />}
            tone="accent"
            delay={0.02}
          />
          <DashboardCard
            title="Categories"
            value={formatNumber(stats.totalCategories)}
            icon={<HiOutlineTag size={20} />}
            tone="info"
            delay={0.06}
          />
          <DashboardCard
            title="Low Stock"
            value={formatNumber(stats.lowStock)}
            subtitle={`Below ${LOW_STOCK_THRESHOLD} units`}
            icon={<HiOutlineExclamationTriangle size={20} />}
            tone="warning"
            delay={0.1}
          />
          <DashboardCard
            title="Avg. Price"
            value={formatCurrency(stats.averagePrice)}
            icon={<HiOutlineCurrencyDollar size={20} />}
            tone="success"
            delay={0.14}
          />
          <DashboardCard
            title="Reorder Alerts"
            value={formatNumber(reorderSuggestions.length)}
            subtitle={
              stats.highestRated
                ? `Top rated ${Number(stats.highestRated.rating).toFixed(1)}`
                : undefined
            }
            icon={<HiOutlineStar size={20} />}
            tone="danger"
            delay={0.18}
          />
        </section>
      )}

      <section className="glass rounded-xl p-[1.1rem]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid size-9 place-items-center rounded-md bg-accent-soft text-accent">
              <HiOutlineLightBulb size={18} />
            </span>
            <div>
              <h3 className="text-[1.05rem]">Intelligent reorder suggestions</h3>
              <p className="mt-1 text-[0.85rem] text-fg-muted">
                Based on reorder points and low-stock thresholds. Suggested top-up
                value: {formatCurrency(reorderValue)}.
              </p>
            </div>
          </div>
          <Link
            to="/warehouses"
            className="inline-flex h-[34px] items-center rounded-md border border-border bg-bg-muted px-[0.85rem] text-[0.85rem] font-semibold hover:border-accent hover:text-accent"
          >
            Receive stock
          </Link>
        </div>

        {!topSuggestions.length ? (
          <p className="text-[0.88rem] text-fg-muted">
            Inventory looks healthy — no reorder suggestions right now.
          </p>
        ) : (
          <div className="overflow-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="text-[0.75rem] uppercase tracking-[0.05em] text-fg-muted">
                  <th className="pb-3 font-bold">Product</th>
                  <th className="pb-3 font-bold">Stock</th>
                  <th className="pb-3 font-bold">Reorder at</th>
                  <th className="pb-3 font-bold">Suggest</th>
                  <th className="pb-3 font-bold">Supplier</th>
                  <th className="pb-3 font-bold">Urgency</th>
                </tr>
              </thead>
              <tbody>
                {topSuggestions.map((item) => {
                  const supplier = getSupplierById(item.supplierId);
                  return (
                    <tr key={item.productId} className="border-t border-border">
                      <td className="py-3">
                        <Link
                          to={`/products/${item.productId}`}
                          className="flex items-center gap-3 font-semibold hover:text-accent"
                        >
                          <img
                            src={item.thumbnail}
                            alt=""
                            className="size-10 rounded-[10px] object-cover"
                          />
                          <span>
                            {item.title}
                            <small className="mt-0.5 block font-normal text-fg-muted">
                              ~{item.daysOfCover} days cover · {capitalize(item.category)}
                            </small>
                          </span>
                        </Link>
                      </td>
                      <td className="py-3">{item.stock}</td>
                      <td className="py-3">{item.reorderPoint}</td>
                      <td className="py-3 font-bold text-accent">
                        +{item.suggestedQty}
                        <small className="mt-0.5 block font-normal text-fg-muted">
                          {formatCurrency(item.estimatedCost)}
                        </small>
                      </td>
                      <td className="py-3 text-[0.88rem]">
                        {supplier?.name || 'Unassigned'}
                      </td>
                      <td className="py-3">
                        <Badge variant={urgencyVariant[item.urgency]}>
                          {item.urgency}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="grid grid-cols-3 gap-4 max-[1200px]:grid-cols-1">
        <ChartCard title="Stock by Category" subtitle="Units available across top categories">
          <InventoryBarChart data={chartData.stock} />
        </ChartCard>
        <ChartCard title="Category Mix" subtitle="Share of catalog by category">
          <CategoryPieChart data={chartData.categories} />
        </ChartCard>
        <ChartCard title="Price Distribution" subtitle="How products cluster by price band">
          <PriceLineChart data={chartData.priceTrend} />
        </ChartCard>
      </section>

      <section className="grid grid-cols-3 gap-[0.9rem] max-[900px]:grid-cols-1">
        {warehouseSummaries.slice(0, 3).map((warehouse) => (
          <Link
            key={warehouse.id}
            to="/warehouses"
            className="glass flex items-center justify-between gap-4 rounded-xl px-[1.2rem] py-[1.1rem] transition-[transform,box-shadow] duration-[180ms] ease-in-out hover:-translate-y-[3px] hover:text-accent hover:shadow-md"
          >
            <div>
              <h3 className="mb-1 text-base">{warehouse.name}</h3>
              <p className="text-[0.82rem] text-fg-muted">
                {formatNumber(warehouse.units)} units · {warehouse.utilization}% capacity
              </p>
            </div>
            <HiOutlineArrowRight />
          </Link>
        ))}
      </section>

      <section className="grid grid-cols-[1.5fr_1fr] gap-4 max-[900px]:grid-cols-1">
        <div className="glass rounded-xl p-[1.1rem]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[1.05rem]">Recent Products</h3>
            <Link to="/products" className="text-[0.85rem] font-[650] text-accent">
              View all
            </Link>
          </div>
          {loading ? (
            <ProductCardSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 gap-[0.85rem] max-[900px]:grid-cols-1">
              {recentProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>

        <div className="glass rounded-xl p-[1.1rem]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[1.05rem]">Recent Activity</h3>
          </div>
          {activity.length === 0 ? (
            <p className="text-[0.78rem] text-fg-muted">
              No local activity yet. Add, edit, or delete a product to see updates here.
            </p>
          ) : (
            <ul className="flex flex-col gap-[0.85rem]">
              {activity.slice(0, 8).map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <span
                    className={`mt-[0.4rem] size-2.5 shrink-0 rounded-full ${
                      activityDotClass[item.type] || 'bg-accent'
                    }`}
                  />
                  <div>
                    <p className="text-[0.88rem]">{item.message}</p>
                    <small className="text-[0.78rem] text-fg-muted">
                      {formatDate(item.timestamp)}
                    </small>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-[1.35rem] border-t border-border pt-4">
            <h4 className="mb-[0.65rem] text-[0.9rem]">Needs attention</h4>
            {products.filter((p) => (p.stock || 0) < LOW_STOCK_THRESHOLD).length ===
            0 ? (
              <p className="text-[0.82rem] text-fg-muted">
                No low-stock items right now.
              </p>
            ) : (
              <ul>
                {products
                  .filter((p) => (p.stock || 0) < LOW_STOCK_THRESHOLD)
                  .slice(0, 5)
                  .map((p) => (
                    <li key={p.id}>
                      <Link
                        to={`/products/${p.id}`}
                        className="flex justify-between gap-3 py-[0.45rem] text-[0.85rem]"
                      >
                        <span>{p.title}</span>
                        <small className="whitespace-nowrap text-warning">
                          {p.stock} · {capitalize(p.category)}
                        </small>
                      </Link>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
