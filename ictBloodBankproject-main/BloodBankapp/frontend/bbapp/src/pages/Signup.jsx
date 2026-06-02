import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    blood: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async () => {
    if (!user.name || !user.email || !user.password || !user.blood) {
      setError("Please complete all fields before signup.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate(data.user.isAdmin ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-smalltext">Add your details and start using Blood Bank.</p>

        {error && <div className="message-error">{error}</div>}

        <div className="form-row">
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="auth-input"
            onChange={handleChange}
            value={user.name}
          />
        </div>

        <div className="form-row">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            className="auth-input"
            onChange={handleChange}
            value={user.email}
          />
        </div>

        <div className="form-row">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create password"
            className="auth-input"
            onChange={handleChange}
            value={user.password}
          />
        </div>

        <div className="form-row">
          <label>Blood Group</label>
          <input
            type="text"
            name="blood"
            placeholder="A+, B-, O+, etc."
            className="auth-input"
            onChange={handleChange}
            value={user.blood}
          />
        </div>

        <button
          type="button"
          className="auth-button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Signing up..." : "Signup"}
        </button>
      </div>
    </div>
  );
}

export default Signup;