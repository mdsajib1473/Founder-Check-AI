import { useState } from 'react';
import { API_BASE_URL } from '../config';

interface Integration {
  id: string;
  platform: string;
  platform_name: string;
  status: string;
  connected_at: string;
  last_used: string | null;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  start_date: string;
  event_type: string;
  days_until: number;
  attendees: string[];
}

interface Reminder {
  id: string;
  title: string;
  description: string;
  due_date: string;
  type: string;
  recipients: string[];
  days_until: number;
}

interface APIKey {
  id: string;
  name: string;
  created_at: string;
  last_used: string;
  is_active: boolean;
  scopes: string[];
  display: string;
}

const PlatformIntegrationsDashboard = () => {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'calendar' | 'reminders' | 'api'>('marketplace');
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);

  const platforms = [
    { key: 'slack', name: 'Slack', icon: '', description: 'Get milestone alerts in Slack' },
    { key: 'google_drive', name: 'Google Drive', icon: '', description: 'Export reports to Google Drive' },
    { key: 'notion', name: 'Notion', icon: '', description: 'Sync with Notion workspace' },
    { key: 'zapier', name: 'Zapier', icon: '', description: 'Connect to 5000+ apps' },
    { key: 'gmail', name: 'Gmail', icon: '', description: 'Share reports via email' }
  ];

  const loadIntegrations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/integrations/active`);
      const data = await response.json();
      setIntegrations(data.integrations || []);
    } catch (error) {
      console.error('Failed to load integrations:', error);
    }
  };

  const loadMilestones = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/integrations/calendar/milestones`);
      const data = await response.json();
      setMilestones(data.milestones || []);
    } catch (error) {
      console.error('Failed to load milestones:', error);
    }
  };

  const loadReminders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/integrations/reminders/pending`);
      const data = await response.json();
      setReminders(data.reminders || []);
    } catch (error) {
      console.error('Failed to load reminders:', error);
    }
  };

  const loadAPIKeys = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/integrations/api-keys`);
      const data = await response.json();
      setApiKeys(data.keys || []);
    } catch (error) {
      console.error('Failed to load API keys:', error);
    }
  };

  const connectIntegration = async (platform: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/integrations/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, config: {} })
      });

      if (response.ok) {
        loadIntegrations();
      }
    } catch (error) {
      console.error('Failed to connect integration:', error);
    }
  };

  const createMilestone = async () => {
    try {
      const tomorrow = new Date(Date.now() + 86400000).toISOString();
      const response = await fetch(`${API_BASE_URL}/api/integrations/calendar/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Launch Event',
          description: 'Product launch milestone',
          start_date: tomorrow,
          end_date: tomorrow,
          event_type: 'launch'
        })
      });

      if (response.ok) {
        loadMilestones();
      }
    } catch (error) {
      console.error('Failed to create milestone:', error);
    }
  };

  const createReminder = async () => {
    try {
      const tomorrow = new Date(Date.now() + 86400000).toISOString();
      const response = await fetch(`${API_BASE_URL}/api/integrations/reminders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Follow-up Action',
          description: 'Action item for team',
          due_date: tomorrow,
          reminder_type: 'email',
          recipients: ['team@example.com']
        })
      });

      if (response.ok) {
        loadReminders();
      }
    } catch (error) {
      console.error('Failed to create reminder:', error);
    }
  };

  const generateAPIKey = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/integrations/api-keys/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `API Key ${new Date().toLocaleDateString()}`,
          scopes: ['read:analyses', 'read:market', 'read:financial']
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert(`API Key Generated: ${data.key}\n\nSave this - you won't see it again!`);
        loadAPIKeys();
      }
    } catch (error) {
      console.error('Failed to generate API key:', error);
    }
  };

  const renderMarketplaceTab = () => (
    <div style={{ padding: '2rem' }}>
      <h3 style={{ color: '#00ff41', marginBottom: '1.5rem' }}>Integration Marketplace</h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {platforms.map(platform => {
          const isConnected = integrations.some(i => i.platform === platform.key);
          return (
            <div key={platform.key} style={{
              backgroundColor: isConnected ? 'rgba(0, 255, 65, 0.1)' : 'rgba(0, 0, 0, 0.3)',
              padding: '1.5rem',
              borderRadius: '8px',
              border: `1px solid ${isConnected ? '#00ff41' : '#00ffee'}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{platform.icon}</div>
                <h4 style={{ color: '#fff', margin: '0 0 0.5rem 0' }}>{platform.name}</h4>
                <p style={{ color: '#aaa', fontSize: '0.9rem', margin: 0 }}>{platform.description}</p>
              </div>
              <button
                onClick={() => connectIntegration(platform.key)}
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  backgroundColor: isConnected ? '#00ff41' : '#0055ff',
                  color: isConnected ? '#0f2a47' : '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {isConnected ? 'Connected' : 'Connect'}
              </button>
            </div>
          );
        })}
      </div>

      {integrations.length > 0 && (
        <div style={{
          backgroundColor: 'rgba(0, 255, 238, 0.1)',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid rgba(0, 255, 238, 0.3)'
        }}>
          <h4 style={{ color: '#00ffee', marginTop: 0 }}>Active Integrations</h4>
          {integrations.map(integration => (
            <div key={integration.id} style={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              padding: '0.75rem',
              marginBottom: '0.5rem',
              borderRadius: '4px',
              borderLeft: '3px solid #00ff41'
            }}>
              <div style={{ color: '#fff', fontWeight: 'bold' }}>{integration.platform_name}</div>
              <small style={{ color: '#aaa' }}>Connected {new Date(integration.connected_at).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderCalendarTab = () => (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#00ff41' }}>Calendar & Milestones</h3>
        <button
          onClick={createMilestone}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#00ff41',
            color: '#0f2a47',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          + Add Milestone
        </button>
      </div>

      {milestones.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#aaa' }}>
          <p>No upcoming milestones. Create one to get started!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {milestones.map(milestone => (
            <div key={milestone.id} style={{
              backgroundColor: 'rgba(0, 255, 238, 0.1)',
              padding: '1rem',
              borderRadius: '8px',
              borderLeft: '3px solid #00ffee'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <div>
                  <h4 style={{ color: '#fff', margin: '0 0 0.25rem 0' }}>{milestone.title}</h4>
                  <p style={{ color: '#aaa', margin: 0, fontSize: '0.85rem' }}>{milestone.description}</p>
                </div>
                <span style={{
                  backgroundColor: milestone.days_until <= 7 ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 255, 65, 0.2)',
                  color: milestone.days_until <= 7 ? '#ff4444' : '#00ff41',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  {milestone.days_until} days
                </span>
              </div>
              <div style={{ color: '#aaa', fontSize: '0.8rem' }}>
                {new Date(milestone.start_date).toLocaleDateString()} • {milestone.event_type}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderRemindersTab = () => (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#00ff41' }}>Reminders & Action Items</h3>
        <button
          onClick={createReminder}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#00ff41',
            color: '#0f2a47',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          + New Reminder
        </button>
      </div>

      {reminders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#aaa' }}>
          <p>No pending reminders. You're all caught up!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {reminders.map(reminder => (
            <div key={reminder.id} style={{
              backgroundColor: 'rgba(255, 165, 0, 0.1)',
              padding: '1rem',
              borderRadius: '8px',
              borderLeft: '3px solid #ffaa44'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ color: '#fff', margin: '0 0 0.25rem 0' }}>{reminder.title}</h4>
                  <p style={{ color: '#aaa', margin: 0, fontSize: '0.85rem' }}>{reminder.description}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{
                    backgroundColor: 'rgba(255, 165, 0, 0.2)',
                    color: '#ffaa44',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap'
                  }}>
                    {reminder.days_until} days
                  </span>
                  <button style={{
                    padding: '0.5rem',
                    backgroundColor: '#00ff41',
                    color: '#0f2a47',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}>
                    Send
                  </button>
                </div>
              </div>
              <div style={{ color: '#aaa', fontSize: '0.8rem' }}>
                Due: {new Date(reminder.due_date).toLocaleDateString()} • {reminder.type}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAPITab = () => (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#00ff41' }}>API Access & Webhooks</h3>
        <button
          onClick={generateAPIKey}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#00ff41',
            color: '#0f2a47',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          + Generate API Key
        </button>
      </div>

      <div style={{
        backgroundColor: 'rgba(0, 255, 238, 0.1)',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '1px solid rgba(0, 255, 238, 0.3)',
        marginBottom: '2rem'
      }}>
        <h4 style={{ color: '#00ffee', marginTop: 0 }}>API Documentation</h4>
        <div style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: '1.6' }}>
          <p><strong style={{ color: '#00ffee' }}>Base URL:</strong> https://api.foundercheck.io/v1</p>
          <p><strong style={{ color: '#00ffee' }}>Authentication:</strong> Bearer {'{api_key}'} in Authorization header</p>
          <p><strong style={{ color: '#00ffee' }}>Response Format:</strong> JSON</p>
          <p><strong style={{ color: '#00ffee' }}>Rate Limit:</strong> 1000 requests/hour</p>
        </div>
      </div>

      <h4 style={{ color: '#00ffee', marginBottom: '1rem' }}>API Keys ({apiKeys.length})</h4>
      {apiKeys.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#aaa' }}>
          <p>No API keys yet. Generate one to get started.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {apiKeys.map(key => (
            <div key={key.id} style={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              padding: '1rem',
              borderRadius: '4px',
              borderLeft: `3px solid ${key.is_active ? '#00ff41' : '#ff4444'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <div>
                  <div style={{ color: '#fff', fontWeight: 'bold' }}>{key.name}</div>
                  <small style={{ color: '#aaa' }}>{key.display}</small>
                </div>
                <span style={{
                  backgroundColor: key.is_active ? 'rgba(0, 255, 65, 0.2)' : 'rgba(255, 0, 0, 0.2)',
                  color: key.is_active ? '#00ff41' : '#ff4444',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  {key.is_active ? 'Active' : 'Revoked'}
                </span>
              </div>
              <div style={{ color: '#aaa', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                Created: {new Date(key.created_at).toLocaleDateString()} • Last used: {key.last_used}
              </div>
              <div style={{ color: '#00ffee', fontSize: '0.8rem' }}>
                Scopes: {key.scopes.join(', ')}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{
        backgroundColor: 'rgba(0, 255, 65, 0.1)',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '1px solid rgba(0, 255, 65, 0.3)',
        marginTop: '2rem'
      }}>
        <h4 style={{ color: '#00ff41', marginTop: 0 }}>Sample API Request</h4>
        <pre style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: '1rem',
          borderRadius: '4px',
          color: '#00ff41',
          fontSize: '0.8rem',
          overflowX: 'auto',
          margin: 0
        }}>
{`curl -X GET https://api.foundercheck.io/v1/analyses \\
  -H "Authorization: Bearer YOUR_API_KEY"

# Response
{
  "success": true,
  "analyses": [...],
  "count": 5
}`}
        </pre>
      </div>
    </div>
  );

  return (
    <div style={{
      backgroundColor: '#0f2a47',
      color: '#fff',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1px solid #00ffee'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        borderBottom: '1px solid #00ffee'
      }}>
        {[
          { key: 'marketplace', label: 'Marketplace', icon: '' },
          { key: 'calendar', label: 'Calendar', icon: '' },
          { key: 'reminders', label: 'Reminders', icon: '' },
          { key: 'api', label: 'API Access', icon: '' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key as typeof activeTab);
              if (tab.key === 'marketplace') loadIntegrations();
              if (tab.key === 'calendar') loadMilestones();
              if (tab.key === 'reminders') loadReminders();
              if (tab.key === 'api') loadAPIKeys();
            }}
            style={{
              padding: '1rem',
              backgroundColor: activeTab === tab.key ? 'rgba(0, 255, 238, 0.2)' : 'transparent',
              color: activeTab === tab.key ? '#00ffee' : '#888',
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
        {activeTab === 'marketplace' && renderMarketplaceTab()}
        {activeTab === 'calendar' && renderCalendarTab()}
        {activeTab === 'reminders' && renderRemindersTab()}
        {activeTab === 'api' && renderAPITab()}
      </div>
    </div>
  );
};

export default PlatformIntegrationsDashboard;
