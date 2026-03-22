const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Placement Portal Backend Running");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

const { verifyToken, authorizeRole } = require("./middleware/authMiddleware");

app.get("/api/protected",
  verifyToken,
  authorizeRole("admin"),
  (req, res) => {
    res.json({ message: "You accessed protected route!" });
  }
);

const applicationRoutes = require("./routes/applicationRoutes");

app.use("/api/applications", applicationRoutes);


const companyRoutes = require("./routes/companyRoutes");

app.use("/api/companies", companyRoutes);


const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);

const studentRoutes = require("./routes/studentRoutes");
app.use("/api/students", studentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
