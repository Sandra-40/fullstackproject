import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [request, setRequest] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    blood: "",
    category: "Receiver",
    ailment: "",
    unitsRequired: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserEmail = currentUser.email || "";
  const userRequests = requests.filter(
    (requestItem) => requestItem.email === currentUserEmail
  );
  const approvedDonorRequests = requests.filter(
    (requestItem) => requestItem.category === "Donor" && requestItem.status === "Approved"
  );
  const availableDonors = [...donors, ...approvedDonorRequests];
  const totalRequests = userRequests.length;
  const activeDonors = availableDonors.length;
  const approvedRequests = userRequests.filter((item) => item.status === "Approved").length;

  const fetchDonors = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/donors");
      const data = await response.json();
      setDonors(data.donors || []);
    } catch (err) {
      console.error("Error fetching donors:", err);
    }
  };

  const fetchUserRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://localhost:5000/api/requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setRequests(data.requests || []);
    } catch (err) {
      console.error("Error fetching user requests:", err);
    }
  };

  useEffect(() => {
    fetchDonors();
    fetchUserRequests();

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
      fetchUserRequests();
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () => window.removeEventListener("profileUpdated", handleProfileUpdate);
  }, []);

  const handleRequestChange = (e) => {
    setRequest({
      ...request,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmitRequest = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login first");
        return;
      }

      const response = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Request failed");
        return;
      }

      alert("Request submitted successfully!");
      setRequest({
        name: "",
        age: "",
        email: "",
        phone: "",
        blood: "",
        category: "Receiver",
        ailment: "",
        unitsRequired: 1,
      });
      setError("");
      fetchUserRequests();
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <header className="page-heading">
        <div>
          <span className="page-badge">Donor Dashboard</span>
          <h1>Welcome back, {currentUser.name || "Member"}</h1>
          <p className="page-subtitle">
            Submit a new request, check status updates, and view available donors.
          </p>
        </div>
      </header>

      <div className="dashboard-summary">
        <div className="summary-card">
          <span className="summary-label">My Requests</span>
          <strong>{totalRequests}</strong>
          <p>{approvedRequests} approved requests</p>
        </div>
        <div className="summary-card">
          <span className="summary-label">Available Donors</span>
          <strong>{activeDonors}</strong>
          <p>Live blood group matches available</p>
        </div>
        <div className="summary-card summary-action-card">
          <span className="summary-label">Profile</span>
          <strong>{currentUser.name || "User"}</strong>
          <p>{currentUser.blood || "Blood group unknown"}</p>
          <button className="secondary-btn" type="button" onClick={() => navigate("/profile")}>Edit Profile</button>
        </div>
      </div>

      <div className="dashboard-grid user-dashboard-grid">
        <section className="section-card">
          <div className="section-card-header">
            <h2>Blood Request Form</h2>
            <span className="section-note">Enter your request details below.</span>
          </div>

          {error && <div className="message-error">{error}</div>}

          <div className="form-grid">
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="form-control"
              onChange={handleRequestChange}
              value={request.name}
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              className="form-control"
              onChange={handleRequestChange}
              value={request.age}
            />
            <input
              type="email"
              name="email"
              placeholder="Email ID"
              className="form-control"
              onChange={handleRequestChange}
              value={request.email}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              className="form-control"
              onChange={handleRequestChange}
              value={request.phone}
            />
            <input
              type="text"
              name="blood"
              placeholder="Blood Type"
              className="form-control"
              onChange={handleRequestChange}
              value={request.blood}
            />
            <select
              name="category"
              className="form-control"
              onChange={handleRequestChange}
              value={request.category}
            >
              <option value="Receiver">Receiver</option>
              <option value="Donor">Donor</option>
            </select>
            <input
              type="text"
              name="ailment"
              placeholder="Pre Defined Ailments"
              className="form-control"
              onChange={handleRequestChange}
              value={request.ailment}
            />
            <input
              type="number"
              name="unitsRequired"
              placeholder="Units Required"
              className="form-control"
              onChange={handleRequestChange}
              value={request.unitsRequired}
            />
          </div>

          <button className="primary-btn" onClick={handleSubmitRequest} disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </section>

        <section className="section-card">
          <div className="section-card-header">
            <h2>Request Status</h2>
            <span className="section-note">Track the latest updates for your sent requests.</span>
          </div>
          {userRequests.length === 0 ? (
            <p className="empty-state">No request history found.</p>
          ) : (
            <div className="request-list">
              {userRequests.map((requestItem) => (
                <div key={requestItem._id} className="list-card">
                  <div className="list-card-title">
                    <strong>{requestItem.category} request</strong> for {requestItem.blood}
                  </div>
                  <div className={`status-pill status-${requestItem.status.toLowerCase()}`}>
                    {requestItem.status}
                  </div>
                  <p className="list-card-description">
                    {requestItem.status === "Approved" &&
                      "Approved! You can contact the donor or visit the center."}
                    {requestItem.status === "Rejected" &&
                      "Rejected. Please update your request details or contact support."}
                    {requestItem.status === "Pending" &&
                      "Pending approval from admin."}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="table-card">
          <div className="section-card-header">
            <h2>Available Blood Donors</h2>
            <span className="section-note">Donor list and approved requests in one place.</span>
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
                    <th>Blood Group</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Ailment</th>
                    <th>Source</th>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
