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
  business_canvas?: any;
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
  go_to_market?: any;
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

export const generateEnhancedPDF = (analysis: AnalysisData) => {
  // Safe data extraction with fallbacks
  const readinessScore = analysis.overall_readiness_score ?? 5;
  const marketScore = analysis.demand_analysis?.score ?? 5;
  const riskScore = analysis.risk_assessment?.overall_risk_score ?? 5;
  const founderFitScore = analysis.founder_fit?.fit_score ?? 5;
  const bangladeshScore = analysis.bangladesh_impact?.impact_score ?? 5;

  // Helper to get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 8) return '#00ff41';
    if (score >= 6) return '#ffaa00';
    return '#ff4444';
  };

  // Helper to get status text
  const getStatusText = (score: number) => {
    if (score >= 8) return '✓ STRONG';
    if (score >= 6) return '⚠ MODERATE';
    return '✗ NEEDS WORK';
  };

  // Generate bar chart for market share
  const generateMarketShareChart = () => {
    const competitors = analysis.competitor_analysis?.direct_competitors?.slice(0, 5) || [];
    if (competitors.length === 0) return '';

    return competitors.map((c: any, i: number) => {
      const share = parseInt(c.market_share) || 20;
      const colors = ['#2196f3', '#ff9800', '#4caf50', '#f44336', '#9c27b0'];
      return `
        <div style="margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 11px; font-weight: 600; color: #333;">
              ${i + 1}. ${c.name}
            </span>
            <span style="font-size: 11px; font-weight: 700; color: ${colors[i]};">
              ${c.market_share_display}
            </span>
          </div>
          <div style="height: 6px; background: #e0e0e0; border-radius: 3px; overflow: hidden;">
            <div style="height: 100%; background: ${colors[i]}; width: ${share}%; transition: width 0.3s;"></div>
          </div>
        </div>
      `;
    }).join('');
  };

  // Generate SWOT details
  const generateSWOTDetails = () => {
    const swot = analysis.swot_analysis || { strengths: [], weaknesses: [], opportunities: [], threats: [] };

    return `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
        <div style="padding: 15px; background: rgba(0, 255, 65, 0.08); border-left: 3px solid #00ff41; border-radius: 6px;">
          <h5 style="color: #00ff41; margin: 0 0 10px 0; font-size: 12px; font-weight: 700;">💪 STRENGTHS (${swot.strengths?.length || 0})</h5>
          ${(swot.strengths || []).map((s: string) => `
            <p style="font-size: 11px; color: #333; margin: 6px 0; padding-left: 15px; position: relative;">
              <span style="position: absolute; left: 0; color: #00ff41; font-weight: bold;">✓</span> ${s}
            </p>
          `).join('')}
        </div>

        <div style="padding: 15px; background: rgba(255, 170, 0, 0.08); border-left: 3px solid #ffaa00; border-radius: 6px;">
          <h5 style="color: #ffaa00; margin: 0 0 10px 0; font-size: 12px; font-weight: 700;">⚠️ WEAKNESSES (${swot.weaknesses?.length || 0})</h5>
          ${(swot.weaknesses || []).map((w: string) => `
            <p style="font-size: 11px; color: #333; margin: 6px 0; padding-left: 15px; position: relative;">
              <span style="position: absolute; left: 0; color: #ffaa00; font-weight: bold;">⚠</span> ${w}
            </p>
          `).join('')}
        </div>

        <div style="padding: 15px; background: rgba(33, 150, 243, 0.08); border-left: 3px solid #2196f3; border-radius: 6px;">
          <h5 style="color: #2196f3; margin: 0 0 10px 0; font-size: 12px; font-weight: 700;">🎯 OPPORTUNITIES (${swot.opportunities?.length || 0})</h5>
          ${(swot.opportunities || []).map((o: string) => `
            <p style="font-size: 11px; color: #333; margin: 6px 0; padding-left: 15px; position: relative;">
              <span style="position: absolute; left: 0; color: #2196f3; font-weight: bold;">→</span> ${o}
            </p>
          `).join('')}
        </div>

        <div style="padding: 15px; background: rgba(244, 67, 54, 0.08); border-left: 3px solid #f44336; border-radius: 6px;">
          <h5 style="color: #f44336; margin: 0 0 10px 0; font-size: 12px; font-weight: 700;">🔥 THREATS (${swot.threats?.length || 0})</h5>
          ${(swot.threats || []).map((t: string) => `
            <p style="font-size: 11px; color: #333; margin: 6px 0; padding-left: 15px; position: relative;">
              <span style="position: absolute; left: 0; color: #f44336; font-weight: bold;">⚡</span> ${t}
            </p>
          `).join('')}
        </div>
      </div>
    `;
  };

  // Generate skills progress bars
  const generateSkillsBars = () => {
    const skills = analysis.founder_fit?.required_skills || [];
    if (skills.length === 0) return '';

    return skills.map((skill: string, i: number) => {
      const proficiencies = [70, 60, 50, 45];
      const prof = proficiencies[i] || 40;
      return `
        <div style="margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span style="font-size: 11px; font-weight: 600; color: #333;">📌 ${skill}</span>
            <span style="font-size: 10px; color: #999;">${prof}%</span>
          </div>
          <div style="height: 5px; background: #e0e0e0; border-radius: 3px; overflow: hidden;">
            <div style="height: 100%; background: linear-gradient(90deg, #2196f3, #00ff41); width: ${prof}%;"></div>
          </div>
        </div>
      `;
    }).join('');
  };

  // Generate competitor table
  const generateCompetitorTable = () => {
    const competitors = analysis.competitor_analysis?.direct_competitors?.slice(0, 5) || [];
    if (competitors.length === 0) return '';

    return `
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 10px;">
        <thead>
          <tr style="background: linear-gradient(135deg, #0f2a47 0%, #1a3a5c 100%); color: white;">
            <th style="padding: 8px; text-align: left; font-weight: 600;">Rank</th>
            <th style="padding: 8px; text-align: left; font-weight: 600;">Company</th>
            <th style="padding: 8px; text-align: center; font-weight: 600;">Market Share</th>
            <th style="padding: 8px; text-align: right; font-weight: 600;">Revenue</th>
            <th style="padding: 8px; text-align: right; font-weight: 600;">Users</th>
          </tr>
        </thead>
        <tbody>
          ${competitors.map((c: any, i: number) => `
            <tr style="border-bottom: 1px solid #e0e0e0; background: ${i % 2 === 0 ? '#f9f9f9' : 'white'};">
              <td style="padding: 8px; color: #00ff41; font-weight: 700;">#${c.rank}</td>
              <td style="padding: 8px; font-weight: 600; color: #0f2a47;">${c.name}</td>
              <td style="padding: 8px; text-align: center; font-weight: 700; color: #2196f3;">${c.market_share_display}</td>
              <td style="padding: 8px; text-align: right; color: #666;">${c.estimated_revenue || 'N/A'}</td>
              <td style="padding: 8px; text-align: right; color: #666;">${c.users || 'N/A'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', sans-serif;
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
        }
        .content-page { padding: 20mm; }
        .cover-page {
          background: linear-gradient(135deg, #0f2a47 0%, #1a3a5c 100%);
          color: white;
          padding: 40mm;
          height: 297mm;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .logo-text { font-size: 48px; font-weight: 900; color: #00ff41; margin-bottom: 10px; }
        .subtitle-cover { font-size: 16px; color: #00ffee; letter-spacing: 2px; text-transform: uppercase; }
        .startup-title { font-size: 48px; font-weight: 900; margin-bottom: 20px; color: white; line-height: 1.2; }
        .startup-desc { font-size: 16px; color: #ccc; margin-bottom: 40px; line-height: 1.6; }
        .score-display {
          background: rgba(0, 255, 65, 0.1);
          border: 2px solid #00ff41;
          border-radius: 20px;
          padding: 30px;
          display: inline-block;
          margin-bottom: 40px;
        }
        .score-big { font-size: 72px; font-weight: 900; color: #00ff41; }
        .score-status { font-size: 18px; margin-top: 10px; font-weight: bold; }
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }
        .kpi-card {
          background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
          border-left: 4px solid #00ff41;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .kpi-label { font-size: 10px; color: #666; text-transform: uppercase; font-weight: 600; margin-bottom: 6px; }
        .kpi-value { font-size: 22px; font-weight: 900; color: #00ff41; }
        .kpi-subtext { font-size: 10px; color: #999; margin-top: 4px; }
        .page-title { font-size: 28px; font-weight: 900; color: #0f2a47; margin-bottom: 20px; border-bottom: 3px solid #00ff41; padding-bottom: 12px; }
        .section-title { font-size: 14px; font-weight: 800; color: #0f2a47; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #e0e0e0; }
        .gauge-svg { width: 80px; height: 80px; margin: 0 auto 8px; }
        .gauge-container { text-align: center; flex: 1; }
        .gauges-flex { display: flex; gap: 15px; justify-content: space-around; margin-bottom: 25px; }
        @media print { .page { box-shadow: none; margin: 0; } }
      </style>
    </head>
    <body>
      <!-- COVER PAGE -->
      <div class="page cover-page">
        <div style="text-align: center;">
          <div class="logo-text">🚀 FounderCheck</div>
          <div class="subtitle-cover">Analysis Report</div>
        </div>

        <div style="text-align: center;">
          <h1 class="startup-title">${analysis.idea_extraction?.title || 'Startup Analysis'}</h1>
          <p class="startup-desc">${analysis.idea_extraction?.description || ''}</p>
          <div class="score-display">
            <div class="score-big">${readinessScore.toFixed(1)}</div>
            <div style="font-size: 14px; color: #ccc; margin-top: 5px;">/ 10</div>
            <div class="score-status" style="color: ${getScoreColor(readinessScore)};">${getStatusText(readinessScore)}</div>
          </div>
        </div>

        <div style="text-align: center; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 20px;">
          <div style="font-size: 12px; color: #aaa;">Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <div style="font-size: 12px; color: #aaa;">FounderCheck - AI-Powered Startup Validator</div>
        </div>
      </div>

      <!-- PAGE 2: EXECUTIVE DASHBOARD -->
      <div class="page content-page">
        <h1 class="page-title">📊 Executive Dashboard</h1>

        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-label">Readiness</div>
            <div class="kpi-value">${readinessScore.toFixed(1)}</div>
            <div class="kpi-subtext">${getStatusText(readinessScore)}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Market</div>
            <div class="kpi-value">${marketScore.toFixed(1)}</div>
            <div class="kpi-subtext">Demand Score</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Risk</div>
            <div class="kpi-value">${riskScore.toFixed(1)}</div>
            <div class="kpi-subtext">Assessment</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Founder Fit</div>
            <div class="kpi-value">${founderFitScore.toFixed(1)}</div>
            <div class="kpi-subtext">Capability</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">BD Impact</div>
            <div class="kpi-value">${bangladeshScore.toFixed(1)}</div>
            <div class="kpi-subtext">Market Score</div>
          </div>
        </div>

        <h3 class="section-title">Market Metrics</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px;">
          <thead>
            <tr style="background: #f0f0f0;">
              <th style="padding: 10px; text-align: left; font-weight: 600;">Metric</th>
              <th style="padding: 10px; text-align: left; font-weight: 600;">Value</th>
              <th style="padding: 10px; text-align: left; font-weight: 600;">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 10px;">Market Size</td>
              <td style="padding: 10px; font-weight: 600;">${analysis.demand_analysis?.market_size || 'N/A'}</td>
              <td style="padding: 10px; color: ${marketScore >= 7 ? '#00ff41' : marketScore >= 5 ? '#ffaa00' : '#ff4444'};">
                ${marketScore >= 7 ? '✓ Strong' : marketScore >= 5 ? '⚠ Moderate' : '✗ Limited'}
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #e0e0e0; background: #f9f9f9;">
              <td style="padding: 10px;">Sector</td>
              <td style="padding: 10px; font-weight: 600;">${analysis.idea_extraction?.sector || 'N/A'}</td>
              <td style="padding: 10px;">Industry Focus</td>
            </tr>
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 10px;">Regulatory Risk</td>
              <td style="padding: 10px; font-weight: 600; color: ${getScoreColor(riskScore)};">${riskScore.toFixed(1)}/10</td>
              <td style="padding: 10px; color: ${riskScore >= 7 ? '#ff4444' : riskScore >= 5 ? '#ffaa00' : '#00ff41'};">
                ${riskScore >= 7 ? '⚠ High Risk' : riskScore >= 5 ? '⚠ Moderate' : '✓ Low Risk'}
              </td>
            </tr>
          </tbody>
        </table>

        <h3 class="section-title">Key Opportunities</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;">
          ${(analysis.demand_analysis?.opportunities || []).slice(0, 4).map((opp: string) => `
            <div style="padding: 10px; background: rgba(0, 255, 65, 0.08); border-left: 3px solid #00ff41; border-radius: 4px; font-size: 11px; color: #333;">
              <span style="color: #00ff41; font-weight: bold;">✓</span> ${opp}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- PAGE 3: COMPETITIVE ANALYSIS -->
      <div class="page content-page">
        <h1 class="page-title">🔥 Competitive Landscape</h1>

        <h3 class="section-title">Market Share Distribution</h3>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          ${generateMarketShareChart()}
        </div>

        <h3 class="section-title">Competitor Rankings</h3>
        ${generateCompetitorTable()}

        <h3 class="section-title">Strategic Position</h3>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #00ff41; margin-bottom: 15px; font-size: 11px;">
          <p style="margin-bottom: 8px;">
            <strong style="color: #0f2a47;">Advantage:</strong> ${analysis.competitor_analysis?.competitive_advantage || 'N/A'}
          </p>
          <p style="color: #666;">
            <strong>Threat Level:</strong>
            <span style="font-weight: 700; color: ${analysis.competitor_analysis?.threat_level === 'HIGH' ? '#ff4444' : '#ffaa00'};">
              ${analysis.competitor_analysis?.threat_level || 'MODERATE'}
            </span>
          </p>
        </div>
      </div>

      <!-- PAGE 4: SWOT ANALYSIS -->
      <div class="page content-page">
        <h1 class="page-title">🎯 SWOT Analysis</h1>
        ${generateSWOTDetails()}
      </div>

      <!-- PAGE 5: RISKS & FOUNDER FIT -->
      <div class="page content-page">
        <h1 class="page-title">⚠️ Risk & Founder Fit</h1>

        <h3 class="section-title">Risk Assessment</h3>
        <div style="display: flex; gap: 15px; margin-bottom: 20px;">
          <div style="flex: 1; padding: 15px; background: rgba(244, 67, 54, 0.08); border-radius: 8px; border-left: 3px solid #f44336;">
            <p style="font-size: 10px; color: #999; margin-bottom: 5px; text-transform: uppercase; font-weight: 600;">Overall Risk Score</p>
            <p style="font-size: 28px; font-weight: 900; color: ${getScoreColor(riskScore)};">${riskScore.toFixed(1)}/10</p>
          </div>
          <div style="flex: 1; padding: 15px; background: rgba(244, 67, 54, 0.08); border-radius: 8px; border-left: 3px solid #f44336;">
            <p style="font-size: 10px; color: #999; margin-bottom: 5px; text-transform: uppercase; font-weight: 600;">High Priority Risks</p>
            <p style="font-size: 28px; font-weight: 900; color: #f44336;">${analysis.risk_assessment?.high_risks?.length || 0}</p>
          </div>
        </div>

        ${(analysis.risk_assessment?.high_risks || []).slice(0, 2).map((r: any) => `
          <div style="padding: 12px; background: rgba(244, 67, 54, 0.1); border-left: 3px solid #f44336; border-radius: 6px; margin-bottom: 10px; font-size: 11px;">
            <p style="font-weight: 700; color: #f44336; margin-bottom: 4px;">⚠ ${r.risk}</p>
            <p style="color: #666; margin-bottom: 3px;">📊 ${r.probability} | 💥 ${r.impact}</p>
            <p style="color: #00ff41;">✓ ${r.mitigation}</p>
          </div>
        `).join('')}

        <h3 class="section-title">Founder-Market Fit</h3>
        <div style="display: flex; gap: 15px; margin-bottom: 15px;">
          <div style="flex: 1; text-align: center; padding: 15px; background: rgba(33, 150, 243, 0.08); border-radius: 8px; border-left: 3px solid #2196f3;">
            <p style="font-size: 10px; color: #999; margin-bottom: 5px; text-transform: uppercase; font-weight: 600;">Fit Score</p>
            <p style="font-size: 28px; font-weight: 900; color: #2196f3;">${founderFitScore.toFixed(1)}/10</p>
          </div>
          <div style="flex: 2;">
            <h4 style="font-size: 11px; font-weight: 700; margin-bottom: 8px; color: #0f2a47;">Required Skills</h4>
            ${generateSkillsBars()}
          </div>
        </div>
      </div>

      <!-- PAGE 6: BANGLADESH & GTM -->
      <div class="page content-page">
        <h1 class="page-title">🇧🇩 Bangladesh Impact & GTM</h1>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
          <div style="padding: 15px; background: rgba(33, 150, 243, 0.08); border-left: 3px solid #2196f3; border-radius: 8px;">
            <p style="font-size: 10px; color: #999; margin-bottom: 5px; text-transform: uppercase; font-weight: 600;">Impact Score</p>
            <p style="font-size: 28px; font-weight: 900; color: #2196f3;">${bangladeshScore.toFixed(1)}/10</p>
          </div>
          <div style="padding: 15px; background: rgba(33, 150, 243, 0.08); border-left: 3px solid #2196f3; border-radius: 8px;">
            <p style="font-size: 10px; color: #999; margin-bottom: 5px; text-transform: uppercase; font-weight: 600;">Recommendations</p>
            <p style="font-size: 28px; font-weight: 900; color: #2196f3;">${analysis.bangladesh_impact?.localization_recommendations?.length || 0}</p>
          </div>
        </div>

        <h3 class="section-title">Market Opportunity</h3>
        <p style="font-size: 11px; color: #666; line-height: 1.6; padding: 12px; background: #f9f9f9; border-radius: 6px; border-left: 3px solid #00ff41; margin-bottom: 20px;">
          ${analysis.bangladesh_impact?.market_potential || 'N/A'}
        </p>

        <h3 class="section-title">Go-to-Market Roadmap</h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
          <div style="padding: 12px; background: rgba(0, 255, 65, 0.08); border-left: 3px solid #00ff41; border-radius: 6px;">
            <p style="font-size: 11px; font-weight: 700; color: #00ff41; margin-bottom: 6px;">🚀 Phase 1: Launch</p>
            <p style="font-size: 10px; color: #666; line-height: 1.5;">${analysis.go_to_market?.phase_1?.substring(0, 60) || 'Plan launch strategy'}</p>
          </div>
          <div style="padding: 12px; background: rgba(255, 170, 0, 0.08); border-left: 3px solid #ffaa00; border-radius: 6px;">
            <p style="font-size: 11px; font-weight: 700; color: #ffaa00; margin-bottom: 6px;">📈 Phase 2: Growth</p>
            <p style="font-size: 10px; color: #666; line-height: 1.5;">${analysis.go_to_market?.phase_2?.substring(0, 60) || 'Scale operations'}</p>
          </div>
          <div style="padding: 12px; background: rgba(76, 175, 80, 0.08); border-left: 3px solid #4caf50; border-radius: 6px;">
            <p style="font-size: 11px; font-weight: 700; color: #4caf50; margin-bottom: 6px;">🎯 Phase 3: Scale</p>
            <p style="font-size: 10px; color: #666; line-height: 1.5;">${analysis.go_to_market?.phase_3?.substring(0, 60) || 'Expand market'}</p>
          </div>
        </div>
      </div>

    </body>
    </html>
  `;

  const options = {
    margin: 0,
    filename: `${analysis.idea_extraction?.title?.replace(/\s+/g, '-') || 'analysis'}-professional-${new Date().getTime()}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { orientation: 'portrait' as const, unit: 'mm', format: 'a4' }
  } as any;

  html2pdf().set(options).from(htmlContent).save();
};
