import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  HiOutlineArrowPath,
  HiOutlineBuildingStorefront,
  HiOutlinePlus,
} from 'react-icons/hi2';
import { toast } from 'react-toastify';
import Breadcrumb from '../../components/common/Breadcrumb';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import { useInventory } from '../../hooks/useInventory';
import { useProducts } from '../../hooks/useProducts';
import { formatDate, formatNumber } from '../../utils/helpers';

function Warehouses() {
  const {
    warehouses,
    warehouseSummaries,
    operations,
    suppliers,
    addWarehouse,
    receiveStock,
    transferStock,
  } = useInventory();
  const { products } = useProducts();
  const [tab, setTab] = useState('overview');

  const productOptions = useMemo(
    () =>
      products.map((p) => ({
        value: String(p.id),
        label: `${p.title} (${p.stock} in catalog)`,
      })),
    [products]
  );

  const warehouseOptions = warehouses.map((w) => ({
    value: w.id,
    label: `${w.name} (${w.code})`,
  }));

  const supplierOptions = [
    { value: '', label: 'No supplier' },
    ...suppliers.map((s) => ({ value: s.id, label: s.name })),
  ];

  const warehouseForm = useForm({
    defaultValues: { name: '', code: '', location: '', capacity: 1000 },
  });
  const receiveForm = useForm({
    defaultValues: {
      productId: '',
      warehouseId: warehouses[0]?.id || '',
      quantity: 10,
      supplierId: '',
      note: '',
    },
  });
  const transferForm = useForm({
    defaultValues: {
      productId: '',
      fromWarehouseId: warehouses[0]?.id || '',
      toWarehouseId: warehouses[1]?.id || warehouses[0]?.id || '',
      quantity: 5,
      note: '',
    },
  });

  const onAddWarehouse = warehouseForm.handleSubmit((values) => {
    try {
      addWarehouse(values);
      warehouseForm.reset({ name: '', code: '', location: '', capacity: 1000 });
    } catch (error) {
      toast.error(error.message);
    }
  });

  const onReceive = receiveForm.handleSubmit((values) => {
    try {
      receiveStock(values);
      receiveForm.reset({
        ...values,
        quantity: 10,
        note: '',
      });
    } catch (error) {
      toast.error(error.message);
    }
  });

  const onTransfer = transferForm.handleSubmit((values) => {
    try {
      transferStock(values);
      transferForm.reset({
        ...values,
        quantity: 5,
        note: '',
      });
    } catch (error) {
      toast.error(error.message);
    }
  });

  const tabBtn = (id, label) => (
    <button
      type="button"
      key={id}
      className={`rounded-md px-3 py-2 text-[0.88rem] font-semibold ${
        tab === id ? 'bg-accent-soft text-accent' : 'text-fg-muted'
      }`}
      onClick={() => setTab(id)}
    >
      {label}
    </button>
  );

  return (
    <div className="page flex flex-col gap-4">
      <Breadcrumb items={[{ label: 'Warehouses' }]} />

      <header>
        <h1 className="text-[clamp(1.55rem,2.4vw,2rem)]">Warehouse operations</h1>
        <p className="mt-1 text-fg-muted">
          Track locations, receive stock from suppliers, and transfer between warehouses.
        </p>
      </header>

      <div className="inline-flex w-fit gap-1 rounded-md border border-border bg-bg-elevated p-1">
        {tabBtn('overview', 'Overview')}
        {tabBtn('receive', 'Receive stock')}
        {tabBtn('transfer', 'Transfer')}
        {tabBtn('history', 'History')}
      </div>

      {tab === 'overview' && (
        <>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
            {warehouseSummaries.map((warehouse) => (
              <article key={warehouse.id} className="glass rounded-xl p-5">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-[1.05rem]">{warehouse.name}</h3>
                    <p className="mt-1 text-[0.82rem] text-fg-muted">
                      {warehouse.location || 'No location set'}
                    </p>
                  </div>
                  <Badge>{warehouse.code}</Badge>
                </div>
                <dl className="grid grid-cols-2 gap-3 text-[0.85rem]">
                  <div className="rounded-md bg-bg-muted p-3">
                    <dt className="text-fg-muted">Units</dt>
                    <dd className="mt-1 font-bold">{formatNumber(warehouse.units)}</dd>
                  </div>
                  <div className="rounded-md bg-bg-muted p-3">
                    <dt className="text-fg-muted">SKUs</dt>
                    <dd className="mt-1 font-bold">{formatNumber(warehouse.skus)}</dd>
                  </div>
                </dl>
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-[0.78rem] text-fg-muted">
                    <span>Capacity use</span>
                    <span>{warehouse.utilization}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-bg-muted">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${warehouse.utilization}%` }}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>

          <section className="glass rounded-xl p-5">
            <h2 className="mb-4 text-[1.05rem]">Add warehouse</h2>
            <form
              className="grid grid-cols-4 gap-3 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1"
              onSubmit={onAddWarehouse}
            >
              <Input
                label="Name"
                error={warehouseForm.formState.errors.name?.message}
                {...warehouseForm.register('name', { required: 'Required' })}
              />
              <Input label="Code" placeholder="MAIN" {...warehouseForm.register('code')} />
              <Input label="Location" {...warehouseForm.register('location')} />
              <Input
                label="Capacity"
                type="number"
                min="1"
                {...warehouseForm.register('capacity')}
              />
              <div className="col-span-4 max-[900px]:col-span-2 max-[560px]:col-span-1">
                <Button type="submit" leftIcon={<HiOutlinePlus />}>
                  Create warehouse
                </Button>
              </div>
            </form>
          </section>
        </>
      )}

      {tab === 'receive' && (
        <section className="glass max-w-[720px] rounded-xl p-5">
          <div className="mb-4 flex items-center gap-2">
            <HiOutlineBuildingStorefront className="text-accent" />
            <h2 className="text-[1.05rem]">Receive stock</h2>
          </div>
          <p className="mb-4 text-[0.88rem] text-fg-muted">
            Incoming goods increase warehouse stock and the product catalog total.
          </p>
          <form className="grid grid-cols-2 gap-3 max-[560px]:grid-cols-1" onSubmit={onReceive}>
            <Select
              label="Product"
              options={productOptions}
              placeholder="Select product"
              {...receiveForm.register('productId', { required: true })}
            />
            <Select
              label="Warehouse"
              options={warehouseOptions}
              {...receiveForm.register('warehouseId', { required: true })}
            />
            <Input
              label="Quantity"
              type="number"
              min="1"
              {...receiveForm.register('quantity', { required: true, min: 1 })}
            />
            <Select
              label="Supplier"
              options={supplierOptions}
              {...receiveForm.register('supplierId')}
            />
            <Input
              label="Note"
              className="col-span-2 max-[560px]:col-span-1"
              {...receiveForm.register('note')}
            />
            <div className="col-span-2 max-[560px]:col-span-1">
              <Button type="submit">Receive stock</Button>
            </div>
          </form>
        </section>
      )}

      {tab === 'transfer' && (
        <section className="glass max-w-[720px] rounded-xl p-5">
          <div className="mb-4 flex items-center gap-2">
            <HiOutlineArrowPath className="text-accent" />
            <h2 className="text-[1.05rem]">Transfer between warehouses</h2>
          </div>
          <p className="mb-4 text-[0.88rem] text-fg-muted">
            Moves stock between locations without changing total catalog inventory.
          </p>
          <form className="grid grid-cols-2 gap-3 max-[560px]:grid-cols-1" onSubmit={onTransfer}>
            <Select
              label="Product"
              options={productOptions}
              placeholder="Select product"
              className="col-span-2 max-[560px]:col-span-1"
              {...transferForm.register('productId', { required: true })}
            />
            <Select
              label="From"
              options={warehouseOptions}
              {...transferForm.register('fromWarehouseId', { required: true })}
            />
            <Select
              label="To"
              options={warehouseOptions}
              {...transferForm.register('toWarehouseId', { required: true })}
            />
            <Input
              label="Quantity"
              type="number"
              min="1"
              {...transferForm.register('quantity', { required: true, min: 1 })}
            />
            <Input label="Note" {...transferForm.register('note')} />
            <div className="col-span-2 max-[560px]:col-span-1">
              <Button type="submit">Transfer stock</Button>
            </div>
          </form>
        </section>
      )}

      {tab === 'history' && (
        <section className="glass rounded-xl p-5">
          <h2 className="mb-4 text-[1.05rem]">Recent warehouse activity</h2>
          {!operations.length ? (
            <p className="text-fg-muted">No receive or transfer activity yet.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {operations.map((op) => (
                <li
                  key={op.id}
                  className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-3 last:border-0"
                >
                  <div>
                    <p className="text-[0.92rem]">{op.message}</p>
                    {op.note && (
                      <p className="mt-1 text-[0.8rem] text-fg-muted">{op.note}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge variant={op.type === 'receive' ? 'success' : 'info'}>
                      {op.type}
                    </Badge>
                    <p className="mt-1 text-[0.75rem] text-fg-muted">
                      {formatDate(op.timestamp)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}

export default Warehouses;
