import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { EMOTIONS } from "../assets/emotion";
import Swal from "sweetalert2";

const CreateRecipeModal = ({ isOpen, onClose, onCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const toggleEmotion = (emotion) => {
    setSelectedEmotions((prev) =>
      prev.includes(emotion)
        ? prev.filter((e) => e !== emotion)
        : [...prev, emotion]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title,
        description,
        emotions: selectedEmotions,
      };
      const res = await axiosInstance.post("/recipes", payload);

      Swal.fire({
        icon: "success",
        title: "Recipe Created!",
        text: "Your recipe has been successfully posted.",
        confirmButtonColor: "#f97316",
      });

      onCreated?.(res.data);
      onClose();
    } catch (error) {
      console.error("Error creating recipe:", error);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Failed to create recipe. Please try again.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex justify-center items-center px-4">
      <div className="bg-white p-14 rounded-lg shadow-lg w-full max-w-xl relative font-nerko">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          ×
        </button>
        <h1 className="text-2xl font-bold text-center text-orange-500 mb-4">
          Create New Recipe
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium text-sm text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-sm text-gray-700">
              Emotion Tags
            </label>
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

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition text-sm font-semibold"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipeModal;
