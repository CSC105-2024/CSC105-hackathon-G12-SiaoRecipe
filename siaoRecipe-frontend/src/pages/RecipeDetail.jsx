import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AiOutlineUser, AiFillHeart } from "react-icons/ai";
import { FaRegCommentDots, FaEdit, FaTrash } from "react-icons/fa";
import Wallpaper from "../assets/Wallpaper_LowOpacity.jpg";
import { recipeApi } from "../api/recipeApi";
import { commentApi } from "../api/commentApi";
import { likeApi } from "../api/likeApi";
import { userApi } from "../api/userApi";
import EditCommentModal from "../components/EditComment.Modal";
import ConfirmDeleteCommentModal from "../components/ConfirmDeleteCommentModal";

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [editingComment, setEditingComment] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recipeRes, commentRes, hasLikedRes, likeCountRes, userRes] =
          await Promise.all([
            recipeApi.getById(id),
            commentApi.getByRecipe(id),
            likeApi.hasLiked(id),
            likeApi.count(id),
            userApi.getCurrentUser(),
          ]);

        setRecipe(recipeRes.data);
        setComments(commentRes.data);
        setLiked(hasLikedRes.data.liked);
        setLikeCount(likeCountRes.data.count);
        setCurrentUser(userRes.data);
      } catch (err) {
        console.error("Failed to load data", err);
      }
    };
    fetchData();
  }, [id]);

  const handleToggleLike = async () => {
    try {
      if (liked) {
        await likeApi.unlike(id);
        setLikeCount((prev) => prev - 1);
      } else {
        await likeApi.like(id);
        setLikeCount((prev) => prev + 1);
      }
      setLiked(!liked);
    } catch (err) {
      console.error("Failed to toggle like", err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await commentApi.create({
        recipeId: Number(id),
        content: newComment,
      });
      setComments((prev) => [res.data, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to post comment", err);
    }
  };

  const handleSaveEdit = async (commentId, content) => {
    try {
      await commentApi.update(commentId, content);
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, content: content, author: c.author } : c
        )
      );

      setEditingComment(null);
    } catch (err) {
      console.error("Failed to update comment", err);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await commentApi.delete(confirmDeleteId);
      setComments((prev) => prev.filter((c) => c.id !== confirmDeleteId));
      setConfirmDeleteId(null);
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  if (!recipe) {
    return (
      <div className="text-center mt-10 text-gray-600">Loading recipe...</div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center py-8"
      style={{ backgroundImage: `url(${Wallpaper})` }}
    >
      <div className="max-w-2xl mx-auto bg-white/90 rounded-2xl shadow-xl p-6 min-h-[80vh] font-nerko mt-15">
        {/* Header */}
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center border-2 border-gray-500 mr-3">
            <AiOutlineUser size={20} />
          </div>
          <div>
            <div className="text-gray-800 font-bold">
              {recipe?.author?.username || "Unknown"}
              <span className="text-sm text-gray-500 font-normal ml-2">
                / {recipe?.emotions?.map((e) => e.emotion).join(", ")}
              </span>
            </div>
          </div>
        </div>

        {/* Title + Description */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            {recipe?.title}
          </h2>
          <div className="text-gray-700 whitespace-pre-line leading-relaxed">
            {recipe?.description}
          </div>
        </div>

        {/* Likes + Comment Count */}
        <div className="flex gap-6 text-gray-600 text-base mb-6">
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={handleToggleLike}
          >
            <AiFillHeart
              size={18}
              className={liked ? "text-red-500" : "text-gray-400"}
            />
            <span>{likeCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaRegCommentDots size={16} />
            <span>{recipe?.commentsCount || comments.length}</span>
          </div>
        </div>

        {/* Comment Form */}
        <div className="mb-6">
          <label
            htmlFor="comment"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Leave a comment
          </label>
          <textarea
            id="comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Express the flavor of your feelings..."
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none text-sm font-nerko resize-y min-h-[100px] mb-3"
          />
          <div className="flex justify-end">
            <button
              onClick={handleCommentSubmit}
              className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-black transition"
            >
              Send
            </button>
          </div>
        </div>

        {/* Comment List */}
        <div className="border-t border-gray-300 pt-4 space-y-3 max-h-[300px] overflow-y-auto">
          {comments.map((cmt) => (
            <div
              key={cmt.id}
              className="bg-gray-100 px-4 py-2 rounded-lg text-sm text-gray-700 flex justify-between items-start gap-2"
            >
              <div>
                <strong>{cmt?.author?.username || "Anonymous"}</strong>:{" "}
                {cmt?.content}
              </div>
              {currentUser?.id === cmt?.author?.id && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingComment(cmt)}
                    className="text-black hover:opacity-80"
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(cmt.id)}
                    className="text-black hover:opacity-80"
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <EditCommentModal
        isOpen={!!editingComment}
        comment={editingComment}
        onClose={() => setEditingComment(null)}
        onSave={handleSaveEdit}
      />
      <ConfirmDeleteCommentModal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default RecipeDetail;
