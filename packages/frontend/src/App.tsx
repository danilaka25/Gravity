import { useState, useEffect } from "react";
import "./App.css";
import JarList from "./components/JarList";
import AddJarForm from "./components/AddJarForm";
import { API_URL } from "./config";

type Jar = {
  id: string;
  authorNickname: string;
  jarUrl: string;
  createdAt: string;
  accumulated?: string | null;
  goal?: string | null;
  lastStatsUpdate?: string | null;
};

function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "add">("home");
  const [jars, setJars] = useState<Jar[]>([]);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadJars();
  }, []);

  const loadJars = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/jars`);
      if (!response.ok) throw new Error("Failed to load jars");
      const data = await response.json();
      setJars(data);
    } catch (error) {
      showMessage("Помилка при завантаженні даних", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddJar = async (jarUrl: string, authorNickname: string) => {
    try {
      const response = await fetch(`${API_URL}/api/jars`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jarUrl, authorNickname }),
      });

      if (!response.ok) throw new Error("Failed to add jar");

      showMessage("✅ Банку успішно додано!", "success");
      loadJars();
      setCurrentPage("home");
    } catch (error) {
      showMessage("❌ Помилка при додаванні банки", "error");
    }
  };

  const handleDeleteJar = async (id: string) => {
    if (!confirm("Ви впевнені?")) return;

    try {
      const response = await fetch(`${API_URL}/api/jars/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete jar");

      showMessage("✅ Банку видалено", "success");
      loadJars();
    } catch (error) {
      showMessage("❌ Помилка при видаленні", "error");
    }
  };

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🍯 Gravity - Monobank Jars Monitor</h1>
        <div className="nav">
          <button
            className={`nav-btn ${currentPage === "home" ? "active" : "inactive"
              }`}
            onClick={() => setCurrentPage("home")}
          >
            📊 Головна
          </button>
          <button
            className={`nav-btn ${currentPage === "add" ? "active" : "inactive"
              }`}
            onClick={() => setCurrentPage("add")}
          >
            ➕ Додати
          </button>
        </div>
      </div>

      <div className="content">
        {message && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        {currentPage === "home" && (
          <JarList jars={jars} loading={loading} onDelete={handleDeleteJar} />
        )}

        {currentPage === "add" && <AddJarForm onAdd={handleAddJar} />}
      </div>
    </div>
  );
}

export default App;
