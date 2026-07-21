export const filterProducts = (products, filters) => {
  if (!products?.length) return [];

  let result = [...products];
  const {
    search = '',
    category = 'all',
    minPrice = 0,
    maxPrice = Infinity,
    minStock = 0,
    maxStock = Infinity,
    minRating = 0,
    inStockOnly = false,
  } = filters;

  if (search.trim()) {
    const q = search.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }

  if (category && category !== 'all') {
    result = result.filter((p) => p.category === category);
  }

  result = result.filter((p) => {
    const price = Number(p.price) || 0;
    const stock = Number(p.stock) || 0;
    const rating = Number(p.rating) || 0;
    if (price < minPrice || price > maxPrice) return false;
    if (stock < minStock || stock > maxStock) return false;
    if (rating < minRating) return false;
    if (inStockOnly && stock <= 0) return false;
    return true;
  });

  return result;
};

export const sortProducts = (products, sortValue = 'title-asc') => {
  const [field, direction] = sortValue.split('-');
  const sorted = [...products];

  sorted.sort((a, b) => {
    let aVal = a[field];
    let bVal = b[field];

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = (bVal || '').toLowerCase();
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    }

    aVal = Number(aVal) || 0;
    bVal = Number(bVal) || 0;
    return direction === 'asc' ? aVal - bVal : bVal - aVal;
  });

  return sorted;
};

export const paginate = (items, page = 1, pageSize = 12) => {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;

  return {
    items: items.slice(start, end),
    page: currentPage,
    pageSize,
    total,
    totalPages,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
};

export const computeStats = (products, lowStockThreshold = 15) => {
  if (!products?.length) {
    return {
      totalProducts: 0,
      totalCategories: 0,
      lowStock: 0,
      averagePrice: 0,
      highestRated: null,
      totalValue: 0,
    };
  }

  const categories = new Set(products.map((p) => p.category).filter(Boolean));
  const lowStock = products.filter((p) => (p.stock || 0) < lowStockThreshold);
  const totalPrice = products.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
  const totalValue = products.reduce(
    (sum, p) => sum + (Number(p.price) || 0) * (Number(p.stock) || 0),
    0
  );
  const highestRated = [...products].sort(
    (a, b) => (b.rating || 0) - (a.rating || 0)
  )[0];

  return {
    totalProducts: products.length,
    totalCategories: categories.size,
    lowStock: lowStock.length,
    averagePrice: totalPrice / products.length,
    highestRated,
    totalValue,
  };
};

export const buildCategoryChartData = (products) => {
  const map = {};
  products.forEach((p) => {
    const cat = p.category || 'other';
    map[cat] = (map[cat] || 0) + 1;
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
};

export const buildStockChartData = (products) => {
  const map = {};
  products.forEach((p) => {
    const cat = p.category || 'other';
    if (!map[cat]) map[cat] = { name: cat, stock: 0, products: 0 };
    map[cat].stock += Number(p.stock) || 0;
    map[cat].products += 1;
  });
  return Object.values(map)
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 8);
};

export const buildPriceTrendData = (products) => {
  const buckets = [
    { name: '$0–25', min: 0, max: 25, count: 0 },
    { name: '$25–50', min: 25, max: 50, count: 0 },
    { name: '$50–100', min: 50, max: 100, count: 0 },
    { name: '$100–500', min: 100, max: 500, count: 0 },
    { name: '$500+', min: 500, max: Infinity, count: 0 },
  ];

  products.forEach((p) => {
    const price = Number(p.price) || 0;
    const bucket = buckets.find((b) => price >= b.min && price < b.max);
    if (bucket) bucket.count += 1;
  });

  return buckets.map(({ name, count }) => ({ name, count }));
};

/**
 * Suggest reorders for products at/below their reorder point.
 * Products without a custom reorderPoint use the low-stock threshold.
 */
export const buildReorderSuggestions = (
  products,
  { defaultReorderPoint = 20, lowStockThreshold = 15 } = {}
) => {
  if (!products?.length) return [];

  return products
    .map((product) => {
      const stock = Number(product.stock) || 0;
      const hasCustomPoint = Number(product.reorderPoint) > 0;
      const reorderPoint = hasCustomPoint
        ? Number(product.reorderPoint)
        : lowStockThreshold;
      if (stock > reorderPoint) return null;

      const target = Math.max(
        (hasCustomPoint ? reorderPoint : defaultReorderPoint) * 2,
        lowStockThreshold * 2
      );
      const suggestedQty = Math.max(target - stock, reorderPoint);
      const urgency =
        stock <= 0 ? 'critical' : stock < lowStockThreshold ? 'high' : 'medium';
      const daysOfCover = Math.max(1, Math.ceil(stock / Math.max(reorderPoint / 7, 1)));

      return {
        productId: product.id,
        title: product.title,
        thumbnail: product.thumbnail,
        category: product.category,
        stock,
        reorderPoint,
        suggestedQty,
        urgency,
        daysOfCover,
        supplierId: product.supplierId || '',
        estimatedCost: suggestedQty * (Number(product.price) || 0),
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      const rank = { critical: 0, high: 1, medium: 2 };
      return rank[a.urgency] - rank[b.urgency] || a.stock - b.stock;
    });
};
