import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import wallpaper from "../assets/Wallpaper_LowOpacity.jpg";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa";
import { EMOTIONS } from "../assets/emotion";
import { likeApi } from "../api/likeApi";

const ThreadItem = ({ thread }) => {
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
          {username} <span className="font-normal text-gray-400 text-xs ml-2">/ {emotionText}</span>
        </div>
        <div className="mt-1 line-clamp-3 text-sm text-gray-600 my-1 cursor-pointer">
          <div className="text-base font-semibold text-gray-800">{thread.title}</div>
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
            <span>{thread._count?.comments || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const FavoritePage = () => {
  const [threads, setThreads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await likeApi.getAllLiked();
        setThreads(res.data);
      } catch (err) {
        console.error("Failed to fetch favorites", err);
      }
    };
    fetchFavorites();
  }, []);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredThreads = threads.filter((thread) => {
    const username = thread.author?.username?.toLowerCase() || "";
    const description = thread.description?.toLowerCase() || "";
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      username.includes(lowerSearch) ||
      description.includes(lowerSearch) ||
      thread.emotions?.some((e) => e.emotion?.toLowerCase().includes(lowerSearch));

    const matchesCategory =
      selectedCategories.length === 0 ||
      thread.emotions?.some((e) => selectedCategories.includes(e.emotion));

    return matchesSearch && matchesCategory;
  });

  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-center items-start font-nerko"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      <div className="w-full max-w-5xl bg-white/90 rounded-2xl shadow-xl mt-20 p-8 overflow-y-auto max-h-[80vh]">
        <h1 className="text-2xl text-orange-500 font-bold text-center mb-5">Favorites</h1>

        <div className="flex flex-wrap gap-4 justify-center mb-6">
          <input
            type="text"
            placeholder="Search favorites"
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
                  onChange={() => toggleCategory(category)}
                  className="accent-orange-500"
                />
                {category}
              </label>
            ))}
          </div>
        </div>

        <div>
          {filteredThreads.length > 0 ? (
            filteredThreads.map((thread) => (
              <ThreadItem key={thread.id} thread={thread} />
            ))
          ) : (
            <p className="text-center text-gray-500">No favorite recipes found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritePage;
