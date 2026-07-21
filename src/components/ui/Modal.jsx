import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

const sizeMap = {
  sm: 'max-w-[420px]',
  md: 'max-w-[560px]',
  lg: 'max-w-[760px]',
};

function Modal({ isOpen, onClose, title, children, size = 'md', footer }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[1000] grid place-items-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className="absolute inset-0 bg-overlay backdrop-blur-[4px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={`glass relative max-h-[min(90vh,820px)] w-full overflow-auto rounded-xl bg-bg-solid ${sizeMap[size] || sizeMap.md}`}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          >
            <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-[1.15rem]">
              <h3 className="text-[1.1rem] font-bold">{title}</h3>
              <button
                type="button"
                className="grid size-[34px] place-items-center rounded-sm border-none bg-bg-muted text-fg-secondary cursor-pointer"
                onClick={onClose}
                aria-label="Close"
              >
                <IoClose size={20} />
              </button>
            </div>
            <div className="p-5">{children}</div>
            {footer && (
              <div className="flex justify-end gap-[0.65rem] border-t border-border px-5 pb-5 pt-4">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default Modal;
