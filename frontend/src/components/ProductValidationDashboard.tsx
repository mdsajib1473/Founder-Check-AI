import { useState } from 'react';
import { API_BASE_URL } from '../config';

interface Feature {
  id: string;
  name: string;
  effort: number;
  impact: number;
  priority_score: number;
  dependencies: string[];
}

interface PriorityMatrix {
  must_haves: Feature[];
  should_haves: Feature[];
  could_haves: Feature[];
  wont_haves: Feature[];
  total_features: number;
  effort_vs_impact: {
    high_impact_low_effort: number;
    high_impact_high_effort: number;
    low_impact_low_effort: number;
    low_impact_high_effort: number;
  };
}

interface Interview {
  id: string;
  template: string;
  respondent: string;
  date: string;
  questions_total: number;
}

interface MVPPlan {
  product_name: string;
  mvp_features: string[];
  excluded_features: string[];
  timeline_weeks: number;
  recommendation: string;
  phases: Array<{
    phase: string;
    tasks: string[];
    effort_hours: number;
  }>;
}

const ProductValidationDashboard = () => {
  const [activeTab, setActiveTab] = useState<'priority' | 'customer' | 'mvp'>('priority');
  const [priorityMatrix, setPriorityMatrix] = useState<PriorityMatrix | null>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [mvpPlan] = useState<MVPPlan | null>(null); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [showAddFeature, setShowAddFeature] = useState(false);
  const [showCreateInterview, setShowCreateInterview] = useState(false);
  const [showDefineMVP, setShowDefineMVP] = useState(false);

  // Feature Priority Matrix States
  const [newFeature, setNewFeature] = useState({
    name: '',
    description: '',
    moscow: 'could',
    effort: 5,
    impact: 5
  });

  // Customer Development States
  const [selectedTemplate, setSelectedTemplate] = useState('customer_discovery');
  const [respondentName, setRespondentName] = useState('');

  // MVP Definition States
  const [mvpData, setMvpData] = useState({
    productName: '',
    coreFeatures: '',
    niceToHave: '',
    launchWeeks: 8
  });

  const loadPriorityMatrix = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/validation/priority-matrix`);
      const data = await response.json();
      setPriorityMatrix(data.matrix);
    } catch (error) {
      console.error('Failed to load priority matrix:', error);
    }
  };

  const addFeature = async () => {
    if (!newFeature.name) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/validation/features/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newFeature.name,
          description: newFeature.description,
          moscow: newFeature.moscow,
          effort: parseInt(String(newFeature.effort)),
          impact: parseInt(String(newFeature.impact)),
          dependencies: []
        })
      });

      if (response.ok) {
        setNewFeature({ name: '', description: '', moscow: 'could', effort: 5, impact: 5 });
        setShowAddFeature(false);
        loadPriorityMatrix();
      }
    } catch (error) {
      console.error('Failed to add feature:', error);
    }
  };

  const createInterview = async () => {
    if (!respondentName) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/validation/interview/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_name: selectedTemplate,
          respondent_name: respondentName
        })
      });

      if (response.ok) {
        const data = await response.json();
        setInterviews([...interviews, data.interview]);
        setRespondentName('');
        setShowCreateInterview(false);
      }
    } catch (error) {
      console.error('Failed to create interview:', error);
    }
  };

  const defineMVP = async () => {
    if (!mvpData.productName || !mvpData.coreFeatures) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/validation/mvp/define`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: mvpData.productName,
          core_features: mvpData.coreFeatures.split(',').map(f => f.trim()),
          non_essential_features: mvpData.niceToHave.split(',').map(f => f.trim()).filter(f => f),
          launch_weeks: mvpData.launchWeeks
        })
      });

      if (response.ok) {
        await response.json();
        setMvpData({ productName: '', coreFeatures: '', niceToHave: '', launchWeeks: 8 });
        setShowDefineMVP(false);
        // Load MVP plan
      }
    } catch (error) {
      console.error('Failed to define MVP:', error);
    }
  };

  const renderPriorityTab = () => (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#5A6B48' }}>Feature Priority Matrix</h3>
        <button
          onClick={() => {
            setShowAddFeature(!showAddFeature);
            loadPriorityMatrix();
          }}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#5A6B48',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {showAddFeature ? 'Cancel' : '+ Add Feature'}
        </button>
      </div>

      {showAddFeature && (
        <div style={{
          backgroundColor: 'rgba(35, 40, 46, 0.04)',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          border: '1px solid #5a6169'
        }}>
          <h4 style={{ color: '#5a6169', marginTop: 0 }}>Add New Feature</h4>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <input
              type="text"
              placeholder="Feature name"
              value={newFeature.name}
              onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
              style={{
                padding: '0.5rem',
                backgroundColor: 'rgba(35, 40, 46, 0.08)',
                border: '1px solid #5a6169',
                color: '#23282e',
                borderRadius: '4px'
              }}
            />
            <textarea
              placeholder="Description"
              value={newFeature.description}
              onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
              style={{
                padding: '0.5rem',
                backgroundColor: 'rgba(35, 40, 46, 0.08)',
                border: '1px solid #5a6169',
                color: '#23282e',
                borderRadius: '4px',
                minHeight: '60px'
              }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <select
                value={newFeature.moscow}
                onChange={(e) => setNewFeature({ ...newFeature, moscow: e.target.value })}
                style={{
                  padding: '0.5rem',
                  backgroundColor: 'rgba(35, 40, 46, 0.08)',
                  border: '1px solid #5a6169',
                  color: '#23282e',
                  borderRadius: '4px'
                }}
              >
                <option value="must" style={{ color: '#23282e' }}>Must Have</option>
                <option value="should" style={{ color: '#23282e' }}>Should Have</option>
                <option value="could" style={{ color: '#23282e' }}>Could Have</option>
                <option value="wont" style={{ color: '#23282e' }}>Won't Have</option>
              </select>
              <input
                type="range"
                min="1"
                max="10"
                value={newFeature.effort}
                onChange={(e) => setNewFeature({ ...newFeature, effort: parseInt(e.target.value) })}
                style={{ cursor: 'pointer' }}
              />
              <div style={{ textAlign: 'center' }}>
                <small style={{ color: '#5a6169' }}>Effort: {newFeature.effort}</small>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div />
              <input
                type="range"
                min="1"
                max="10"
                value={newFeature.impact}
                onChange={(e) => setNewFeature({ ...newFeature, impact: parseInt(e.target.value) })}
                style={{ cursor: 'pointer' }}
              />
              <div style={{ textAlign: 'center' }}>
                <small style={{ color: '#5a6169' }}>Impact: {newFeature.impact}</small>
              </div>
            </div>
            <button
              onClick={addFeature}
              style={{
                padding: '0.75rem',
                backgroundColor: '#5A6B48',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Add Feature
            </button>
          </div>
        </div>
      )}

      {priorityMatrix ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Must Haves */}
          <div style={{
            backgroundColor: 'rgba(156, 107, 31, 0.10)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid rgba(156, 107, 31, 0.10)'
          }}>
            <h4 style={{ color: '#9C6B1F', margin: '0 0 1rem 0' }}>
              Must Have ({priorityMatrix.must_haves.length})
            </h4>
            {priorityMatrix.must_haves.map(f => (
              <div key={f.id} style={{
                marginBottom: '0.75rem',
                padding: '0.75rem',
                backgroundColor: 'rgba(0, 0, 0, 0)',
                borderRadius: '4px',
                borderLeft: '3px solid #9C6B1F'
              }}>
                <div style={{ fontWeight: 'bold', color: '#23282e' }}>{f.name}</div>
                <div style={{ fontSize: '0.85rem', color: '#8b9096', marginTop: '0.25rem' }}>
                  Score: {f.priority_score} | Effort: {f.effort} | Impact: {f.impact}
                </div>
              </div>
            ))}
          </div>

          {/* Should Haves */}
          <div style={{
            backgroundColor: 'rgba(156, 107, 31, 0.10)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid rgba(156, 107, 31, 0.10)'
          }}>
            <h4 style={{ color: '#9C6B1F', margin: '0 0 1rem 0' }}>
              Should Have ({priorityMatrix.should_haves.length})
            </h4>
            {priorityMatrix.should_haves.map(f => (
              <div key={f.id} style={{
                marginBottom: '0.75rem',
                padding: '0.75rem',
                backgroundColor: 'rgba(0, 0, 0, 0)',
                borderRadius: '4px',
                borderLeft: '3px solid #9C6B1F'
              }}>
                <div style={{ fontWeight: 'bold', color: '#23282e' }}>{f.name}</div>
                <div style={{ fontSize: '0.85rem', color: '#8b9096', marginTop: '0.25rem' }}>
                  Score: {f.priority_score} | Effort: {f.effort} | Impact: {f.impact}
                </div>
              </div>
            ))}
          </div>

          {/* Could Haves */}
          <div style={{
            backgroundColor: 'rgba(90, 107, 72, 0.10)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid rgba(90, 107, 72, 0.10)'
          }}>
            <h4 style={{ color: '#5a6169', margin: '0 0 1rem 0' }}>
              Could Have ({priorityMatrix.could_haves.length})
            </h4>
            {priorityMatrix.could_haves.map(f => (
              <div key={f.id} style={{
                marginBottom: '0.75rem',
                padding: '0.75rem',
                backgroundColor: 'rgba(0, 0, 0, 0)',
                borderRadius: '4px',
                borderLeft: '3px solid #5a6169'
              }}>
                <div style={{ fontWeight: 'bold', color: '#23282e' }}>{f.name}</div>
                <div style={{ fontSize: '0.85rem', color: '#8b9096', marginTop: '0.25rem' }}>
                  Score: {f.priority_score} | Effort: {f.effort} | Impact: {f.impact}
                </div>
              </div>
            ))}
          </div>

          {/* Won't Haves */}
          <div style={{
            backgroundColor: 'rgba(35, 40, 46, 0.04)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid rgba(35, 40, 46, 0.04)'
          }}>
            <h4 style={{ color: '#8b9096', margin: '0 0 1rem 0' }}>
              Won't Have ({priorityMatrix.wont_haves.length})
            </h4>
            {priorityMatrix.wont_haves.map(f => (
              <div key={f.id} style={{
                marginBottom: '0.75rem',
                padding: '0.75rem',
                backgroundColor: 'rgba(0, 0, 0, 0)',
                borderRadius: '4px',
                borderLeft: '3px solid #8b9096'
              }}>
                <div style={{ fontWeight: 'bold', color: '#23282e' }}>{f.name}</div>
                <div style={{ fontSize: '0.85rem', color: '#8b9096', marginTop: '0.25rem' }}>
                  Score: {f.priority_score}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#8b9096' }}>
          <p>Add features to see the priority matrix</p>
        </div>
      )}
    </div>
  );

  const renderCustomerTab = () => (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#5A6B48' }}>Customer Development Framework</h3>
        <button
          onClick={() => setShowCreateInterview(!showCreateInterview)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#5A6B48',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {showCreateInterview ? 'Cancel' : '+ New Interview'}
        </button>
      </div>

      {showCreateInterview && (
        <div style={{
          backgroundColor: 'rgba(35, 40, 46, 0.04)',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          border: '1px solid #5a6169'
        }}>
          <h4 style={{ color: '#5a6169', marginTop: 0 }}>Create Interview</h4>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              style={{
                padding: '0.5rem',
                backgroundColor: 'rgba(35, 40, 46, 0.08)',
                border: '1px solid #5a6169',
                color: '#23282e',
                borderRadius: '4px'
              }}
            >
              <option value="customer_discovery" style={{ color: '#23282e' }}>Customer Discovery</option>
              <option value="problem_validation" style={{ color: '#23282e' }}>Problem Validation</option>
              <option value="solution_validation" style={{ color: '#23282e' }}>Solution Validation</option>
            </select>
            <input
              type="text"
              placeholder="Respondent name"
              value={respondentName}
              onChange={(e) => setRespondentName(e.target.value)}
              style={{
                padding: '0.5rem',
                backgroundColor: 'rgba(35, 40, 46, 0.08)',
                border: '1px solid #5a6169',
                color: '#23282e',
                borderRadius: '4px'
              }}
            />
            <button
              onClick={createInterview}
              style={{
                padding: '0.75rem',
                backgroundColor: '#5A6B48',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Create Interview
            </button>
          </div>
        </div>
      )}

      <div style={{
        backgroundColor: 'rgba(90, 107, 72, 0.10)',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '1px solid rgba(90, 107, 72, 0.10)',
        marginBottom: '2rem'
      }}>
        <h4 style={{ color: '#5a6169', marginTop: 0 }}>Interview Templates</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0)',
            padding: '1rem',
            borderRadius: '4px',
            borderLeft: '3px solid #5A6B48'
          }}>
            <div style={{ fontWeight: 'bold', color: '#5A6B48', marginBottom: '0.5rem' }}>
              Customer Discovery
            </div>
            <small style={{ color: '#8b9096' }}>7 questions • ~21 minutes</small>
            <div style={{ color: '#8b9096', marginTop: '0.5rem', fontSize: '0.8rem' }}>
              Understand customer problems and needs
            </div>
          </div>
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0)',
            padding: '1rem',
            borderRadius: '4px',
            borderLeft: '3px solid #5a6169'
          }}>
            <div style={{ fontWeight: 'bold', color: '#5a6169', marginBottom: '0.5rem' }}>
              Problem Validation
            </div>
            <small style={{ color: '#8b9096' }}>6 questions • ~18 minutes</small>
            <div style={{ color: '#8b9096', marginTop: '0.5rem', fontSize: '0.8rem' }}>
              Validate that the problem is real
            </div>
          </div>
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0)',
            padding: '1rem',
            borderRadius: '4px',
            borderLeft: '3px solid #9C6B1F'
          }}>
            <div style={{ fontWeight: 'bold', color: '#9C6B1F', marginBottom: '0.5rem' }}>
              Solution Validation
            </div>
            <small style={{ color: '#8b9096' }}>6 questions • ~18 minutes</small>
            <div style={{ color: '#8b9096', marginTop: '0.5rem', fontSize: '0.8rem' }}>
              Test if your solution resonates
            </div>
          </div>
        </div>
      </div>

      {interviews.length > 0 && (
        <div>
          <h4 style={{ color: '#5A6B48', marginBottom: '1rem' }}>Completed Interviews ({interviews.length})</h4>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {interviews.map(interview => (
              <div key={interview.id} style={{
                backgroundColor: 'rgba(0, 0, 0, 0)',
                padding: '1rem',
                borderRadius: '4px',
                borderLeft: '3px solid #5A6B48'
              }}>
                <div style={{ fontWeight: 'bold', color: '#23282e' }}>{interview.respondent}</div>
                <div style={{ fontSize: '0.85rem', color: '#8b9096', marginTop: '0.25rem' }}>
                  {interview.template} • {interview.questions_total} questions • {new Date(interview.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderMVPTab = () => (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#5A6B48' }}>MVP Definition Helper</h3>
        <button
          onClick={() => setShowDefineMVP(!showDefineMVP)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#5A6B48',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {showDefineMVP ? 'Cancel' : '+ Define MVP'}
        </button>
      </div>

      {showDefineMVP && (
        <div style={{
          backgroundColor: 'rgba(35, 40, 46, 0.04)',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          border: '1px solid #5a6169'
        }}>
          <h4 style={{ color: '#5a6169', marginTop: 0 }}>Define Your MVP</h4>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <input
              type="text"
              placeholder="Product name"
              value={mvpData.productName}
              onChange={(e) => setMvpData({ ...mvpData, productName: e.target.value })}
              style={{
                padding: '0.5rem',
                backgroundColor: 'rgba(35, 40, 46, 0.08)',
                border: '1px solid #5a6169',
                color: '#23282e',
                borderRadius: '4px'
              }}
            />
            <textarea
              placeholder="Core features (comma-separated)"
              value={mvpData.coreFeatures}
              onChange={(e) => setMvpData({ ...mvpData, coreFeatures: e.target.value })}
              style={{
                padding: '0.5rem',
                backgroundColor: 'rgba(35, 40, 46, 0.08)',
                border: '1px solid #5a6169',
                color: '#23282e',
                borderRadius: '4px',
                minHeight: '60px'
              }}
            />
            <textarea
              placeholder="Nice-to-have features (comma-separated)"
              value={mvpData.niceToHave}
              onChange={(e) => setMvpData({ ...mvpData, niceToHave: e.target.value })}
              style={{
                padding: '0.5rem',
                backgroundColor: 'rgba(35, 40, 46, 0.08)',
                border: '1px solid #5a6169',
                color: '#23282e',
                borderRadius: '4px',
                minHeight: '60px'
              }}
            />
            <div>
              <label style={{ color: '#5a6169', display: 'block', marginBottom: '0.5rem' }}>
                Launch Timeline: {mvpData.launchWeeks} weeks
              </label>
              <input
                type="range"
                min="2"
                max="24"
                value={mvpData.launchWeeks}
                onChange={(e) => setMvpData({ ...mvpData, launchWeeks: parseInt(e.target.value) })}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>
            <button
              onClick={defineMVP}
              style={{
                padding: '0.75rem',
                backgroundColor: '#5A6B48',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Define MVP
            </button>
          </div>
        </div>
      )}

      {mvpPlan && (
        <div style={{
          backgroundColor: 'rgba(90, 107, 72, 0.10)',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid rgba(90, 107, 72, 0.10)'
        }}>
          <h4 style={{ color: '#5a6169', marginTop: 0 }}>{mvpPlan.product_name}</h4>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <small style={{ color: '#8b9096' }}>Timeline: {mvpPlan.timeline_weeks} weeks</small>
            </div>
            <div style={{ color: '#5A6B48', fontWeight: 'bold', marginBottom: '1rem' }}>
              {mvpPlan.recommendation}
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h5 style={{ color: '#5a6169', marginTop: 0 }}>Core Features</h5>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              {mvpPlan.mvp_features.map((feature, i) => (
                <div key={i} style={{
                  backgroundColor: 'rgba(90, 107, 72, 0.10)',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  borderLeft: '2px solid #5A6B48',
                  color: '#23282e'
                }}>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {mvpPlan.excluded_features.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h5 style={{ color: '#9C6B1F', marginTop: 0 }}>Excluded Features (Phase 2)</h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                {mvpPlan.excluded_features.map((feature, i) => (
                  <div key={i} style={{
                    backgroundColor: 'rgba(156, 107, 31, 0.10)',
                    padding: '0.75rem',
                    borderRadius: '4px',
                    borderLeft: '2px solid #9C6B1F',
                    color: '#23282e'
                  }}>
                    ○ {feature}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h5 style={{ color: '#5a6169', marginTop: 0 }}>Development Phases</h5>
            {mvpPlan.phases.map((phase, i) => (
              <div key={i} style={{
                backgroundColor: 'rgba(0, 0, 0, 0)',
                padding: '1rem',
                marginBottom: '0.75rem',
                borderRadius: '4px',
                borderLeft: '3px solid #5a6169'
              }}>
                <div style={{ fontWeight: 'bold', color: '#23282e', marginBottom: '0.5rem' }}>
                  {phase.phase}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#8b9096', marginBottom: '0.5rem' }}>
                  Effort: {Math.round(phase.effort_hours)} hours
                </div>
                <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem', color: '#8b9096' }}>
                  {phase.tasks.map((task, j) => (
                    <li key={j} style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>{task}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={{
      backgroundColor: '#ffffff',
      color: '#23282e',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1px solid #5a6169'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        borderBottom: '1px solid #5a6169'
      }}>
        {[
          { key: 'priority', label: 'Feature Matrix', icon: '' },
          { key: 'customer', label: 'Customer Development', icon: '' },
          { key: 'mvp', label: 'MVP Definition', icon: '' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            style={{
              padding: '1rem',
              backgroundColor: activeTab === tab.key ? 'rgba(90, 107, 72, 0.10)' : 'transparent',
              color: activeTab === tab.key ? '#5a6169' : '#8b9096',
              border: 'none',
              cursor: 'pointer',
              fontWeight: activeTab === tab.key ? 'bold' : 'normal',
              fontSize: '0.9rem'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'priority' && renderPriorityTab()}
        {activeTab === 'customer' && renderCustomerTab()}
        {activeTab === 'mvp' && renderMVPTab()}
      </div>
    </div>
  );
};

export default ProductValidationDashboard;
