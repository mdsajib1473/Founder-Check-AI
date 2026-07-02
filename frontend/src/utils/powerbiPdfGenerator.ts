import html2pdf from 'html2pdf.js';

export interface AnalysisData {
  overall_readiness_score: number;
  idea_extraction?: {
    title: string;
    description: string;
    sector: string;
    target_customer: string;
    revenue_model: string;
    location: string;
  };
  demand_analysis?: {
    market_size: string;
    score: number;
    opportunities: string[];
    threats: string[];
  };
  regulatory_analysis?: {
    risk_score: number;
    key_regulators: string[];
    critical_approvals: string;
    estimated_timeline: number;
    cost_estimate: number;
    warnings: string;
  };
  business_canvas?: {
    key_partners: string[];
    key_activities: string[];
    customer_segments: string[];
    channels: string[];
    value_proposition: string;
    revenue_streams: Record<string, any>;
    cost_structure: Record<string, any>;
    customer_relationships: string[];
    key_resources: Record<string, any>;
  };
  competitor_analysis?: {
    direct_competitors: any[];
    market_overview: any;
    threat_level: string;
    competitive_advantage: string;
    market_gaps: string[];
  };
  bangladesh_impact?: {
    impact_score: number;
    market_potential: string;
    localization_recommendations: string[];
  };
  swot_analysis?: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  go_to_market?: {
    phase_1: string;
    phase_2: string;
    phase_3: string;
    customer_acquisition: string;
    pricing_strategy: string;
  };
  risk_assessment?: {
    overall_risk_score: number;
    high_risks: any[];
    medium_risks: any[];
  };
  founder_fit?: {
    fit_score: number;
    required_skills: string[];
    improvement_areas: string[];
  };
}

