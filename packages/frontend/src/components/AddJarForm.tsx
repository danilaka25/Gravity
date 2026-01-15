import { useState } from "react";

type AddJarFormProps = {
  onAdd: (jarUrl: string, authorNickname: string) => Promise<void>;
};

export default function AddJarForm({ onAdd }: AddJarFormProps) {
  const [jarUrl, setJarUrl] = useState("");
  const [authorNickname, setAuthorNickname] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onAdd(jarUrl, authorNickname);
      setJarUrl("");
      setAuthorNickname("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Добавить новую банку</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="jarUrl">Ссылка на банку Monobank</label>
          <input
            id="jarUrl"
            type="text"
            placeholder="https://send.monobank.ua/jar/..."
            value={jarUrl}
            onChange={(e) => setJarUrl(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="authorNickname">Ник автора</label>
          <input
            id="authorNickname"
            type="text"
            placeholder="Ваше имя или ник"
            value={authorNickname}
            onChange={(e) => setAuthorNickname(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn primary" disabled={loading}>
          {loading ? "Добавляется..." : "Добавить банку"}
        </button>
      </form>
    </div>
  );
}
