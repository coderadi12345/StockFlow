import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import { productService } from '../services/productService';
import { generateId } from '../utils/helpers';
import {
  computeStats,
  filterProducts,
  sortProducts,
  buildCategoryChartData,
  buildStockChartData,
  buildPriceTrendData,
  buildReorderSuggestions,
} from '../utils/productUtils';
import {
  STORAGE_KEYS,
  LOW_STOCK_THRESHOLD,
  DEFAULT_REORDER_POINT,
} from '../constants';

export const ProductContext = createContext(null);

const emptyOverrides = () => ({ added: [], updated: {}, deleted: [] });

const readOverrides = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS_OVERRIDE);
    return raw ? JSON.parse(raw) : emptyOverrides();
  } catch {
    return emptyOverrides();
  }
};

const readActivity = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export function ProductProvider({ children }) {
  const [baseProducts, setBaseProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [overrides, setOverrides] = useState(readOverrides);
  const [activity, setActivity] = useState(readActivity);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const persistOverrides = useCallback((updater) => {
    setOverrides((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      localStorage.setItem(STORAGE_KEYS.PRODUCTS_OVERRIDE, JSON.stringify(next));
      return next;
    });
  }, []);

  const pushActivity = useCallback((entry) => {
    setActivity((prev) => {
      const next = [
        { id: generateId(), timestamp: Date.now(), ...entry },
        ...prev,
      ].slice(0, 30);
      localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(next));
      return next;
    });
  }, []);

  const products = useMemo(() => {
    const deletedSet = new Set(overrides.deleted || []);
    const mapped = baseProducts
      .filter((p) => !deletedSet.has(String(p.id)))
      .map((p) => {
        const patch = overrides.updated?.[String(p.id)];
        return patch ? { ...p, ...patch } : p;
      });
    return [...(overrides.added || []), ...mapped];
  }, [baseProducts, overrides]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productService.getAll({ limit: 0 }),
        productService.getCategories(),
      ]);
      setBaseProducts(productsRes.products || []);
      const cats = Array.isArray(categoriesRes)
        ? categoriesRes.map((c) =>
            typeof c === 'string' ? c : c.slug || c.name || String(c)
          )
        : [];
      setCategories(cats);
    } catch (err) {
      setError(err.message || 'Failed to load inventory data');
      toast.error(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const getProductById = useCallback(
    (id) => products.find((p) => String(p.id) === String(id)),
    [products]
  );

  const applyStockPatch = useCallback(
    (id, patch) => {
      if (String(id).startsWith('local-')) {
        persistOverrides((prev) => ({
          ...prev,
          added: (prev.added || []).map((p) =>
            String(p.id) === String(id) ? { ...p, ...patch } : p
          ),
        }));
      } else {
        persistOverrides((prev) => ({
          ...prev,
          updated: {
            ...(prev.updated || {}),
            [String(id)]: { ...(prev.updated?.[String(id)] || {}), ...patch },
          },
        }));
      }
    },
    [persistOverrides]
  );

  const addProduct = useCallback(
    (payload) => {
      const newProduct = {
        id: generateId(),
        title: payload.title,
        description: payload.description || '',
        category: payload.category || 'misc',
        price: Number(payload.price) || 0,
        discountPercentage: Number(payload.discountPercentage) || 0,
        rating: Number(payload.rating) || 4,
        stock: Number(payload.stock) || 0,
        brand: payload.brand || 'Inventra',
        supplierId: payload.supplierId || '',
        reorderPoint:
          Number(payload.reorderPoint) > 0
            ? Number(payload.reorderPoint)
            : DEFAULT_REORDER_POINT,
        thumbnail:
          payload.thumbnail ||
          'https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/thumbnail.webp',
        images: payload.images || [],
        tags: payload.tags || [],
        isLocal: true,
      };

      persistOverrides((prev) => ({
        ...prev,
        added: [newProduct, ...(prev.added || [])],
      }));
      pushActivity({
        type: 'add',
        message: `Added product "${newProduct.title}"`,
        productId: newProduct.id,
      });
      toast.success('Product added successfully');
      return newProduct;
    },
    [persistOverrides, pushActivity]
  );

  const updateProduct = useCallback(
    (id, payload) => {
      const existing = products.find((p) => String(p.id) === String(id));
      if (!existing) {
        toast.error('Product not found');
        return null;
      }

      const patch = {
        title: payload.title ?? existing.title,
        description: payload.description ?? existing.description,
        category: payload.category ?? existing.category,
        price: Number(payload.price ?? existing.price),
        discountPercentage: Number(
          payload.discountPercentage ?? existing.discountPercentage
        ),
        rating: Number(payload.rating ?? existing.rating),
        stock: Number(payload.stock ?? existing.stock),
        brand: payload.brand ?? existing.brand,
        thumbnail: payload.thumbnail ?? existing.thumbnail,
        supplierId:
          payload.supplierId !== undefined
            ? payload.supplierId
            : existing.supplierId || '',
        reorderPoint: Number(
          payload.reorderPoint ?? existing.reorderPoint ?? DEFAULT_REORDER_POINT
        ),
      };

      applyStockPatch(id, patch);
      pushActivity({
        type: 'update',
        message: `Updated product "${patch.title}"`,
        productId: id,
      });
      toast.success('Product updated successfully');
      return { ...existing, ...patch };
    },
    [products, applyStockPatch, pushActivity]
  );

  const deleteProduct = useCallback(
    (id) => {
      const existing = products.find((p) => String(p.id) === String(id));
      if (!existing) {
        toast.error('Product not found');
        return false;
      }

      if (String(id).startsWith('local-')) {
        persistOverrides((prev) => ({
          ...prev,
          added: (prev.added || []).filter((p) => String(p.id) !== String(id)),
        }));
      } else {
        persistOverrides((prev) => {
          const nextUpdated = { ...(prev.updated || {}) };
          delete nextUpdated[String(id)];
          return {
            ...prev,
            updated: nextUpdated,
            deleted: [...new Set([...(prev.deleted || []), String(id)])],
          };
        });
      }

      pushActivity({
        type: 'delete',
        message: `Deleted product "${existing.title}"`,
        productId: id,
      });
      toast.success('Product deleted successfully');
      return true;
    },
    [products, persistOverrides, pushActivity]
  );

  const adjustStock = useCallback(
    (id, delta, { silent = false } = {}) => {
      const existing = products.find((p) => String(p.id) === String(id));
      if (!existing) throw new Error('Product not found');

      const nextStock = Math.max(0, (Number(existing.stock) || 0) + Number(delta));
      applyStockPatch(id, { stock: nextStock });

      if (!silent) {
        pushActivity({
          type: 'stock',
          message: `Adjusted stock for "${existing.title}" to ${nextStock}`,
          productId: id,
        });
        toast.success('Stock updated');
      }
      return nextStock;
    },
    [products, applyStockPatch, pushActivity]
  );

  const getFilteredProducts = useCallback(
    (filters = {}, sortValue = 'title-asc') => {
      const filtered = filterProducts(products, filters);
      return sortProducts(filtered, sortValue);
    },
    [products]
  );

  const stats = useMemo(
    () => computeStats(products, LOW_STOCK_THRESHOLD),
    [products]
  );

  const chartData = useMemo(
    () => ({
      categories: buildCategoryChartData(products),
      stock: buildStockChartData(products),
      priceTrend: buildPriceTrendData(products),
    }),
    [products]
  );

  const reorderSuggestions = useMemo(
    () =>
      buildReorderSuggestions(products, {
        defaultReorderPoint: DEFAULT_REORDER_POINT,
        lowStockThreshold: LOW_STOCK_THRESHOLD,
      }),
    [products]
  );

  const value = useMemo(
    () => ({
      products,
      categories,
      loading,
      error,
      activity,
      stats,
      chartData,
      reorderSuggestions,
      fetchProducts,
      getProductById,
      addProduct,
      updateProduct,
      deleteProduct,
      adjustStock,
      getFilteredProducts,
      lowStockThreshold: LOW_STOCK_THRESHOLD,
    }),
    [
      products,
      categories,
      loading,
      error,
      activity,
      stats,
      chartData,
      reorderSuggestions,
      fetchProducts,
      getProductById,
      addProduct,
      updateProduct,
      deleteProduct,
      adjustStock,
      getFilteredProducts,
    ]
  );

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}
