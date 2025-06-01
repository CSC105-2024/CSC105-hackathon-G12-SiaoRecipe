import { useState, useEffect } from "react";

const EditCommentModal = ({ isOpen, onClose, comment, onSave }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (comment) setContent(comment.content);
  }, [comment]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSave(comment.id, content);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 bg-opacity-30 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Edit Comment</h2>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 text-sm focus:outline-none"
          rows={4}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCommentModal;
