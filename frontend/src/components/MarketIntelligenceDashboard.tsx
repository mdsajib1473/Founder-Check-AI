import React, { useState } from 'react'

type Tab = 'market' | 'competitors' | 'benchmarks' | 'trends' | 'alerts'

interface Props {
  sector?: string;
}

const MarketIntelligenceDashboard: React.FC<Props> = ({ sector = 'Technology' }) => {
  const [activeTab, setActiveTab] = useState<Tab>('market');

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#23282e', marginBottom: '24px' }}>Market Intelligence Dashboard</h2>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(35, 40, 46, 0.08)', flexWrap: 'wrap' }}>
        {[
          { id: 'market' as Tab, label: 'Market Overview' },
          { id: 'competitors' as Tab, label: 'Competitive Analysis' },
          { id: 'benchmarks' as Tab, label: 'Industry Benchmarks' },
          { id: 'trends' as Tab, label: 'Trends & Alerts' },
          { id: 'alerts' as Tab, label: 'News Alerts' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 16px',
              background: activeTab === tab.id ? 'rgba(90, 107, 72, 0.10)' : 'transparent',
              border: activeTab === tab.id ? '1px solid #5A6B48' : '1px solid rgba(35, 40, 46, 0.08)',
              color: activeTab === tab.id ? '#5A6B48' : '#5a6169',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: activeTab === tab.id ? '700' : '600'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Market Overview Tab */}
      {activeTab === 'market' && (
        <div>
          <h3 style={{ color: '#23282e', marginBottom: '20px', fontSize: '16px' }}>Market Overview: {sector}</h3>

          {/* Key Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Market Size', value: '$2.5B', color: '#5a6169' },
              { label: 'Annual Growth', value: '28.5%', color: '#5A6B48' },
              { label: '3-Year Projection', value: '35% CAGR', color: '#9C6B1F' },
              { label: 'Market Opportunity', value: 'Excellent', color: '#5A6B48' }
            ].map((metric, i) => (
              <div key={i} style={{ padding: '20px', background: `rgba(${metric.color === '#5a6169' ? '33,150,243' : metric.color === '#5A6B48' ? '76,175,80' : metric.color === '#9C6B1F' ? '255,152,0' : '0,255,65'}, 0.1)`, borderRadius: '8px', border: `1px solid ${metric.color}33` }}>
                <p style={{ color: '#8b9096', fontSize: '12px', marginBottom: '8px' }}>{metric.label}</p>
                <p style={{ fontSize: '22px', fontWeight: 'bold', color: metric.color }}>{metric.value}</p>
              </div>
            ))}
          </div>

          {/* TAM/SAM/SOM Analysis */}
          <div style={{ padding: '20px', background: 'rgba(35, 40, 46, 0.05)', borderRadius: '8px', border: '1px solid rgba(35, 40, 46, 0.05)', marginBottom: '24px' }}>
            <h4 style={{ color: '#5a6169', marginBottom: '16px', fontSize: '14px' }}>Market Sizing Analysis</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {[
                { label: 'TAM', value: '$15B', desc: 'Total Addressable Market' },
                { label: 'SAM', value: '$5B', desc: 'Serviceable Market' },
                { label: 'SOM', value: '$500M', desc: 'Obtainable Market' }
              ].map((metric, i) => (
                <div key={i} style={{ padding: '12px', background: 'rgba(35, 40, 46, 0.05)', borderRadius: '6px' }}>
                  <p style={{ color: '#5a6169', fontWeight: '700', marginBottom: '4px' }}>{metric.label}</p>
                  <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#23282e', marginBottom: '4px' }}>{metric.value}</p>
                  <p style={{ color: '#8b9096', fontSize: '11px' }}>{metric.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Trends */}
          <div style={{ padding: '20px', background: 'rgba(90, 107, 72, 0.10)', borderRadius: '8px', border: '1px solid rgba(90, 107, 72, 0.10)' }}>
            <h4 style={{ color: '#5A6B48', marginBottom: '12px', fontSize: '14px' }}>Key Market Trends</h4>
            <div style={{ display: 'grid', gap: '8px' }}>
              {['Mobile-first adoption', 'FinTech growth', 'E-commerce expansion', 'Digital payments boom'].map((trend, i) => (
                <div key={i} style={{ padding: '10px', background: 'rgba(90, 107, 72, 0.10)', borderRadius: '4px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ color: '#5A6B48', fontWeight: 'bold' }}></span>
                  <span style={{ color: '#5a6169', fontSize: '13px' }}>{trend}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Competitors Tab */}
      {activeTab === 'competitors' && (
        <div>
          <h3 style={{ color: '#23282e', marginBottom: '20px', fontSize: '16px' }}>Competitive Landscape</h3>

          {/* Market Consolidation */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Competitors', value: '3', icon: '' },
              { label: 'Market Concentration', value: '85%', icon: '' },
              { label: 'Status', value: 'Consolidated', icon: '' }
            ].map((metric, i) => (
              <div key={i} style={{ padding: '16px', background: 'rgba(35, 40, 46, 0.05)', borderRadius: '8px', border: '1px solid rgba(35, 40, 46, 0.05)', textAlign: 'center' }}>
                <p style={{ fontSize: '24px', marginBottom: '8px' }}>{metric.icon}</p>
                <p style={{ color: '#8b9096', fontSize: '12px', marginBottom: '4px' }}>{metric.label}</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#5a6169' }}>{metric.value}</p>
              </div>
            ))}
          </div>

          {/* Top Competitors */}
          <h4 style={{ color: '#23282e', marginBottom: '12px', fontSize: '14px' }}>Top 3 Competitors</h4>
          <div style={{ display: 'grid', gap: '12px' }}>
            {[
              { rank: 1, name: 'Foodpanda', share: 35, growth: 22, valuation: 200 },
              { rank: 2, name: 'Uber Eats', share: 25, growth: 18, valuation: 500 },
              { rank: 3, name: 'Local Delivery', share: 20, growth: 15, valuation: 150 }
            ].map((comp, i) => (
              <div key={i} style={{ padding: '16px', background: 'rgba(35, 40, 46, 0.08)', borderRadius: '8px', border: '1px solid rgba(35, 40, 46, 0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <p style={{ color: '#23282e', fontWeight: '600', marginBottom: '4px' }}>#{comp.rank} {comp.name}</p>
                    <p style={{ color: '#8b9096', fontSize: '12px' }}>Market: {comp.share}% | Growth: {comp.growth}%/yr</p>
                  </div>
                  <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#5A6B48' }}>${comp.valuation}M</p>
                </div>

                {/* Market Share Bar */}
                <div style={{ height: '6px', background: 'rgba(0, 0, 0, 0)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: `linear-gradient(90deg, #5A6B48, #5a6169)`, width: `${comp.share}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Benchmarks Tab */}
      {activeTab === 'benchmarks' && (
        <div>
          <h3 style={{ color: '#23282e', marginBottom: '20px', fontSize: '16px' }}>Industry Benchmarks vs Your Metrics</h3>

          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { metric: 'CAC (Customer Acquisition Cost)', your: 2500, benchmark: 1500, unit: '৳' },
              { metric: 'LTV (Lifetime Value)', your: 45000, benchmark: 45000, unit: '৳' },
              { metric: 'Churn Rate', your: 4.5, benchmark: 5.0, unit: '%' },
              { metric: 'Gross Margin', your: 72, benchmark: 75, unit: '%' },
              { metric: 'Growth Rate', your: 110, benchmark: 120, unit: '%' }
            ].map((item, i) => {
              const performance = item.your <= item.benchmark ? 'Above Target' : 'Below Target';
              const color = item.metric.includes('Churn') ? (item.your < item.benchmark ? '#5A6B48' : '#9C6B1F') : (item.your > item.benchmark ? '#5A6B48' : '#9C6B1F');

              return (
                <div key={i} style={{ padding: '16px', background: 'rgba(35, 40, 46, 0.05)', borderRadius: '8px', border: '1px solid rgba(35, 40, 46, 0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <p style={{ color: '#23282e', fontWeight: '600' }}>{item.metric}</p>
                    <span style={{ padding: '4px 12px', background: color + '33', color: color, borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
                      {performance}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <p style={{ color: '#8b9096', fontSize: '11px', marginBottom: '4px' }}>Your Value</p>
                      <p style={{ fontSize: '18px', fontWeight: 'bold', color: color }}>{item.your}{item.unit}</p>
                    </div>
                    <div>
                      <p style={{ color: '#8b9096', fontSize: '11px', marginBottom: '4px' }}>Benchmark Median</p>
                      <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#5a6169' }}>{item.benchmark}{item.unit}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recommendations */}
          <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(156, 107, 31, 0.10)', borderRadius: '8px', border: '1px solid rgba(156, 107, 31, 0.10)' }}>
            <h4 style={{ color: '#9C6B1F', marginBottom: '12px', fontSize: '14px' }}>Recommendations</h4>
            <ul style={{ color: '#5a6169', fontSize: '13px', lineHeight: '1.8', margin: 0, paddingLeft: '20px' }}>
              <li>CAC is slightly above benchmark - optimize marketing spend</li>
              <li>LTV is on track - maintain retention strategy</li>
              <li>Churn is below target - keep current customer success efforts</li>
              <li>Gross margin needs 3% improvement - review cost structure</li>
            </ul>
          </div>
        </div>
      )}

      {/* Trends Tab */}
      {activeTab === 'trends' && (
        <div>
          <h3 style={{ color: '#23282e', marginBottom: '20px', fontSize: '16px' }}>Market Trends & SWOT Evolution</h3>

          {/* Trend Chart */}
          <div style={{ padding: '20px', background: 'rgba(90, 107, 72, 0.10)', borderRadius: '8px', border: '1px solid rgba(90, 107, 72, 0.10)', marginBottom: '24px' }}>
            <h4 style={{ color: '#5A6B48', marginBottom: '16px', fontSize: '14px' }}>Market Share Trend (Last 12 Months)</h4>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '150px', padding: '20px 0' }}>
              {[15, 18, 20, 22, 24, 26, 28, 30, 32, 33, 34, 35].map((height, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${height}%`,
                    background: 'linear-gradient(180deg, #5A6B48 0%, #5A6B48 100%)',
                    borderRadius: '4px',
                    position: 'relative'
                  }}
                  title={`${height}%`}
                />
              ))}
            </div>
            <p style={{ color: '#8b9096', fontSize: '12px', marginTop: '12px' }}>Showing steady growth from 15% to 35% market share</p>
          </div>

          {/* Market Position Evolution */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              { period: 'Quarter 1', rank: 5, status: 'Emerging' },
              { period: 'Quarter 2', rank: 4, status: 'Growing' },
              { period: 'Quarter 3', rank: 3, status: 'Established' }
            ].map((period, i) => (
              <div key={i} style={{ padding: '12px', background: 'rgba(35, 40, 46, 0.05)', borderRadius: '6px', textAlign: 'center' }}>
                <p style={{ color: '#8b9096', fontSize: '11px', marginBottom: '4px' }}>{period.period}</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#5a6169', marginBottom: '4px' }}>Rank #{period.rank}</p>
                <p style={{ color: '#5A6B48', fontSize: '12px', fontWeight: '600' }}>{period.status}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div>
          <h3 style={{ color: '#23282e', marginBottom: '20px', fontSize: '16px' }}>Market News & Alerts</h3>

          <div style={{ display: 'grid', gap: '12px' }}>
            {[
              { impact: 'High', headline: 'New regulatory framework for food delivery', source: 'Business Insider', date: '2 days ago' },
              { impact: 'Medium', headline: 'Competitor launches same-day delivery in Dhaka', source: 'DhakaTribune', date: '5 days ago' },
              { impact: 'High', headline: 'Bangladesh GDP growth accelerates to 7.5%', source: 'World Bank', date: '1 week ago' },
              { impact: 'Low', headline: 'New payment gateway launched', source: 'TechCrunch Asia', date: '2 weeks ago' }
            ].map((alert, i) => (
              <div key={i} style={{ padding: '16px', background: alert.impact === 'High' ? 'rgba(156, 107, 31, 0.10)' : alert.impact === 'Medium' ? 'rgba(156, 107, 31, 0.10)' : 'rgba(90, 107, 72, 0.10)', borderRadius: '8px', border: `1px solid ${alert.impact === 'High' ? 'rgba(156, 107, 31, 0.10)' : alert.impact === 'Medium' ? 'rgba(156, 107, 31, 0.10)' : 'rgba(90, 107, 72, 0.10)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <p style={{ color: '#23282e', fontWeight: '600', flex: 1 }}>{alert.headline}</p>
                  <span style={{ padding: '4px 12px', background: alert.impact === 'High' ? '#9C6B1F' : alert.impact === 'Medium' ? '#9C6B1F' : '#5A6B48', color: '#23282e', borderRadius: '4px', fontSize: '11px', fontWeight: '600', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                    {alert.impact}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8b9096', fontSize: '11px' }}>
                  <p>{alert.source}</p>
                  <p>{alert.date}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Alert Settings */}
          <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(35, 40, 46, 0.05)', borderRadius: '8px', border: '1px solid rgba(35, 40, 46, 0.05)' }}>
            <h4 style={{ color: '#5a6169', marginBottom: '12px', fontSize: '14px' }}>Alert Preferences</h4>
            <label style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
              <span style={{ color: '#5a6169', fontSize: '13px' }}>High impact alerts</span>
            </label>
            <label style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
              <span style={{ color: '#5a6169', fontSize: '13px' }}>Competitor updates</span>
            </label>
            <label style={{ display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" style={{ cursor: 'pointer' }} />
              <span style={{ color: '#5a6169', fontSize: '13px' }}>Regulatory changes</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketIntelligenceDashboard;
