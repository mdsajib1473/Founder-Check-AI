import { useState } from 'react';

const MobileOfflineDashboard = () => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'offline' | 'sync'>('notifications');

  return (
    <div style={{
      backgroundColor: '#ffffff',
      color: '#23282e',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1px solid #5a6169',
      padding: '2rem'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        borderBottom: '1px solid #5a6169',
        marginBottom: '2rem',
        paddingBottom: '1rem'
      }}>
        {[
          { key: 'notifications', label: 'Notifications' },
          { key: 'offline', label: 'Offline Mode' },
          { key: 'sync', label: 'Sync Status' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            style={{
              padding: '0.75rem',
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

      {activeTab === 'notifications' && (
        <div>
          <h3 style={{ color: '#5A6B48', marginTop: 0 }}>Push Notifications</h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {[
              { type: '', label: 'Milestones', count: 3 },
              { type: '', label: 'Alerts', count: 5 },
              { type: '', label: 'Funding', count: 2 },
              { type: '', label: 'Insights', count: 8 }
            ].map((item, i) => (
              <div key={i} style={{
                backgroundColor: 'rgba(0, 0, 0, 0)',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{item.type}</div>
                <div style={{ fontSize: '0.9rem', color: '#8b9096' }}>{item.label}</div>
                <div style={{ fontSize: '1.2rem', color: '#5a6169', fontWeight: 'bold', marginTop: '0.5rem' }}>
                  {item.count}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid rgba(90, 107, 72, 0.10)' }}>
              <h4 style={{ margin: 0, color: '#5A6B48' }}>Recent Notifications</h4>
            </div>
            {[
              { icon: '', title: 'Milestone Reached: Series A Funding', time: '2 hours ago' },
              { icon: '', title: 'Competitor Alert: GrowthX launched new feature', time: '4 hours ago' },
              { icon: '', title: 'Funding News: TechBD raised $5M Series A', time: '1 day ago' }
            ].map((notif, i) => (
              <div key={i} style={{
                padding: '1rem',
                borderBottom: i < 2 ? '1px solid rgba(90, 107, 72, 0.10)' : 'none',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start'
              }}>
                <div style={{ fontSize: '1.2rem' }}>{notif.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#23282e', fontWeight: 'bold' }}>{notif.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#8b9096', marginTop: '0.25rem' }}>{notif.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'offline' && (
        <div>
          <h3 style={{ color: '#5A6B48', marginTop: 0 }}>Offline Mode</h3>

          <div style={{
            backgroundColor: 'rgba(90, 107, 72, 0.10)',
            border: '1px solid rgba(90, 107, 72, 0.10)',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#5A6B48' }}>Offline Ready</h4>
                <p style={{ margin: 0, color: '#8b9096', fontSize: '0.9rem' }}>
                  All analysis data downloaded and cached locally
                </p>
              </div>
              <button style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#5a6169',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>
                Download Now
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { label: 'Financial Data', size: '2.4 MB' },
              { label: 'Market Data', size: '1.8 MB' },
              { label: 'Team Data', size: '0.6 MB' },
              { label: 'Product Data', size: '0.9 MB' }
            ].map((item, i) => (
              <div key={i} style={{
                backgroundColor: 'rgba(0, 0, 0, 0)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#8b9096' }}>{item.label}</span>
                  <span style={{ color: '#5a6169', fontWeight: 'bold' }}>{item.size}</span>
                </div>
                <div style={{
                  height: '4px',
                  backgroundColor: 'rgba(90, 107, 72, 0.10)',
                  borderRadius: '2px',
                  marginTop: '0.5rem',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    backgroundColor: '#5A6B48',
                    width: '100%'
                  }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0)',
            padding: '1.5rem',
            borderRadius: '8px'
          }}>
            <h4 style={{ color: '#5a6169', marginTop: 0 }}>Offline Capabilities</h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#8b9096' }}>
              <li>View all analysis data without internet</li>
              <li>Make local changes and notes</li>
              <li>Generate reports offline</li>
              <li>Access financial projections</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'sync' && (
        <div>
          <h3 style={{ color: '#5A6B48', marginTop: 0 }}>Sync Status</h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {[
              { label: 'Synced', value: '24', color: '#5A6B48' },
              { label: 'Pending', value: '3', color: '#9C6B1F' },
              { label: 'Conflicts', value: '0', color: '#9C6B1F' }
            ].map((item, i) => (
              <div key={i} style={{
                backgroundColor: 'rgba(0, 0, 0, 0)',
                padding: '1.5rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: item.color, marginBottom: '0.5rem' }}>
                  {item.value}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#8b9096' }}>{item.label}</div>
              </div>
            ))}
          </div>

          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: '2rem'
          }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid rgba(90, 107, 72, 0.10)' }}>
              <h4 style={{ margin: 0, color: '#5A6B48' }}>Pending Changes</h4>
            </div>
            {[
              { entity: 'Financial Projections', action: 'Update', time: '5 min ago' },
              { entity: 'Team Member Added', action: 'Create', time: '15 min ago' },
              { entity: 'Market Data', action: 'Update', time: '2 hours ago' }
            ].map((item, i) => (
              <div key={i} style={{
                padding: '1rem',
                borderBottom: i < 2 ? '1px solid rgba(90, 107, 72, 0.10)' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ color: '#23282e', fontWeight: 'bold' }}>{item.entity}</div>
                  <div style={{ fontSize: '0.85rem', color: '#8b9096', marginTop: '0.25rem' }}>{item.time}</div>
                </div>
                <div style={{
                  padding: '0.25rem 0.75rem',
                  backgroundColor: 'rgba(156, 107, 31, 0.10)',
                  color: '#9C6B1F',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  fontWeight: 'bold'
                }}>
                  {item.action}
                </div>
              </div>
            ))}
          </div>

          <button style={{
            width: '100%',
            padding: '1rem',
            backgroundColor: '#5a6169',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1rem'
          }}>
            Sync Now
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileOfflineDashboard;
