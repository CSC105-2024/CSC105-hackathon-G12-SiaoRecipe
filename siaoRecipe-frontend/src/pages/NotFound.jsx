import { Link } from "react-router-dom";
import wallpaper from "../assets/Wallpaper_LowOpacity.jpg";

const NotFound = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center font-nerko px-4"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      <div className="bg-white/90 p-10 rounded-lg shadow-xl text-center max-w-lg w-full">
        <h1 className="text-6xl font-bold text-orange-500 mb-2">404</h1>
        <p className="text-xl text-gray-700 mb-4">Oops! Page not found</p>
        <p className="text-gray-500 mb-6">
          The page you’re looking for doesn’t exist, or it might have been cooked away 🍳
        </p>
        <Link
          to="/"
          className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
