const express = require("express");
const cors = require("cors");
const connectDB = require("./connection");
const authRoutes = require("./routes/auth");
const donorRoutes = require("./routes/donors");
const requestRoutes = require("./routes/requests");
const User = require("./models/User");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
connectDB();

// Seed admin user
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "admin@gmail.com" });
    if (!adminExists) {
      const admin = new User({
        name: "Admin",
        email: "admin@gmail.com",
        password: "admin123",
        blood: "O+",
        isAdmin: true,
      });
      await admin.save();
      console.log("Admin user created");
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
};

seedAdmin();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/requests", requestRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Blood Bank API Server" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
