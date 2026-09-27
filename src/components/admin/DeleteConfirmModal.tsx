import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Gemstone } from '../../types';
import { useEcommerce } from '../../context/EcommerceContext';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Gemstone | null;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const { deleteProduct } = useEcommerce();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !product) return null;

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    const result = await deleteProduct(product.id);
    setIsDeleting(false);
    if (result.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-[#171717]/75 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="min-h-screen px-4 py-8 flex items-center justify-center relative">
        <div
          className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E1D9CD] z-10 animate-in fade-in zoom-in-95 duration-200 text-[#151515]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-[#716B60] hover:text-[#151515] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 className="font-serif text-xl font-semibold text-[#151515]">
            Permanently Delete Gemstone?
          </h3>

          <p className="text-xs text-[#716B60] mt-2 leading-relaxed">
            Are you sure you want to permanently delete <strong className="text-[#151515]">"{product.name}"</strong>?
          </p>

          <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg mt-3 border border-red-100">
            Warning: This action cannot be undone. This stone will be removed permanently from the database and public website.
          </p>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-[#E1D9CD] hover:border-[#716B60] text-[#716B60] hover:text-[#151515] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
              className="px-5 py-2.5 bg-[#A14B38] hover:bg-[#8A3F2F] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
            >
              {isDeleting ? 'Deleting...' : 'Confirm Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
