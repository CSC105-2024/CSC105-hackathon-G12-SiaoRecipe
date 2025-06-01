import React from "react";
import { createPortal } from "react-dom";

const ConfirmDeleteCommentModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 w-[300px] text-center shadow-xl font-nerko">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Delete Comment
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete this comment?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmDeleteCommentModal;
