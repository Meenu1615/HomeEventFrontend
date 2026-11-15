import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function Signup() {
  const navigate = useNavigate();
  const [emailid, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [utype, setUtype] = useState("User");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/signup`, {
        emailid,
        password,
        utype,
      });

      setMessage(
        response.data.emailSent
          ? "Signup successful! Welcome email sent."
          : "Signup successful! Email service is not configured.",
      );

      navigate("/login");

      alert(`Welcome to Home Events, ${emailid}!`);

      setEmail("");
      setPassword("");
      setUtype("User");
    } catch (error: any) {
      console.log("SIGNUP ERROR:", error);
      console.log("SERVER RESPONSE:", error.response?.data);

      alert(error.response?.data?.message || error.message || "Signup failed");
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-picture signup-picture">
          <div className="picture-content">
            <span className="picture-icon">✦</span>
            <h2>Every celebration starts here.</h2>
            <p>
              Create your account and make every occasion a beautiful memory.
            </p>
          </div>
        </div>

        <div className="auth-form-area">
          <span className="auth-eyebrow">JOIN OUR COMMUNITY</span>
          <h1>Create Account</h1>
          <p className="auth-subtitle">
            Sign up to get started with Home Events.
          </p>

          <form onSubmit={handleSignup}>
            <label htmlFor="signup-email">Email ID</label>
            <input
              id="signup-email"
              type="email"
              placeholder="Enter your email"
              value={emailid}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type="password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />

            <label htmlFor="signup-type">User Type</label>
            <select
              id="signup-type"
              value={utype}
              onChange={(e) => setUtype(e.target.value)}
              required
            >
              <option value="Select User Type">Select User Type</option>
              <option value="Citizen">Citizen</option>
              <option value="Vendor">Vendor</option>
            </select>

            <button type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Signup Now →"}
            </button>
          </form>

          {message && (
            <p className="auth-message" role="status">
              {message}
            </p>
          )}

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Signup;
