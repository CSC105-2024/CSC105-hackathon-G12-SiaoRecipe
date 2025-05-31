import { useState } from "react";
import { EMOTIONS } from "../assets/emotion";
import Swal from "sweetalert2";

const EditRecipeModal = ({ initialData, onSave, onCancel }) => {
  const [title, setTitle] = useState(initialData.recipeName);
  const [description, setDescription] = useState(initialData.description);
  const [selectedEmotions, setSelectedEmotions] = useState(
    initialData.mood ? [initialData.mood] : []
  );

  const toggleEmotion = (emotion) => {
    setSelectedEmotions((prev) =>
      prev.includes(emotion)
        ? prev.filter((e) => e !== emotion)
        : [...prev, emotion]
    );
  };

  const handleSave = async () => {
    try {
      await onSave({
        title,
        description,
        emotions: selectedEmotions,
      });

      Swal.fire({
        icon: "success",
        title: "Recipe Updated!",
        text: "Your changes have been saved successfully.",
        confirmButtonColor: "#f97316",
      });
    } catch (error) {
      console.error("Error saving recipe:", error);
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: "Could not update the recipe. Please try again.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-md relative font-nerko">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-orange-500 text-center">Edit Recipe</h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">Title</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">Description</label>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-sm text-gray-700">Emotions</label>
            <div className="flex flex-wrap gap-2">
              {EMOTIONS.map((emotion) => (
                <label
                  key={emotion}
                  className={`px-3 py-1 rounded-full text-sm cursor-pointer border ${
                    selectedEmotions.includes(emotion)
                      ? "bg-orange-400 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={emotion}
                    checked={selectedEmotions.includes(emotion)}
                    onChange={() => toggleEmotion(emotion)}
                    className="hidden"
                  />
                  {emotion}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              className="px-4 py-2 bg-gray-300 text-sm rounded hover:bg-gray-400"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-orange-500 text-white text-sm rounded hover:bg-orange-600"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRecipeModal;
