export const APP_NAME = 'Inventra';
export const APP_TAGLINE = 'Inventory Intelligence';

export const STORAGE_KEYS = {
  AUTH: 'inventra_auth',
  LOCAL_USERS: 'inventra_local_users',
  THEME: 'inventra_theme',
  PRODUCTS_OVERRIDE: 'inventra_products_override',
  ACTIVITY: 'inventra_activity',
  PROFILE: 'inventra_profile',
  SUPPLIERS: 'inventra_suppliers',
  WAREHOUSES: 'inventra_warehouses',
  WAREHOUSE_STOCK: 'inventra_warehouse_stock',
  WAREHOUSE_OPS: 'inventra_warehouse_ops',
};

export const API = {
  BASE_URL: 'https://dummyjson.com',
  LOGIN: '/auth/login',
  PRODUCTS: '/products',
  CATEGORIES: '/products/categories',
  SEARCH: '/products/search',
};

export const LOW_STOCK_THRESHOLD = 15;
export const DEFAULT_REORDER_POINT = 20;
export const DEFAULT_PAGE_SIZE = 12;
export const DEBOUNCE_MS = 400;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CATEGORIES: '/categories',
  SUPPLIERS: '/suppliers',
  WAREHOUSES: '/warehouses',
  PROFILE: '/profile',
  SETTINGS: '/settings',
};

export const SORT_OPTIONS = [
  { value: 'title-asc', label: 'Name A–Z' },
  { value: 'title-desc', label: 'Name Z–A' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Highest Rated' },
  { value: 'stock-asc', label: 'Stock: Low to High' },
];
