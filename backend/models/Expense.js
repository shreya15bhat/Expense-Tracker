const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ["Food", "Transport", "Bills", "Shopping", "Health", "Education", "Salary", "Other"],
      default: "Other"
    },
    type: {
      type: String,
      required: true,
      enum: ["expense", "income"],
      default: "expense"
    },
    date: { type: Date, required: true, default: Date.now },
    notes: { type: String, trim: true, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
