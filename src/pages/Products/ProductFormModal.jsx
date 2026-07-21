import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { capitalize } from '../../utils/helpers';
import { DEFAULT_REORDER_POINT } from '../../constants';
import { useInventory } from '../../hooks/useInventory';

function ProductFormModal({ isOpen, onClose, onSubmit, product, categories = [] }) {
  const isEdit = Boolean(product);
  const { suppliers } = useInventory();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      brand: '',
      price: '',
      stock: '',
      rating: '4',
      thumbnail: '',
      supplierId: '',
      reorderPoint: DEFAULT_REORDER_POINT,
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        title: product.title || '',
        description: product.description || '',
        category: product.category || '',
        brand: product.brand || '',
        price: product.price ?? '',
        stock: product.stock ?? '',
        rating: product.rating ?? 4,
        thumbnail: product.thumbnail || '',
        supplierId: product.supplierId || '',
        reorderPoint: product.reorderPoint ?? DEFAULT_REORDER_POINT,
      });
    } else {
      reset({
        title: '',
        description: '',
        category: categories[0] || '',
        brand: '',
        price: '',
        stock: '',
        rating: '4',
        thumbnail: '',
        supplierId: '',
        reorderPoint: DEFAULT_REORDER_POINT,
      });
    }
  }, [product, categories, reset, isOpen]);

  const categoryOptions = categories.map((c) => ({
    value: c,
    label: capitalize(c),
  }));

  const supplierOptions = [
    { value: '', label: 'Unassigned' },
    ...suppliers.map((s) => ({ value: s.id, label: s.name })),
  ];

  const submit = async (values) => {
    await onSubmit?.(values);
    onClose?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Product' : 'Add Product'}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button loading={isSubmitting} onClick={handleSubmit(submit)}>
            {isEdit ? 'Save changes' : 'Create product'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(submit)}>
        <div className="grid grid-cols-2 gap-[0.9rem]">
          <Input
            label="Title"
            error={errors.title?.message}
            {...register('title', { required: 'Title is required' })}
          />
          <Input label="Brand" {...register('brand')} />
          <Select
            label="Category"
            options={categoryOptions}
            error={errors.category?.message}
            {...register('category', { required: 'Category is required' })}
          />
          <Select
            label="Supplier"
            options={supplierOptions}
            {...register('supplierId')}
          />
          <Input
            label="Price"
            type="number"
            step="0.01"
            min="0"
            error={errors.price?.message}
            {...register('price', {
              required: 'Price is required',
              min: { value: 0, message: 'Must be ≥ 0' },
            })}
          />
          <Input
            label="Stock"
            type="number"
            min="0"
            error={errors.stock?.message}
            {...register('stock', {
              required: 'Stock is required',
              min: { value: 0, message: 'Must be ≥ 0' },
            })}
          />
          <Input
            label="Reorder point"
            type="number"
            min="0"
            hint="Suggest reorder when stock reaches this level"
            {...register('reorderPoint', {
              min: { value: 0, message: 'Must be ≥ 0' },
            })}
          />
          <Input
            label="Rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            {...register('rating', {
              min: { value: 0, message: 'Min 0' },
              max: { value: 5, message: 'Max 5' },
            })}
          />
        </div>
        <div className="mt-[0.9rem]">
          <Input label="Thumbnail URL" placeholder="https://…" {...register('thumbnail')} />
        </div>
        <div className="mt-[0.9rem] flex flex-col gap-[0.4rem]">
          <label
            className="text-[0.85rem] font-semibold text-fg-secondary"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            className="w-full min-h-[100px] resize-y rounded-md border border-border bg-input px-[0.9rem] py-[0.7rem] outline-none focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)]"
            rows={4}
            {...register('description')}
          />
        </div>
      </form>
    </Modal>
  );
}

export default ProductFormModal;
