import { useState, useEffect } from 'react'
import './App.css'
import { generateEnhancedPDF } from './utils/enhancedPdfGenerator'
import FinancialDashboard from './components/FinancialDashboard'
import CollaborationHub from './components/CollaborationHub'
import MarketIntelligenceDashboard from './components/MarketIntelligenceDashboard'
import ProductValidationDashboard from './components/ProductValidationDashboard'
import PlatformIntegrationsDashboard from './components/PlatformIntegrationsDashboard'
import EducationResourcesDashboard from './components/EducationResourcesDashboard'
import StartupSchoolDashboard from './components/StartupSchoolDashboard'
import ComplianceLegalDashboard from './components/ComplianceLegalDashboard'
import AdvancedAnalyticsDashboard from './components/AdvancedAnalyticsDashboard'
import MobileOfflineDashboard from './components/MobileOfflineDashboard'
import LocalizationDashboard from './components/LocalizationDashboard'
import ContinuousMonitoringDashboard from './components/ContinuousMonitoringDashboard'
import ErrorBoundary, { Defer } from './components/ErrorBoundary'

/** True when the object exists and has at least one key. */
const hasData = (obj: any) => !!obj && Object.keys(obj).length > 0

/** Coerces an LLM field to a list: arrays pass through, a single value becomes a one-item list. */
const asList = (v: any): any[] => (Array.isArray(v) ? v : v == null || v === '' ? [] : [v])

/** Coerces an LLM field to displayable text, flattening lists and objects. */
const asText = (v: any): string => {
  if (typeof v === 'string') return v
  if (v == null) return ''
  if (Array.isArray(v)) return v.map(asText).join('; ')
  if (typeof v === 'object') return Object.values(v).map(asText).join('; ')
  return String(v)
}

/**
 * Honest placeholder for tabs whose data comes from the extended analysis.
 * Shows a calculating state while it runs and a retry option if it failed,
 * instead of empty shells or fabricated numbers.
 */
const ExtendedPending = ({ status, label, onRetry }: { status: string; label: string; onRetry: () => void }) => (
  <div className="section" style={{ textAlign: 'center', padding: '60px 20px' }}>
    {status === 'loading' ? (
      <>
        <h3>Calculating {label}...</h3>
        <p style={{ color: '#999', marginTop: '10px' }}>
          The extended analysis is still running. This usually takes under a minute.
        </p>
      </>
    ) : (
      <>
        <h3>{label} not available yet</h3>
        <p style={{ color: '#999', marginTop: '10px' }}>
          This section needs the extended analysis to finish before it can show real data.
        </p>
        <button className="btn-secondary" style={{ marginTop: '16px' }} onClick={onRetry}>
          Run extended analysis
        </button>
      </>
    )}
  </div>
)

const LogoIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background circle */}
    <rect width="24" height="24" rx="6" fill="url(#logoGradient)" opacity="0.1" />

    {/* Check mark */}
    <path d="M7 12L10.5 15.5L17 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

    {/* Upward arrow */}
    <path d="M12 5V13M12 5L10 7M12 5L14 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

    <defs>
      <linearGradient id="logoGradient" x1="0" y1="0" x2="24" y2="24">
        <stop offset="0%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
  </svg>
)

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [page, setPage] = useState<'home' | 'history' | 'qa'>('home')
  const [idea, setIdea] = useState('')
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [backendHealth, setBackendHealth] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [qaSession, setQASession] = useState<any>(null)
  const [qaAnswer, setQAAnswer] = useState('')
  const [qaResults, setQAResults] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [extendedStatus, setExtendedStatus] = useState<'idle' | 'loading' | 'ready' | 'failed'>('idle')
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem('fc_token'))
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
    checkBackendHealth()
  }, [isDarkMode])

  const checkBackendHealth = async () => {
    try {
      const res = await fetch('http://localhost:9001/health')
      setBackendHealth(res.ok)
    } catch {
      setBackendHealth(false)
    }
  }

  // Restore the session on load if a stored token is still valid
  useEffect(() => {
    if (!authToken) return
    fetch('http://localhost:9001/api/v1/auth/me', {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => {
        if (res.ok) {
          setIsLoggedIn(true)
        } else {
          localStorage.removeItem('fc_token')
          setAuthToken(null)
        }
      })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /** fetch with the Bearer token attached; logs out on 401. */
  const authFetch = async (url: string, options: RequestInit = {}) => {
    const headers: Record<string, string> = { ...((options.headers as Record<string, string>) || {}) }
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`
    const res = await fetch(url, { ...options, headers })
    if (res.status === 401) {
      localStorage.removeItem('fc_token')
      setAuthToken(null)
      setIsLoggedIn(false)
      setAuthError('Session expired, please log in again')
    }
    return res
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)
    const endpoint = authMode === 'register' ? 'register' : 'login'
    try {
      const res = await fetch(`http://localhost:9001/api/v1/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setAuthError(typeof data.detail === 'string' ? data.detail : 'Enter a valid email and a password of at least 8 characters')
        return
      }
      localStorage.setItem('fc_token', data.access_token)
      setAuthToken(data.access_token)
      setIsLoggedIn(true)
      setLoginEmail('')
      setLoginPassword('')
    } catch {
      setAuthError('Could not reach the server')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('fc_token')
    setAuthToken(null)
    setIsLoggedIn(false)
    setAnalysis(null)
    setExtendedStatus('idle')
    setAuthError(null)
    setPage('home')
  }

  const exportToPDF = () => {
    if (!analysis) {
      alert('No analysis to export')
      return
    }
    try {
      generateEnhancedPDF(analysis)
      alert('✓ Enterprise-grade PDF report generated successfully!')
    } catch (err) {
      console.error('PDF export error:', err)
      alert('Failed to export PDF. Please try again.')
    }
  }

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idea.trim() || idea.length < 10) {
      setError('Enter at least 10 characters')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await authFetch('http://localhost:9001/api/v1/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, language: 'english' }),
      })

      if (!res.ok) throw new Error('Analysis failed')
      const data = await res.json()
      setAnalysis(data)
      setActiveTab('overview')
      // Kick off the extended analysis in the background so the Financial,
      // SWOT, GTM, BD Impact and Founder Fit tabs get real data.
      if (data.analysis_id) {
        loadExtended(data.analysis_id)
      }
    } catch (err) {
      setError('Failed to analyze idea')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Fetches the extended analysis (SWOT, GTM, BD Impact, Founder Fit and
   * full financial projections) and merges it into the current analysis.
   * Skips the merge if the user has already started a different analysis.
   */
  const loadExtended = async (analysisId: number) => {
    setExtendedStatus('loading')
    try {
      const res = await authFetch(`http://localhost:9001/api/v1/analyze/${analysisId}/extended`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Extended analysis failed')
      const data = await res.json()
      setAnalysis((prev: any) =>
        prev && prev.analysis_id === analysisId ? { ...prev, ...data } : prev
      )
      setExtendedStatus('ready')
    } catch {
      setExtendedStatus('failed')
    }
  }

  const loadHistory = async () => {
    try {
      const res = await authFetch('http://localhost:9001/api/v1/analyses')
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setHistory(data)
      setPage('history')
    } catch (err) {
      setError('Failed to load history')
    }
  }

  const loadAnalysis = async (id: number) => {
    try {
      const res = await authFetch(`http://localhost:9001/api/v1/analyses/${id}`)
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setAnalysis(data)
      setPage('home')
      setActiveTab('overview')
    } catch (err) {
      setError('Failed to load analysis')
    }
  }

  const startQA = async () => {
    if (!analysis?.analysis_id) {
      setError('Analysis not saved')
      return
    }

    try {
      const res = await authFetch(`http://localhost:9001/api/v1/qa/start/${analysis.analysis_id}`, {
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

    try {
      const res = await authFetch('http://localhost:9001/api/v1/qa/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: qaSession.session_id, answer: qaAnswer }),
      })

      if (!res.ok) throw new Error('Failed')
      const data = await res.json()

      setQAResults([
        ...qaResults,
        {
          question: qaSession.question,
          answer: qaAnswer,
          score: data.last_score ?? null,
          feedback: data.last_feedback || ''
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
    }
  }

  // ===== LANDING PAGE / LOGIN =====
  if (!isLoggedIn) {
    return (
      <div className="landing">
        <div className="landing-header">
          <div className="landing-content">
            <div className="landing-logo">
              <LogoIcon size={28} />
              FounderCheck
            </div>
            <div className="landing-nav-links">
              <button className="nav-link">Features</button>
              <button className="nav-link">Pricing</button>
              <button className="nav-link">About</button>
            </div>
            <div className="landing-right">
              <button onClick={() => setIsDarkMode(!isDarkMode)} className="landing-theme">
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>

        <main className="landing-main">
          <section className="hero">
            <div className="hero-wrapper">
              <h1>Validate Your Startup Idea</h1>
              <p className="hero-subtitle">Get AI-powered market insights, regulatory guidance, and investor readiness assessment in 60 seconds</p>

              <div className="hero-stats">
                <div className="stat">
                  <div className="stat-value">5</div>
                  <div className="stat-label">Analysis Modules</div>
                </div>
                <div className="stat">
                  <div className="stat-value">10</div>
                  <div className="stat-label">Investor Questions</div>
                </div>
                <div className="stat">
                  <div className="stat-value">60s</div>
                  <div className="stat-label">Fast Results</div>
                </div>
              </div>

              <div className="demo-inputs">
                <button onClick={() => setIdea('AI-powered meal delivery in Dhaka')} className="demo-tag">Meal Delivery</button>
                <button onClick={() => setIdea('FinTech microloans for Bangladesh')} className="demo-tag">FinTech</button>
                <button onClick={() => setIdea('AgriTech for farmers')} className="demo-tag">AgriTech</button>
              </div>

              <button
                onClick={() => document.getElementById('features-section')?.scrollIntoView({behavior: 'smooth'})}
                className="hero-cta"
              >
                Start Validating Free
              </button>
            </div>
          </section>

          <section className="features-showcase" id="features-section">
            <h2 className="section-title">Comprehensive Startup Analysis</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Market Demand</h3>
                <p>Deep-dive analysis with TAM/SAM/SOM breakdown, customer needs assessment, and competitive landscape evaluation.</p>
                <ul className="feature-list">
                  <li>Market size estimation</li>
                  <li>Customer pain points</li>
                  <li>Competitive analysis</li>
                </ul>
              </div>

              <div className="feature-card">
                <div className="feature-icon">⚖️</div>
                <h3>Regulatory Insights</h3>
                <p>Bangladesh-specific compliance requirements, licensing needs, and legal considerations for your startup.</p>
                <ul className="feature-list">
                  <li>Regulatory compliance</li>
                  <li>Risk assessment</li>
                  <li>Legal requirements</li>
                </ul>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🎯</div>
                <h3>Business Model</h3>
                <p>Structured business model validation using the proven business canvas framework and methodology.</p>
                <ul className="feature-list">
                  <li>Value proposition</li>
                  <li>Revenue streams</li>
                  <li>Key partnerships</li>
                </ul>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🎤</div>
                <h3>Investor Interview</h3>
                <p>Practice pitching with AI-powered questions and receive detailed feedback on your startup idea.</p>
                <ul className="feature-list">
                  <li>10 critical questions</li>
                  <li>Real-time scoring</li>
                  <li>Expert feedback</li>
                </ul>
              </div>

              <div className="feature-card">
                <div className="feature-icon">📈</div>
                <h3>Readiness Score</h3>
                <p>Get a comprehensive readiness score and actionable insights to improve your startup idea.</p>
                <ul className="feature-list">
                  <li>Overall readiness score</li>
                  <li>Detailed breakdown</li>
                  <li>Action items</li>
                </ul>
              </div>

              <div className="feature-card">
                <div className="feature-icon">📑</div>
                <h3>PDF Export</h3>
                <p>Download your complete analysis as a professional PDF report to share with investors.</p>
                <ul className="feature-list">
                  <li>Professional PDF</li>
                  <li>Shareable format</li>
                  <li>Print-ready</li>
                </ul>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🔥</div>
                <h3>Competitor Analysis</h3>
                <p>Identify direct & indirect competitors, analyze their strengths/weaknesses, and find market gaps.</p>
                <ul className="feature-list">
                  <li>Competitor mapping</li>
                  <li>Market share analysis</li>
                  <li>Competitive advantage</li>
                </ul>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🇧🇩</div>
                <h3>Bangladesh Impact</h3>
                <p>Deep local market analysis including regulations, cultural factors, supply chain, and economic opportunity.</p>
                <ul className="feature-list">
                  <li>Local regulations</li>
                  <li>Cultural insights</li>
                  <li>Market potential</li>
                </ul>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🎯</div>
                <h3>SWOT Analysis</h3>
                <p>Complete SWOT matrix to identify strengths, weaknesses, opportunities and threats for your startup.</p>
                <ul className="feature-list">
                  <li>Strength assessment</li>
                  <li>Growth opportunities</li>
                  <li>Risk mitigation</li>
                </ul>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🚀</div>
                <h3>Go-to-Market Strategy</h3>
                <p>Phased GTM plan with customer acquisition channels, pricing strategy, and partnership targets.</p>
                <ul className="feature-list">
                  <li>3-phase launch plan</li>
                  <li>Pricing guidance</li>
                  <li>Partnership opportunities</li>
                </ul>
              </div>

              <div className="feature-card">
                <div className="feature-icon">⚠️</div>
                <h3>Risk Assessment</h3>
                <p>Identify critical risks with probability analysis, impact assessment, and mitigation strategies.</p>
                <ul className="feature-list">
                  <li>Risk prioritization</li>
                  <li>Impact analysis</li>
                  <li>Mitigation plans</li>
                </ul>
              </div>

              <div className="feature-card">
                <div className="feature-icon">👤</div>
                <h3>Founder Fit</h3>
                <p>Assess your startup idea against founder expertise, identify gaps, and get improvement recommendations.</p>
                <ul className="feature-list">
                  <li>Skill assessment</li>
                  <li>Experience gaps</li>
                  <li>Team recommendations</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="pricing-section" id="pricing-section">
            <div className="pricing-section-title">
              <h2 className="section-title">Simple Pricing</h2>
            </div>
            <div className="pricing-grid">
              <div className="pricing-card">
                <div className="pricing-name">Starter</div>
                <div className="pricing-desc">Perfect for early-stage founders</div>
                <div className="pricing-amount">Free</div>
                <ul className="pricing-features">
                  <li>5 analyses per month</li>
                  <li>Basic market analysis</li>
                  <li>Regulatory insights</li>
                  <li>Q&A interview</li>
                </ul>
                <button className="pricing-btn" onClick={() => document.getElementById('login-section')?.scrollIntoView({behavior: 'smooth'})}>Get Started</button>
              </div>

              <div className="pricing-card featured">
                <div className="pricing-badge">Most Popular</div>
                <div className="pricing-name">Professional</div>
                <div className="pricing-desc">For serious entrepreneurs</div>
                <div className="pricing-amount">$29<span style={{fontSize: '14px', color: 'var(--text-3)'}}>/ month</span></div>
                <ul className="pricing-features">
                  <li>Unlimited analyses</li>
                  <li>Advanced market analysis</li>
                  <li>PDF export</li>
                  <li>Priority support</li>
                  <li>Analysis history</li>
                </ul>
                <button className="pricing-btn" onClick={() => document.getElementById('login-section')?.scrollIntoView({behavior: 'smooth'})}>Subscribe Now</button>
              </div>

              <div className="pricing-card">
                <div className="pricing-name">Enterprise</div>
                <div className="pricing-desc">For organizations</div>
                <div className="pricing-amount">Custom</div>
                <ul className="pricing-features">
                  <li>Team accounts</li>
                  <li>API access</li>
                  <li>Custom integrations</li>
                  <li>Dedicated support</li>
                </ul>
                <button className="pricing-btn">Contact Sales</button>
              </div>
            </div>
          </section>

          <section className="highlights">
            <div className="highlight-item">
              <div className="highlight-number">60s</div>
              <div className="highlight-label">Fast validation</div>
            </div>
            <div className="highlight-item">
              <div className="highlight-number">5</div>
              <div className="highlight-label">Analysis modules</div>
            </div>
            <div className="highlight-item">
              <div className="highlight-number">10</div>
              <div className="highlight-label">Investor questions</div>
            </div>
            <div className="highlight-item">
              <div className="highlight-number">Free</div>
              <div className="highlight-label">Forever</div>
            </div>
          </section>

          <section className="modules">
            <h2>What We Analyze</h2>
            <div className="modules-grid">
              <div className="module">
                <h3>📊 Market Demand</h3>
                <p>TAM/SAM/SOM analysis, customer needs, competitive landscape</p>
              </div>
              <div className="module">
                <h3>⚖️ Regulatory Risk</h3>
                <p>Bangladesh compliance, licensing, legal requirements</p>
              </div>
              <div className="module">
                <h3>🎯 Business Model</h3>
                <p>Value proposition, revenue streams, key partnerships</p>
              </div>
              <div className="module">
                <h3>🎤 Investor Pitch</h3>
                <p>Answer 10 critical questions and get AI investor feedback</p>
              </div>
              <div className="module">
                <h3>🔥 Competitors</h3>
                <p>Direct/indirect competitor analysis, market gaps, positioning</p>
              </div>
              <div className="module">
                <h3>🇧🇩 Bangladesh Impact</h3>
                <p>Local market potential, cultural factors, supply chain insights</p>
              </div>
              <div className="module">
                <h3>🎯 SWOT Analysis</h3>
                <p>Comprehensive strengths, weaknesses, opportunities, threats</p>
              </div>
              <div className="module">
                <h3>🚀 Go-to-Market</h3>
                <p>Phased GTM strategy, customer acquisition, pricing approach</p>
              </div>
              <div className="module">
                <h3>⚠️ Risk Assessment</h3>
                <p>High/medium priority risks with mitigation strategies</p>
              </div>
              <div className="module">
                <h3>👤 Founder Fit</h3>
                <p>Skills assessment, experience gaps, team recommendations</p>
              </div>
              <div className="module">
                <h3>💰 Financial Projections</h3>
                <p>3-year revenue projections, unit economics, runway</p>
              </div>
              <div className="module">
                <h3>📈 Readiness Score</h3>
                <p>Overall startup readiness with 5-10 actionable improvements</p>
              </div>
            </div>
          </section>

          <section className="login-section" id="login-section">
            <div className="login-wrapper">
              <form onSubmit={handleLogin} className="login-form">
                <h2>{authMode === 'register' ? 'Create Your Account' : 'Start Your Validation'}</h2>

                <div className="form-field">
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Email address"
                    required
                  />
                </div>

                <div className="form-field">
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder={authMode === 'register' ? 'Password (at least 8 characters)' : 'Password'}
                    required
                  />
                </div>

                {authError && <p style={{ color: '#e5484d', fontSize: '13px', marginBottom: '10px' }}>{authError}</p>}

                <button type="submit" className="form-submit">
                  {authMode === 'register' ? 'Create Account' : 'Sign In'}
                </button>
              </form>
              <p className="form-hint">
                {authMode === 'register' ? 'Already have an account?' : 'New to FounderCheck?'}{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode(authMode === 'register' ? 'login' : 'register'); setAuthError(null); }}
                  style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline', fontSize: 'inherit', padding: 0 }}
                >
                  {authMode === 'register' ? 'Sign in' : 'Create an account'}
                </button>
              </p>
            </div>
          </section>
        </main>

        <footer className="landing-footer">
          <p>© 2026 FounderCheck</p>
        </footer>
      </div>
    )
  }

  // ===== HISTORY PAGE =====
  if (page === 'history') {
    return (
      <div className="app">
        <header className="header">
          <div className="header-left">
            <div className="logo">
              <LogoIcon size={20} />
              FounderCheck
            </div>
          </div>
          <nav className="nav">
            <button className="nav-item active">📋 History</button>
          </nav>
          <div className="header-right">
            <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <main className="main">
          <div className="container">
            <div className="card">
              <h2>📋 Analysis History</h2>
              {history.length === 0 ? (
                <p className="empty-state">No analyses yet</p>
              ) : (
                <div className="history-grid">
                  {history.map((item) => (
                    <div key={item.id} className="history-card" onClick={() => loadAnalysis(item.id)}>
                      <h4>{item.title}</h4>
                      <p>{item.sector}</p>
                      <div className="history-meta">
                        <span className="score-badge">{item.overall_readiness_score}/10</span>
                        {item.qa_completed ? <span className="qa-badge">✓ QA Done</span> : <span className="qa-badge pending">○ Pending</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button className="btn-secondary" onClick={() => setPage('home')}>← Back</button>
            </div>
          </div>
        </main>

        <footer className="footer">
          <p>© 2026 FounderCheck. Empowering Bangladesh Entrepreneurs.</p>
        </footer>
      </div>
    )
  }

  // ===== Q&A PAGE =====
  if (page === 'qa') {
    return (
      <div className="app">
        <header className="header">
          <div className="header-left">
            <div className="logo">
              <LogoIcon size={20} />
              FounderCheck
            </div>
          </div>
          <nav className="nav">
            <button className="nav-item">🎤 Investor Q&A</button>
          </nav>
          <div className="header-right">
            <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <main className="main">
          <div className="container qa-container">
            {qaSession?.completed ? (
              <div className="card qa-complete">
                <h2>✓ Interview Complete!</h2>
                <div className="score-display">
                  <div className="score-item">
                    <p>Q&A Score</p>
                    <div className="big-score">{qaSession.final_score != null ? `${qaSession.final_score.toFixed(1)}/10` : 'Not scored'}</div>
                  </div>
                  <div className="score-item">
                    <p>Adjusted Readiness</p>
                    <div className="big-score">{qaSession.readiness_score != null ? `${qaSession.readiness_score.toFixed(1)}/10` : 'Unchanged'}</div>
                  </div>
                </div>
                <button className="btn-primary" onClick={() => setPage('home')}>View Report</button>
              </div>
            ) : (
              <div className="card qa-card">
                <div className="qa-progress">
                  <p>Question {qaSession?.question_number || 1}/{qaSession?.total_questions || 10}</p>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: `${((qaSession?.question_number || 1) / 10) * 100}%`}}></div>
                  </div>
                </div>

                <h3 className="qa-question">{qaSession?.question}</h3>

                {qaResults.length > 0 && (
                  <div style={{ marginBottom: '16px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '13px' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                      Previous answer: {qaResults[qaResults.length - 1].score != null ? `${qaResults[qaResults.length - 1].score}/10` : 'Not scored'}
                    </p>
                    <p style={{ color: '#999' }}>{qaResults[qaResults.length - 1].feedback}</p>
                  </div>
                )}

                <form onSubmit={submitAnswer}>
                  <textarea
                    value={qaAnswer}
                    onChange={(e) => setQAAnswer(e.target.value)}
                    placeholder="Your answer..."
                    rows={6}
                    className="qa-textarea"
                  />
                  <button type="submit" className="btn-primary" disabled={!qaAnswer.trim()}>
                    Submit Answer
                  </button>
                </form>
              </div>
            )}
          </div>
        </main>

        <footer className="footer">
          <p>© 2026 FounderCheck. Practice pitching to AI investors.</p>
        </footer>
      </div>
    )
  }

  // ===== HOME PAGE =====
  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <div className="logo">🚀 FounderCheck</div>
        </div>
        <nav className="nav">
          <button className="nav-item active">📊 Analyze</button>
          <button className="nav-item" onClick={loadHistory}>📋 History</button>
        </nav>
        <div className="header-right">
          <span className={`status ${backendHealth ? 'online' : 'offline'}`}>
            {backendHealth ? '● Online' : '● Offline'}
          </span>
          <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="main">
        <div className="container">
          {!analysis ? (
            <div className="card input-card">
              <h2>Validate Your Startup Idea</h2>
              <p className="subtitle">AI-powered analysis for Bangladesh entrepreneurs</p>

              <form onSubmit={handleAnalyze} className="form">
                <div className="form-group">
                  <label>Your Startup Idea</label>
                  <textarea
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="E.g., Cloud kitchen in Mirpur serving office workers..."
                    rows={6}
                    disabled={loading}
                    className="textarea"
                  />
                  <span className="char-count">{idea.length}/500</span>
                </div>

                <button type="submit" disabled={loading || !idea.trim()} className="btn-primary btn-large">
                  {loading ? '⏳ Analyzing...' : '🚀 Analyze My Idea'}
                </button>
              </form>

              {error && <div className="error-box">⚠️ {error}</div>}

              <div className="demo-section">
                <p className="demo-title">Try a demo:</p>
                <div className="demo-buttons">
                  {['Cloud kitchen in Mirpur', 'AgriTech for farmers', 'Fintech lending'].map((d) => (
                    <button key={d} onClick={() => setIdea(d)} className="demo-btn">
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="results-container">
              <div className="results-header">
                <div>
                  <h2>{analysis.idea_extraction?.title || 'Analysis'}</h2>
                  <p>{analysis.idea_extraction?.description}</p>
                </div>
                <button onClick={() => {
                  setAnalysis(null);
                  setIdea('');
                  setError(null);
                  setExtendedStatus('idle');
                }} className="btn-secondary">← New Analysis</button>
              </div>

              <div className="score-card-main">
                <div className="score-circle" style={{background: `conic-gradient(#2563eb ${(analysis.overall_readiness_score || 0) * 10}%, #e5e7eb 0)`}}>
                  <span className="score-num">{analysis.overall_readiness_score?.toFixed(1) || '0'}</span>
                </div>
                <div className="score-info">
                  <h3>Readiness Score</h3>
                  <p>{analysis.overall_readiness_score >= 8 ? '✓ Strong' : analysis.overall_readiness_score >= 6 ? '⚠ Moderate' : '✗ Needs Work'}</p>
                  <div className="action-buttons">
                    <button onClick={exportToPDF} className="action-btn">📥 Export Report</button>
                    <button onClick={() => {
                      const text = `Check out this startup analysis: ${analysis.idea_extraction?.title}\n\nReadiness Score: ${analysis.overall_readiness_score}/10\n\nAnalyzed with FounderCheck - The startup validator for Bangladesh\nhttps://foundercheck.io`;
                      navigator.share?.({ title: 'FounderCheck Analysis', text }) || alert('Share: ' + text);
                    }} className="action-btn">📤 Share</button>
                    <button onClick={() => alert('✓ Analysis saved to your history!')} className="action-btn">💾 Save</button>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '12px', color: '#999', margin: '10px 0 20px' }}>
                This is an AI-generated startup assessment for exploration and learning, not investment advice or a guarantee of outcome.
              </p>

              <div className="tabs">
                {['overview', 'demand', 'regulatory', 'canvas', 'competitors', 'bangladesh', 'swot', 'gtm', 'risks', 'founder', 'financial', 'collaboration', 'market', 'validation', 'integrations', 'education', 'school', 'compliance', 'analytics', 'mobile', 'localization', 'monitoring', 'qa'].map(tab => {
                  const tabLabels: {[key: string]: string} = {
                    overview: '📊 Overview',
                    demand: '📈 Demand',
                    regulatory: '⚖️ Regulatory',
                    canvas: '🎯 Canvas',
                    competitors: '🔥 Competitors',
                    bangladesh: '🇧🇩 BD Impact',
                    swot: '🎯 SWOT',
                    gtm: '🚀 GTM',
                    risks: '⚠️ Risks',
                    founder: '👤 Founder Fit',
                    financial: '💰 Financial',
                    collaboration: '🤝 Collaborate',
                    market: '🌍 Market Intel',
                    validation: '🎯 Product Validation',
                    integrations: '🔌 Integrations',
                    education: '📚 Learn',
                    school: '🎓 School',
                    compliance: '🔐 Legal',
                    analytics: '📊 Analytics',
                    mobile: '📱 Mobile',
                    localization: '🌍 Localization',
                    monitoring: '🔄 Monitor',
                    qa: '🎤 Interview'
                  };
                  return (
                    <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                      {tabLabels[tab]}
                    </button>
                  );
                })}
              </div>

              <div className="tab-content">
                {/* Keyed by tab so the boundary resets when the user switches tabs.
                    Defer moves JSX evaluation inside the boundary so it can catch
                    render errors from these inline sections. */}
                <ErrorBoundary key={activeTab}>
                <Defer render={() => (<>
                {activeTab === 'overview' && (
                  <div className="grid-2">
                    <div className="stat-box"><p>Sector</p><p className="stat-value">{analysis.idea_extraction?.sector}</p></div>
                    <div className="stat-box"><p>Customer</p><p className="stat-value">{analysis.idea_extraction?.target_customer}</p></div>
                    <div className="stat-box"><p>Revenue</p><p className="stat-value">{analysis.idea_extraction?.revenue_model}</p></div>
                    <div className="stat-box"><p>Location</p><p className="stat-value">{analysis.idea_extraction?.location}</p></div>
                  </div>
                )}

                {activeTab === 'demand' && (
                  <div className="section">
                    <h3>Market Demand Analysis</h3>

                    <div className="grid-2" style={{marginBottom: '30px'}}>
                      <div style={{padding: '20px', background: 'rgba(33, 150, 243, 0.08)', borderRadius: '8px', border: '1px solid rgba(33, 150, 243, 0.3)'}}>
                        <h4 style={{color: '#2196F3', marginBottom: '8px'}}>📊 Market Size</h4>
                        <p style={{fontSize: '18px', fontWeight: 'bold', color: '#00ff41'}}>{analysis.demand_analysis?.market_size}</p>
                      </div>

                      <div style={{padding: '20px', background: 'rgba(244, 67, 54, 0.08)', borderRadius: '8px', border: '1px solid rgba(244, 67, 54, 0.3)'}}>
                        <h4 style={{color: '#F44336', marginBottom: '8px'}}>🎯 Competition</h4>
                        <p style={{fontSize: '16px', color: '#ccc'}}>{analysis.demand_analysis?.competition}</p>
                      </div>

                      <div style={{padding: '20px', background: 'rgba(76, 175, 80, 0.08)', borderRadius: '8px', border: '1px solid rgba(76, 175, 80, 0.3)'}}>
                        <h4 style={{color: '#4CAF50', marginBottom: '8px'}}>📈 Market Score</h4>
                        <svg viewBox="0 0 100 100" style={{width: '100%', height: '80px', margin: '10px 0'}}>
                          <circle cx="50" cy="50" r="45" fill="none" stroke="#333" strokeWidth="8" opacity="0.2"/>
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#4CAF50"
                            strokeWidth="8"
                            strokeDasharray={`${(analysis.demand_analysis?.score || 0) * 28.27} 282.7`}
                            opacity="0.9"
                          />
                          <text x="50" y="58" textAnchor="middle" fill="#4CAF50" fontSize="24" fontWeight="bold">
                            {analysis.demand_analysis?.score}/10
                          </text>
                        </svg>
                      </div>
                    </div>

                    <div className="grid-2">
                      <div style={{padding: '20px', background: 'rgba(76, 175, 80, 0.08)', borderRadius: '8px', border: '1px solid rgba(76, 175, 80, 0.3)'}}>
                        <h4 style={{color: '#4CAF50', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                          <span>✨</span>
                          Key Opportunities
                        </h4>
                        <ul style={{listStyle: 'none', padding: 0}}>
                          {analysis.demand_analysis?.opportunities?.map((o: string, i: number) => (
                            <li key={i} style={{padding: '12px', marginBottom: '8px', background: 'rgba(76, 175, 80, 0.1)', borderRadius: '6px', borderLeft: '3px solid #4CAF50', color: '#ccc', fontSize: '13'}}>
                              ✓ {o}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div style={{padding: '20px', background: 'rgba(255, 152, 0, 0.08)', borderRadius: '8px', border: '1px solid rgba(255, 152, 0, 0.3)'}}>
                        <h4 style={{color: '#FF9800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                          <span>⚡</span>
                          Key Threats
                        </h4>
                        <ul style={{listStyle: 'none', padding: 0}}>
                          {analysis.demand_analysis?.threats?.map((t: string, i: number) => (
                            <li key={i} style={{padding: '12px', marginBottom: '8px', background: 'rgba(255, 152, 0, 0.1)', borderRadius: '6px', borderLeft: '3px solid #FF9800', color: '#ccc', fontSize: '13'}}>
                              ⚠️ {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'regulatory' && (
                  <div className="section">
                    <p><strong>Regulators:</strong> {analysis.regulatory_analysis?.key_regulators?.join(', ')}</p>
                    <p><strong>Timeline:</strong> ~{analysis.regulatory_analysis?.estimated_timeline} days</p>
                    <p><strong>Cost:</strong> ৳{analysis.regulatory_analysis?.cost_estimate?.toLocaleString()}</p>
                    <div className="warning">⚠️ {analysis.regulatory_analysis?.warnings}</div>
                  </div>
                )}

                {activeTab === 'canvas' && (
                  <div className="section">
                    <h3>Business Model Canvas</h3>
                    <div style={{background: 'rgba(15, 42, 71, 0.3)', padding: '20px', borderRadius: '12px', overflowX: 'auto', border: '1px solid var(--border)'}}>
                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', minWidth: '1000px'}}>

                        {/* KEY PARTNERS */}
                        <div style={{background: 'rgba(33, 150, 243, 0.08)', border: '2px solid #2196F3', borderRadius: '8px', padding: '16px'}}>
                          <h4 style={{color: '#2196F3', margin: '0 0 12px 0', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px'}}>Key Partners</h4>
                          <div style={{fontSize: '12px', color: '#ccc', lineHeight: '1.6'}}>
                            {Array.isArray(analysis.business_canvas?.key_partners)
                              ? analysis.business_canvas.key_partners.slice(0, 4).map((p: any, i: number) => (
                                  <div key={i} style={{marginBottom: '8px', paddingBottom: '8px', borderBottom: i < 3 ? '1px solid rgba(33, 150, 243, 0.2)' : 'none'}}>
                                    • {typeof p === 'string' ? p.substring(0, 40) : JSON.stringify(p).substring(0, 40)}
                                  </div>
                                ))
                              : <div>• {typeof analysis.business_canvas?.key_partners === 'string' ? analysis.business_canvas.key_partners.substring(0, 60) : 'N/A'}</div>
                            }
                          </div>
                        </div>

                        {/* KEY ACTIVITIES */}
                        <div style={{background: 'rgba(76, 175, 80, 0.08)', border: '2px solid #4CAF50', borderRadius: '8px', padding: '16px'}}>
                          <h4 style={{color: '#4CAF50', margin: '0 0 12px 0', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px'}}>Key Activities</h4>
                          <div style={{fontSize: '12px', color: '#ccc', lineHeight: '1.6'}}>
                            {Array.isArray(analysis.business_canvas?.key_activities)
                              ? analysis.business_canvas.key_activities.slice(0, 4).map((a: any, i: number) => (
                                  <div key={i} style={{marginBottom: '8px', paddingBottom: '8px', borderBottom: i < 3 ? '1px solid rgba(76, 175, 80, 0.2)' : 'none'}}>
                                    • {typeof a === 'string' ? a.substring(0, 40) : JSON.stringify(a).substring(0, 40)}
                                  </div>
                                ))
                              : <div>• {typeof analysis.business_canvas?.key_activities === 'string' ? analysis.business_canvas.key_activities.substring(0, 60) : 'N/A'}</div>
                            }
                          </div>
                        </div>

                        {/* VALUE PROPOSITION - CENTER & LARGE */}
                        <div style={{gridColumn: '2 / 4', background: 'rgba(255, 193, 7, 0.1)', border: '3px solid #FFC107', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: '240px'}}>
                          <h4 style={{color: '#FFC107', margin: '0 0 16px 0', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px'}}>Value Proposition</h4>
                          <p style={{fontSize: '13px', color: '#fff', lineHeight: '1.6', margin: 0}}>
                            {typeof analysis.business_canvas?.value_proposition === 'string'
                              ? analysis.business_canvas.value_proposition.substring(0, 150)
                              : typeof analysis.business_canvas?.value_proposition === 'object' && Array.isArray(analysis.business_canvas.value_proposition)
                              ? analysis.business_canvas.value_proposition[0]?.substring(0, 150)
                              : 'Value proposition not available'}
                          </p>
                        </div>

                        {/* CUSTOMER SEGMENTS */}
                        <div style={{background: 'rgba(244, 67, 54, 0.08)', border: '2px solid #F44336', borderRadius: '8px', padding: '16px'}}>
                          <h4 style={{color: '#F44336', margin: '0 0 12px 0', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px'}}>Segments</h4>
                          <div style={{fontSize: '12px', color: '#ccc', lineHeight: '1.6'}}>
                            {Array.isArray(analysis.business_canvas?.customer_segments)
                              ? analysis.business_canvas.customer_segments.slice(0, 4).map((s: any, i: number) => (
                                  <div key={i} style={{marginBottom: '8px', paddingBottom: '8px', borderBottom: i < 3 ? '1px solid rgba(244, 67, 54, 0.2)' : 'none'}}>
                                    • {typeof s === 'string' ? s.substring(0, 40) : JSON.stringify(s).substring(0, 40)}
                                  </div>
                                ))
                              : <div>• {typeof analysis.business_canvas?.customer_segments === 'string' ? analysis.business_canvas.customer_segments.substring(0, 60) : 'N/A'}</div>
                            }
                          </div>
                        </div>

                        {/* CHANNELS */}
                        <div style={{background: 'rgba(156, 39, 176, 0.08)', border: '2px solid #9C27B0', borderRadius: '8px', padding: '16px'}}>
                          <h4 style={{color: '#9C27B0', margin: '0 0 12px 0', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px'}}>Channels</h4>
                          <div style={{fontSize: '12px', color: '#ccc', lineHeight: '1.6'}}>
                            {Array.isArray(analysis.business_canvas?.channels)
                              ? analysis.business_canvas.channels.slice(0, 4).map((c: any, i: number) => (
                                  <div key={i} style={{marginBottom: '8px', paddingBottom: '8px', borderBottom: i < 3 ? '1px solid rgba(156, 39, 176, 0.2)' : 'none'}}>
                                    • {typeof c === 'string' ? c.substring(0, 40) : JSON.stringify(c).substring(0, 40)}
                                  </div>
                                ))
                              : <div>• {typeof analysis.business_canvas?.channels === 'string' ? analysis.business_canvas.channels.substring(0, 60) : 'N/A'}</div>
                            }
                          </div>
                        </div>

                        {/* COST STRUCTURE */}
                        <div style={{background: 'rgba(255, 87, 34, 0.08)', border: '2px solid #FF5722', borderRadius: '8px', padding: '16px'}}>
                          <h4 style={{color: '#FF5722', margin: '0 0 12px 0', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px'}}>Cost Structure</h4>
                          <div style={{fontSize: '11px', color: '#ccc', lineHeight: '1.6'}}>
                            {typeof analysis.business_canvas?.cost_structure === 'object' && !Array.isArray(analysis.business_canvas.cost_structure)
                              ? Object.entries(analysis.business_canvas.cost_structure as any).slice(0, 3).map((item: any, i: number) => (
                                  <div key={i} style={{marginBottom: '8px', paddingBottom: '8px', borderBottom: i < 2 ? '1px solid rgba(255, 87, 34, 0.2)' : 'none'}}>
                                    <span style={{color: '#FF5722', fontWeight: 'bold'}}>•</span> {typeof item[1] === 'object' ? JSON.stringify(item[1]).substring(0, 30) : String(item[1]).substring(0, 30)}
                                  </div>
                                ))
                              : <div>Cost data not available</div>
                            }
                          </div>
                        </div>

                        {/* CUSTOMER RELATIONSHIPS */}
                        <div style={{background: 'rgba(0, 188, 212, 0.08)', border: '2px solid #00BCD4', borderRadius: '8px', padding: '16px'}}>
                          <h4 style={{color: '#00BCD4', margin: '0 0 12px 0', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px'}}>Relationships</h4>
                          <div style={{fontSize: '12px', color: '#ccc', lineHeight: '1.6'}}>
                            {Array.isArray(analysis.business_canvas?.customer_relationships)
                              ? analysis.business_canvas.customer_relationships.slice(0, 3).map((r: any, i: number) => (
                                  <div key={i} style={{marginBottom: '8px', paddingBottom: '8px', borderBottom: i < 2 ? '1px solid rgba(0, 188, 212, 0.2)' : 'none'}}>
                                    • {typeof r === 'string' ? r.substring(0, 35) : JSON.stringify(r).substring(0, 35)}
                                  </div>
                                ))
                              : <div>• {typeof analysis.business_canvas?.customer_relationships === 'string' ? analysis.business_canvas.customer_relationships.substring(0, 60) : 'N/A'}</div>
                            }
                          </div>
                        </div>

                        {/* KEY RESOURCES */}
                        <div style={{background: 'rgba(103, 58, 183, 0.08)', border: '2px solid #673AB7', borderRadius: '8px', padding: '16px'}}>
                          <h4 style={{color: '#673AB7', margin: '0 0 12px 0', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px'}}>Key Resources</h4>
                          <div style={{fontSize: '11px', color: '#ccc', lineHeight: '1.6'}}>
                            {typeof analysis.business_canvas?.key_resources === 'object' && !Array.isArray(analysis.business_canvas.key_resources)
                              ? Object.entries(analysis.business_canvas.key_resources as any).slice(0, 3).map((item: any, i: number) => (
                                  <div key={i} style={{marginBottom: '8px', paddingBottom: '8px', borderBottom: i < 2 ? '1px solid rgba(103, 58, 183, 0.2)' : 'none'}}>
                                    <span style={{color: '#673AB7', fontWeight: 'bold'}}>•</span> {typeof item[1] === 'object' ? JSON.stringify(item[1]).substring(0, 30) : String(item[1]).substring(0, 30)}
                                  </div>
                                ))
                              : <div>Resources not available</div>
                            }
                          </div>
                        </div>

                        {/* REVENUE STREAMS */}
                        <div style={{background: 'rgba(0, 255, 65, 0.08)', border: '2px solid #00FF41', borderRadius: '8px', padding: '16px'}}>
                          <h4 style={{color: '#00FF41', margin: '0 0 12px 0', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px'}}>Revenue Streams</h4>
                          <div style={{fontSize: '11px', color: '#ccc', lineHeight: '1.6'}}>
                            {typeof analysis.business_canvas?.revenue_streams === 'object' && !Array.isArray(analysis.business_canvas.revenue_streams)
                              ? Object.entries(analysis.business_canvas.revenue_streams as any).slice(0, 3).map((item: any, i: number) => (
                                  <div key={i} style={{marginBottom: '8px', paddingBottom: '8px', borderBottom: i < 2 ? '1px solid rgba(0, 255, 65, 0.2)' : 'none'}}>
                                    <span style={{color: '#00FF41', fontWeight: 'bold'}}>•</span> {typeof item[1] === 'object' ? JSON.stringify(item[1]).substring(0, 30) : String(item[1]).substring(0, 30)}
                                  </div>
                                ))
                              : <div>Revenue data not available</div>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'competitors' && (
                  <div className="section">
                    <h3>🔥 Competitive Landscape Analysis</h3>

                    {!analysis.competitor_analysis ? (
                      <div style={{padding: '30px', textAlign: 'center', background: 'rgba(33, 150, 243, 0.05)', borderRadius: '8px', border: '1px solid rgba(33, 150, 243, 0.3)'}}>
                        <p style={{color: '#999', fontSize: '14px'}}>Competitor analysis data loading...</p>
                      </div>
                    ) : (
                      <>
                    {/* Market Overview */}
                    {analysis.competitor_analysis?.market_overview && (
                      <div style={{marginBottom: '30px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px'}}>
                        <div style={{padding: '20px', background: 'rgba(33, 150, 243, 0.1)', borderRadius: '8px', border: '1px solid #2196F3'}}>
                          <p style={{color: '#999', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px'}}>Market Overview</p>
                          <p style={{fontSize: '16px', fontWeight: 'bold', color: '#2196F3'}}>
                            {typeof analysis.competitor_analysis.market_overview === 'object'
                              ? JSON.stringify(analysis.competitor_analysis.market_overview).substring(0, 50)
                              : analysis.competitor_analysis.market_overview}
                          </p>
                        </div>
                        <div style={{padding: '20px', background: 'rgba(76, 175, 80, 0.1)', borderRadius: '8px', border: '1px solid #4CAF50'}}>
                          <p style={{color: '#999', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px'}}>Key Insight</p>
                          <p style={{fontSize: '14px', fontWeight: 'bold', color: '#4CAF50'}}>Growing Market</p>
                        </div>
                        <div style={{padding: '20px', background: 'rgba(255, 152, 0, 0.1)', borderRadius: '8px', border: '1px solid #FF9800'}}>
                          <p style={{color: '#999', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px'}}>Competition</p>
                          <p style={{fontSize: '14px', fontWeight: 'bold', color: '#FF9800'}}>Moderate-High</p>
                        </div>
                      </div>
                    )}

                    {/* Direct Competitors */}
                    {Array.isArray(analysis.competitor_analysis?.direct_competitors) && analysis.competitor_analysis.direct_competitors.length > 0 && (
                      <>
                        <h4 style={{marginBottom: '20px', color: '#fff'}}>📊 Direct Competitors</h4>
                        <div style={{marginBottom: '30px', padding: '20px', background: 'rgba(22, 25, 47, 0.7)', borderRadius: '8px', border: '1px solid var(--border)'}}>
                          {analysis.competitor_analysis.direct_competitors.map((c: any, i: number) => (
                            <div key={i} style={{marginBottom: '20px'}}>
                              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                                <div style={{display: 'flex', alignItems: 'center', gap: '8px', flex: 1}}>
                                  <span style={{fontSize: '18px', fontWeight: 'bold', color: '#00ff41', width: '24px'}}>#{i + 1}</span>
                                  <div>
                                    <p style={{fontSize: '14px', fontWeight: 'bold', color: '#fff', margin: 0}}>{c.name || `Competitor ${i + 1}`}</p>
                                    <p style={{fontSize: '11px', color: '#999', margin: '2px 0'}}>{c.market_share || '—'}% market share</p>
                                  </div>
                                </div>
                              </div>

                              {/* Competitor Info */}
                              <div style={{padding: '12px', background: 'rgba(0, 255, 65, 0.05)', borderRadius: '6px', fontSize: '12px', color: '#ccc'}}>
                                <div style={{marginBottom: '8px'}}>
                                  <strong style={{color: '#00ff41'}}>💪 Strength:</strong> {c.strength || 'Strong market presence'}
                                </div>
                                <div>
                                  <strong style={{color: '#FF9800'}}>⚠️ Weakness:</strong> {c.weakness || 'Limited regional coverage'}
                                </div>
                              </div>

                              {i < analysis.competitor_analysis.direct_competitors.length - 1 && (
                                <div style={{borderBottom: '1px solid rgba(255, 255, 255, 0.1)', margin: '16px 0'}}></div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Competitive Advantage */}
                    {analysis.competitor_analysis?.competitive_advantage && (
                      <div style={{marginBottom: '30px', padding: '20px', background: 'rgba(0, 255, 65, 0.1)', borderRadius: '8px', border: '2px solid #00ff41'}}>
                        <h4 style={{color: '#00ff41', marginBottom: '12px'}}>💡 Your Competitive Advantage</h4>
                        <p style={{color: '#ccc', fontSize: '14px', lineHeight: '1.6', margin: 0}}>
                          {typeof analysis.competitor_analysis.competitive_advantage === 'string'
                            ? analysis.competitor_analysis.competitive_advantage
                            : 'Unique value proposition in the market'}
                        </p>
                      </div>
                    )}

                    {/* Market Gaps */}
                    {Array.isArray(analysis.competitor_analysis?.market_gaps) && analysis.competitor_analysis.market_gaps.length > 0 && (
                      <div style={{marginBottom: '30px', padding: '20px', background: 'rgba(76, 175, 80, 0.08)', borderRadius: '8px', border: '1px solid rgba(76, 175, 80, 0.3)'}}>
                        <h4 style={{color: '#4CAF50', marginBottom: '14px'}}>✨ Market Gaps & Opportunities</h4>
                        <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                          {analysis.competitor_analysis.market_gaps.map((gap: string, i: number) => (
                            <li key={i} style={{padding: '10px', marginBottom: '8px', background: 'rgba(76, 175, 80, 0.1)', borderRadius: '6px', borderLeft: '3px solid #4CAF50', color: '#ccc', fontSize: '13'}}>
                              ✓ {gap}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Threat Assessment */}
                    {analysis.competitor_analysis?.threat_level && (
                      <div style={{padding: '20px', background: 'rgba(255, 152, 0, 0.1)', borderRadius: '8px', border: '2px solid #FF9800'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                          <div style={{fontSize: '24px'}}>⚠️</div>
                          <div>
                            <p style={{fontSize: '12px', color: '#999', margin: '0 0 4px 0', textTransform: 'uppercase'}}>Threat Level</p>
                            <p style={{fontSize: '18px', fontWeight: 'bold', color: '#FF9800', margin: 0}}>
                              {analysis.competitor_analysis.threat_level}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    </>
                    )}
                  </div>
                )}

                {activeTab === 'bangladesh' && !hasData(analysis.bangladesh_impact) && (
                  <ExtendedPending status={extendedStatus} label="Bangladesh market impact" onRetry={() => loadExtended(analysis.analysis_id)} />
                )}
                {activeTab === 'bangladesh' && hasData(analysis.bangladesh_impact) && (
                  <div className="section">
                    <h3>🇧🇩 Bangladesh Market Impact Assessment</h3>

                    <div style={{marginBottom: '30px', padding: '30px', background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(0, 255, 65, 0.1))', borderRadius: '12px', border: '2px solid #2196F3'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div>
                          <p style={{color: '#999', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase'}}>Market Impact Score</p>
                          <p style={{fontSize: '40px', fontWeight: 'bold', color: '#00ff41'}}>{analysis.bangladesh_impact?.impact_score}/10</p>
                        </div>
                        <div style={{fontSize: '64px'}}>🇧🇩</div>
                      </div>
                    </div>

                    <div className="grid-2" style={{marginBottom: '30px'}}>
                      <div style={{padding: '20px', background: 'rgba(244, 67, 54, 0.08)', borderRadius: '8px', border: '1px solid rgba(244, 67, 54, 0.3)'}}>
                        <h4 style={{color: '#F44336', marginBottom: '14px'}}>⚖️ Local Regulations</h4>
                        <ul style={{listStyle: 'none', padding: 0}}>
                          {asList(analysis.bangladesh_impact?.local_regulations).map((r: any, i: number) => (
                            <li key={i} style={{padding: '8px 0', borderBottom: '1px solid rgba(244, 67, 54, 0.2)', color: '#ccc', fontSize: '13'}}>
                              ✓ {asText(r)}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div style={{padding: '20px', background: 'rgba(76, 175, 80, 0.08)', borderRadius: '8px', border: '1px solid rgba(76, 175, 80, 0.3)'}}>
                        <h4 style={{color: '#4CAF50', marginBottom: '14px'}}>💰 Market Potential</h4>
                        <p style={{color: '#ccc', lineHeight: '1.6', fontSize: '13'}}>{asText(analysis.bangladesh_impact?.market_potential)}</p>
                      </div>

                      <div style={{padding: '20px', background: 'rgba(156, 39, 176, 0.08)', borderRadius: '8px', border: '1px solid rgba(156, 39, 176, 0.3)'}}>
                        <h4 style={{color: '#9C27B0', marginBottom: '14px'}}>🎭 Cultural Factors</h4>
                        <p style={{color: '#ccc', lineHeight: '1.6', fontSize: '13'}}>{asText(analysis.bangladesh_impact?.cultural_factors)}</p>
                      </div>

                      <div style={{padding: '20px', background: 'rgba(255, 152, 0, 0.08)', borderRadius: '8px', border: '1px solid rgba(255, 152, 0, 0.3)'}}>
                        <h4 style={{color: '#FF9800', marginBottom: '14px'}}>📊 Economic Factors</h4>
                        <p style={{color: '#ccc', lineHeight: '1.6', fontSize: '13'}}>{asText(analysis.bangladesh_impact?.economic_factors)}</p>
                      </div>
                    </div>

                    <div style={{padding: '24px', background: 'rgba(0, 255, 65, 0.1)', borderRadius: '12px', border: '2px solid #00ff41'}}>
                      <h4 style={{color: '#00ff41', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <span>✨</span>
                        Localization Strategy for Bangladesh
                      </h4>
                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px'}}>
                        {asList(analysis.bangladesh_impact?.localization_recommendations).map((r: any, i: number) => (
                          <div key={i} style={{padding: '14px', background: 'rgba(0, 255, 65, 0.08)', borderRadius: '8px', border: '1px solid #00ff41', display: 'flex', gap: '10px', alignItems: 'flex-start'}}>
                            <span style={{color: '#00ff41', fontWeight: 'bold', fontSize: '16px', marginTop: '2px'}}>✓</span>
                            <span style={{color: '#ccc', fontSize: '13', lineHeight: '1.5'}}>{asText(r)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'swot' && !hasData(analysis.swot_analysis) && (
                  <ExtendedPending status={extendedStatus} label="SWOT analysis" onRetry={() => loadExtended(analysis.analysis_id)} />
                )}
                {activeTab === 'swot' && hasData(analysis.swot_analysis) && (
                  <div className="section">
                    <h3>SWOT Analysis</h3>
                    <svg viewBox="0 0 800 600" className="swot-matrix">
                      {/* Quadrants */}
                      <rect x="10" y="10" width="390" height="280" fill="rgba(76, 175, 80, 0.08)" stroke="#4CAF50" strokeWidth="2" rx="6"/>
                      <rect x="400" y="10" width="390" height="280" fill="rgba(255, 152, 0, 0.08)" stroke="#FF9800" strokeWidth="2" rx="6"/>
                      <rect x="10" y="290" width="390" height="300" fill="rgba(33, 150, 243, 0.08)" stroke="#2196F3" strokeWidth="2" rx="6"/>
                      <rect x="400" y="290" width="390" height="300" fill="rgba(244, 67, 54, 0.08)" stroke="#F44336" strokeWidth="2" rx="6"/>

                      {/* Headers */}
                      <text x="205" y="40" textAnchor="middle" fill="#4CAF50" fontSize="18" fontWeight="bold">💪 STRENGTHS</text>
                      <text x="595" y="40" textAnchor="middle" fill="#FF9800" fontSize="18" fontWeight="bold">⚠️ WEAKNESSES</text>
                      <text x="205" y="320" textAnchor="middle" fill="#2196F3" fontSize="18" fontWeight="bold">🎯 OPPORTUNITIES</text>
                      <text x="595" y="320" textAnchor="middle" fill="#F44336" fontSize="18" fontWeight="bold">🔥 THREATS</text>

                      {/* Strengths content */}
                      {asList(analysis.swot_analysis?.strengths).slice(0, 3).map((s: any, i: number) => (
                        <text key={i} x="30" y={70 + i * 60} fill="#ccc" fontSize="13">• {asText(s)}</text>
                      ))}

                      {/* Weaknesses content */}
                      {asList(analysis.swot_analysis?.weaknesses).slice(0, 3).map((w: any, i: number) => (
                        <text key={i} x="420" y={70 + i * 60} fill="#ccc" fontSize="13">• {asText(w)}</text>
                      ))}

                      {/* Opportunities content */}
                      {asList(analysis.swot_analysis?.opportunities).slice(0, 3).map((o: any, i: number) => (
                        <text key={i} x="30" y={350 + i * 60} fill="#ccc" fontSize="13">• {asText(o)}</text>
                      ))}

                      {/* Threats content */}
                      {asList(analysis.swot_analysis?.threats).slice(0, 3).map((t: any, i: number) => (
                        <text key={i} x="420" y={350 + i * 60} fill="#ccc" fontSize="13">• {asText(t)}</text>
                      ))}
                    </svg>
                  </div>
                )}

                {activeTab === 'gtm' && !hasData(analysis.go_to_market) && (
                  <ExtendedPending status={extendedStatus} label="go-to-market strategy" onRetry={() => loadExtended(analysis.analysis_id)} />
                )}
                {activeTab === 'gtm' && hasData(analysis.go_to_market) && (
                  <div className="section">
                    <h3>Go-to-Market Strategy</h3>

                    <svg viewBox="0 0 900 300" className="gtm-timeline">
                      {/* Timeline line */}
                      <line x1="50" y1="150" x2="850" y2="150" stroke="#00ff41" strokeWidth="2"/>

                      {/* Phase 1 */}
                      <circle cx="150" cy="150" r="30" fill="#2196F3" opacity="0.9"/>
                      <text x="150" y="160" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="bold">1</text>
                      <text x="150" y="220" textAnchor="middle" fill="#2196F3" fontSize="13" fontWeight="bold">LAUNCH</text>
                      <text x="150" y="240" textAnchor="middle" fill="#ccc" fontSize="11">30 days</text>
                      <rect x="30" y="260" width="240" height="30" fill="rgba(33, 150, 243, 0.1)" stroke="#2196F3" strokeWidth="1" rx="4"/>
                      <text x="150" y="278" textAnchor="middle" fill="#ccc" fontSize="10">{asText(analysis.go_to_market?.phase_1).substring(0, 40)}</text>

                      {/* Phase 2 */}
                      <circle cx="450" cy="150" r="30" fill="#FF9800" opacity="0.9"/>
                      <text x="450" y="160" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="bold">2</text>
                      <text x="450" y="220" textAnchor="middle" fill="#FF9800" fontSize="13" fontWeight="bold">GROWTH</text>
                      <text x="450" y="240" textAnchor="middle" fill="#ccc" fontSize="11">60 days</text>
                      <rect x="330" y="260" width="240" height="30" fill="rgba(255, 152, 0, 0.1)" stroke="#FF9800" strokeWidth="1" rx="4"/>
                      <text x="450" y="278" textAnchor="middle" fill="#ccc" fontSize="10">{asText(analysis.go_to_market?.phase_2).substring(0, 40)}</text>

                      {/* Phase 3 */}
                      <circle cx="750" cy="150" r="30" fill="#4CAF50" opacity="0.9"/>
                      <text x="750" y="160" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="bold">3</text>
                      <text x="750" y="220" textAnchor="middle" fill="#4CAF50" fontSize="13" fontWeight="bold">SCALE</text>
                      <text x="750" y="240" textAnchor="middle" fill="#ccc" fontSize="11">90 days</text>
                      <rect x="630" y="260" width="240" height="30" fill="rgba(76, 175, 80, 0.1)" stroke="#4CAF50" strokeWidth="1" rx="4"/>
                      <text x="750" y="278" textAnchor="middle" fill="#ccc" fontSize="10">{asText(analysis.go_to_market?.phase_3).substring(0, 40)}</text>
                    </svg>

                    <div className="grid-2" style={{marginTop: '40px'}}>
                      <div>
                        <h4>📊 Customer Acquisition Channels</h4>
                        <p style={{padding: '16px', background: 'rgba(22, 25, 47, 0.7)', borderRadius: '8px', border: '1px solid var(--border)', marginTop: '10px'}}>
                          {asText(analysis.go_to_market?.customer_acquisition)}
                        </p>
                      </div>
                      <div>
                        <h4>💰 Pricing Strategy</h4>
                        <p style={{padding: '16px', background: 'rgba(22, 25, 47, 0.7)', borderRadius: '8px', border: '1px solid var(--border)', marginTop: '10px'}}>
                          {asText(analysis.go_to_market?.pricing_strategy)}
                        </p>
                      </div>
                    </div>

                    <div style={{marginTop: '30px', padding: '20px', background: 'rgba(156, 39, 176, 0.08)', borderRadius: '8px', border: '1px solid rgba(156, 39, 176, 0.3)'}}>
                      <h4 style={{color: '#9C27B0', marginBottom: '16px'}}>🤝 Key Partnership Targets</h4>
                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px'}}>
                        {asList(analysis.go_to_market?.partnership_targets).map((p: any, i: number) => (
                          <div key={i} style={{padding: '12px', background: 'rgba(156, 39, 176, 0.1)', borderRadius: '6px', border: '1px solid rgba(156, 39, 176, 0.2)', display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <span style={{fontSize: '18px'}}>🤝</span>
                            <span style={{color: '#ccc', fontSize: '13'}}>{asText(p)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'risks' && !hasData(analysis.risk_assessment) && (
                  <ExtendedPending status={extendedStatus} label="risk assessment" onRetry={() => loadExtended(analysis.analysis_id)} />
                )}
                {activeTab === 'risks' && hasData(analysis.risk_assessment) && (
                  <div className="section">
                    <h3>Risk Assessment & Heat Map</h3>

                    <div style={{marginBottom: '30px', padding: '20px', background: 'rgba(255, 152, 0, 0.08)', borderRadius: '8px', border: '1px solid #FF9800'}}>
                      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <div>
                          <p style={{color: '#999', fontSize: '12px', marginBottom: '4px'}}>Overall Risk Score</p>
                          <p style={{fontSize: '32px', fontWeight: 'bold', color: '#FF9800'}}>{analysis.risk_assessment?.overall_risk_score}/10</p>
                        </div>
                        <div style={{fontSize: '48px'}}>📊</div>
                      </div>
                    </div>

                    <svg viewBox="0 0 800 500" className="risk-heatmap">
                      {/* Risk Matrix Grid */}
                      <defs>
                        <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="rgba(76, 175, 80, 0.3)"/>
                          <stop offset="50%" stopColor="rgba(255, 152, 0, 0.3)"/>
                          <stop offset="100%" stopColor="rgba(244, 67, 54, 0.3)"/>
                        </linearGradient>
                      </defs>

                      {/* Background */}
                      <rect x="100" y="50" width="650" height="350" fill="url(#riskGradient)" stroke="#444" strokeWidth="1"/>

                      {/* Grid lines */}
                      <line x1="100" y1="216" x2="750" y2="216" stroke="#444" strokeWidth="1" opacity="0.5"/>
                      <line x1="425" y1="50" x2="425" y2="400" stroke="#444" strokeWidth="1" opacity="0.5"/>

                      {/* Axes */}
                      <text x="50" y="410" fontSize="12" fill="#999">Low</text>
                      <text x="700" y="410" fontSize="12" fill="#999">High</text>
                      <text x="50" y="70" fontSize="12" fill="#999">High</text>
                      <text x="50" y="400" fontSize="12" fill="#999">Low</text>
                      <text x="350" y="440" fontSize="12" fill="#999" textAnchor="middle">PROBABILITY →</text>
                      <text x="20" y="220" fontSize="12" fill="#999" textAnchor="middle" transform="rotate(-90 20 220)">IMPACT ↑</text>

                      {/* Quadrant Labels */}
                      <text x="250" y="80" fontSize="11" fill="#4CAF50" fontWeight="bold" textAnchor="middle">Low Priority</text>
                      <text x="600" y="80" fontSize="11" fill="#FF9800" fontWeight="bold" textAnchor="middle">Medium Priority</text>
                      <text x="250" y="370" fontSize="11" fill="#FF9800" fontWeight="bold" textAnchor="middle">Medium Priority</text>
                      <text x="600" y="370" fontSize="11" fill="#F44336" fontWeight="bold" textAnchor="middle">🔴 Critical</text>

                      {/* Risk bubbles */}
                      {analysis.risk_assessment?.high_risks?.map((_: any, i: number) => (
                        <g key={i}>
                          <circle cx={600 + (i * 20)} cy={120 + (i * 30)} r="25" fill="#F44336" opacity="0.7"/>
                          <text x={600 + (i * 20)} y={125 + (i * 30)} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">{i + 1}</text>
                        </g>
                      ))}
                      {analysis.risk_assessment?.medium_risks?.map((_: any, i: number) => (
                        <g key={i}>
                          <circle cx={450 - (i * 25)} cy={250 + (i * 20)} r="22" fill="#FF9800" opacity="0.7"/>
                          <text x={450 - (i * 25)} y={255 + (i * 20)} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">{i + 4}</text>
                        </g>
                      ))}
                    </svg>

                    <div className="grid-2" style={{marginTop: '30px'}}>
                      <div>
                        <h4>🔴 High Priority Risks</h4>
                        {analysis.risk_assessment?.high_risks?.map((r: any, i: number) => (
                          <div key={i} style={{marginBottom: '16px', padding: '14px', background: 'rgba(244, 67, 54, 0.12)', borderRadius: '6px', border: '1px solid rgba(244, 67, 54, 0.3)'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px'}}>
                              <span style={{display: 'inline-block', width: '24px', height: '24px', background: '#F44336', color: '#fff', borderRadius: '50%', textAlign: 'center', lineHeight: '24px', fontSize: '12px', fontWeight: 'bold'}}>{i + 1}</span>
                              <strong style={{color: '#F44336'}}>{r.risk}</strong>
                            </div>
                            <p style={{fontSize: '12px', margin: '4px 0', color: '#ccc'}}>📊 {r.probability} probability | 💥 {r.impact}</p>
                            <p style={{fontSize: '12px', color: '#4CAF50', marginTop: '8px'}}>✓ Mitigation: {r.mitigation}</p>
                          </div>
                        ))}
                      </div>
                      <div>
                        <h4>🟡 Medium Priority Risks</h4>
                        {analysis.risk_assessment?.medium_risks?.map((r: any, i: number) => (
                          <div key={i} style={{marginBottom: '16px', padding: '14px', background: 'rgba(255, 152, 0, 0.12)', borderRadius: '6px', border: '1px solid rgba(255, 152, 0, 0.3)'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px'}}>
                              <span style={{display: 'inline-block', width: '24px', height: '24px', background: '#FF9800', color: '#fff', borderRadius: '50%', textAlign: 'center', lineHeight: '24px', fontSize: '12px', fontWeight: 'bold'}}>{i + 4}</span>
                              <strong style={{color: '#FF9800'}}>{r.risk}</strong>
                            </div>
                            <p style={{fontSize: '12px', margin: '4px 0', color: '#ccc'}}>📊 {r.probability} probability | 💥 {r.impact}</p>
                            <p style={{fontSize: '12px', color: '#4CAF50', marginTop: '8px'}}>✓ Mitigation: {r.mitigation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'founder' && !hasData(analysis.founder_fit) && (
                  <ExtendedPending status={extendedStatus} label="founder fit assessment" onRetry={() => loadExtended(analysis.analysis_id)} />
                )}
                {activeTab === 'founder' && hasData(analysis.founder_fit) && (
                  <div className="section">
                    <h3>Founder-Market Fit Assessment</h3>

                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px'}}>
                      <div style={{textAlign: 'center', padding: '30px', background: 'rgba(0, 255, 65, 0.08)', borderRadius: '12px', border: '2px solid #00ff41'}}>
                        <p style={{fontSize: '12px', color: '#999', marginBottom: '12px'}}>Founder Fit Score</p>
                        <svg viewBox="0 0 200 200" style={{width: '180px', height: '180px'}}>
                          <circle cx="100" cy="100" r="90" fill="none" stroke="#333" strokeWidth="8" opacity="0.2"/>
                          <circle
                            cx="100"
                            cy="100"
                            r="90"
                            fill="none"
                            stroke="#00ff41"
                            strokeWidth="8"
                            strokeDasharray={`${(analysis.founder_fit?.fit_score || 0) * 5.65} 565`}
                            opacity="0.9"
                            style={{transition: 'stroke-dasharray 0.3s'}}
                          />
                          <text x="100" y="110" textAnchor="middle" fill="#00ff41" fontSize="48" fontWeight="bold">
                            {analysis.founder_fit?.fit_score}
                          </text>
                          <text x="100" y="140" textAnchor="middle" fill="#999" fontSize="14">/10</text>
                        </svg>
                      </div>

                      <div style={{padding: '20px'}}>
                        <h4 style={{marginBottom: '16px', color: '#fff'}}>Required Skills</h4>
                        {asList(analysis.founder_fit?.required_skills).map((s: any, i: number) => (
                          <div key={i} style={{marginBottom: '12px'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px'}}>
                              <span style={{fontSize: '13px', color: '#ccc'}}>📌 {asText(s)}</span>
                            </div>
                            <div style={{height: '6px', background: 'rgba(22, 25, 47, 0.9)', borderRadius: '3px', overflow: 'hidden', border: '1px solid var(--border)'}}>
                              <div style={{height: '100%', background: 'linear-gradient(90deg, #00ff41, #00ffee)', width: `${50 + i * 15}%`, transition: 'width 0.3s'}}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid-2">
                      <div style={{padding: '20px', background: 'rgba(255, 152, 0, 0.08)', borderRadius: '8px', border: '1px solid rgba(255, 152, 0, 0.3)'}}>
                        <h4 style={{color: '#FF9800', marginBottom: '12px'}}>⚠️ Experience Gaps</h4>
                        <p style={{color: '#ccc', lineHeight: '1.6'}}>{asText(analysis.founder_fit?.experience_gaps)}</p>
                      </div>

                      <div style={{padding: '20px', background: 'rgba(76, 175, 80, 0.08)', borderRadius: '8px', border: '1px solid rgba(76, 175, 80, 0.3)'}}>
                        <h4 style={{color: '#4CAF50', marginBottom: '12px'}}>👥 Team Recommendations</h4>
                        <p style={{color: '#ccc', lineHeight: '1.6'}}>{asText(analysis.founder_fit?.team_recommendations)}</p>
                      </div>
                    </div>

                    <div style={{marginTop: '30px', padding: '20px', background: 'rgba(33, 150, 243, 0.08)', borderRadius: '8px', border: '1px solid rgba(33, 150, 243, 0.3)'}}>
                      <h4 style={{color: '#2196F3', marginBottom: '16px'}}>📚 How to Improve Your Fit</h4>
                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px'}}>
                        {asList(analysis.founder_fit?.improvement_areas).map((a: any, i: number) => (
                          <div key={i} style={{padding: '12px', background: 'rgba(33, 150, 243, 0.1)', borderRadius: '6px', border: '1px solid rgba(33, 150, 243, 0.2)', display: 'flex', gap: '10px', alignItems: 'flex-start'}}>
                            <span style={{fontSize: '18px', marginTop: '2px'}}>📚</span>
                            <span style={{color: '#ccc', fontSize: '13'}}>{asText(a)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick analysis only returns a placeholder here; the full structure
                    (with key_metrics) arrives with the extended analysis */}
                {activeTab === 'financial' && !analysis.financial_projections?.key_metrics && (
                  <ExtendedPending status={extendedStatus} label="financial projections" onRetry={() => loadExtended(analysis.analysis_id)} />
                )}
                {activeTab === 'financial' && analysis.financial_projections?.key_metrics && (
                  <FinancialDashboard
                    financial={analysis.financial_projections}
                    startup_title={analysis.idea_extraction?.title || 'Your Startup'}
                  />
                )}

                {activeTab === 'collaboration' && (
                  <CollaborationHub
                    analysis_id={analysis.analysis_id}
                  />
                )}

                {activeTab === 'market' && (
                  <MarketIntelligenceDashboard
                    sector={analysis.idea_extraction?.sector}
                  />
                )}

                {activeTab === 'validation' && (
                  <ProductValidationDashboard />
                )}

                {activeTab === 'integrations' && (
                  <PlatformIntegrationsDashboard />
                )}

                {activeTab === 'education' && (
                  <EducationResourcesDashboard />
                )}

                {activeTab === 'school' && (
                  <StartupSchoolDashboard />
                )}

                {activeTab === 'compliance' && (
                  <ComplianceLegalDashboard />
                )}

                {activeTab === 'analytics' && (
                  <AdvancedAnalyticsDashboard />
                )}

                {activeTab === 'mobile' && (
                  <MobileOfflineDashboard />
                )}

                {activeTab === 'localization' && (
                  <LocalizationDashboard />
                )}

                {activeTab === 'monitoring' && (
                  <ContinuousMonitoringDashboard />
                )}

                {activeTab === 'qa' && (
                  <div className="qa-section">
                    <p>Practice pitching to investors with AI-powered Q&A</p>
                    {analysis.overall_readiness_score >= 5 ? (
                      <button onClick={startQA} className="btn-primary btn-large">🎤 Start Interview</button>
                    ) : (
                      <p className="warning">Improve readiness score to 5+ for Q&A</p>
                    )}
                  </div>
                )}
                </>)} />
                </ErrorBoundary>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>© 2026 FounderCheck. Empowering Bangladesh Entrepreneurs with AI Insights.</p>
      </footer>
    </div>
  )
}

export default App
