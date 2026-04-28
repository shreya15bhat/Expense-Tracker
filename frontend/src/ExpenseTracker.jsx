import { useEffect, useMemo, useState } from "react";
import { createExpense, deleteExpense, getExpenses, updateExpense } from "./api";
import { useAuth } from "./context/AuthContext";
import Charts from "./components/Charts";
import SummaryCards from "./components/SummaryCards";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";

const initialForm = {
  title: "",
  amount: "",
  category: "Food",
  type: "expense",
  date: new Date().toISOString().slice(0, 10),
  notes: ""
};

export default function ExpenseTracker() {
  const { user, logoutUser } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({ category: "All", type: "All", month: "All" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const data = await getExpenses(filters);
      setExpenses(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [filters]);

  const summary = useMemo(() => {
    const income = expenses
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const expense = expenses
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    return {
      income,
      expense,
      balance: income - expense
    };
  }, [expenses]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      ...form,
      amount: Number(form.amount)
    };

    try {
      setError("");
      if (editingId) {
        await updateExpense(editingId, payload);
      } else {
        await createExpense(payload);
      }
      resetForm();
      await loadData();
    } catch (err) {
      setError(err.message || "Unable to save expense");
    }
  }

  function startEdit(item) {
    setEditingId(item._id);
    setForm({
      title: item.title || "",
      amount: String(item.amount ?? ""),
      category: item.category || "Food",
      type: item.type || "expense",
      date: item.date ? new Date(item.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      notes: item.notes || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm("Delete this entry?");
    if (!confirmDelete) return;

    try {
      await deleteExpense(id);
      await loadData();
    } catch (err) {
      setError(err.message || "Unable to delete expense");
    }
  }

  return (
    <div className="app-shell">
      <div className="container">
        <nav className="nav-bar">
          <div className="user-info">
            <span className="avatar">{user.name.charAt(0).toUpperCase()}</span>
            <span>Welcome, <strong>{user.name}</strong></span>
          </div>
          <button className="small secondary" onClick={logoutUser}>Logout</button>
        </nav>

        <header className="hero">
          <div>
            <p className="eyebrow">Personal Finance</p>
            <h1>Dashboard</h1>
            <p className="subtitle">Track your income and expenses in real-time.</p>
          </div>

          <SummaryCards summary={summary} />
          
          <Charts expenses={expenses} />
        </header>

        <TransactionForm 
          form={form} 
          editingId={editingId} 
          handleChange={handleChange} 
          handleSubmit={handleSubmit} 
          resetForm={resetForm} 
        />

        <TransactionList 
          expenses={expenses} 
          loading={loading} 
          error={error} 
          filters={filters} 
          handleFilterChange={handleFilterChange} 
          startEdit={startEdit} 
          handleDelete={handleDelete} 
        />
      </div>
    </div>
  );
}
