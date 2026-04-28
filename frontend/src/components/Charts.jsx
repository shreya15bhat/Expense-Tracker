import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#ef4444", "#6366f1"];

export default function Charts({ expenses }) {
  // Prepare Category Data for Pie Chart
  const categoryData = expenses
    .filter((item) => item.type === "expense")
    .reduce((acc, item) => {
      const existing = acc.find((c) => c.name === item.category);
      if (existing) {
        existing.value += Number(item.amount);
      } else {
        acc.push({ name: item.category, value: Number(item.amount) });
      }
      return acc;
    }, []);

  // Prepare Monthly Data for Bar Chart
  const monthlyDataMap = expenses.reduce((acc, item) => {
    const month = new Date(item.date).toLocaleString("default", { month: "short" });
    if (!acc[month]) {
      acc[month] = { name: month, income: 0, expense: 0 };
    }
    if (item.type === "income") {
      acc[month].income += Number(item.amount);
    } else {
      acc[month].expense += Number(item.amount);
    }
    return acc;
  }, {});

  const barData = Object.values(monthlyDataMap).sort((a, b) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.indexOf(a.name) - months.indexOf(b.name);
  });

  return (
    <motion.div 
      className="charts-grid"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="card chart-container">
        <h3>Expense by Category</h3>
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                animationBegin={0}
                animationDuration={1500}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ background: "#0f172a", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                itemStyle={{ color: "#e5e7eb" }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="muted" style={{ padding: "80px 0" }}>No expense data to display</div>
        )}
      </div>

      <div className="card chart-container">
        <h3>Income vs Expense</h3>
        {barData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ background: "#0f172a", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px" }}
                itemStyle={{ color: "#e5e7eb" }}
                cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
              />
              <Legend verticalAlign="bottom" height={36}/>
              <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} animationDuration={1500} />
              <Bar dataKey="expense" fill="#ef4444" radius={[6, 6, 0, 0]} animationDuration={1500} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="muted" style={{ padding: "80px 0" }}>No transaction history to display</div>
        )}
      </div>
    </motion.div>
  );
}
