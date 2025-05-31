import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import wallpaper from "../assets/Wallpaper_LowOpacity.jpg";
import { AiFillHeart, AiOutlineHeart, AiOutlineEdit } from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa";
import { likeApi } from "../api/likeApi";
import { recipeApi } from "../api/recipeApi";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import EditRecipeModal from "../components/EditRecipeModal";
import { EMOTIONS } from "../assets/emotion";
import { FiTrash2 } from "react-icons/fi";

const ThreadItem = ({ thread, onEdit, onDelete }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikeStatusAndCount = async () => {
      try {
        const [likedRes, countRes] = await Promise.all([
          likeApi.hasLiked(thread.id),
          likeApi.count(thread.id),
        ]);
        setLiked(likedRes.data.liked);
        setLikesCount(countRes.data.count);
      } catch (err) {
        console.error("Failed to fetch like status or count", err);
      }
    };
    fetchLikeStatusAndCount();
  }, [thread.id]);

  const toggleLike = async () => {
    try {
      if (liked) {
        await likeApi.unlike(thread.id);
        setLiked(false);
        setLikesCount((prev) => Math.max(prev - 1, 0));
      } else {
        await likeApi.like(thread.id);
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Failed to toggle like", err);
    }
  };

  const goToComments = () => navigate(`/recipes/${thread.id}`);
  const emotionText = thread.emotions?.map((e) => e.emotion).join(", ") || "";
  const username = thread.author?.username || "Unknown";

  return (
    <div className="flex items-start border-b border-gray-200 py-4">
      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold mr-4">
        👤
      </div>
      <div className="flex-1">
        <div className="font-bold text-gray-900 text-base">
          {username}{" "}
          <span className="font-normal text-gray-400 text-xs ml-2">
            / {emotionText}
          </span>
        </div>
        <div className="mt-1 line-clamp-3 text-sm text-gray-600 my-1 cursor-pointer">
          <div className="text-base font-semibold text-gray-800">
            {thread.title}
          </div>
          <div className="text-sm text-gray-600 mt-1">{thread.description}</div>
        </div>
        <div className="flex items-center gap-5 text-sm text-gray-500 mt-2">
          <div
            onClick={toggleLike}
            className={`flex items-center gap-1 cursor-pointer select-none ${
              liked ? "text-red-500" : "text-gray-500"
            }`}
          >
            {liked ? <AiFillHeart size={18} /> : <AiOutlineHeart size={18} />}
            <span>{likesCount.toLocaleString()}</span>
          </div>
          <div
            onClick={goToComments}
            className="flex items-center gap-1 cursor-pointer select-none text-gray-600"
          >
            <FaRegCommentDots size={18} />
            <span>{thread.comments?.length || 0}</span>
          </div>
          <div className="flex gap-4 ml-auto">
            <button
              onClick={() => onEdit(thread)}
              title="Edit"
              className="text-orange-500"
            >
              <AiOutlineEdit size={24} /> 
            </button>
            <button
              onClick={() => onDelete(thread)}
              title="Delete"
              className="text-red-500"
            >
              <FiTrash2 size={24} /> 
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyRecipePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [deletingRecipe, setDeletingRecipe] = useState(null);

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const res = await recipeApi.getByUser();
        setRecipes(res.data);
      } catch (err) {
        console.error("Failed to fetch my recipes", err);
      }
    };
    fetchMyRecipes();
  }, []);

  const filtered = recipes.filter((r) => {
    const title = r.title?.toLowerCase() || "";
    const description = r.description?.toLowerCase() || "";
    const author = r.author?.username?.toLowerCase() || "";
    const lowerSearch = searchTerm.toLowerCase();

    const matchesSearch =
      title.includes(lowerSearch) ||
      description.includes(lowerSearch) ||
      author.includes(lowerSearch) ||
      r.emotions?.some((e) => e.emotion?.toLowerCase().includes(lowerSearch));

    const matchesCategory =
      selectedCategories.length === 0 ||
      r.emotions?.some((e) => selectedCategories.includes(e.emotion));

    return matchesSearch && matchesCategory;
  });
  const handleSaveEdit = async (updatedData) => {
    try {
      await recipeApi.update(editingRecipe.id, updatedData);
      setRecipes((prev) =>
        prev.map((r) =>
          r.id === editingRecipe.id
            ? {
                ...r,
                ...updatedData,
                emotions: updatedData.emotions.map((e) => ({ emotion: e })),
              }
            : r
        )
      );
      setEditingRecipe(null);
    } catch (err) {
      console.error("Edit failed:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await recipeApi.delete(deletingRecipe.id);
      setRecipes((prev) => prev.filter((r) => r.id !== deletingRecipe.id));
      setDeletingRecipe(null);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-center items-start font-nerko"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      <div className="w-full max-w-5xl bg-white/90 rounded-2xl shadow-xl mt-20 p-8 overflow-y-auto max-h-[80vh]">
        <h1 className="text-2xl text-orange-500 font-bold text-center mb-5">
          My Recipes
        </h1>

        <div className="flex flex-wrap gap-4 justify-center mb-6">
          <input
            type="text"
            placeholder="Search your recipes"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-md border border-gray-300 shadow text-sm focus:outline-none min-w-[250px] max-w-[400px]"
          />

          <div className="flex flex-wrap gap-3 border border-gray-300 p-2 rounded bg-white max-w-[400px] overflow-y-auto max-h-24">
            {EMOTIONS.map((category) => (
              <label
                key={category}
                className={`flex items-center gap-1 text-xs cursor-pointer select-none ${
                  selectedCategories.includes(category)
                    ? "text-orange-500"
                    : "text-gray-600"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() =>
                    setSelectedCategories((prev) =>
                      prev.includes(category)
                        ? prev.filter((c) => c !== category)
                        : [...prev, category]
                    )
                  }
                  className="accent-orange-500"
                />
                {category}
              </label>
            ))}
          </div>
        </div>

        {filtered.length > 0 ? (
          filtered.map((r) => (
            <ThreadItem
              key={r.id}
              thread={r}
              onEdit={setEditingRecipe}
              onDelete={setDeletingRecipe}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No recipes found.</p>
        )}
      </div>

      {editingRecipe && (
        <EditRecipeModal
          initialData={{
            recipeName: editingRecipe.title,
            mood: editingRecipe.emotions?.[0]?.emotion || "",
            description: editingRecipe.description,
          }}
          onSave={handleSaveEdit}
          onCancel={() => setEditingRecipe(null)}
        />
      )}

      {deletingRecipe && (
        <ConfirmDeleteModal
          onConfirm={handleDelete}
          onCancel={() => setDeletingRecipe(null)}
        />
      )}
    </div>
  );
};

export default MyRecipePage;
