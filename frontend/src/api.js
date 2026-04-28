const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

const getHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const headers = { "Content-Type": "application/json" };
  if (user && user.token) {
    headers["Authorization"] = `Bearer ${user.token}`;
  }
  return headers;
};

// Auth
export async function login(email, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Login failed");
  localStorage.setItem("user", JSON.stringify(data));
  return data;
}

export async function register(name, email, password) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Registration failed");
  localStorage.setItem("user", JSON.stringify(data));
  return data;
}

export function logout() {
  localStorage.removeItem("user");
}

// Expenses
export async function getExpenses(params = {}) {
  const url = new URL(`${API_BASE}/expenses`);
  Object.entries(params).forEach(([key, value]) => {
    if (value && value !== "All") url.searchParams.set(key, value);
  });

  const response = await fetch(url, { headers: getHeaders() });
  if (!response.ok) throw new Error("Failed to fetch expenses");
  return response.json();
}

export async function createExpense(expense) {
  const response = await fetch(`${API_BASE}/expenses`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(expense),
  });
  if (!response.ok) throw new Error("Failed to create expense");
  return response.json();
}

export async function updateExpense(id, expense) {
  const response = await fetch(`${API_BASE}/expenses/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(expense),
  });
  if (!response.ok) throw new Error("Failed to update expense");
  return response.json();
}

export async function deleteExpense(id) {
  const response = await fetch(`${API_BASE}/expenses/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete expense");
  return response.json();
}
