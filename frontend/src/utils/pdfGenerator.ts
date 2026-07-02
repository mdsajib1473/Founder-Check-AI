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

export const generatePDF = (analysis: AnalysisData) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          line-height: 1.6;
          padding: 20px;
          background: white;
        }
        .container { max-width: 800px; margin: 0 auto; }
        .header {
          text-align: center;
          padding: 30px 0;
          border-bottom: 3px solid #00ff41;
          margin-bottom: 30px;
        }
        .logo { font-size: 28px; font-weight: bold; color: #00ff41; }
        .subtitle { color: #666; font-size: 14px; margin-top: 5px; }
        .score-card {
          background: #f5f5f5;
          padding: 20px;
          border-radius: 10px;
          margin: 20px 0;
          text-align: center;
        }
        .score-value { font-size: 48px; font-weight: bold; color: #00ff41; }
        .score-label { color: #666; font-size: 14px; margin-top: 5px; }
        .section {
          page-break-inside: avoid;
          margin: 30px 0;
          padding: 20px;
          background: #fafafa;
          border-left: 4px solid #00ff41;
        }
        .section-title {
          font-size: 20px;
          font-weight: bold;
          color: #00ff41;
          margin-bottom: 15px;
          border-bottom: 2px solid #ddd;
          padding-bottom: 10px;
        }
        .section-subtitle {
          font-size: 14px;
          font-weight: bold;
          color: #333;
          margin-top: 15px;
          margin-bottom: 8px;
        }
        .list-item {
          margin-left: 20px;
          margin-bottom: 8px;
          line-height: 1.6;
        }
        .stat-box {
          display: inline-block;
          background: white;
          padding: 15px;
          margin: 10px 10px 10px 0;
          border-radius: 5px;
          border-left: 3px solid #00ff41;
        }
        .stat-label { color: #666; font-size: 12px; }
        .stat-value { font-size: 18px; font-weight: bold; color: #00ff41; }
        .risk-high { color: #f44336; font-weight: bold; }
        .risk-medium { color: #ff9800; font-weight: bold; }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #ddd;
          font-size: 12px;
          color: #666;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 10px 0;
        }
        th, td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th { background: #f5f5f5; font-weight: bold; }
        .page-break { page-break-after: always; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- COVER PAGE -->
        <div class="header">
          <div class="logo">🚀 FounderCheck</div>
          <div class="subtitle">Startup Validation Report</div>
        </div>

        <div style="text-align: center; margin: 50px 0;">
          <h1 style="font-size: 36px; color: #333;">${analysis.idea_extraction?.title || 'Startup Analysis'}</h1>
          <p style="font-size: 16px; color: #666; margin-top: 20px;">${analysis.idea_extraction?.description || ''}</p>
        </div>

        <div class="score-card">
          <div class="score-label">Overall Readiness Score</div>
          <div class="score-value">${analysis.overall_readiness_score?.toFixed(1) || '0'}/10</div>
          <div class="score-label" style="margin-top: 10px;">
            ${analysis.overall_readiness_score >= 8 ? '✓ STRONG' : analysis.overall_readiness_score >= 6 ? '⚠ MODERATE' : '✗ NEEDS WORK'}
          </div>
        </div>

        <div style="text-align: center; margin-top: 50px; color: #666; font-size: 14px;">
          <p>Generated on ${new Date().toLocaleDateString()}</p>
          <p>By FounderCheck - AI-Powered Startup Validator</p>
        </div>

        <div class="page-break"></div>

        <!-- EXECUTIVE SUMMARY -->
        <div class="section">
          <div class="section-title">📋 Executive Summary</div>

          <div class="stat-box">
            <div class="stat-label">SECTOR</div>
            <div class="stat-value">${analysis.idea_extraction?.sector || 'N/A'}</div>
          </div>

          <div class="stat-box">
            <div class="stat-label">TARGET CUSTOMER</div>
            <div class="stat-value">${analysis.idea_extraction?.target_customer || 'N/A'}</div>
          </div>

          <div class="stat-box">
            <div class="stat-label">LOCATION</div>
            <div class="stat-value">${analysis.idea_extraction?.location || 'N/A'}</div>
          </div>

          <div class="stat-box">
            <div class="stat-label">REVENUE MODEL</div>
            <div class="stat-value">${analysis.idea_extraction?.revenue_model || 'N/A'}</div>
          </div>

          <p style="margin-top: 20px; color: #666;">
            This startup idea demonstrates a readiness score of <strong>${analysis.overall_readiness_score?.toFixed(1)}/10</strong>.
            The analysis covers 11 key dimensions including market demand, regulatory compliance, competitive positioning,
            and founder-market fit to provide a comprehensive assessment.
          </p>
        </div>

        <!-- MARKET DEMAND -->
        <div class="section">
          <div class="section-title">📈 Market Demand Analysis</div>

          <div class="stat-box">
            <div class="stat-label">MARKET SIZE</div>
            <div class="stat-value">${analysis.demand_analysis?.market_size || 'N/A'}</div>
          </div>

          <div class="stat-box">
            <div class="stat-label">MARKET SCORE</div>
            <div class="stat-value">${analysis.demand_analysis?.score || '0'}/10</div>
          </div>

          <div class="section-subtitle">Key Opportunities</div>
          ${(analysis.demand_analysis?.opportunities || []).map((o: string) => `
            <div class="list-item">✓ ${o}</div>
          `).join('')}

          <div class="section-subtitle">Key Threats</div>
          ${(analysis.demand_analysis?.threats || []).map((t: string) => `
            <div class="list-item">⚠ ${t}</div>
          `).join('')}
        </div>

        <!-- REGULATORY -->
        <div class="section">
          <div class="section-title">⚖️ Regulatory Risk Assessment</div>

          <div class="stat-box">
            <div class="stat-label">RISK SCORE</div>
            <div class="stat-value">${analysis.regulatory_analysis?.risk_score || '0'}/10</div>
          </div>

          <div class="stat-box">
            <div class="stat-label">TIMELINE</div>
            <div class="stat-value">~${analysis.regulatory_analysis?.estimated_timeline || '0'} days</div>
          </div>

          <div class="stat-box">
            <div class="stat-label">COST ESTIMATE</div>
            <div class="stat-value">৳${analysis.regulatory_analysis?.cost_estimate?.toLocaleString() || '0'}</div>
          </div>

          <div class="section-subtitle">Key Regulators</div>
          ${(analysis.regulatory_analysis?.key_regulators || []).map((r: string) => `
            <div class="list-item">• ${r}</div>
          `).join('')}

          <div class="section-subtitle">Critical Approvals</div>
          <div class="list-item">${analysis.regulatory_analysis?.critical_approvals || 'N/A'}</div>

          ${analysis.regulatory_analysis?.warnings ? `
            <div class="section-subtitle">⚠️ Important Warnings</div>
            <div class="list-item" style="background: #fff3cd; padding: 10px; border-radius: 5px; color: #856404;">
              ${analysis.regulatory_analysis.warnings}
            </div>
          ` : ''}
        </div>

        <!-- COMPETITIVE ANALYSIS -->
        <div class="section">
          <div class="section-title">🔥 Competitive Analysis</div>

          <div class="section-subtitle">Market Overview</div>
          <table>
            <tr>
              <th>Metric</th>
              <th>Value</th>
            </tr>
            <tr>
              <td>Total Market Size</td>
              <td>${analysis.competitor_analysis?.market_overview?.total_market || 'N/A'}</td>
            </tr>
            <tr>
              <td>Growth Rate</td>
              <td>${analysis.competitor_analysis?.market_overview?.growth_rate || 'N/A'}</td>
            </tr>
            <tr>
              <td>Key Regions</td>
              <td>${analysis.competitor_analysis?.market_overview?.key_regions || 'N/A'}</td>
            </tr>
          </table>

          <div class="section-subtitle">Direct Competitors</div>
          <table>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Market Share</th>
              <th>Impact</th>
            </tr>
            ${(analysis.competitor_analysis?.direct_competitors || []).slice(0, 5).map((c: any) => `
              <tr>
                <td>#${c.rank}</td>
                <td>${c.name}</td>
                <td>${c.market_share_display}</td>
                <td>${c.impact}</td>
              </tr>
            `).join('')}
          </table>

          <div class="section-subtitle">Your Competitive Advantage</div>
          <div class="list-item">${analysis.competitor_analysis?.competitive_advantage || 'N/A'}</div>

          <div class="section-subtitle">Threat Level</div>
          <div class="list-item" style="font-size: 16px;">
            <span class="risk-${analysis.competitor_analysis?.threat_level === 'HIGH' ? 'high' : 'medium'}">
              ${analysis.competitor_analysis?.threat_level || 'MEDIUM'}
            </span>
          </div>
        </div>

        <div class="page-break"></div>

        <!-- BANGLADESH IMPACT -->
        <div class="section">
          <div class="section-title">🇧🇩 Bangladesh Market Impact</div>

          <div class="stat-box">
            <div class="stat-label">IMPACT SCORE</div>
            <div class="stat-value">${analysis.bangladesh_impact?.impact_score || '0'}/10</div>
          </div>

          <div class="section-subtitle">Market Potential</div>
          <div class="list-item">${analysis.bangladesh_impact?.market_potential || 'N/A'}</div>

          <div class="section-subtitle">Localization Recommendations</div>
          ${(analysis.bangladesh_impact?.localization_recommendations || []).map((r: string) => `
            <div class="list-item">✓ ${r}</div>
          `).join('')}
        </div>

        <!-- SWOT -->
        <div class="section">
          <div class="section-title">🎯 SWOT Analysis</div>

          <table>
            <tr>
              <th>Strengths</th>
              <th>Weaknesses</th>
            </tr>
            <tr>
              <td>
                ${(analysis.swot_analysis?.strengths || []).map((s: string) => `• ${s}`).join('<br>')}
              </td>
              <td>
                ${(analysis.swot_analysis?.weaknesses || []).map((w: string) => `• ${w}`).join('<br>')}
              </td>
            </tr>
          </table>

          <table>
            <tr>
              <th>Opportunities</th>
              <th>Threats</th>
            </tr>
            <tr>
              <td>
                ${(analysis.swot_analysis?.opportunities || []).map((o: string) => `• ${o}`).join('<br>')}
              </td>
              <td>
                ${(analysis.swot_analysis?.threats || []).map((t: string) => `• ${t}`).join('<br>')}
              </td>
            </tr>
          </table>
        </div>

        <!-- GTM -->
        <div class="section">
          <div class="section-title">🚀 Go-to-Market Strategy</div>

          <div class="section-subtitle">Phase 1: Launch (30 days)</div>
          <div class="list-item">${analysis.go_to_market?.phase_1 || 'N/A'}</div>

          <div class="section-subtitle">Phase 2: Growth (60 days)</div>
          <div class="list-item">${analysis.go_to_market?.phase_2 || 'N/A'}</div>

          <div class="section-subtitle">Phase 3: Scale (90 days)</div>
          <div class="list-item">${analysis.go_to_market?.phase_3 || 'N/A'}</div>
        </div>

        <!-- RISKS -->
        <div class="section">
          <div class="section-title">⚠️ Risk Assessment</div>

          <div class="stat-box">
            <div class="stat-label">OVERALL RISK SCORE</div>
            <div class="stat-value">${analysis.risk_assessment?.overall_risk_score || '0'}/10</div>
          </div>

          <div class="section-subtitle">High Priority Risks</div>
          ${(analysis.risk_assessment?.high_risks || []).map((r: any) => `
            <div class="list-item" style="color: #f44336;">
              <strong>⚠ ${r.risk}</strong> (${r.probability})<br>
              Impact: ${r.impact}<br>
              Mitigation: ${r.mitigation}
            </div>
          `).join('')}

          <div class="section-subtitle">Medium Priority Risks</div>
          ${(analysis.risk_assessment?.medium_risks || []).map((r: any) => `
            <div class="list-item" style="color: #ff9800;">
              <strong>⚠ ${r.risk}</strong> (${r.probability})<br>
              Impact: ${r.impact}<br>
              Mitigation: ${r.mitigation}
            </div>
          `).join('')}
        </div>

        <!-- FOUNDER FIT -->
        <div class="section">
          <div class="section-title">👤 Founder-Market Fit</div>

          <div class="stat-box">
            <div class="stat-label">FIT SCORE</div>
            <div class="stat-value">${analysis.founder_fit?.fit_score || '0'}/10</div>
          </div>

          <div class="section-subtitle">Required Skills</div>
          ${(analysis.founder_fit?.required_skills || []).map((s: string) => `
            <div class="list-item">• ${s}</div>
          `).join('')}

          <div class="section-subtitle">Improvement Areas</div>
          ${(analysis.founder_fit?.improvement_areas || []).map((a: string) => `
            <div class="list-item">📚 ${a}</div>
          `).join('')}
        </div>

        <!-- FOOTER -->
        <div class="footer">
          <p><strong>FounderCheck</strong> - AI-Powered Startup Validator for Bangladesh</p>
          <p>This analysis was generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          <p>For more analyses, visit: <strong>www.foundercheck.io</strong></p>
          <p style="margin-top: 20px; color: #999;">© 2026 FounderCheck. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const options = {
    margin: 10,
    filename: `${analysis.idea_extraction?.title?.replace(/\s+/g, '-') || 'analysis'}-${new Date().getTime()}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait' as const, unit: 'mm', format: 'a4' }
  } as any;

  html2pdf().set(options).from(htmlContent).save();
};
