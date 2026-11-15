import { useState, type FormEvent } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const [emailid, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage("");

    if (!emailid || !password) {
      setMessage("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/login`, {
        emailid: emailid.trim().toLowerCase(),
        password: password,
      });

      console.log("LOGIN RESPONSE:", response.data);

      const { token, user } = response.data;

      // Check backend response
      if (!token || !user) {
        setMessage("Token or user details missing from backend!");
        return;
      }

      // Get user role
      const role = String(user.utype || user.role || "")
        .trim()
        .toLowerCase();

      // Save login information
      localStorage.setItem("token", token);
      localStorage.setItem("authUser", JSON.stringify(user));
      localStorage.setItem("utype", user.utype || user.role);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("citizenemail", user.emailid || emailid);

      alert(
        "Login Successful!\n\n" +
          "Welcome: " +
          (user.emailid || emailid) +
          "\nUser Type: " +
          user.utype +
          "\n\nJWT Token:\n" +
          token,
      );

      // Role-based dashboard navigation
      if (role === "user" || role === "citizen") {
        navigate("/citizen-dashboard", { replace: true });
      } else if (role === "vendor") {
        navigate("/vendor-dashboard", { replace: true });
      } else if (role === "admin") {
        navigate("/admin-dashboard", { replace: true });
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("authUser");
        localStorage.removeItem("utype");
        localStorage.removeItem("isLoggedIn");

        setMessage("Invalid user role: " + role);
      }
    } catch (error: any) {
      console.log("LOGIN ERROR:", error.response?.data || error.message);

      setMessage(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Unable to connect to server. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-picture login-picture">
          <div className="picture-content">
            <h2>Welcome Back!</h2>
            <p>
              Sign in and continue planning your special celebrations with us.
            </p>
          </div>
        </div>

        <div className="auth-form-area">
          <span className="auth-eyebrow">WELCOME BACK</span>

          <h1>Login</h1>

          <p className="auth-subtitle">
            Enter your registered account details.
          </p>

          <form onSubmit={handleLogin}>
            <label htmlFor="login-email">Email ID</label>

            <input
              id="login-email"
              type="email"
              placeholder="Enter your email"
              value={emailid}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="login-password">Password</label>

            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <p className="login-note">
              Use your registered email and password.
            </p>

            <button type="submit" disabled={loading}>
              {loading ? "Please Wait..." : "Login →"}
            </button>
          </form>

          {message && (
            <p className="auth-message" role="alert">
              {message}
            </p>
          )}

          <p className="auth-footer">
            New here? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
