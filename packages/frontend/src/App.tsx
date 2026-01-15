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
      showMessage("Ошибка при загрузке данных", "error");
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

      showMessage("✅ Банка успешно добавлена!", "success");
      loadJars();
      setCurrentPage("home");
    } catch (error) {
      showMessage("❌ Ошибка при добавлении банки", "error");
    }
  };

  const handleDeleteJar = async (id: string) => {
    if (!confirm("Вы уверены?")) return;

    try {
      const response = await fetch(`${API_URL}/api/jars/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete jar");

      showMessage("✅ Банка удалена", "success");
      loadJars();
    } catch (error) {
      showMessage("❌ Ошибка при удалении", "error");
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
            className={`nav-btn ${
              currentPage === "home" ? "active" : "inactive"
            }`}
            onClick={() => setCurrentPage("home")}
          >
            📊 Главная
          </button>
          <button
            className={`nav-btn ${
              currentPage === "add" ? "active" : "inactive"
            }`}
            onClick={() => setCurrentPage("add")}
          >
            ➕ Добавить
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
