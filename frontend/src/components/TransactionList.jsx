import { motion, AnimatePresence } from "framer-motion";

const categories = ["All", "Food", "Transport", "Bills", "Shopping", "Health", "Education", "Salary", "Other"];
const types = ["All", "expense", "income"];

export default function TransactionList({ 
  expenses, 
  loading, 
  error, 
  filters, 
  handleFilterChange, 
  startEdit, 
  handleDelete 
}) {
  const monthValue = filters.month === "All" ? "" : filters.month;

  return (
    <motion.section 
      className="card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="section-head">
        <h2>Recent Transactions</h2>
        <div className="filters">
          <select name="category" value={filters.category} onChange={handleFilterChange}>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select name="type" value={filters.type} onChange={handleFilterChange}>
            {types.map((type) => (
              <option key={type} value={type}>
                {type === "All" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
          <input
            name="month"
            value={monthValue}
            onChange={handleFilterChange}
            type="month"
          />
        </div>
      </div>

      {error && <div className="alert">{error}</div>}
      
      {loading ? (
        <div className="muted">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            Loading transactions...
          </motion.div>
        </div>
      ) : expenses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💸</div>
          <h3>No transactions found</h3>
          <p>Start by adding a new entry above or try changing your filters.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Type</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {expenses.map((item) => (
                  <motion.tr 
                    key={item._id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <td>
                      <div className="title-cell">
                        <strong>{item.title}</strong>
                        {item.notes && <span className="notes-preview">{item.notes}</span>}
                      </div>
                    </td>
                    <td>{item.category}</td>
                    <td>
                      <span className={`pill ${item.type}`}>
                        {item.type}
                      </span>
                    </td>
                    <td>{new Date(item.date).toLocaleDateString()}</td>
                    <td className={`amount-cell ${item.type}`}>
                      {item.type === "income" ? "+" : "-"}₹{Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="actions">
                      <button type="button" className="small secondary" onClick={() => startEdit(item)}>Edit</button>
                      <button type="button" className="small danger" onClick={() => handleDelete(item._id)}>Delete</button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </motion.section>
  );
}
