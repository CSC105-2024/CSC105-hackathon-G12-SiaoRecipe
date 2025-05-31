import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { userApi } from "../api/userApi";
import wallpaper from "../assets/Wallpaper_LowOpacity.jpg";
import logo from "../assets/Siao_Logo.png";

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await userApi.register({
        username: data.username,
        password: data.password,
      });

      Swal.fire({
        title: "Registration Successful!",
        text: "You have successfully registered.",
        icon: "success",
        confirmButtonColor: "#f47c20",
      }).then(() => {
        navigate("/");
      });
    } catch (err) {
      console.error("Registration failed:", err);
      Swal.fire({
        title: "Registration Failed",
        text: err.response?.data?.error || "An error occurred. Please try again.",
        icon: "error",
      });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center font-nerko"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      <div className="bg-gradient-to-b from-[#FF9B45] to-[#EE6E00] p-8 rounded-3xl shadow-lg w-96 text-center">
        <img src={logo} alt="SIAO Recipe" className="w-42 mx-auto mb-0" />

        <h2 className="text-white text-2xl font-bold mb-1">Create your Account</h2>
        <p className="text-white text-sm mb-6 font-nerko">We have no food. Just feelings.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="text-left text-white text-sm">
          <label className="block mb-1">Username</label>
          <input
            type="text"
            placeholder="username"
            {...register("username", { required: "Username is required" })}
            className={`w-full mb-2 px-4 py-2 rounded border ${errors.username ? "border-red-600" : "border-white"} bg-transparent text-white placeholder-gray placeholder-opacity-50 focus:outline-none`}
          />
          {errors.username && <p className="text-red-900 text-xs mb-2">{errors.username.message}</p>}

          <label className="block mb-1">Password</label>
          <input
            type="password"
            placeholder="************"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Password must be at least 8 characters" },
            })}
            className={`w-full mb-2 px-4 py-2 rounded border ${errors.password ? "border-red-600" : "border-white"} bg-transparent text-white placeholder-gray placeholder-opacity-50 focus:outline-none`}
          />
          {errors.password && <p className="text-red-900 text-xs mb-2">{errors.password.message}</p>}

          <label className="block mb-1">Confirm Password</label>
          <input
            type="password"
            placeholder="************"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) => value === getValues("password") || "Passwords don't match",
            })}
            className={`w-full mb-2 px-4 py-2 rounded border ${errors.confirmPassword ? "border-red-600" : "border-white"} bg-transparent text-white placeholder-gray placeholder-opacity-50 focus:outline-none`}
          />
          {errors.confirmPassword && <p className="text-red-900 text-xs mb-2">{errors.confirmPassword.message}</p>}

          <button
            type="submit"
            className="block w-full bg-white text-orange-500 font-bold py-2 rounded-xl text-center hover:bg-gray-100 mt-4"
          >
            Register
          </button>
        </form>

        <p className="text-white text-sm mt-6">
          Do you already have an Account?{" "}
          <a href="/" className="underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
