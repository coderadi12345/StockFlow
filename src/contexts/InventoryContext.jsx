import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import { inventoryService } from '../services/inventoryService';
import { useProducts } from '../hooks/useProducts';

export const InventoryContext = createContext(null);

const cloneStock = (stock) => {
  const next = {};
  Object.entries(stock || {}).forEach(([warehouseId, map]) => {
    next[warehouseId] = { ...(map || {}) };
  });
  return next;
};

const allocatedUnits = (stock, productId) =>
  Object.values(stock || {}).reduce(
    (sum, map) => sum + (Number(map?.[String(productId)]) || 0),
    0
  );

const warehouseUnitTotal = (stock, warehouseId) =>
  Object.values(stock?.[warehouseId] || {}).reduce(
    (sum, qty) => sum + (Number(qty) || 0),
    0
  );

export function InventoryProvider({ children }) {
  const { products, adjustStock } = useProducts();
  const [suppliers, setSuppliers] = useState(() => inventoryService.getSuppliers());
  const [warehouses, setWarehouses] = useState(() => inventoryService.getWarehouses());
  const [warehouseStock, setWarehouseStock] = useState(() =>
    inventoryService.getWarehouseStock()
  );
  const [operations, setOperations] = useState(() => inventoryService.getOperations());

  const persistSuppliers = useCallback((updater) => {
    setSuppliers((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      inventoryService.saveSuppliers(next);
      return next;
    });
  }, []);

  const persistWarehouses = useCallback((updater) => {
    setWarehouses((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      inventoryService.saveWarehouses(next);
      return next;
    });
  }, []);

  const persistStock = useCallback((updater) => {
    setWarehouseStock((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      inventoryService.saveWarehouseStock(next);
      return next;
    });
  }, []);

  const pushOperation = useCallback((entry) => {
    setOperations((prev) => {
      const next = [
        { id: inventoryService.createId(), timestamp: Date.now(), ...entry },
        ...prev,
      ].slice(0, 50);
      inventoryService.saveOperations(next);
      return next;
    });
  }, []);

  // Keep warehouse allocations aligned with the product catalog
  useEffect(() => {
    if (!products.length || !warehouses.length) return;

    const main = warehouses.find((w) => w.code === 'MAIN') || warehouses[0];
    if (!main) return;

    persistStock((prev) => {
      const next = cloneStock(prev);
      const productIds = new Set(products.map((p) => String(p.id)));
      let changed = false;

      Object.keys(next).forEach((warehouseId) => {
        Object.keys(next[warehouseId] || {}).forEach((productId) => {
          if (!productIds.has(productId)) {
            delete next[warehouseId][productId];
            changed = true;
          }
        });
      });

      products.forEach((product) => {
        const productId = String(product.id);
        const catalog = Number(product.stock) || 0;
        const allocated = allocatedUnits(next, productId);
        if (allocated === catalog) return;

        const currentMain = Number(next[main.id]?.[productId] || 0);
        const adjustedMain = Math.max(0, currentMain + (catalog - allocated));
        next[main.id] = {
          ...(next[main.id] || {}),
          [productId]: adjustedMain,
        };
        changed = true;
      });

      return changed ? next : prev;
    });
  }, [products, warehouses, persistStock]);

  const addSupplier = useCallback(
    (payload) => {
      const supplier = {
        id: inventoryService.createId(),
        name: payload.name.trim(),
        contact: payload.contact?.trim() || '',
        email: payload.email?.trim() || '',
        phone: payload.phone?.trim() || '',
        leadTimeDays: Number(payload.leadTimeDays) || 5,
        notes: payload.notes?.trim() || '',
      };
      persistSuppliers((prev) => [supplier, ...prev]);
      toast.success('Supplier added');
      return supplier;
    },
    [persistSuppliers]
  );

  const updateSupplier = useCallback(
    (id, payload) => {
      persistSuppliers((prev) =>
        prev.map((s) =>
          String(s.id) === String(id)
            ? {
                ...s,
                name: payload.name?.trim() ?? s.name,
                contact: payload.contact?.trim() ?? s.contact,
                email: payload.email?.trim() ?? s.email,
                phone: payload.phone?.trim() ?? s.phone,
                leadTimeDays: Number(payload.leadTimeDays ?? s.leadTimeDays),
                notes: payload.notes?.trim() ?? s.notes,
              }
            : s
        )
      );
      toast.success('Supplier updated');
    },
    [persistSuppliers]
  );

  const deleteSupplier = useCallback(
    (id) => {
      persistSuppliers((prev) => prev.filter((s) => String(s.id) !== String(id)));
      toast.success('Supplier removed');
    },
    [persistSuppliers]
  );

  const addWarehouse = useCallback(
    (payload) => {
      const warehouse = {
        id: inventoryService.createId(),
        name: payload.name.trim(),
        code: (payload.code || payload.name).trim().toUpperCase().slice(0, 6),
        location: payload.location?.trim() || '',
        capacity: Number(payload.capacity) || 1000,
      };
      persistWarehouses((prev) => [...prev, warehouse]);
      toast.success('Warehouse added');
      return warehouse;
    },
    [persistWarehouses]
  );

  const updateWarehouse = useCallback(
    (id, payload) => {
      persistWarehouses((prev) =>
        prev.map((w) =>
          String(w.id) === String(id)
            ? {
                ...w,
                name: payload.name?.trim() ?? w.name,
                code: payload.code?.trim()?.toUpperCase() ?? w.code,
                location: payload.location?.trim() ?? w.location,
                capacity: Number(payload.capacity ?? w.capacity),
              }
            : w
        )
      );
      toast.success('Warehouse updated');
    },
    [persistWarehouses]
  );

  const deleteWarehouse = useCallback(
    (id) => {
      if (warehouses.length <= 1) {
        throw new Error('Keep at least one warehouse');
      }
      persistStock((prev) => {
        const next = cloneStock(prev);
        delete next[id];
        return next;
      });
      persistWarehouses((prev) => prev.filter((w) => String(w.id) !== String(id)));
      toast.success('Warehouse removed');
    },
    [warehouses.length, persistWarehouses, persistStock]
  );

  const getStockInWarehouse = useCallback(
    (warehouseId, productId) =>
      Number(warehouseStock?.[warehouseId]?.[String(productId)] || 0),
    [warehouseStock]
  );

  const receiveStock = useCallback(
    ({ productId, warehouseId, quantity, supplierId = '', note = '' }) => {
      const qty = Number(quantity);
      if (!Number.isInteger(qty) || qty < 1) throw new Error('Enter a valid quantity');
      const product = products.find((p) => String(p.id) === String(productId));
      const warehouse = warehouses.find((w) => String(w.id) === String(warehouseId));
      if (!product) throw new Error('Product not found');
      if (!warehouse) throw new Error('Warehouse not found');

      const currentUnits = warehouseUnitTotal(warehouseStock, warehouseId);
      if (warehouse.capacity && currentUnits + qty > warehouse.capacity) {
        throw new Error(
          `${warehouse.name} only has ${Math.max(0, warehouse.capacity - currentUnits)} units of free capacity`
        );
      }

      persistStock((prev) => {
        const current = Number(prev?.[warehouseId]?.[String(productId)] || 0);
        return {
          ...prev,
          [warehouseId]: {
            ...(prev[warehouseId] || {}),
            [String(productId)]: current + qty,
          },
        };
      });
      adjustStock(productId, qty, { silent: true });
      pushOperation({
        type: 'receive',
        message: `Received ${qty} × ${product.title} into ${warehouse.name}`,
        productId,
        warehouseId,
        supplierId,
        quantity: qty,
        note,
      });
      toast.success(`Received ${qty} units into ${warehouse.name}`);
    },
    [
      products,
      warehouses,
      warehouseStock,
      persistStock,
      adjustStock,
      pushOperation,
    ]
  );

  const transferStock = useCallback(
    ({ productId, fromWarehouseId, toWarehouseId, quantity, note = '' }) => {
      const qty = Number(quantity);
      if (!Number.isInteger(qty) || qty < 1) throw new Error('Enter a valid quantity');
      if (String(fromWarehouseId) === String(toWarehouseId)) {
        throw new Error('Choose two different warehouses');
      }
      const product = products.find((p) => String(p.id) === String(productId));
      const from = warehouses.find((w) => String(w.id) === String(fromWarehouseId));
      const to = warehouses.find((w) => String(w.id) === String(toWarehouseId));
      if (!product || !from || !to) throw new Error('Invalid transfer details');

      const available = Number(
        warehouseStock?.[fromWarehouseId]?.[String(productId)] || 0
      );
      if (qty > available) {
        throw new Error(`Only ${available} units available in ${from.name}`);
      }

      const toUnits = warehouseUnitTotal(warehouseStock, toWarehouseId);
      if (to.capacity && toUnits + qty > to.capacity) {
        throw new Error(
          `${to.name} only has ${Math.max(0, to.capacity - toUnits)} units of free capacity`
        );
      }

      persistStock((prev) => {
        const fromQty = Number(prev?.[fromWarehouseId]?.[String(productId)] || 0);
        const toQty = Number(prev?.[toWarehouseId]?.[String(productId)] || 0);
        return {
          ...prev,
          [fromWarehouseId]: {
            ...(prev[fromWarehouseId] || {}),
            [String(productId)]: fromQty - qty,
          },
          [toWarehouseId]: {
            ...(prev[toWarehouseId] || {}),
            [String(productId)]: toQty + qty,
          },
        };
      });
      pushOperation({
        type: 'transfer',
        message: `Transferred ${qty} × ${product.title}: ${from.name} → ${to.name}`,
        productId,
        fromWarehouseId,
        toWarehouseId,
        quantity: qty,
        note,
      });
      toast.success('Transfer completed');
    },
    [products, warehouses, warehouseStock, persistStock, pushOperation]
  );

  const getSupplierById = useCallback(
    (id) => suppliers.find((s) => String(s.id) === String(id)),
    [suppliers]
  );

  const warehouseSummaries = useMemo(
    () =>
      warehouses.map((warehouse) => {
        const stockMap = warehouseStock[warehouse.id] || {};
        const units = Object.values(stockMap).reduce(
          (sum, qty) => sum + (Number(qty) || 0),
          0
        );
        const skus = Object.values(stockMap).filter((qty) => Number(qty) > 0).length;
        return {
          ...warehouse,
          units,
          skus,
          utilization: warehouse.capacity
            ? Math.min(100, Math.round((units / warehouse.capacity) * 100))
            : 0,
        };
      }),
    [warehouses, warehouseStock]
  );

  const value = useMemo(
    () => ({
      suppliers,
      warehouses,
      warehouseStock,
      operations,
      warehouseSummaries,
      addSupplier,
      updateSupplier,
      deleteSupplier,
      addWarehouse,
      updateWarehouse,
      deleteWarehouse,
      receiveStock,
      transferStock,
      getStockInWarehouse,
      getSupplierById,
    }),
    [
      suppliers,
      warehouses,
      warehouseStock,
      operations,
      warehouseSummaries,
      addSupplier,
      updateSupplier,
      deleteSupplier,
      addWarehouse,
      updateWarehouse,
      deleteWarehouse,
      receiveStock,
      transferStock,
      getStockInWarehouse,
      getSupplierById,
    ]
  );

  return (
    <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
  );
}
