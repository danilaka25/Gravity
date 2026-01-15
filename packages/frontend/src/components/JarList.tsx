type JarListProps = {
  jars: Array<{
    id: string;
    authorNickname: string;
    jarUrl: string;
    createdAt: string;
  }>;
  loading: boolean;
  onDelete: (id: string) => Promise<void>;
};

export default function JarList({ jars, loading, onDelete }: JarListProps) {
  return (
    <div>
      <h2>Все банки</h2>
      {loading && <p className="loading">Загрузка...</p>}

      {jars.length === 0 ? (
        <div className="empty-state">
          <p>Нет добавленных банок</p>
        </div>
      ) : (
        <div className="jars-container">
          {/* Desktop view - Table */}
          <table className="table">
            <thead>
              <tr>
                <th>Автор</th>
                <th>Ссылка на банку</th>
                <th>Дата добавления</th>
                <th>Действия</th>
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
                  <td>{new Date(jar.createdAt).toLocaleDateString("uk-UA")}</td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => onDelete(jar.id)}
                    >
                      Удалить
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
                  <label>Ссылка на банку</label>
                  <a href={jar.jarUrl} target="_blank" rel="noreferrer">
                    {jar.jarUrl.substring(0, 50)}...
                  </a>
                </div>
                <div className="card-field">
                  <label>Дата добавления</label>
                  <p>{new Date(jar.createdAt).toLocaleDateString("uk-UA")}</p>
                </div>
                <div className="card-actions">
                  <button
                    className="btn-delete"
                    onClick={() => onDelete(jar.id)}
                  >
                    Удалить
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
