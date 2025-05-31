import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaHome, FaSearch, FaUser } from "react-icons/fa";
import Logo from "../assets/Siao_Logo.png";
import { userApi } from "../api/userApi.ts";

const Sidebar = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await userApi.logout();
      document.cookie = "token=; Max-Age=0; path=/";
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await userApi.getCurrentUser();
      } catch (err) {
        navigate("/");
      }
    };
    checkAuth();
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-[300px] bg-gradient-to-b from-[#FF9B45] to-[#EE6E00] text-white p-8 flex flex-col justify-between shadow-lg font-[Comic_Sans_MS]">
        <img src={Logo} alt="Siao Logo" className="w-[100%] mx-auto mb-25" />

        <nav className="flex flex-col gap-10 ml-6">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `flex items-center font-bold text-lg hover:bg-[#FF7B29] px-2 py-2 rounded-lg ${
                isActive ? "bg-[#FF7B29]" : ""
              }`
            }
          >
            <FaHome className="mr-3 text-xl" />
            HomePage
          </NavLink>

          <NavLink
            to="/explore"
            className={({ isActive }) =>
              `flex items-center font-bold text-lg hover:bg-[#FF7B29] px-2 py-2 rounded-lg ${
                isActive ? "bg-[#FF7B29]" : ""
              }`
            }
          >
            <FaSearch className="mr-3 text-xl" />
            Explore
          </NavLink>

          <div className="flex items-center gap-2">
            <NavLink
              to="/setting"
              className={({ isActive }) =>
                `flex-1 flex items-center font-bold text-lg hover:bg-[#FF7B29] px-2 py-1 rounded-lg ${
                  isActive ? "bg-[#FF7B29]" : ""
                }`
              }
            >
              <FaUser className="mr-3 text-xl" />
              User
            </NavLink>
            <span
              onClick={toggleUserMenu}
              className="cursor-pointer text-sm select-none mr-25"
            >
              {userMenuOpen ? "▲" : "▼"}
            </span>
          </div>

          {userMenuOpen && (
            <div className="flex flex-col gap-4 ml-8 font-semibold">
              <NavLink
                to="/my-recipe"
                className={({ isActive }) =>
                  `text-white hover:bg-[#FF7B29] px-2 py-1 rounded-lg ${
                    isActive ? "bg-[#FF7B29]" : ""
                  }`
                }
              >
                My Recipe
              </NavLink>
              <NavLink
                to="/favorite"
                className={({ isActive }) =>
                  `text-white hover:bg-[#FF7B29] px-2 py-1 rounded-lg ${
                    isActive ? "bg-[#FF7B29]" : ""
                  }`
                }
              >
                Favourite
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-white hover:bg-[#FF7B29] px-2 py-1 rounded-lg text-left"
              >
                Log Out
              </button>
            </div>
          )}
        </nav>

        <div className="flex flex-col gap-2 items-center mt-auto">
          <div className="w-15 h-1.5 bg-white rounded-md"></div>
          <div className="w-12 h-1.5 bg-white rounded-md"></div>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Sidebar;
