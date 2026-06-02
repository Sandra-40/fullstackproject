import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    blood: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    if (!token || !savedUser.email) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const user = data.user || savedUser;
          setProfile({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            address: user.address || "",
            blood: user.blood || user.bloodGroup || "",
            password: "",
          });
        } else {
          setProfile({
            name: savedUser.name || "",
            email: savedUser.email || "",
            phone: savedUser.phone || "",
            address: savedUser.address || "",
            blood: savedUser.blood || savedUser.bloodGroup || "",
            password: "",
          });
        }
      } catch (error) {
        setProfile({
          name: savedUser.name || "",
          email: savedUser.email || "",
          phone: savedUser.phone || "",
          address: savedUser.address || "",
          blood: savedUser.blood || savedUser.bloodGroup || "",
          password: "",
        });
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
    setMessage("");
    setError("");
  };

  const handleSave = async () => {
    if (!profile.name || !profile.blood) {
      setError("Please enter your name and blood group before saving.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    const token = localStorage.getItem("token");
    const payload = { ...profile };
    if (!payload.password) {
      delete payload.password;
    }

    try {
      if (token) {
        const response = await fetch("http://localhost:5000/api/auth/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        const updatedUser = data.user || payload;

        if (response.ok) {
          localStorage.setItem("user", JSON.stringify(updatedUser));
          window.dispatchEvent(new CustomEvent("profileUpdated", { detail: updatedUser }));
          setMessage("Profile updated successfully.");
          setProfile((prev) => ({ ...prev, password: "" }));
        } else {
          localStorage.setItem("user", JSON.stringify(updatedUser));
          window.dispatchEvent(new CustomEvent("profileUpdated", { detail: updatedUser }));
          setMessage("Saved locally. Backend profile update may not be available.");
        }
      } else {
        localStorage.setItem("user", JSON.stringify(payload));
        window.dispatchEvent(new CustomEvent("profileUpdated", { detail: payload }));
        setMessage("Saved locally.");
      }
    } catch (err) {
      localStorage.setItem("user", JSON.stringify(payload));
      window.dispatchEvent(new CustomEvent("profileUpdated", { detail: payload }));
      setError("Unable to reach backend. Saved locally.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="page-shell profile-page">
      <div className="profile-card">
        <h1 className="auth-title">My Profile</h1>
        <p className="auth-smalltext">View and update your details in one place.</p>

        {message && <div className="message-success">{message}</div>}
        {error && <div className="message-error">{error}</div>}

        <div className="profile-grid">
          <div className="form-row">
            <label>Name</label>
            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="auth-input"
              placeholder="Full Name"
            />
          </div>

          <div className="form-row">
            <label>Email</label>
            <input
              name="email"
              value={profile.email}
              readOnly
              className="auth-input auth-input-disabled"
            />
          </div>

          <div className="form-row">
            <label>Phone Number</label>
            <input
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="auth-input"
              placeholder="Phone Number"
            />
          </div>

          <div className="form-row">
            <label>Address</label>
            <input
              name="address"
              value={profile.address}
              onChange={handleChange}
              className="auth-input"
              placeholder="Address"
            />
          </div>

          <div className="form-row">
            <label>Blood Group</label>
            <input
              name="blood"
              value={profile.blood}
              onChange={handleChange}
              className="auth-input"
              placeholder="Blood Group"
            />
          </div>

          <div className="form-row">
            <label>Change Password</label>
            <div className="password-row">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={profile.password}
                onChange={handleChange}
                className="auth-input auth-input-password"
                placeholder="New Password"
              />
              <button
                type="button"
                className="show-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="auth-button"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving profile..." : "Save Profile"}
        </button>
      </div>
    </main>
  );
}

export default Profile;
