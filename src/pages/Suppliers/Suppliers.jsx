import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { HiOutlineBuildingOffice2, HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi2';
import Breadcrumb from '../../components/common/Breadcrumb';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Badge from '../../components/ui/Badge';
import { useInventory } from '../../hooks/useInventory';
import { useProducts } from '../../hooks/useProducts';

function Suppliers() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useInventory();
  const { products } = useProducts();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      contact: '',
      email: '',
      phone: '',
      leadTimeDays: 5,
      notes: '',
    },
  });

  const linkedCounts = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      if (!p.supplierId) return;
      map[p.supplierId] = (map[p.supplierId] || 0) + 1;
    });
    return map;
  }, [products]);

  const openCreate = () => {
    setEditing(null);
    reset({
      name: '',
      contact: '',
      email: '',
      phone: '',
      leadTimeDays: 5,
      notes: '',
    });
    setOpen(true);
  };

  const openEdit = (supplier) => {
    setEditing(supplier);
    reset({
      name: supplier.name,
      contact: supplier.contact,
      email: supplier.email,
      phone: supplier.phone,
      leadTimeDays: supplier.leadTimeDays,
      notes: supplier.notes,
    });
    setOpen(true);
  };

  const onSubmit = (values) => {
    if (editing) updateSupplier(editing.id, values);
    else addSupplier(values);
    setOpen(false);
    setEditing(null);
  };

  return (
    <div className="page flex flex-col gap-4">
      <Breadcrumb items={[{ label: 'Suppliers' }]} />

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.55rem,2.4vw,2rem)]">Suppliers</h1>
          <p className="mt-1 text-fg-muted">
            Manage vendors that replenish your inventory.
          </p>
        </div>
        <Button leftIcon={<HiOutlinePlus />} onClick={openCreate}>
          Add supplier
        </Button>
      </header>

      {!suppliers.length ? (
        <EmptyState
          icon={<HiOutlineBuildingOffice2 size={28} />}
          title="No suppliers yet"
          description="Add your first supplier to link products and plan reorders."
          actionLabel="Add supplier"
          onAction={openCreate}
        />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {suppliers.map((supplier) => (
            <article key={supplier.id} className="glass rounded-xl p-5">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-[1.05rem]">{supplier.name}</h3>
                  <p className="mt-1 text-[0.85rem] text-fg-muted">
                    {supplier.contact || 'No contact'}
                  </p>
                </div>
                <Badge variant="accent">{supplier.leadTimeDays}d lead</Badge>
              </div>
              <dl className="mb-4 space-y-1 text-[0.85rem] text-fg-secondary">
                <div>{supplier.email || '—'}</div>
                <div>{supplier.phone || '—'}</div>
                <div className="text-fg-muted">
                  {linkedCounts[supplier.id] || 0} linked products
                </div>
              </dl>
              {supplier.notes && (
                <p className="mb-4 text-[0.82rem] text-fg-muted">{supplier.notes}</p>
              )}
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => openEdit(supplier)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  leftIcon={<HiOutlineTrash />}
                  onClick={() => setDeleting(supplier)}
                >
                  Remove
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit supplier' : 'Add supplier'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button loading={isSubmitting} onClick={handleSubmit(onSubmit)}>
              {editing ? 'Save' : 'Create'}
            </Button>
          </>
        }
      >
        <form className="grid grid-cols-2 gap-3 max-[560px]:grid-cols-1" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Company name"
            className="col-span-2 max-[560px]:col-span-1"
            error={errors.name?.message}
            {...register('name', { required: 'Name is required' })}
          />
          <Input label="Contact person" {...register('contact')} />
          <Input label="Lead time (days)" type="number" min="1" {...register('leadTimeDays')} />
          <Input label="Email" type="email" {...register('email')} />
          <Input label="Phone" {...register('phone')} />
          <Input
            label="Notes"
            className="col-span-2 max-[560px]:col-span-1"
            {...register('notes')}
          />
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) deleteSupplier(deleting.id);
          setDeleting(null);
        }}
        title="Remove supplier"
        message={`Remove “${deleting?.name}”? Linked products keep their supplier id until edited.`}
        confirmLabel="Remove"
        danger
      />
    </div>
  );
}

export default Suppliers;
