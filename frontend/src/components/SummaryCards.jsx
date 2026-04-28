import { motion } from "framer-motion";

export default function SummaryCards({ summary }) {
  const cards = [
    { label: "Income", value: summary.income, type: "income" },
    { label: "Expense", value: summary.expense, type: "expense" },
    { label: "Balance", value: summary.balance, type: "balance" }
  ];

  return (
    <div className="summary-grid">
      {cards.map((card, index) => (
        <motion.div 
          key={card.label}
          className={`summary-card ${card.type === "balance" ? (card.value >= 0 ? "positive" : "negative") : ""}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <span>{card.label}</span>
          <strong>₹{card.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
        </motion.div>
      ))}
    </div>
  );
}
