import { Link } from 'react-router-dom';
import { HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2';
import Badge from '../ui/Badge';
import { formatCurrency, capitalize } from '../../utils/helpers';
import { LOW_STOCK_THRESHOLD } from '../../constants';

function ProductTable({ products = [], onEdit, onDelete, canManage = false }) {
  return (
    <div className="glass overflow-auto rounded-xl">
      <table className="w-full min-w-[720px] border-collapse">
        <thead>
          <tr>
            {[
              'Product',
              'Category',
              'Price',
              'Stock',
              'Rating',
              ...(canManage ? ['Actions'] : []),
            ].map((h) => (
              <th
                key={h}
                className="bg-bg-muted px-4 py-[0.9rem] text-left text-[0.75rem] font-bold tracking-[0.05em] whitespace-nowrap text-fg-muted uppercase border-b border-border"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const stockVariant =
              product.stock <= 0
                ? 'danger'
                : product.stock < LOW_STOCK_THRESHOLD
                  ? 'warning'
                  : 'success';

            return (
              <tr
                key={product.id}
                className="transition-colors duration-[180ms] ease-in-out hover:bg-[rgba(15,118,110,0.04)]"
              >
                <td className="border-b border-border px-4 py-[0.9rem] whitespace-nowrap">
                  <Link
                    to={`/products/${product.id}`}
                    className="flex min-w-[220px] items-center gap-3"
                  >
                    <img
                      src={product.thumbnail}
                      alt=""
                      className="size-[42px] rounded-[10px] object-cover bg-bg-muted"
                    />
                    <span className="flex min-w-0 flex-col">
                      <strong className="max-w-[220px] truncate text-[0.9rem]">
                        {product.title}
                      </strong>
                      <small className="text-[0.75rem] text-fg-muted">
                        {product.brand || '—'}
                      </small>
                    </span>
                  </Link>
                </td>
                <td className="border-b border-border px-4 py-[0.9rem] whitespace-nowrap">
                  <Badge>{capitalize(product.category)}</Badge>
                </td>
                <td className="border-b border-border px-4 py-[0.9rem] whitespace-nowrap">
                  {formatCurrency(product.price)}
                </td>
                <td className="border-b border-border px-4 py-[0.9rem] whitespace-nowrap">
                  <Badge variant={stockVariant}>{product.stock}</Badge>
                </td>
                <td className="border-b border-border px-4 py-[0.9rem] whitespace-nowrap">
                  {Number(product.rating || 0).toFixed(1)}
                </td>
                {canManage && (
                  <td className="border-b border-border px-4 py-[0.9rem] whitespace-nowrap">
                    <div className="flex gap-[0.35rem]">
                    <button
                      type="button"
                      className="grid size-[34px] place-items-center rounded-[10px] border border-border bg-bg-elevated text-fg-secondary cursor-pointer transition-all duration-[180ms] ease-in-out hover:border-accent hover:text-accent"
                      onClick={() => onEdit?.(product)}
                      aria-label="Edit product"
                    >
                      <HiOutlinePencilSquare size={16} />
                    </button>
                    <button
                      type="button"
                      className="grid size-[34px] place-items-center rounded-[10px] border border-border bg-bg-elevated text-fg-secondary cursor-pointer transition-all duration-[180ms] ease-in-out hover:border-danger hover:text-danger"
                      onClick={() => onDelete?.(product)}
                      aria-label="Delete product"
                    >
                      <HiOutlineTrash size={16} />
                    </button>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
