import { useState } from 'react';

const LocalizationDashboard = () => {
  const [activeTab, setActiveTab] = useState<'languages' | 'regions' | 'compliance'>('languages');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedRegion, setSelectedRegion] = useState('bd');

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
          { key: 'languages', label: 'Languages' },
          { key: 'regions', label: 'Regional Markets' },
          { key: 'compliance', label: 'Local Compliance' }
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

      {activeTab === 'languages' && (
        <div>
          <h3 style={{ color: '#5A6B48', marginTop: 0 }}>Multi-Language Support</h3>

          <div style={{
            backgroundColor: 'rgba(90, 107, 72, 0.10)',
            border: '1px solid rgba(90, 107, 72, 0.10)',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#5A6B48' }}>Current Language: {selectedLanguage.toUpperCase()}</h4>
                <p style={{ margin: 0, color: '#8b9096', fontSize: '0.9rem' }}>
                  Switch between languages instantly
                </p>
              </div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {[
              { code: 'en', name: 'English', native: 'English' },
              { code: 'bn', name: 'Bengali', native: 'বাংলা' },
              { code: 'hi', name: 'Hindi', native: 'हिन्दी' }
            ].map((lang, i) => (
              <div
                key={i}
                onClick={() => setSelectedLanguage(lang.code)}
                style={{
                  backgroundColor: selectedLanguage === lang.code ? 'rgba(90, 107, 72, 0.10)' : 'rgba(0, 0, 0, 0)',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: selectedLanguage === lang.code ? '2px solid #5a6169' : '1px solid rgba(90, 107, 72, 0.10)',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}></div>
                <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#5a6169' }}>{lang.name}</div>
                <div style={{ fontSize: '0.9rem', color: '#8b9096', marginTop: '0.25rem' }}>{lang.native}</div>
              </div>
            ))}
          </div>

          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0)',
            padding: '1.5rem',
            borderRadius: '8px'
          }}>
            <h4 style={{ color: '#5a6169', marginTop: 0 }}>Language Features</h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#8b9096', lineHeight: '1.8' }}>
              <li>Complete UI localization</li>
              <li>Right-to-left text support (Hindi, Bengali)</li>
              <li>Localized number & date formats</li>
              <li>Regional market terminology</li>
              <li>Instant language switching</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'regions' && (
        <div>
          <h3 style={{ color: '#5A6B48', marginTop: 0 }}>Regional Market Expansion</h3>

          <div style={{
            backgroundColor: 'rgba(90, 107, 72, 0.10)',
            border: '1px solid rgba(90, 107, 72, 0.10)',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '2rem'
          }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#5A6B48' }}>Current Region: {selectedRegion.toUpperCase()}</h4>
            <p style={{ margin: 0, color: '#8b9096', fontSize: '0.9rem' }}>
              Market data customized for your region
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {[
              { code: 'bd', name: 'Bangladesh', flag: '', size: '$2.5B', growth: '25-30%' },
              { code: 'in', name: 'India', flag: '', size: '$40B+', growth: '20-25%' },
              { code: 'pk', name: 'Pakistan', flag: '', size: '$1.2B', growth: '18-22%' },
              { code: 'sea', name: 'Southeast Asia', flag: '', size: '$50B+', growth: '15-20%' }
            ].map((region, i) => (
              <div
                key={i}
                onClick={() => setSelectedRegion(region.code)}
                style={{
                  backgroundColor: selectedRegion === region.code ? 'rgba(90, 107, 72, 0.10)' : 'rgba(0, 0, 0, 0)',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: selectedRegion === region.code ? '2px solid #5a6169' : '1px solid rgba(90, 107, 72, 0.10)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{region.flag}</span>
                  <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#5a6169' }}>{region.name}</div>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#8b9096' }}>
                  <div>Market: {region.size}</div>
                  <div>Growth: {region.growth}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem'
          }}>
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0)',
              padding: '1rem',
              borderRadius: '8px'
            }}>
              <h4 style={{ color: '#5a6169', marginTop: 0, fontSize: '0.9rem' }}>Key Industries</h4>
              {selectedRegion === 'bd' && <div style={{ fontSize: '0.85rem', color: '#8b9096' }}>Tech, E-commerce, FinTech</div>}
              {selectedRegion === 'in' && <div style={{ fontSize: '0.85rem', color: '#8b9096' }}>SaaS, EdTech, FinTech</div>}
              {selectedRegion === 'pk' && <div style={{ fontSize: '0.85rem', color: '#8b9096' }}>IT Services, FinTech, Logistics</div>}
              {selectedRegion === 'sea' && <div style={{ fontSize: '0.85rem', color: '#8b9096' }}>E-commerce, Logistics, Travel</div>}
            </div>

            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0)',
              padding: '1rem',
              borderRadius: '8px'
            }}>
              <h4 style={{ color: '#5a6169', marginTop: 0, fontSize: '0.9rem' }}>Compliance Framework</h4>
              {selectedRegion === 'bd' && <div style={{ fontSize: '0.85rem', color: '#8b9096' }}>BIDA, Data Protection Act</div>}
              {selectedRegion === 'in' && <div style={{ fontSize: '0.85rem', color: '#8b9096' }}>SPICE, GST, Data Localization</div>}
              {selectedRegion === 'pk' && <div style={{ fontSize: '0.85rem', color: '#8b9096' }}>Cyber Crime Act, SECP Rules</div>}
              {selectedRegion === 'sea' && <div style={{ fontSize: '0.85rem', color: '#8b9096' }}>ASEAN Standards, Data Residency</div>}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'compliance' && (
        <div>
          <h3 style={{ color: '#5A6B48', marginTop: 0 }}>Local Compliance Checklist</h3>

          <div style={{
            backgroundColor: 'rgba(90, 107, 72, 0.10)',
            border: '1px solid rgba(90, 107, 72, 0.10)',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '2rem'
          }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#5A6B48' }}>
              {selectedRegion === 'bd' && 'Bangladesh Compliance'}
              {selectedRegion === 'in' && 'India Compliance'}
              {selectedRegion === 'pk' && 'Pakistan Compliance'}
              {selectedRegion === 'sea' && 'Southeast Asia Compliance'}
            </h4>
            <p style={{ margin: 0, color: '#8b9096', fontSize: '0.9rem' }}>
              Estimated timeline: 6-12 weeks | Cost: Varies by region
            </p>
          </div>

          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            {selectedRegion === 'bd' && (
              <div>
                {[
                  'BIDA Investment Registration',
                  'Company Registration (RJSC)',
                  'Tax Identification Number (TIN)',
                  'Bank Account Opening',
                  'Data Protection Compliance',
                  'E-commerce License (if applicable)'
                ].map((item, i) => (
                  <div key={i} style={{
                    padding: '1rem',
                    borderBottom: i < 5 ? '1px solid rgba(90, 107, 72, 0.10)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <input type="checkbox" defaultChecked={false} style={{ cursor: 'pointer', width: '1.2rem', height: '1.2rem' }} />
                    <span style={{ color: '#8b9096' }}>{item}</span>
                  </div>
                ))}
              </div>
            )}
            {selectedRegion === 'in' && (
              <div>
                {[
                  'PAN & GST Registration',
                  'Company Registration (MCA)',
                  'Bank Account & MSME Registration',
                  'Data Localization Compliance',
                  'Startup India Recognition',
                  'Sector-specific licenses'
                ].map((item, i) => (
                  <div key={i} style={{
                    padding: '1rem',
                    borderBottom: i < 5 ? '1px solid rgba(90, 107, 72, 0.10)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <input type="checkbox" defaultChecked={false} style={{ cursor: 'pointer', width: '1.2rem', height: '1.2rem' }} />
                    <span style={{ color: '#8b9096' }}>{item}</span>
                  </div>
                ))}
              </div>
            )}
            {selectedRegion === 'pk' && (
              <div>
                {[
                  'SECP Registration',
                  'NTN & Sales Tax Registration',
                  'Bank Account Opening',
                  'Cyber Crime Act Compliance',
                  'Pakistan Stock Exchange (if applicable)',
                  'Authority approvals by sector'
                ].map((item, i) => (
                  <div key={i} style={{
                    padding: '1rem',
                    borderBottom: i < 5 ? '1px solid rgba(90, 107, 72, 0.10)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <input type="checkbox" defaultChecked={false} style={{ cursor: 'pointer', width: '1.2rem', height: '1.2rem' }} />
                    <span style={{ color: '#8b9096' }}>{item}</span>
                  </div>
                ))}
              </div>
            )}
            {selectedRegion === 'sea' && (
              <div>
                {[
                  'Country-specific registration',
                  'Tax & GST compliance',
                  'Data protection registration',
                  'E-commerce license',
                  'Industry-specific permits',
                  'International compliance'
                ].map((item, i) => (
                  <div key={i} style={{
                    padding: '1rem',
                    borderBottom: i < 5 ? '1px solid rgba(90, 107, 72, 0.10)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <input type="checkbox" defaultChecked={false} style={{ cursor: 'pointer', width: '1.2rem', height: '1.2rem' }} />
                    <span style={{ color: '#8b9096' }}>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalizationDashboard;
