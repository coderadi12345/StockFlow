export const formatCurrency = (value) => {
  const num = Number(value) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(num);
};

export const formatNumber = (value) =>
  new Intl.NumberFormat('en-US').format(Number(value) || 0);

export const formatDate = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const truncate = (str, length = 80) => {
  if (!str) return '';
  return str.length > length ? `${str.slice(0, length)}…` : str;
};

export const capitalize = (str = '') =>
  str
    .split(/[\s-_]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const generateId = () =>
  `local-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const getInitials = (firstName = '', lastName = '') =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
