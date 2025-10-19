import { useMemo, useState } from 'react'

function History() {
  const [selected, setSelected] = useState(null)
  const records = useMemo(() => JSON.parse(localStorage.getItem('kd_records') || '[]'), [])

  return (
    <div className="kd-container">
      <header className="kd-header">
        <h1>Previous Predictions</h1>
      </header>
      <div className="kd-card">
        {records.length === 0 ? (
          <p className="kd-info">No records yet.</p>
        ) : (
          <div className="kd-table-wrapper">
            <table className="kd-table">
              <thead>
                <tr>
                  <th>Serial</th>
                  <th>Name</th>
                  <th>Verdict</th>
                  <th>Probability</th>
                  <th>Date</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, idx) => (
                  <tr key={r.id}>
                    <td>{idx + 1}</td>
                    <td>{r.name}</td>
                    <td>{r.verdict}</td>
                    <td>{(r.result * 100).toFixed(1)}%</td>
                    <td>{new Date(r.createdAt).toLocaleString()}</td>
                    <td>
                      <button
                        type="button"
                        className="kd-button"
                        onClick={() => setSelected(r)}
                        style={{ height: 36, padding: '0 12px' }}
                      >
                        View details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="kd-modal" onClick={() => setSelected(null)}>
          <div className="kd-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="kd-modal-header">
              <h3>{selected.name}</h3>
              <button className="kd-modal-close" onClick={() => setSelected(null)}>×</button>
            </div>
            <div className="kd-modal-body">
              <p><strong>Verdict:</strong> {selected.verdict} ({(selected.result * 100).toFixed(1)}%)</p>
              <div className="kd-kv">
                {Object.entries(selected.fields).map(([k, v]) => (
                  <div key={k} className="kd-kv-row">
                    <div className="kd-kv-key">{k}</div>
                    <div className="kd-kv-value">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default History


