import { motion } from "framer-motion";

const categories = ["Food", "Transport", "Bills", "Shopping", "Health", "Education", "Salary", "Other"];

export default function TransactionForm({ form, editingId, handleChange, handleSubmit, resetForm }) {
  return (
    <motion.section 
      className="card"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h2>{editingId ? "Edit Entry" : "Add New Entry"}</h2>
      <form className="form-grid" onSubmit={handleSubmit}>
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
        <input
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount"
          type="number"
          min="0"
          step="0.01"
          required
        />
        <select name="category" value={form.category} onChange={handleChange}>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input name="date" value={form.date} onChange={handleChange} type="date" required />
        <input name="notes" value={form.notes} onChange={handleChange} placeholder="Notes (optional)" />
        <div className="actions" style={{ gridColumn: "1 / -1" }}>
          <button type="submit" style={{ flex: 1 }}>{editingId ? "Update" : "Add"} Entry</button>
          {editingId && (
            <button type="button" className="secondary" onClick={resetForm}>Cancel Edit</button>
          )}
        </div>
      </form>
    </motion.section>
  );
}
