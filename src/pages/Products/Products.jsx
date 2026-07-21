import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  HiOutlinePlus,
  HiOutlineSquares2X2,
  HiOutlineTableCells,
  HiOutlineInbox,
} from 'react-icons/hi2';
import Breadcrumb from '../../components/common/Breadcrumb';
import FilterPanel from '../../components/common/FilterPanel';
import ProductCard from '../../components/common/ProductCard';
import ProductTable from '../../components/common/ProductTable';
import SearchBar from '../../components/ui/SearchBar';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import {
  ProductCardSkeleton,
  TableSkeleton,
} from '../../components/loaders/skeletons';
import { useProducts } from '../../hooks/useProducts';
import { usePagination } from '../../hooks/usePagination';
import { DEFAULT_PAGE_SIZE } from '../../constants';
import ProductFormModal from './ProductFormModal';

const defaultFilters = {
  search: '',
  category: 'all',
  minPrice: 0,
  maxPrice: Infinity,
  minStock: 0,
  maxStock: Infinity,
  minRating: 0,
  inStockOnly: false,
};

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories, loading, error, fetchProducts, getFilteredProducts, addProduct, updateProduct, deleteProduct, products } =
    useProducts();

  const [filters, setFilters] = useState({
    ...defaultFilters,
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
  });
  const [sortValue, setSortValue] = useState('title-asc');
  const [view, setView] = useState('grid');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'all';
    setFilters((prev) => ({ ...prev, search, category }));
  }, [searchParams]);

  const filtered = useMemo(
    () => getFilteredProducts(filters, sortValue),
    [getFilteredProducts, filters, sortValue]
  );

  const pagination = usePagination(filtered, DEFAULT_PAGE_SIZE);

  useEffect(() => {
    pagination.resetPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortValue]);

  const suggestions = useMemo(() => {
    if (!filters.search?.trim()) return [];
    const q = filters.search.toLowerCase();
    return products.filter((p) => p.title?.toLowerCase().includes(q)).slice(0, 6);
  }, [products, filters.search]);

  const onDebouncedSearch = useCallback(
    (value) => {
      setFilters((prev) => ({ ...prev, search: value }));
      const next = new URLSearchParams(searchParams);
      if (value.trim()) next.set('search', value.trim());
      else next.delete('search');
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const resetFilters = () => {
    setFilters({ ...defaultFilters });
    setSortValue('title-asc');
    setSearchParams({}, { replace: true });
  };

  const handleSave = (values) => {
    if (editing) {
      updateProduct(editing.id, values);
    } else {
      addProduct(values);
    }
    setEditing(null);
  };

  if (error && !products.length) {
    return <ErrorState message={error} onRetry={fetchProducts} />;
  }

  const viewBtnClass = (active) =>
    `grid h-[34px] w-[38px] place-items-center rounded-[10px] border-none cursor-pointer ${
      active
        ? 'bg-accent-soft text-accent'
        : 'bg-transparent text-fg-muted'
    }`;

  return (
    <div className="page flex flex-col gap-[1.1rem]">
      <Breadcrumb items={[{ label: 'Products' }]} />

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.55rem,2.4vw,2rem)] tracking-[-0.03em]">
            Products
          </h1>
          <p className="mt-1 text-fg-muted">
            Search, filter, and manage your inventory catalog.
          </p>
        </div>
        <Button
          leftIcon={<HiOutlinePlus size={18} />}
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          Add Product
        </Button>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-[0.85rem]">
        <SearchBar
          className="!max-w-[480px] flex-1"
          value={filters.search}
          onChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
          onDebouncedChange={onDebouncedSearch}
          suggestions={suggestions}
          placeholder="Search by name, brand, category…"
        />
        <div className="inline-flex gap-[0.35rem] rounded-md border border-border bg-bg-elevated p-1">
          <button
            type="button"
            className={viewBtnClass(view === 'grid')}
            onClick={() => setView('grid')}
            aria-label="Grid view"
          >
            <HiOutlineSquares2X2 size={18} />
          </button>
          <button
            type="button"
            className={viewBtnClass(view === 'table')}
            onClick={() => setView('table')}
            aria-label="Table view"
          >
            <HiOutlineTableCells size={18} />
          </button>
        </div>
      </div>

      <FilterPanel
        filters={filters}
        onChange={setFilters}
        categories={categories}
        sortValue={sortValue}
        onSortChange={setSortValue}
        onReset={resetFilters}
      />

      {loading ? (
        view === 'grid' ? (
          <ProductCardSkeleton count={8} />
        ) : (
          <TableSkeleton rows={8} />
        )
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<HiOutlineInbox size={28} />}
          title="No products found"
          description="Try clearing filters or add a new product to your catalog."
          actionLabel="Reset filters"
          onAction={resetFilters}
        />
      ) : (
        <>
          {view === 'grid' ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
              {pagination.items.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <ProductTable
              products={pagination.items}
              canManage
              onEdit={(product) => {
                setEditing(product);
                setFormOpen(true);
              }}
              onDelete={setDeleting}
            />
          )}

          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            pageSize={pagination.pageSize}
            onPageChange={pagination.goToPage}
          />
        </>
      )}

      <ProductFormModal
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSave}
        product={editing}
        categories={categories}
      />

      <ConfirmDialog
        isOpen={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) deleteProduct(deleting.id);
          setDeleting(null);
        }}
        title="Delete product"
        message={`Are you sure you want to delete “${deleting?.title}”? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}

export default Products;
