import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiStar,
  HiArrowLeft,
} from 'react-icons/hi2';
import Breadcrumb from '../../components/common/Breadcrumb';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import ErrorState from '../../components/ui/ErrorState';
import { DetailSkeleton } from '../../components/loaders/skeletons';
import { useProducts } from '../../hooks/useProducts';
import { useInventory } from '../../hooks/useInventory';
import { formatCurrency, capitalize } from '../../utils/helpers';
import { DEFAULT_REORDER_POINT, LOW_STOCK_THRESHOLD } from '../../constants';
import ProductFormModal from './ProductFormModal';

function ProductDetail() {
  const { getSupplierById } = useInventory();
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getProductById,
    loading,
    categories,
    updateProduct,
    deleteProduct,
    products,
  } = useProducts();

  const product = getProductById(id);
  const supplier = getSupplierById(product?.supplierId);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const related = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && String(p.id) !== String(product.id))
      .slice(0, 4);
  }, [products, product]);

  if (loading && !product) return <DetailSkeleton />;

  if (!product) {
    return (
      <ErrorState
        title="Product not found"
        message="This product may have been deleted or does not exist."
        onRetry={() => navigate('/products')}
      />
    );
  }

  const stockVariant =
    product.stock <= 0 ? 'danger' : product.stock < LOW_STOCK_THRESHOLD ? 'warning' : 'success';

  return (
    <div className="page flex flex-col gap-4">
      <Breadcrumb
        items={[
          { label: 'Products', to: '/products' },
          { label: product.title },
        ]}
      />

      <Button
        variant="ghost"
        size="sm"
        leftIcon={<HiArrowLeft />}
        onClick={() => navigate('/products')}
      >
        Back to products
      </Button>

      <div className="glass grid grid-cols-[1.05fr_1fr] gap-6 rounded-xl p-5 max-[900px]:grid-cols-1">
        <div>
          <img
            src={product.images?.[0] || product.thumbnail}
            alt={product.title}
            className="aspect-square w-full rounded-lg object-cover bg-bg-muted"
          />
          <div className="mt-[0.7rem] grid grid-cols-4 gap-[0.55rem]">
            {(product.images || [product.thumbnail]).slice(0, 4).map((src, i) => (
              <img
                key={`${src}-${i}`}
                src={src}
                alt=""
                className="aspect-square rounded-[10px] object-cover bg-bg-muted"
              />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 flex flex-wrap gap-[0.45rem]">
            <Badge variant="accent">{capitalize(product.category)}</Badge>
            <Badge variant={stockVariant}>
              {product.stock <= 0
                ? 'Out of stock'
                : product.stock < LOW_STOCK_THRESHOLD
                  ? 'Low stock'
                  : 'In stock'}
            </Badge>
          </div>

          <h1 className="text-[clamp(1.5rem,2.5vw,2rem)] leading-[1.2] tracking-[-0.03em]">
            {product.title}
          </h1>
          <p className="mt-[0.35rem] text-fg-muted">{product.brand || 'Inventra'}</p>

          <div className="my-4 flex items-center gap-4">
            <span className="text-[1.7rem] font-[750] text-accent">
              {formatCurrency(product.price)}
            </span>
            <span className="inline-flex items-center gap-[0.3rem] font-bold text-warning">
              <HiStar /> {Number(product.rating || 0).toFixed(2)}
            </span>
          </div>

          <p className="leading-[1.65] text-fg-secondary">{product.description}</p>

          <dl className="my-5 grid grid-cols-3 gap-3 max-[900px]:grid-cols-1">
            <div className="rounded-md bg-bg-muted p-3">
              <dt className="text-[0.72rem] uppercase tracking-[0.05em] text-fg-muted">
                Stock
              </dt>
              <dd className="mt-1 font-bold">{product.stock} units</dd>
            </div>
            <div className="rounded-md bg-bg-muted p-3">
              <dt className="text-[0.72rem] uppercase tracking-[0.05em] text-fg-muted">
                Reorder point
              </dt>
              <dd className="mt-1 font-bold">
                {product.reorderPoint ?? DEFAULT_REORDER_POINT}
              </dd>
            </div>
            <div className="rounded-md bg-bg-muted p-3">
              <dt className="text-[0.72rem] uppercase tracking-[0.05em] text-fg-muted">
                Supplier
              </dt>
              <dd className="mt-1 font-bold">
                {supplier?.name || 'Unassigned'}
              </dd>
            </div>
          </dl>

          <div className="flex flex-wrap gap-[0.65rem]">
            <Button
              leftIcon={<HiOutlinePencilSquare />}
              onClick={() => setEditOpen(true)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              leftIcon={<HiOutlineTrash />}
              onClick={() => setConfirmOpen(true)}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="mb-[0.85rem] text-[1.15rem]">
            More in {capitalize(product.category)}
          </h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-[0.85rem]">
            {related.map((item) => (
              <Link
                key={item.id}
                to={`/products/${item.id}`}
                className="glass flex items-center gap-3 rounded-lg p-3 transition-transform duration-[180ms] ease-in-out hover:-translate-y-0.5"
              >
                <img
                  src={item.thumbnail}
                  alt=""
                  className="size-14 rounded-[10px] object-cover"
                />
                <div>
                  <strong className="mb-[0.2rem] block text-[0.88rem]">
                    {item.title}
                  </strong>
                  <span className="text-[0.85rem] font-bold text-accent">
                    {formatCurrency(item.price)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <ProductFormModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        product={product}
        categories={categories}
        onSubmit={(values) => updateProduct(product.id, values)}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          deleteProduct(product.id);
          navigate('/products');
        }}
        title="Delete product"
        message={`Delete “${product.title}”? This cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}

export default ProductDetail;
