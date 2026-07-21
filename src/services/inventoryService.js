import { STORAGE_KEYS } from '../constants';
import { generateId } from '../utils/helpers';

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const DEFAULT_SUPPLIERS = [
  {
    id: 'sup-northwind',
    name: 'Northwind Supplies',
    contact: 'Priya Mehta',
    email: 'orders@northwind.demo',
    phone: '+1 415 555 0142',
    leadTimeDays: 5,
    notes: 'Primary electronics & accessories vendor',
  },
  {
    id: 'sup-harbor',
    name: 'Harbor Goods Co.',
    contact: 'James Cole',
    email: 'sales@harborgoods.demo',
    phone: '+1 212 555 0198',
    leadTimeDays: 7,
    notes: 'Bulk consumer goods and packaging',
  },
  {
    id: 'sup-apex',
    name: 'Apex Components',
    contact: 'Sara Kim',
    email: 'supply@apexcomp.demo',
    phone: '+1 650 555 0177',
    leadTimeDays: 3,
    notes: 'Fast-turnaround components',
  },
];

const DEFAULT_WAREHOUSES = [
  {
    id: 'wh-main',
    name: 'Main Warehouse',
    code: 'MAIN',
    location: 'Building A · Floor 1',
    capacity: 10000,
  },
  {
    id: 'wh-east',
    name: 'East Depot',
    code: 'EAST',
    location: 'East Campus · Dock 3',
    capacity: 4500,
  },
  {
    id: 'wh-overflow',
    name: 'Overflow Bay',
    code: 'OVFL',
    location: 'Annex · Bay 7',
    capacity: 2000,
  },
];

export const inventoryService = {
  getSuppliers: () => {
    const stored = read(STORAGE_KEYS.SUPPLIERS, null);
    if (!stored || !Array.isArray(stored) || stored.length === 0) {
      write(STORAGE_KEYS.SUPPLIERS, DEFAULT_SUPPLIERS);
      return DEFAULT_SUPPLIERS;
    }
    return stored;
  },

  saveSuppliers: (suppliers) => write(STORAGE_KEYS.SUPPLIERS, suppliers),

  getWarehouses: () => {
    const stored = read(STORAGE_KEYS.WAREHOUSES, null);
    if (!stored || !Array.isArray(stored) || stored.length === 0) {
      write(STORAGE_KEYS.WAREHOUSES, DEFAULT_WAREHOUSES);
      return DEFAULT_WAREHOUSES;
    }
    return stored;
  },

  saveWarehouses: (warehouses) => write(STORAGE_KEYS.WAREHOUSES, warehouses),

  getWarehouseStock: () => read(STORAGE_KEYS.WAREHOUSE_STOCK, {}),

  saveWarehouseStock: (stock) => write(STORAGE_KEYS.WAREHOUSE_STOCK, stock),

  getOperations: () => read(STORAGE_KEYS.WAREHOUSE_OPS, []),

  saveOperations: (ops) => write(STORAGE_KEYS.WAREHOUSE_OPS, ops),

  createId: generateId,
};
