type JarListProps = {
  jars: Array<{
    id: string;
    authorNickname: string;
    jarUrl: string;
    createdAt: string;
    accumulated?: string | null;
    goal?: string | null;
    lastStatsUpdate?: string | null;
  }>;
  loading: boolean;
  onDelete: (id: string) => Promise<void>;
};

export default function JarList({ jars, loading, onDelete }: JarListProps) {
  return (
    <div>
      <h2>Всі банки</h2>
      {loading && <p className="loading">Завантаження...</p>}

      {jars.length === 0 ? (
        <div className="empty-state">
          <p>Немає доданих банок</p>
        </div>
      ) : (
        <div className="jars-container">
          {/* Desktop view - Table */}
          <table className="table">
            <thead>
              <tr>
                <th>Автор</th>
                <th>Посилання на банку</th>
                <th>Накопичено</th>
                <th>Ціль</th>
                <th>Оновлено</th>
                <th>Дата додавання</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {jars.map((jar) => (
                <tr key={jar.id}>
                  <td>{jar.authorNickname}</td>
                  <td>
                    <a href={jar.jarUrl} target="_blank" rel="noreferrer">
                      {jar.jarUrl.substring(0, 40)}...
                    </a>
                  </td>
                  <td>{jar.accumulated ? `${jar.accumulated} ₴` : "null"}</td>
                  <td>{jar.goal ? `${jar.goal} ₴` : "null"}</td>
                  <td>
                    {jar.lastStatsUpdate
                      ? new Date(jar.lastStatsUpdate).toLocaleTimeString("uk-UA", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      : "null"}
                  </td>
                  <td>{new Date(jar.createdAt).toLocaleDateString("uk-UA")}</td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => onDelete(jar.id)}
                    >
                      Видалити
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile view - Cards */}
          <div className="cards-grid">
            {jars.map((jar) => (
              <div key={jar.id} className="jar-card">
                <div className="card-field">
                  <label>Автор</label>
                  <p>{jar.authorNickname}</p>
                </div>
                <div className="card-field">
                  <label>Посилання</label>
                  <a href={jar.jarUrl} target="_blank" rel="noreferrer">
                    {jar.jarUrl.substring(0, 50)}...
                  </a>
                </div>
                <div className="card-field">
                  <label>Накопичено</label>
                  <p>{jar.accumulated ? `${jar.accumulated} ₴` : "null"}</p>
                </div>
                <div className="card-field">
                  <label>Ціль</label>
                  <p>{jar.goal ? `${jar.goal} ₴` : "null"}</p>
                </div>
                <div className="card-field">
                  <label>Оновлено</label>
                  <p>
                    {jar.lastStatsUpdate
                      ? new Date(jar.lastStatsUpdate).toLocaleTimeString("uk-UA", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      : "null"}
                  </p>
                </div>
                <div className="card-actions">
                  <button
                    className="btn-delete"
                    onClick={() => onDelete(jar.id)}
                  >
                    Видалити
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
