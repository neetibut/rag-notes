import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);
      setUser(data.user); // Save user to AuthContext
      navigate("/dashboard"); // Redirect after successful login
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-200">
      <div className="bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0_0_#000] w-full max-w-md p-10">
        <h2 className="text-3xl font-extrabold text-black text-center mb-8 border-4 border-black rounded-lg bg-yellow-200 py-3 ">
          Login to Your Account
        </h2>

        {error && (
          <div className="bg-red-200 text-red-900 border-2 border-black rounded-lg px-4 py-2 mb-4 text-center shadow-[2px_2px_0_0_#000] font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-base font-bold text-black mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="block w-full p-3 border-4 border-black rounded-lg bg-yellow-50 shadow-[2px_2px_0_0_#000] focus:ring-2 focus:ring-pink-300 font-mono text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-base font-bold text-black mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="block w-full p-3 border-4 border-black rounded-lg bg-yellow-50 shadow-[2px_2px_0_0_#000] focus:ring-2 focus:ring-pink-300 font-mono text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full bg-pink-300 border-4 border-black text-black font-extrabold py-3 rounded-lg shadow-[2px_2px_0_0_#000] hover:bg-pink-400 transition-all duration-200"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-base text-black mt-6 font-mono">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-blue-700 font-bold underline hover:text-blue-900"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
