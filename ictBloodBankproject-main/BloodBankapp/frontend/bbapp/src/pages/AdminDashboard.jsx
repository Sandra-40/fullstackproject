import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("add");
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [donorForm, setDonorForm] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    blood: "",
    ailment: "",
  });

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    fetchDonors();
    fetchRequests();

    const handleProfileUpdate = (event) => {
      const updatedUser = event?.detail || JSON.parse(localStorage.getItem("user") || "{}");
      if (updatedUser.email) {
        setDonors((prev) =>
          prev.map((donor) =>
            donor.email === updatedUser.email
              ? {
                  ...donor,
                  name: updatedUser.name || donor.name,
                  phone: updatedUser.phone || donor.phone,
                  blood: updatedUser.blood || donor.blood,
                }
              : donor
          )
        );
        setRequests((prev) =>
          prev.map((item) =>
            item.email === updatedUser.email
              ? {
                  ...item,
                  name: updatedUser.name || item.name,
                  phone: updatedUser.phone || item.phone,
                  blood: updatedUser.blood || item.blood,
                }
              : item
          )
        );
      }
      fetchDonors();
      fetchRequests();
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () => window.removeEventListener("profileUpdated", handleProfileUpdate);
  }, []);

  const getToken = () => localStorage.getItem("token");

  const fetchDonors = async () => {
    try {
      const token = getToken();
      const response = await fetch("http://localhost:5000/api/donors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setDonors(data.donors || []);
    } catch (err) {
      console.error("Error fetching donors:", err);
    }
  };

  const fetchRequests = async () => {
    try {
      const token = getToken();
      const response = await fetch("http://localhost:5000/api/requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setRequests(data.requests || []);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  const handleDonorChange = (e) => {
    setDonorForm({
      ...donorForm,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleAddDonor = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();
      if (!token) {
        setError("Not authenticated");
        return;
      }

      const response = await fetch("http://localhost:5000/api/donors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(donorForm),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to add donor");
        return;
      }

      alert("Donor added successfully!");
      setDonorForm({
        name: "",
        age: "",
        email: "",
        phone: "",
        blood: "",
        ailment: "",
      });
      fetchDonors();
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDonor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this donor?")) return;

    try {
      const token = getToken();
      const response = await fetch(`http://localhost:5000/api/donors/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        alert("Failed to delete donor");
        return;
      }

      alert("Donor deleted successfully!");
      fetchDonors();
    } catch (err) {
      console.error("Error deleting donor:", err);
    }
  };

  const handleUpdateRequestStatus = async (id, status) => {
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:5000/api/requests/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update request");
        return;
      }

      alert("Request updated successfully!");
      fetchRequests();
    } catch (err) {
      console.error("Error updating request:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const approvedDonorRequests = requests.filter(
    (request) => request.category === "Donor" && request.status === "Approved"
  );

  const availableDonors = [...donors, ...approvedDonorRequests];

  return (
    <main className="page-shell">
      <header className="page-heading">
        <div>
          <span className="page-badge">Admin Dashboard</span>
          <h1>Admin workspace</h1>
          <p className="page-subtitle">
            Add donors, approve requests, and review listings in a polished dashboard.
          </p>
        </div>
      </header>

      <section className="admin-page-nav">
        <button
          type="button"
          className={`admin-nav-link ${activeTab === "add" ? "active" : ""}`}
          onClick={() => setActiveTab("add")}
        >
          Add Donor
        </button>
        <button
          type="button"
          className={`admin-nav-link ${activeTab === "donors" ? "active" : ""}`}
          onClick={() => setActiveTab("donors")}
        >
          Available Donors
        </button>
        <button
          type="button"
          className={`admin-nav-link ${activeTab === "requests" ? "active" : ""}`}
          onClick={() => setActiveTab("requests")}
        >
          Blood Donation Requests
        </button>
        <button
          type="button"
          className="admin-nav-link admin-logout-link"
          onClick={handleLogout}
        >
          Logout
        </button>
      </section>

      <section className="admin-content">
        {activeTab === "add" && (
          <section className="section-card admin-form-card">
            <div className="section-card-header">
              <h2>Add Donor</h2>
              <span className="section-note">Add new donor details to the system.</span>
            </div>

            {error && <div className="message-error">{error}</div>}

            <div className="form-grid admin-form-grid">
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="form-control"
                onChange={handleDonorChange}
                value={donorForm.name}
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                className="form-control"
                onChange={handleDonorChange}
                value={donorForm.age}
              />
              <input
                type="email"
                name="email"
                placeholder="Email ID"
                className="form-control"
                onChange={handleDonorChange}
                value={donorForm.email}
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                className="form-control"
                onChange={handleDonorChange}
                value={donorForm.phone}
              />
              <input
                type="text"
                name="blood"
                placeholder="Blood Type"
                className="form-control"
                onChange={handleDonorChange}
                value={donorForm.blood}
              />
              <input
                type="text"
                name="ailment"
                placeholder="Ailments"
                className="form-control"
                onChange={handleDonorChange}
                value={donorForm.ailment}
              />
            </div>

            <button className="primary-btn" onClick={handleAddDonor} disabled={loading}>
              {loading ? "Adding..." : "Add Donor"}
            </button>
          </section>
        )}

        {activeTab === "donors" && (
          <section className="table-card">
            <div className="section-card-header">
              <h2>Available Donors</h2>
              <span className="section-note">Donor records and approved request matches.</span>
            </div>

            {availableDonors.length === 0 ? (
              <p className="empty-state">No donors available.</p>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Age</th>
                      <th>Blood</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Ailment</th>
                      <th>Source</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableDonors.map((donor) => (
                      <tr key={donor._id}>
                        <td>{donor.name}</td>
                        <td>{donor.age}</td>
                        <td>{donor.blood}</td>
                        <td>{donor.email}</td>
                        <td>{donor.phone}</td>
                        <td>{donor.ailment}</td>
                        <td>{donor.status === "Approved" ? "Approved Request" : "Donor"}</td>
                        <td>
                          {donor.status !== "Approved" && (
                            <button className="danger-btn" onClick={() => handleDeleteDonor(donor._id)}>
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {activeTab === "requests" && (
          <section className="table-card">
            <div className="section-card-header">
              <h2>Blood Donation Requests</h2>
              <span className="section-note">Review and approve or reject requests.</span>
            </div>
            {requests.length === 0 ? (
              <p className="empty-state">No requests available.</p>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Blood Type</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request) => (
                      <tr key={request._id}>
                        <td>{request.name}</td>
                        <td>{request.blood}</td>
                        <td>{request.category}</td>
                        <td>{request.status}</td>
                        <td>
                          {request.status === "Pending" && (
                            <div className="action-group">
                              <button className="success-btn" onClick={() => handleUpdateRequestStatus(request._id, "Approved")}>Approve</button>
                              <button className="danger-btn" onClick={() => handleUpdateRequestStatus(request._id, "Rejected")}>Reject</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </section>
    </main>
  );
}

export default AdminDashboard;
