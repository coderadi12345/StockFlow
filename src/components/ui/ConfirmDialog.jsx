import { HiOutlineExclamationTriangle } from 'react-icons/hi2';
import Button from './Button';
import Modal from './Modal';

function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm action',
  message = 'Are you sure you want to continue?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  danger = false,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={danger ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-[0.85rem]">
        <span
          className={`grid size-10 shrink-0 place-items-center rounded-md ${
            danger
              ? 'bg-[rgba(220,38,38,0.12)] text-danger'
              : 'bg-accent-soft text-accent'
          }`}
        >
          <HiOutlineExclamationTriangle size={22} />
        </span>
        <p className="leading-relaxed text-fg-secondary">{message}</p>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