export const generatePowerBiPDF = (analysis: AnalysisData) => {
  const readinessScore = analysis.overall_readiness_score || 0;
  const marketScore = analysis.demand_analysis?.score || 0;
  const riskScore = analysis.risk_assessment?.overall_risk_score || 0;
  const founderFitScore = analysis.founder_fit?.fit_score || 0;
  const bangladeshScore = analysis.bangladesh_impact?.impact_score || 0;

  // Helper functions for visualization
  const getScoreColor = (score: number) => {
    if (score >= 8) return '#00ff41'; // Green
    if (score >= 6) return '#ffaa00'; // Orange
    return '#ff4444'; // Red
  };

  const getScoreGauge = (score: number, label: string) => `
    <div class="score-gauge">
      <svg viewBox="0 0 120 120" class="gauge-svg">
        <defs>
          <linearGradient id="gaugeGradient${label}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#ff4444;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#ffaa00;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#00ff41;stop-opacity:1" />
          </linearGradient>
        </defs>

        <!-- Background circle -->
        <circle cx="60" cy="60" r="55" fill="none" stroke="#e0e0e0" stroke-width="8"/>

        <!-- Filled arc based on score -->
        <circle cx="60" cy="60" r="55" fill="none"
          stroke="url(#gaugeGradient${label})" stroke-width="8"
          stroke-dasharray="${(score / 10) * 345} 345"
          transform="rotate(-90 60 60)"/>

        <!-- Center circle -->
        <circle cx="60" cy="60" r="35" fill="white"/>

        <!-- Score text -->
        <text x="60" y="65" text-anchor="middle" font-size="24" font-weight="bold" fill="${getScoreColor(score)}">
          ${score.toFixed(1)}
        </text>
        <text x="60" y="82" text-anchor="middle" font-size="10" fill="#666">/10</text>
      </svg>
      <p class="gauge-label">${label}</p>
    </div>
  `;

  const getStatusBadge = (score: number) => {
    if (score >= 8) return { text: '✓ STRONG', color: '#00ff41' };
    if (score >= 6) return { text: '⚠ MODERATE', color: '#ffaa00' };
    return { text: '✗ NEEDS WORK', color: '#ff4444' };
  };

  const status = getStatusBadge(readinessScore);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>FounderCheck Analysis Report</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: 'Segoe UI', 'Microsoft Sans Serif', sans-serif;
          background: #f5f5f5;
          color: #333;
          line-height: 1.5;
        }

        .page {
          width: 210mm;
          height: 297mm;
          margin: 0 auto;
          padding: 0;
          background: white;
          page-break-after: always;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }

        /* COVER PAGE */
        .cover-page {
          background: linear-gradient(135deg, #0f2a47 0%, #1a3a5c 100%);
          color: white;
          padding: 40mm;
          height: 297mm;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .cover-header {
          text-align: center;
        }

        .logo-text {
          font-size: 48px;
          font-weight: 900;
          color: #00ff41;
          margin-bottom: 10px;
        }

        .subtitle-cover {
          font-size: 16px;
          color: #00ffee;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .cover-main {
          text-align: center;
        }

        .startup-title {
          font-size: 48px;
          font-weight: 900;
          margin-bottom: 20px;
          color: white;
          line-height: 1.2;
        }

        .startup-desc {
          font-size: 16px;
          color: #ccc;
          margin-bottom: 40px;
          line-height: 1.6;
        }

        .score-display {
          background: rgba(0, 255, 65, 0.1);
          border: 2px solid #00ff41;
          border-radius: 20px;
          padding: 30px;
          display: inline-block;
          margin-bottom: 40px;
        }

        .score-big {
          font-size: 72px;
          font-weight: 900;
          color: #00ff41;
        }

        .score-status {
          font-size: 18px;
          color: ${status.color};
          margin-top: 10px;
          font-weight: bold;
        }

        .cover-footer {
          text-align: center;
          border-top: 1px solid rgba(255,255,255,0.2);
          padding-top: 20px;
        }

        .footer-text {
          font-size: 12px;
          color: #aaa;
        }

        /* DASHBOARD PAGE */
        .content-page {
          padding: 20mm;
        }

        .page-title {
          font-size: 32px;
          font-weight: 900;
          color: #0f2a47;
          margin-bottom: 25px;
          border-bottom: 3px solid #00ff41;
          padding-bottom: 15px;
        }

        /* KPI CARDS */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-bottom: 30px;
        }

        .kpi-card {
          background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
          border-left: 4px solid #00ff41;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .kpi-label {
          font-size: 11px;
          color: #666;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .kpi-value {
          font-size: 24px;
          font-weight: 900;
          color: #00ff41;
          margin-bottom: 5px;
        }

        .kpi-subtext {
          font-size: 11px;
          color: #999;
        }

        /* GAUGES */
        .gauges-section {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 30px;
          background: #fafafa;
          padding: 20px;
          border-radius: 12px;
        }

        .score-gauge {
          text-align: center;
        }

        .gauge-svg {
          width: 120px;
          height: 120px;
          margin: 0 auto 10px;
        }

        .gauge-label {
          font-size: 12px;
          font-weight: 600;
          color: #333;
          margin: 10px 0 0 0;
        }

        /* METRICS TABLE */
        .metrics-section {
          margin-bottom: 30px;
        }

        .section-title {
          font-size: 16px;
          font-weight: 800;
          color: #0f2a47;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 2px solid #e0e0e0;
        }

        .metrics-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }

        .metrics-table th {
          background: #0f2a47;
          color: white;
          padding: 12px 15px;
          text-align: left;
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .metrics-table td {
          padding: 12px 15px;
          border-bottom: 1px solid #e0e0e0;
          font-size: 12px;
        }

        .metrics-table tbody tr:hover {
          background: #f9f9f9;
        }

        /* RISK MATRIX */
        .risk-matrix {
          background: #fafafa;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .risk-item {
          display: grid;
          grid-template-columns: 1fr 1fr 2fr;
          gap: 15px;
          padding: 15px;
          margin-bottom: 10px;
          background: white;
          border-left: 4px solid;
          border-radius: 4px;
        }

        .risk-high { border-left-color: #ff4444; }
        .risk-medium { border-left-color: #ffaa00; }

        .risk-name {
          font-weight: 600;
          font-size: 12px;
          color: #333;
        }

        .risk-level {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .risk-mitigation {
          font-size: 11px;
          color: #666;
        }

        /* SWOT */
        .swot-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-bottom: 20px;
        }

        .swot-box {
          padding: 20px;
          border-radius: 8px;
          background: #fafafa;
        }

        .swot-box.strengths { border-top: 4px solid #00ff41; }
        .swot-box.weaknesses { border-top: 4px solid #ffaa00; }
        .swot-box.opportunities { border-top: 4px solid #2196f3; }
        .swot-box.threats { border-top: 4px solid #ff4444; }

        .swot-box h4 {
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 12px;
          color: #333;
        }

        .swot-item {
          font-size: 11px;
          color: #666;
          margin-bottom: 6px;
          padding-left: 15px;
          position: relative;
        }

        .swot-item:before {
          content: "•";
          position: absolute;
          left: 0;
          font-weight: bold;
        }

        /* COMPETITOR TABLE */
        .competitor-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          font-size: 11px;
        }

        .competitor-table th {
          background: linear-gradient(135deg, #0f2a47 0%, #1a3a5c 100%);
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: 600;
        }

        .competitor-table td {
          padding: 10px 12px;
          border-bottom: 1px solid #e0e0e0;
        }

        .competitor-rank {
          font-weight: 700;
          color: #00ff41;
          font-size: 13px;
        }

        .competitor-share {
          font-weight: 700;
          color: #0f2a47;
        }

        /* TIMELINE */
        .timeline {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-bottom: 20px;
        }

        .timeline-phase {
          background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #00ff41;
          position: relative;
        }

        .phase-number {
          position: absolute;
          top: -10px;
          left: 15px;
          background: #00ff41;
          color: #0f2a47;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 14px;
        }

        .phase-title {
          font-weight: 700;
          font-size: 13px;
          color: #0f2a47;
          margin-bottom: 8px;
          margin-top: 10px;
        }

        .phase-desc {
          font-size: 11px;
          color: #666;
          line-height: 1.5;
        }

        /* PAGE BREAK */
        .page-break {
          page-break-after: always;
          margin: 0;
          padding: 0;
        }

        /* FOOTER */
        .report-footer {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #e0e0e0;
          text-align: center;
          font-size: 10px;
          color: #999;
        }

        /* PRINT STYLES */
        @media print {
          body { background: white; }
          .page { box-shadow: none; margin: 0; }
        }
      </style>
    </head>
    <body>
      <!-- COVER PAGE -->
      <div class="page cover-page">
        <div class="cover-header">
          <div class="logo-text">🚀 FounderCheck</div>
          <div class="subtitle-cover">Analysis Report</div>
        </div>

        <div class="cover-main">
          <h1 class="startup-title">${analysis.idea_extraction?.title || 'Startup Analysis'}</h1>
          <p class="startup-desc">${analysis.idea_extraction?.description || ''}</p>

          <div class="score-display">
            <div class="score-big">${readinessScore.toFixed(1)}</div>
            <div style="font-size: 14px; color: #ccc; margin-top: 5px;">/ 10</div>
            <div class="score-status">${status.text}</div>
          </div>
        </div>

        <div class="cover-footer">
          <div class="footer-text">Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <div class="footer-text">FounderCheck - AI-Powered Startup Validator</div>
        </div>
      </div>

      <div class="page content-page">
        <h1 class="page-title">📊 Executive Dashboard</h1>

        <!-- KPI GRID -->
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-label">Readiness Score</div>
            <div class="kpi-value">${readinessScore.toFixed(1)}</div>
            <div class="kpi-subtext">${status.text}</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-label">Market Score</div>
            <div class="kpi-value">${marketScore.toFixed(1)}</div>
            <div class="kpi-subtext">Demand Level</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-label">Risk Score</div>
            <div class="kpi-value">${riskScore.toFixed(1)}</div>
            <div class="kpi-subtext">Assessment</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-label">Founder Fit</div>
            <div class="kpi-value">${founderFitScore.toFixed(1)}</div>
            <div class="kpi-subtext">Capability</div>
          </div>
        </div>

        <!-- GAUGE VISUALIZATION -->
        <div class="gauges-section">
          ${getScoreGauge(readinessScore, 'Readiness')}
          ${getScoreGauge(marketScore, 'Market')}
          ${getScoreGauge(riskScore, 'Risk')}
          ${getScoreGauge(bangladeshScore, 'Bangladesh')}
        </div>

        <div class="report-footer">
          Page 1 of Report
        </div>
      </div>

      <!-- PAGE 2: MARKET ANALYSIS -->
      <div class="page content-page">
        <h1 class="page-title">📈 Market & Regulatory Analysis</h1>

        <div class="metrics-section">
          <h3 class="section-title">Market Overview</h3>
          <table class="metrics-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
                <th>Assessment</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Market Size</td>
                <td style="font-weight: 600; color: #00ff41;">${analysis.demand_analysis?.market_size || 'N/A'}</td>
                <td>${marketScore >= 7 ? '✓ Strong Opportunity' : marketScore >= 5 ? '⚠ Moderate' : '✗ Limited'}</td>
              </tr>
              <tr>
                <td>Sector</td>
                <td style="font-weight: 600;">${analysis.idea_extraction?.sector || 'N/A'}</td>
                <td>Industry Focus</td>
              </tr>
              <tr>
                <td>Target Customer</td>
                <td style="font-weight: 600;">${analysis.idea_extraction?.target_customer || 'N/A'}</td>
                <td>Primary Segment</td>
              </tr>
              <tr>
                <td>Regulatory Risk</td>
                <td style="font-weight: 600; color: ${riskScore >= 7 ? '#ff4444' : riskScore >= 5 ? '#ffaa00' : '#00ff41'};">
                  ${riskScore.toFixed(1)}/10
                </td>
                <td>${riskScore >= 7 ? '⚠ High Risk' : riskScore >= 5 ? '⚠ Moderate' : '✓ Low Risk'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="metrics-section">
          <h3 class="section-title">Key Opportunities</h3>
          <table class="metrics-table">
            <tbody>
              ${(analysis.demand_analysis?.opportunities || []).slice(0, 4).map((opp: string) => `
                <tr>
                  <td colspan="3"><span style="color: #00ff41; font-weight: 600;">✓</span> ${opp}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="metrics-section">
          <h3 class="section-title">Key Threats</h3>
          <table class="metrics-table">
            <tbody>
              ${(analysis.demand_analysis?.threats || []).slice(0, 4).map((threat: string) => `
                <tr>
                  <td colspan="3"><span style="color: #ff4444; font-weight: 600;">⚠</span> ${threat}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="report-footer">
          Page 2 of Report | Market & Regulatory Analysis
        </div>
      </div>

      <!-- PAGE 3: COMPETITIVE ANALYSIS -->
      <div class="page content-page">
        <h1 class="page-title">🔥 Competitive Landscape</h1>

        <div class="metrics-section">
          <h3 class="section-title">Competitive Positioning</h3>
          <table class="competitor-table">
            <thead>
              <tr>
                <th style="width: 10%;">Rank</th>
                <th style="width: 25%;">Company</th>
                <th style="width: 15%;">Market Share</th>
                <th style="width: 50%;">Impact</th>
              </tr>
            </thead>
            <tbody>
              ${(analysis.competitor_analysis?.direct_competitors || []).slice(0, 5).map((c: any) => `
                <tr>
                  <td><span class="competitor-rank">#${c.rank}</span></td>
                  <td style="font-weight: 600;">${c.name}</td>
                  <td><span class="competitor-share">${c.market_share_display}</span></td>
                  <td>${c.impact}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="metrics-section">
          <h3 class="section-title">Strategic Position</h3>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #00ff41;">
            <p style="font-size: 12px; color: #333; margin-bottom: 10px;">
              <strong>Advantage:</strong> ${analysis.competitor_analysis?.competitive_advantage || 'N/A'}
            </p>
            <p style="font-size: 12px; color: #666;">
              <strong>Market Gaps:</strong> ${(analysis.competitor_analysis?.market_gaps || []).join(', ') || 'N/A'}
            </p>
            <p style="font-size: 12px; color: #666; margin-top: 10px;">
              <strong>Threat Level:</strong>
              <span style="font-weight: 700; color: ${analysis.competitor_analysis?.threat_level === 'HIGH' ? '#ff4444' : '#ffaa00'};">
                ${analysis.competitor_analysis?.threat_level}
              </span>
            </p>
          </div>
        </div>

        <div class="report-footer">
          Page 3 of Report | Competitive Analysis
        </div>
      </div>

      <!-- PAGE 4: SWOT & GTM -->
      <div class="page content-page">
        <h1 class="page-title">🎯 SWOT & Go-to-Market Strategy</h1>

        <h3 class="section-title" style="margin-top: 0;">SWOT Analysis</h3>
        <div class="swot-grid">
          <div class="swot-box strengths">
            <h4 style="color: #00ff41;">💪 Strengths</h4>
            ${(analysis.swot_analysis?.strengths || []).map((s: string) => `
              <div class="swot-item">${s}</div>
            `).join('')}
          </div>

          <div class="swot-box weaknesses">
            <h4 style="color: #ffaa00;">⚠️ Weaknesses</h4>
            ${(analysis.swot_analysis?.weaknesses || []).map((w: string) => `
              <div class="swot-item">${w}</div>
            `).join('')}
          </div>

          <div class="swot-box opportunities">
            <h4 style="color: #2196f3;">🎯 Opportunities</h4>
            ${(analysis.swot_analysis?.opportunities || []).map((o: string) => `
              <div class="swot-item">${o}</div>
            `).join('')}
          </div>

          <div class="swot-box threats">
            <h4 style="color: #ff4444;">🔥 Threats</h4>
            ${(analysis.swot_analysis?.threats || []).map((t: string) => `
              <div class="swot-item">${t}</div>
            `).join('')}
          </div>
        </div>

        <h3 class="section-title">Go-to-Market Roadmap</h3>
        <div class="timeline">
          <div class="timeline-phase">
            <div class="phase-number">1</div>
            <div class="phase-title">🚀 Launch (30 Days)</div>
            <div class="phase-desc">${analysis.go_to_market?.phase_1 || 'N/A'}</div>
          </div>

          <div class="timeline-phase" style="border-left-color: #ffaa00;">
            <div class="phase-number" style="background: #ffaa00;">2</div>
            <div class="phase-title">📈 Growth (60 Days)</div>
            <div class="phase-desc">${analysis.go_to_market?.phase_2 || 'N/A'}</div>
          </div>

          <div class="timeline-phase" style="border-left-color: #2196f3;">
            <div class="phase-number" style="background: #2196f3;">3</div>
            <div class="phase-title">📊 Scale (90 Days)</div>
            <div class="phase-desc">${analysis.go_to_market?.phase_3 || 'N/A'}</div>
          </div>
        </div>

        <div class="report-footer">
          Page 4 of Report | SWOT & Go-to-Market
        </div>
      </div>

      <!-- PAGE 5: RISKS & FOUNDER FIT -->
      <div class="page content-page">
        <h1 class="page-title">⚠️ Risk Assessment & Team Fit</h1>

        <div class="metrics-section">
          <h3 class="section-title">Critical Risks</h3>
          <div class="risk-matrix">
            <h4 style="margin-bottom: 15px; color: #0f2a47;">High Priority Risks</h4>
            ${(analysis.risk_assessment?.high_risks || []).slice(0, 3).map((r: any) => `
              <div class="risk-item risk-high">
                <div class="risk-name">${r.risk}</div>
                <div class="risk-level" style="color: #ff4444;">📊 ${r.probability}</div>
                <div class="risk-mitigation">✓ ${r.mitigation}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="metrics-section">
          <h3 class="section-title">Founder-Market Fit</h3>
          <div style="background: linear-gradient(135deg, #f9f9f9 0%, #ffffff 100%); padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3;">
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
              <div>
                <p style="font-size: 11px; color: #999; text-transform: uppercase; font-weight: 600; margin-bottom: 8px;">Fit Score</p>
                <p style="font-size: 28px; font-weight: 900; color: #2196f3;">${founderFitScore.toFixed(1)}/10</p>
              </div>
              <div>
                <p style="font-size: 11px; color: #999; text-transform: uppercase; font-weight: 600; margin-bottom: 8px;">Readiness</p>
                <p style="font-size: 28px; font-weight: 900; color: #00ff41;">
                  ${founderFitScore >= 7 ? '✓ Ready' : founderFitScore >= 5 ? '⚠ Developing' : '✗ Build Skills'}
                </p>
              </div>
            </div>

            <h4 style="margin-top: 20px; margin-bottom: 10px; color: #0f2a47; font-size: 13px;">Required Skills</h4>
            ${(analysis.founder_fit?.required_skills || []).map((skill: string) => `
              <p style="font-size: 11px; color: #666; margin-bottom: 5px; padding-left: 15px; position: relative;">
                <span style="position: absolute; left: 0; color: #2196f3; font-weight: bold;">→</span> ${skill}
              </p>
            `).join('')}
          </div>
        </div>

        <div class="report-footer">
          Page 5 of Report | Risk Assessment & Team Fit
        </div>
      </div>

      <!-- PAGE 6: BANGLADESH MARKET -->
      <div class="page content-page">
        <h1 class="page-title">🇧🇩 Bangladesh Market Impact</h1>

        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-label">Impact Score</div>
            <div class="kpi-value">${bangladeshScore.toFixed(1)}</div>
            <div class="kpi-subtext">Market Potential</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-label">Localization</div>
            <div class="kpi-value">${(analysis.bangladesh_impact?.localization_recommendations || []).length}</div>
            <div class="kpi-subtext">Recommendations</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-label">Market Ready</div>
            <div class="kpi-value">${bangladeshScore >= 7 ? '✓' : '⚠'}</div>
            <div class="kpi-subtext">Assessment</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-label">Region</div>
            <div class="kpi-value">${analysis.idea_extraction?.location || 'N/A'}</div>
            <div class="kpi-subtext">Location</div>
          </div>
        </div>

        <div class="metrics-section">
          <h3 class="section-title">Market Opportunity</h3>
          <p style="font-size: 12px; color: #666; line-height: 1.6; background: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #00ff41;">
            ${analysis.bangladesh_impact?.market_potential || 'N/A'}
          </p>
        </div>

        <div class="metrics-section">
          <h3 class="section-title">Localization Strategy</h3>
          <table class="metrics-table">
            <tbody>
              ${(analysis.bangladesh_impact?.localization_recommendations || []).map((rec: string) => `
                <tr>
                  <td style="padding: 10px 15px;"><span style="color: #00ff41; font-weight: 600;">✓</span> ${rec}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="report-footer">
          Page 6 of Report | Bangladesh Market Impact
        </div>
      </div>

    </body>
    </html>
  `;

  const options = {
    margin: 0,
    filename: `${analysis.idea_extraction?.title?.replace(/\s+/g, '-') || 'analysis'}-report-${new Date().getTime()}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { orientation: 'portrait' as const, unit: 'mm', format: 'a4' }
  } as any;

  html2pdf().set(options).from(htmlContent).save();
};
