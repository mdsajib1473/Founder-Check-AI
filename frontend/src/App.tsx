import { useState, useEffect } from 'react'
import './App.css'

interface AnalysisResult {
  analysis_id?: number
  idea_extraction: { title: string; description: string; sector: string; target_customer: string; revenue_model: string; location: string }
  demand_analysis: { score: number; market_size: string; competition: string; opportunities: string[]; threats: string[] }
  regulatory_analysis: { risk_score: number; key_regulators: string[]; critical_approvals: string; estimated_timeline: number; cost_estimate: number; warnings: string }
  business_canvas: { key_partners: string[]; key_activities: string[]; key_resources: Record<string, unknown>; value_proposition: string; customer_segments: string[]; channels: string[]; customer_relationships: string[]; revenue_streams: Record<string, unknown>; cost_structure: Record<string, unknown> }
  investor_questions: Array<{ question: string; category: string }>
  overall_readiness_score: number
  analysis_status: string
}

interface HistoryItem {
  id: number
  title: string
  sector: string
  overall_readiness_score: number
  qa_completed: number
  created_at: string
}

function App() {
  const [page, setPage] = useState<'home' | 'history' | 'qa'>('home')
  const [idea, setIdea] = useState('')
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [backendHealth, setBackendHealth] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])

  // Q&A state
  const [qaSession, setQASession] = useState<any>(null)
  const [qaAnswer, setQAAnswer] = useState('')
  const [qaLoading, setQALoading] = useState(false)
  const [qaResults, setQAResults] = useState<any[]>([])

  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    checkBackendHealth()
  }, [])

  const checkBackendHealth = async () => {
    try {
      const res = await fetch('http://localhost:8000/health')
      setBackendHealth(res.ok)
    } catch {
      setBackendHealth(false)
    }
  }

  // ===== ANALYSIS =====
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idea.trim() || idea.length < 10) {
      setError('Enter at least 10 characters')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('http://localhost:8000/api/v1/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, language: 'english' }),
      })

      if (!res.ok) throw new Error('Analysis failed')
      const data = await res.json()
      setAnalysis(data)
      setActiveTab('overview')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed')
    } finally {
      setLoading(false)
    }
  }

  // ===== HISTORY =====
  const loadHistory = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/analyses')
      if (!res.ok) throw new Error('Failed to load')
      const data = await res.json()
      setHistory(data)
      setPage('history')
    } catch (err) {
      setError('Failed to load history')
    }
  }

  const loadAnalysisFromHistory = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/analyses/${id}`)
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setAnalysis(data)
      setPage('home')
      setActiveTab('overview')
    } catch (err) {
      setError('Failed to load analysis')
    }
  }

  // ===== Q&A =====
  const startQA = async () => {
    if (!analysis?.analysis_id) {
      setError('Save analysis first')
      return
    }

    try {
      const res = await fetch(`http://localhost:8000/api/v1/qa/start/${analysis.analysis_id}`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setQASession(data)
      setQAResults([])
      setQAAnswer('')
      setPage('qa')
    } catch (err) {
      setError('Failed to start Q&A')
    }
  }

  const submitAnswer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!qaAnswer.trim()) return

    setQALoading(true)
    try {
      const res = await fetch('http://localhost:8000/api/v1/qa/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: qaSession.session_id, answer: qaAnswer }),
      })

      if (!res.ok) throw new Error('Failed')
      const data = await res.json()

      // Store result
      setQAResults([
        ...qaResults,
        {
          question: qaSession.question,
          answer: qaAnswer,
          score: data.last_score || 7,
          feedback: data.last_feedback || 'Good answer'
        }
      ])

      if (data.completed) {
        setQASession({
          ...qaSession,
          completed: true,
          final_score: data.final_score,
          readiness_score: data.readiness_score
        })
      } else {
        setQASession({ ...qaSession, question: data.question, question_number: data.question_number })
        setQAAnswer('')
      }
    } catch (err) {
      setError('Failed to submit answer')
    } finally {
      setQALoading(false)
    }
  }

  // ===== RENDER =====

  if (page === 'history') {
    return (
      <div className="app">
        <header className="header">
          <div className="header-content">
            <div className="logo-section">
              <h1>FounderCheck</h1>
              <p>Bangladesh Startup Validator</p>
            </div>
            <button className="nav-btn active" onClick={() => setPage('home')}>
              ← Back to Analyze
            </button>
          </div>
        </header>

        <main className="main-content">
          <div className="container">
            <div className="input-card">
              <h2>Analysis History</h2>
              {history.length === 0 ? (
                <p className="subtitle">No analyses yet. Create your first one!</p>
              ) : (
                <div className="history-list">
                  {history.map((item) => (
                    <div key={item.id} className="history-item" onClick={() => loadAnalysisFromHistory(item.id)}>
                      <div className="history-left">
                        <h4>{item.title}</h4>
                        <p>{item.sector} • Score: {item.overall_readiness_score}/10</p>
                        <span className="history-date">{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="history-right">
                        {item.qa_completed ? <span className="badge-done">✓ Q&A Done</span> : <span className="badge-pending">○ Pending Q&A</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        <footer className="footer">
          <p>FounderCheck | Bangladesh Startup Intelligence Platform</p>
        </footer>
      </div>
    )
  }

  if (page === 'qa') {
    return (
      <div className="app">
        <header className="header">
          <div className="header-content">
            <div className="logo-section">
              <h1>FounderCheck - Investor Q&A</h1>
              <p>{qaSession?.question_number || 0}/{qaSession?.total_questions || 10}</p>
            </div>
            <button className="nav-btn" onClick={() => setPage('home')}>← Back</button>
          </div>
        </header>

        <main className="main-content">
          <div className="container">
            {qaSession?.completed ? (
              <div className="input-card">
                <h2>Q&A Complete! ✓</h2>
                <div className="qa-summary">
                  <div className="score-box">
                    <p className="label">Final Q&A Score</p>
                    <p className="big-score">{qaSession.final_score?.toFixed(1)}/10</p>
                  </div>
                  <div className="score-box">
                    <p className="label">Adjusted Readiness</p>
                    <p className="big-score">{qaSession.readiness_score?.toFixed(1)}/10</p>
                  </div>
                </div>

                <h3>Your Answers:</h3>
                <div className="qa-results">
                  {qaResults.map((r, i) => (
                    <div key={i} className="qa-result-item">
                      <p><strong>Q{i+1}: {r.question}</strong></p>
                      <p className="answer">A: {r.answer}</p>
                      <p className="score">Score: {r.score}/10 - {r.feedback}</p>
                    </div>
                  ))}
                </div>

                <button className="submit-btn" onClick={() => setPage('home')}>
                  View Final Report
                </button>
              </div>
            ) : (
              <div className="input-card">
                <h3>Question {qaSession?.question_number || 1}/{qaSession?.total_questions || 10}</h3>
                <p className="qa-question">{qaSession?.question}</p>

                <form onSubmit={submitAnswer}>
                  <textarea
                    value={qaAnswer}
                    onChange={(e) => setQAAnswer(e.target.value)}
                    placeholder="Your answer..."
                    rows={5}
                    disabled={qaLoading}
                    className="textarea"
                  />
                  <button type="submit" disabled={qaLoading || !qaAnswer.trim()} className="submit-btn">
                    {qaLoading ? 'Evaluating...' : 'Submit Answer'}
                  </button>
                </form>

                {qaResults.length > 0 && (
                  <div className="qa-progress">
                    <h4>Previous Answers:</h4>
                    {qaResults.map((r, i) => (
                      <div key={i} className="mini-result">
                        <span>Q{i+1}: {r.score}/10</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        <footer className="footer">
          <p>FounderCheck | Investor Interview Mode</p>
        </footer>
      </div>
    )
  }

  // ===== HOME PAGE =====
  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <h1>FounderCheck</h1>
            <p>Bangladesh Startup Validator</p>
          </div>
          <div className="header-right">
            <button className="nav-btn" onClick={() => { loadHistory() }}>
              📋 History
            </button>
            <span className={`status-badge ${backendHealth ? 'active' : 'inactive'}`}>
              {backendHealth ? '● Online' : '● Offline'}
            </span>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          {!analysis ? (
            <div className="input-section">
              <div className="input-card">
                <h2>Validate Your Startup Idea</h2>
                <p className="subtitle">Get comprehensive regulatory, market, and financial analysis</p>

                <form onSubmit={handleAnalyze} className="form">
                  <div className="form-group">
                    <label htmlFor="idea">Describe your startup idea</label>
                    <textarea
                      id="idea"
                      value={idea}
                      onChange={(e) => setIdea(e.target.value)}
                      placeholder="E.g., A cloud kitchen in Mirpur serving working professionals..."
                      rows={6}
                      disabled={loading}
                      className="textarea"
                    />
                    <span className="char-count">{idea.length}/500</span>
                  </div>

                  <button type="submit" disabled={loading || !idea.trim()} className="submit-btn">
                    {loading ? <><span className="spinner"></span> Analyzing...</> : <>📊 Analyze My Idea</>}
                  </button>
                </form>

                {error && <div className="error-box">❌ {error}</div>}

                <div className="demo-ideas">
                  <p className="demo-label">Try a demo:</p>
                  <div className="demo-buttons">
                    {['Cloud kitchen in Mirpur', 'AgriTech for Bogura', 'Fintech lending'].map((d) => (
                      <button key={d} type="button" onClick={() => setIdea(d)} className="demo-btn">
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="results-section">
              <div className="results-header">
                <div>
                  <h2>{analysis.idea_extraction.title}</h2>
                  <p className="result-subtitle">{analysis.idea_extraction.description}</p>
                </div>
                <button onClick={() => setAnalysis(null)} className="back-btn">← New Analysis</button>
              </div>

              {/* Score */}
              <div className="score-card">
                <div className="score-content">
                  <div className="score-circle" style={{background: `conic-gradient(#6366f1 ${analysis.overall_readiness_score * 10}%, #e5e7eb 0)`}}>
                    <span className="score-number">{analysis.overall_readiness_score}</span>
                  </div>
                  <div className="score-text">
                    <h3>Overall Readiness</h3>
                    <p className="score-label">{analysis.overall_readiness_score >= 8 ? '✓ Strong' : analysis.overall_readiness_score >= 6 ? '⚠ Moderate' : '✗ Needs Work'}</p>
                    <p className="score-desc">Based on market, regulatory & business analysis</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="tabs">
                {['overview', 'demand', 'regulatory', 'canvas', 'qa'].map(tab => (
                  <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="tab-content">
                {activeTab === 'overview' && (
                  <div className="overview-grid">
                    <div className="info-card"><h4>Sector</h4><p className="value">{analysis.idea_extraction.sector}</p></div>
                    <div className="info-card"><h4>Customer</h4><p className="value">{analysis.idea_extraction.target_customer}</p></div>
                    <div className="info-card"><h4>Revenue</h4><p className="value">{analysis.idea_extraction.revenue_model}</p></div>
                    <div className="info-card"><h4>Location</h4><p className="value">{analysis.idea_extraction.location}</p></div>
                  </div>
                )}

                {activeTab === 'demand' && (
                  <div className="section">
                    <div className="metric">
                      <span>Demand Score: {analysis.demand_analysis.score}/10</span>
                      <div className="score-bar"><div className="bar-fill" style={{width: `${analysis.demand_analysis.score * 10}%`, backgroundColor: '#10b981'}}></div></div>
                    </div>
                    <p><strong>Market:</strong> {analysis.demand_analysis.market_size}</p>
                    <p><strong>Competition:</strong> {analysis.demand_analysis.competition}</p>
                    <div className="two-col">
                      <div><h4>Opportunities</h4><ul>{analysis.demand_analysis.opportunities.map((o, i) => <li key={i}>✓ {o}</li>)}</ul></div>
                      <div><h4>Threats</h4><ul>{analysis.demand_analysis.threats.map((t, i) => <li key={i}>⚠ {t}</li>)}</ul></div>
                    </div>
                  </div>
                )}

                {activeTab === 'regulatory' && (
                  <div className="section">
                    <div className="metric">
                      <span>Regulatory Risk: {10 - analysis.regulatory_analysis.risk_score}/10</span>
                      <div className="score-bar"><div className="bar-fill" style={{width: `${(10 - analysis.regulatory_analysis.risk_score) * 10}%`, backgroundColor: '#ef4444'}}></div></div>
                    </div>
                    <div className="reg-grid">
                      <div><h4>Regulators</h4><div className="tags">{analysis.regulatory_analysis.key_regulators.map((r, i) => <span key={i} className="tag">{r}</span>)}</div></div>
                      <div><h4>Approvals</h4><p>{analysis.regulatory_analysis.critical_approvals}</p></div>
                      <div><h4>Timeline</h4><p className="highlight">~{analysis.regulatory_analysis.estimated_timeline} days</p></div>
                      <div><h4>Cost</h4><p className="highlight">৳{analysis.regulatory_analysis.cost_estimate.toLocaleString()}</p></div>
                    </div>
                    <div className="warning-box"><strong>⚠️</strong> {analysis.regulatory_analysis.warnings}</div>
                  </div>
                )}

                {activeTab === 'canvas' && (
                  <div className="canvas-section">
                    <div className="canvas-grid">
                      <div className="canvas-block"><h4>Partners</h4><ul>{analysis.business_canvas.key_partners?.map((p, i) => <li key={i}>{p}</li>)}</ul></div>
                      <div className="canvas-block"><h4>Activities</h4><ul>{analysis.business_canvas.key_activities?.map((a, i) => <li key={i}>{a}</li>)}</ul></div>
                      <div className="canvas-block"><h4>Segments</h4><ul>{analysis.business_canvas.customer_segments?.map((c, i) => <li key={i}>{c}</li>)}</ul></div>
                      <div className="canvas-block highlight-block"><h4>Value Prop</h4><p>{analysis.business_canvas.value_proposition}</p></div>
                    </div>
                  </div>
                )}

                {activeTab === 'qa' && (
                  <div className="qa-section">
                    {analysis.overall_readiness_score >= 5 ? (
                      <>
                        <p className="qa-intro">Ready to practice pitching to investors?</p>
                        <button className="submit-btn" onClick={startQA}>Start Investor Q&A Interview →</button>
                      </>
                    ) : (
                      <p style={{color: '#ef4444'}}>⚠️ Improve your readiness score first (target: 5+)</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>FounderCheck | Bangladesh Startup Intelligence Platform</p>
      </footer>
    </div>
  )
}

export default App
