const ConfirmDeleteModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 font-nerko">
      <div className="bg-white px-8 py-6 rounded-xl shadow-lg w-full max-w-sm text-center">
        <h2 className="text-xl font-bold text-red-500 mb-3">Delete Recipe?</h2>
        <p className="text-gray-600 text-sm mb-6">Are you sure you want to delete this recipe? This action cannot be undone.</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-1.5 rounded-md text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-1.5 rounded-md text-sm bg-red-500 text-white hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
