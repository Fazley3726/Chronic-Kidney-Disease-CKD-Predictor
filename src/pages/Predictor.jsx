import { useEffect, useMemo, useState } from 'react'
import * as tf from '@tensorflow/tfjs'

// Feature columns from datasheet.csv
export const FEATURE_COLUMNS = [
  'Bp',   // Blood Pressure (mm Hg)
  'Sg',   // Specific Gravity
  'Al',   // Albumin
  'Su',   // Sugar
  'Rbc',  // Red Blood Cells (flag)
  'Bu',   // Blood Urea (mg/dL)
  'Sc',   // Serum Creatinine (mg/dL)
  'Sod',  // Sodium (mEq/L)
  'Pot',  // Potassium (mEq/L)
  'Wbcc', // White Blood Cell Count (/cmm)
  'Rbcc', // Red Blood Cell Count (millions/cmm)
  'Htn'   // Hypertension (flag)
]

export const FIELD_LABELS = {
  Bp: 'Blood Pressure (mm Hg)',
  Sg: 'Specific Gravity',
  Al: 'Albumin',
  Su: 'Sugar',
  Rbc: 'Red Blood Cells (flag)',
  Bu: 'Blood Urea (mg/dL)',
  Sc: 'Serum Creatinine (mg/dL)',
  Sod: 'Sodium (mEq/L)',
  Pot: 'Potassium (mEq/L)',
  Wbcc: 'White Blood Cell Count (/cmm)',
  Rbcc: 'Red Blood Cell Count (millions/cmm)',
  Htn: 'Hypertension (flag)'
}

function normalizeColumn(values) {
  const v = values.filter((x) => Number.isFinite(x))
  const min = Math.min(...v)
  const max = Math.max(...v)
  const range = max - min || 1
  return { data: values.map((x) => (Number(x) - min) / range), min, max }
}

function toNumber(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

function Predictor() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [model, setModel] = useState(null)
  const [scalers, setScalers] = useState([])
  const [patientName, setPatientName] = useState('')
  const makeEmptyForm = () => Object.fromEntries(FEATURE_COLUMNS.map((c) => [c, '']))
  const [form, setForm] = useState(() => makeEmptyForm())
  const [prediction, setPrediction] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function run() {
      try {
        setIsLoading(true)
        const ds = tf.data.csv('/datasheet.csv', { hasHeader: true, columnConfigs: { Class: { isLabel: true } } })
        const rows = []
        await ds.forEachAsync((row) => { rows.push(row) })

        const features = []
        const labels = []
        for (const r of rows) {
          const feat = FEATURE_COLUMNS.map((k) => toNumber(r.xs[k]))
          const cls = toNumber(r.ys.Class)
          const y = cls === 0 ? 0 : 1
          features.push(feat)
          labels.push(y)
        }

        const perColumn = FEATURE_COLUMNS.map((_, i) => features.map((row) => row[i]))
        const scalersTemp = perColumn.map((col) => {
          const { data, min, max } = normalizeColumn(col)
          return { data, min, max }
        })
        const normalized = features.map((_, r) => FEATURE_COLUMNS.map((__, c) => scalersTemp[c].data[r]))

        const m = tf.sequential()
        m.add(tf.layers.dense({ units: 16, inputShape: [FEATURE_COLUMNS.length], activation: 'relu' }))
        m.add(tf.layers.dropout({ rate: 0.1 }))
        m.add(tf.layers.dense({ units: 8, activation: 'relu' }))
        m.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }))
        m.compile({ optimizer: tf.train.adam(0.01), loss: 'binaryCrossentropy', metrics: ['accuracy'] })

        const xs = tf.tensor2d(normalized)
        const ys = tf.tensor2d(labels.map((y) => [y]))
        await m.fit(xs, ys, { epochs: 40, batchSize: 32, verbose: 0, shuffle: true })
        xs.dispose(); ys.dispose()

        if (cancelled) return
        setModel(m)
        setScalers(scalersTemp.map(({ min, max }) => ({ min, max })))
        setIsLoading(false)
      } catch (e) {
        console.error(e)
        if (!cancelled) {
          setError('Failed to load/train model. Check console.')
          setIsLoading(false)
        }
      }
    }
    run()
    return () => { cancelled = true }
  }, [])

  const canPredict = useMemo(() => model && scalers.length && FEATURE_COLUMNS.every((c) => form[c] !== '') && patientName.trim() !== '', [model, scalers, form, patientName])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  function normalizeInput() {
    return FEATURE_COLUMNS.map((col, idx) => {
      const { min, max } = scalers[idx]
      const range = (max - min) || 1
      const v = toNumber(form[col])
      return (v - min) / range
    })
  }

  async function handlePredict(e) {
    e.preventDefault()
    if (!canPredict) return
    const input = normalizeInput()
    const pred = model.predict(tf.tensor2d([input]))
    const prob = (await pred.data())[0]
    pred.dispose()
    setPrediction(prob)

    // Save record to localStorage
    const record = {
      id: Date.now(),
      name: patientName.trim(),
      fields: { ...form },
      result: prob,
      verdict: prob >= 0.5 ? 'Likely CKD' : 'Unlikely CKD',
      createdAt: new Date().toISOString()
    }
    const existing = JSON.parse(localStorage.getItem('kd_records') || '[]')
    existing.unshift(record)
    localStorage.setItem('kd_records', JSON.stringify(existing))

    // clear inputs
    setForm(makeEmptyForm())
    setPatientName('')
  }

  return (
    <div className="kd-container">
      <header className="kd-header">
        <h1>Chronic Kidney Disease Predictor</h1>
        <p className="kd-subtitle">Enter your health metrics to estimate CKD likelihood</p>
      </header>

      <div className="kd-card">
        {isLoading && <p className="kd-info">Training model from dataset... please wait</p>}
        {error && <p className="kd-error">{error}</p>}

        <form onSubmit={handlePredict} className="kd-form-grid">
          <div className="kd-form-item" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="patientName" className="kd-label">Patient Name</label>
            <input id="patientName" name="patientName" className="kd-input" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Enter patient full name" required />
          </div>

          {FEATURE_COLUMNS.map((col) => (
            <div key={col} className="kd-form-item">
              <label htmlFor={col} className="kd-label">{FIELD_LABELS[col] || col}</label>
              <input id={col} name={col} className="kd-input" type="number" step="any" value={form[col]} onChange={handleChange} placeholder={FIELD_LABELS[col] || col} required />
            </div>
          ))}
          <div className="kd-actions">
            <button className="kd-button" type="submit" disabled={!canPredict || isLoading}>Predict</button>
          </div>
        </form>
      </div>

      {prediction != null && (
        <div className="kd-result">
          <div className="kd-result-card">
            <div className="kd-prob">{(prediction * 100).toFixed(1)}%</div>
            <div className={`kd-verdict ${prediction >= 0.5 ? 'risk' : 'safe'}`}>{prediction >= 0.5 ? 'Likely CKD' : 'Unlikely CKD'}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Predictor


