import { useState } from 'react';
import { API_BASE_URL } from '../config';

interface ComplianceItem {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
}

interface LegalTemplate {
  id: string;
  name: string;
  type: string;
  fields: string[];
}

const ComplianceLegalDashboard = () => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'documents' | 'ip'>('checklist');
  const [items, setItems] = useState<ComplianceItem[]>([]);
  const [templates, setTemplates] = useState<LegalTemplate[]>([]);

  const loadChecklist = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/compliance/checklist`);
      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.error('Failed to load checklist:', error);
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/compliance/templates`);
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return '#9C6B1F';
      case 'medium': return '#9C6B1F';
      case 'low': return '#5A6B48';
      default: return '#8b9096';
    }
  };

  const renderChecklistTab = () => (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#5A6B48' }}>Regulatory Checklist</h3>
        <button onClick={loadChecklist} style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#5A6B48',
          color: '#ffffff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          Load Checklist
        </button>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {items.map(item => (
          <div key={item.id} style={{
            backgroundColor: 'rgba(0, 0, 0, 0)',
            padding: '1rem',
            borderRadius: '8px',
            borderLeft: `3px solid ${getPriorityColor(item.priority)}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
              <h4 style={{ color: '#23282e', margin: 0 }}>{item.title}</h4>
              <select
                value={item.status}
                onChange={(e) => {
                  const newItems = items.map(i => i.id === item.id ? {...i, status: e.target.value} : i);
                  setItems(newItems);
                }}
                style={{
                  padding: '0.5rem',
                  backgroundColor: 'rgba(35, 40, 46, 0.08)',
                  border: '1px solid #5a6169',
                  color: '#23282e',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                <option value="pending" style={{ color: '#23282e' }}>Pending</option>
                <option value="in_progress" style={{ color: '#23282e' }}>In Progress</option>
                <option value="completed" style={{ color: '#23282e' }}>Completed</option>
              </select>
            </div>
            <p style={{ color: '#8b9096', fontSize: '0.9rem', margin: '0.25rem 0' }}>
              {item.description}
            </p>
            <small style={{ color: '#8b9096' }}>{item.category}</small>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDocumentsTab = () => (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#5A6B48' }}>Legal Documents</h3>
        <button onClick={loadTemplates} style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#5A6B48',
          color: '#ffffff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          Load Templates
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        {templates.map(template => (
          <div key={template.id} style={{
            backgroundColor: 'rgba(0, 0, 0, 0)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid rgba(90, 107, 72, 0.10)'
          }}>
            <h4 style={{ color: '#5a6169', margin: '0 0 0.75rem 0' }}>{template.name}</h4>
            <p style={{ color: '#8b9096', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
              Type: {template.type}
            </p>
            <div style={{ marginBottom: '1rem' }}>
              <small style={{ color: '#8b9096' }}>Customizable fields:</small>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                {template.fields.map((field, i) => (
                  <span key={i} style={{
                    backgroundColor: 'rgba(90, 107, 72, 0.10)',
                    color: '#5a6169',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '3px',
                    fontSize: '0.8rem'
                  }}>
                    {field}
                  </span>
                ))}
              </div>
            </div>
            <button style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#5a6169',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Generate & Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderIPTab = () => (
    <div style={{ padding: '2rem' }}>
      <h3 style={{ color: '#5A6B48', marginBottom: '1.5rem' }}>IP Protection Guide</h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        {['Trademark Registration', 'Patent Filing', 'Copyright Protection', 'NDA Templates'].map((guide, i) => (
          <div key={i} style={{
            backgroundColor: 'rgba(0, 0, 0, 0)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid rgba(156, 107, 31, 0.10)'
          }}>
            <h4 style={{ color: '#9C6B1F', margin: '0 0 0.75rem 0' }}>{guide}</h4>
            <p style={{ color: '#8b9096', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Complete step-by-step guide with cost and timeline estimates
            </p>
            <button style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#5a6169',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              View Guide
            </button>
          </div>
        ))}
      </div>
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
        gridTemplateColumns: 'repeat(3, 1fr)',
        borderBottom: '1px solid #5a6169'
      }}>
        {[
          { key: 'checklist', label: 'Checklist' },
          { key: 'documents', label: 'Documents' },
          { key: 'ip', label: 'IP Protection' }
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
              fontWeight: activeTab === tab.key ? 'bold' : 'normal'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'checklist' && renderChecklistTab()}
        {activeTab === 'documents' && renderDocumentsTab()}
        {activeTab === 'ip' && renderIPTab()}
      </div>
    </div>
  );
};

export default ComplianceLegalDashboard;
