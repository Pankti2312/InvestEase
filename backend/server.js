const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Route imports
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const supportRoutes = require("./routes/supportRoutes");
const kycRoutes = require("./routes/kycRoutes");
const nomineeRoutes = require("./routes/nomineeRoutes");
const statementRoutes = require("./routes/statementRoutes");
const sipRoutes = require("./routes/sipRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const assistantRoutes = require("./routes/assistantRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/nominees", nomineeRoutes);
app.use("/api/statements", statementRoutes);
app.use("/api/sips", sipRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/assistant", assistantRoutes);

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("InvestEase API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
