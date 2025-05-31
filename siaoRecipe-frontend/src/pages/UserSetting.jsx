import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { userApi } from "../api/userApi";
import Wallpaper from "../assets/Wallpaper_LowOpacity.jpg";

const UserSetting = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userApi.getCurrentUser();
        const user = res.data;
        setValue("username", user.username);
        setValue("userId", user.id);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load user:", err);
        Swal.fire("Error", "Failed to load user data", "error");
      }
    };
    fetchUser();
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      const { userId, username, password } = data;

      const payload = { username };
      if (password) payload.password = password;

      await userApi.update(userId, payload);
      Swal.fire({
        title: "Updated!",
        text: "Your account has been updated.",
        icon: "success",
        confirmButtonColor: "#f47c20",
      }).then(() => navigate("/home"));
    } catch (err) {
      console.error("Update failed:", err);
      Swal.fire("Error", "Failed to update profile", "error");
    }
  };

  if (loading) return <div className="text-center mt-32">Loading...</div>;

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${Wallpaper})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "fixed",
          inset: 0,
          zIndex: -1,
        }}
      />
      <div className="flex items-center justify-center rounded-b-lg">
        <div className="w-full max-w-lg bg-white p-10 shadow-lg rounded-lg border border-gray-300 mt-45">
          <div className="w-full text-center mb-5">
            <span className="font-poppins inline-block text-3xl font-bold text-orange-500 ">
              User Setting
            </span>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
            <input type="hidden" {...register("userId")} />

            <div>
              <label className="font-semibold text-gray-600 text-sm">
                Username
              </label>
              <input
                type="text"
                {...register("username", { required: "Username is required" })}
                className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="font-semibold text-gray-600 text-sm">
                New Password (leave blank to keep current)
              </label>
              <input
                type="password"
                {...register("password", {
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                className="w-full px-4 py-3 border border-gray-400 rounฟded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="font-semibold text-gray-600 text-sm">
                Confirm Password
              </label>
              <input
                type="password"
                {...register("confirmPassword", {
                  validate: (value) =>
                    value === getValues("password") || "Passwords do not match",
                })}
                className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full max-w-sm bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-bold mt-4"
              >
                Save
              </button>
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => navigate("/home")}
                className="w-full max-w-sm border border-gray-400 bg-white text-orange-500 py-3 rounded-lg hover:bg-gray-100 transition font-bold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserSetting;
