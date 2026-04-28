const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const expenseRoutes = require("./routes/expenses");
const authRoutes = require("./routes/auth");

dotenv.config();

// Connect to Database
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

// Serve Frontend
const __frontend_dir = path.join(__dirname, "../frontend/dist");
if (process.env.NODE_ENV === "production") {
  app.use(express.static(__frontend_dir));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__frontend_dir, "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.json({ message: "Expense Tracker API is running" });
  });
}

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
