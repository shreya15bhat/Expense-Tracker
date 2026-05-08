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

  async function loadData(customFilters) {
    try {
      setLoading(true);
      setError("");
      const data = await getExpenses(customFilters || filters);
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

    const shouldResetTypeFilter = !editingId && form.type === "income" && filters.type === "expense";
    const nextFilters = shouldResetTypeFilter ? { ...filters, type: "All" } : filters;

    try {
      setError("");
      if (editingId) {
        await updateExpense(editingId, payload);
      } else {
        await createExpense(payload);
      }
      resetForm();
      if (shouldResetTypeFilter) {
        setFilters(nextFilters);
      }
      await loadData(nextFilters);
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

  async function seedData() {
    const samples = [
      { title: "Salary", amount: 5000, category: "Salary", type: "income", date: new Date().toISOString().slice(0, 10), notes: "Monthly salary" },
      { title: "Rent", amount: 1200, category: "Rent", type: "expense", date: new Date().toISOString().slice(0, 10), notes: "Apt rent" },
      { title: "Groceries", amount: 450, category: "Food", type: "expense", date: new Date().toISOString().slice(0, 10) },
      { title: "Internet", amount: 60, category: "Bills", type: "expense", date: new Date().toISOString().slice(0, 10) },
      { title: "Stocks", amount: 200, category: "Investment", type: "income", date: new Date().toISOString().slice(0, 10) }
    ];
    
    try {
      setLoading(true);
      for (const item of samples) {
        await createExpense(item);
      }
      await loadData();
    } catch (err) {
      setError("Failed to seed data");
    } finally {
      setLoading(false);
    }
  }

  function exportToCSV() {
    if (expenses.length === 0) return;
    
    const headers = ["Date", "Title", "Amount", "Type", "Category", "Notes"];
    const rows = expenses.map(item => [
      new Date(item.date).toLocaleDateString(),
      item.title,
      item.amount,
      item.type,
      item.category,
      item.notes || ""
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `expenses_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="app-shell">
      <div className="container">
        <nav className="nav-bar">
          <div className="user-info">
            <span className="avatar">{user.name.charAt(0).toUpperCase()}</span>
            <span>Welcome, <strong>{user.name}</strong></span>
          </div>
          <div className="nav-actions">
            {expenses.length === 0 && <button className="small ghost" onClick={seedData}>Seed Data</button>}
            <button className="small ghost" onClick={exportToCSV} disabled={expenses.length === 0}>Export CSV</button>
            <button className="small secondary" onClick={logoutUser}>Logout</button>
          </div>
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
