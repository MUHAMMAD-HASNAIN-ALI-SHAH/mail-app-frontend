import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const SignIn = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const { signin, authButtonLoader } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await signin(form);
    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Left Side - Branding */}
      <div className="hidden md:flex flex-col justify-center items-center w-full md:w-1/2 bg-blue-600 text-white p-10">
        <h1 className="text-5xl font-bold mb-4">MailHub</h1>
        <p className="text-lg text-center max-w-md">
          Your personal, secure, and lightning-fast email platform. Stay
          connected with ease.
        </p>
        <img
          src="https://www.gstatic.com/images/branding/product/1x/gmail_2020q4_48dp.png"
          alt="Mail Icon"
          className="w-24 h-24 mt-10"
        />
      </div>

      {/* Right Side - Form */}
      <div className="flex justify-center items-center w-full md:w-1/2 bg-white px-6 py-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              disabled={authButtonLoader}
            >
              {authButtonLoader ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-4">
            Dont have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
