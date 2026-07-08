import { jsPDF } from 'jspdf';

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

const NOT_AVAILABLE = 'Not available';

// Page geometry (A4, portrait, mm)
const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 16;
const CONTENT_W = PAGE_W - MARGIN * 2;

// Palette: the Auditor's Ledger tokens (Agent.md section 3)
const NAVY: [number, number, number] = [35, 40, 46];      // Iron Ink
const GREEN: [number, number, number] = [90, 107, 72];    // Moss (status: pass)
const AMBER: [number, number, number] = [156, 107, 31];   // Ochre (status: caution)
const RED: [number, number, number] = [138, 46, 51];      // Ledger Red (verdict accent)
const BLUE: [number, number, number] = [90, 97, 105];     // secondary ink
const GREY: [number, number, number] = [139, 144, 150];
const DARK: [number, number, number] = [35, 40, 46];
const LIGHT_BG: [number, number, number] = [242, 240, 233]; // Archive paper

const isNum = (v: unknown): v is number => typeof v === 'number' && isFinite(v);

/** Displayable text for any field; never renders "undefined". Also maps
 * characters outside jsPDF's built-in Latin fonts (like the taka sign)
 * to readable ASCII so they cannot render as garbage glyphs. */
const text = (v: unknown, fallback: string = NOT_AVAILABLE): string => {
  if (v === null || v === undefined) return fallback;
  let s = String(v).trim();
  if (s === '' || s === 'undefined' || s === 'null') return fallback;
  s = s.replace(/৳/g, 'BDT ');            // Bengali taka sign
  s = s.replace(/[^\x20-\x7E]/g, '');          // strip other non-ASCII
  return s.trim() || fallback;
};

const fmtScore = (v: unknown): string => (isNum(v) ? v.toFixed(1) : NOT_AVAILABLE);

/** Parse a market share that may arrive as 30, "30", "30%" or be missing. */
const parseShare = (v: unknown): number | null => {
  if (isNum(v)) return Math.max(0, Math.min(100, v));
  if (typeof v === 'string') {
    const n = parseFloat(v.replace('%', '').trim());
    if (isFinite(n)) return Math.max(0, Math.min(100, n));
  }
  return null;
};

const statusText = (score: number | null) => {
  if (!isNum(score)) return NOT_AVAILABLE;
  if (score >= 8) return 'STRONG';
  if (score >= 6) return 'MODERATE';
  return 'NEEDS WORK';
};

const scoreColor = (score: number | null): [number, number, number] => {
  if (!isNum(score)) return GREY;
  if (score >= 8) return GREEN;
  if (score >= 6) return AMBER;
  return RED;
};

export const generateEnhancedPDF = (analysis: AnalysisData) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  let y = MARGIN;

  const readiness = isNum(analysis.overall_readiness_score) ? analysis.overall_readiness_score : null;
  const marketScore = isNum(analysis.demand_analysis?.score) ? analysis.demand_analysis!.score : null;
  const regulatoryRisk = isNum(analysis.regulatory_analysis?.risk_score) ? analysis.regulatory_analysis!.risk_score : null;
  const riskAssessScore = isNum(analysis.risk_assessment?.overall_risk_score) ? analysis.risk_assessment!.overall_risk_score : null;
  const founderFit = isNum(analysis.founder_fit?.fit_score) ? analysis.founder_fit!.fit_score : null;
  const bdScore = isNum(analysis.bangladesh_impact?.impact_score) ? analysis.bangladesh_impact!.impact_score : null;

  // ----- layout plumbing ---------------------------------------------------

  /** Start a new page if fewer than `need` mm remain. */
  const ensure = (need: number) => {
    if (y + need > PAGE_H - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  };

  const newPage = () => {
    doc.addPage();
    y = MARGIN;
  };

  const pageTitle = (title: string) => {
    doc.setFont('times', 'bold');
    doc.setFontSize(19);
    doc.setTextColor(...NAVY);
    doc.text(title, MARGIN, y + 6);
    doc.setDrawColor(...NAVY);
    doc.setLineWidth(0.8);
    doc.line(MARGIN, y + 10, MARGIN + CONTENT_W, y + 10);
    y += 18;
  };

  const sectionTitle = (title: string) => {
    ensure(14);
    doc.setFont('times', 'bold');
    doc.setFontSize(12.5);
    doc.setTextColor(...NAVY);
    doc.text(title, MARGIN, y + 4);
    doc.setDrawColor(210, 208, 200);
    doc.setLineWidth(0.4);
    doc.line(MARGIN, y + 6.5, MARGIN + CONTENT_W, y + 6.5);
    y += 12;
  };

  /** Wrapped paragraph; breaks across pages safely. */
  const paragraph = (value: string, size = 9.5, color: [number, number, number] = DARK, indent = 0) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines: string[] = doc.splitTextToSize(value, CONTENT_W - indent);
    const lineH = size * 0.5;
    for (const line of lines) {
      ensure(lineH + 2);
      doc.text(line, MARGIN + indent, y);
      y += lineH;
    }
    y += 2;
  };

  const bullets = (items: unknown[], color: [number, number, number] = DARK) => {
    if (!items || items.length === 0) {
      paragraph(NOT_AVAILABLE, 9.5, GREY);
      return;
    }
    for (const item of items) {
      const t = text(item, '');
      if (!t) continue;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(...color);
      const lines: string[] = doc.splitTextToSize(t, CONTENT_W - 6);
      ensure(lines.length * 4.8 + 2);
      doc.text('-', MARGIN + 1, y);
      for (const line of lines) {
        doc.text(line, MARGIN + 6, y);
        y += 4.8;
      }
      y += 0.8;
    }
    y += 2;
  };

  /** One stat card with label + value; drawn at x with given width. */
  const statCard = (x: number, w: number, label: string, value: string, valueColor: [number, number, number]) => {
    const h = 20;
    doc.setFillColor(...LIGHT_BG);
    doc.roundedRect(x, y, w, h, 1.5, 1.5, 'F');
    doc.setFillColor(...valueColor);
    doc.rect(x, y, 1.4, h, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(...GREY);
    doc.text(label.toUpperCase(), x + 4, y + 5.5);
    const isNa = value === NOT_AVAILABLE;
    doc.setFont('courier', 'bold');
    doc.setFontSize(isNa ? 8 : 13);
    doc.setTextColor(...valueColor);
    doc.text(value, x + 4, y + (isNa ? 12.5 : 14));
  };

  // ----- cover page: paper ground, ink rules, one ledger-red verdict --------

  doc.setFillColor(...LIGHT_BG);
  doc.rect(0, 0, PAGE_W, PAGE_H, 'F');

  doc.setDrawColor(...DARK);
  doc.setLineWidth(0.6);
  doc.line(MARGIN, 30, PAGE_W - MARGIN, 30);

  doc.setFont('times', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(...DARK);
  doc.text('FounderCheck', PAGE_W / 2, 46, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...GREY);
  doc.text('D I L I G E N C E   R E P O R T', PAGE_W / 2, 55, { align: 'center' });

  doc.setFont('times', 'bold');
  doc.setFontSize(21);
  doc.setTextColor(...DARK);
  const titleLines: string[] = doc.splitTextToSize(text(analysis.idea_extraction?.title, 'Startup Analysis'), 160);
  let coverY = 110;
  for (const line of titleLines.slice(0, 4)) {
    doc.text(line, PAGE_W / 2, coverY, { align: 'center' });
    coverY += 10;
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...BLUE);
  const descLines: string[] = doc.splitTextToSize(text(analysis.idea_extraction?.description, ''), 150);
  coverY += 4;
  for (const line of descLines.slice(0, 3)) {
    doc.text(line, PAGE_W / 2, coverY, { align: 'center' });
    coverY += 5.5;
  }

  // Verdict box: hairline frame, the one ledger-red mark on the page
  const boxW = 72;
  const boxX = (PAGE_W - boxW) / 2;
  const boxY = coverY + 12;
  doc.setDrawColor(...DARK);
  doc.setLineWidth(0.4);
  doc.rect(boxX, boxY, boxW, 44, 'S');
  doc.setFont('times', 'bold');
  if (readiness !== null) {
    doc.setFontSize(36);
    doc.setTextColor(...RED);
    doc.text(readiness.toFixed(1), PAGE_W / 2, boxY + 20, { align: 'center' });
    doc.setFont('courier', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...GREY);
    doc.text('/ 10', PAGE_W / 2, boxY + 27, { align: 'center' });
  } else {
    doc.setFontSize(13);
    doc.setTextColor(...RED);
    doc.text(NOT_AVAILABLE, PAGE_W / 2, boxY + 22, { align: 'center' });
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...DARK);
  doc.text(statusText(readiness), PAGE_W / 2, boxY + 37, { align: 'center' });

  doc.setDrawColor(...DARK);
  doc.setLineWidth(0.6);
  doc.line(MARGIN, 252, PAGE_W - MARGIN, 252);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...GREY);
  const generated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.text(`Generated on ${generated}`, PAGE_W / 2, 262, { align: 'center' });
  doc.text('FounderCheck - AI-Powered Startup Validator', PAGE_W / 2, 268, { align: 'center' });
  doc.setFontSize(7.5);
  doc.text('AI-generated assessment for exploration and learning, not investment advice.', PAGE_W / 2, 276, { align: 'center' });

  // ----- page 2: executive dashboard ----------------------------------------

  newPage();
  pageTitle('Executive Dashboard');

  const cardW = (CONTENT_W - 4 * 4) / 5;
  const cards: Array<[string, string, [number, number, number]]> = [
    ['Readiness', fmtScore(readiness), scoreColor(readiness)],
    ['Market', fmtScore(marketScore), scoreColor(marketScore)],
    ['Reg. Risk', fmtScore(regulatoryRisk), isNum(regulatoryRisk) ? scoreColor(10 - regulatoryRisk) : GREY],
    ['Founder Fit', fmtScore(founderFit), scoreColor(founderFit)],
    ['BD Impact', fmtScore(bdScore), scoreColor(bdScore)],
  ];
  cards.forEach(([label, value, color], i) => statCard(MARGIN + i * (cardW + 4), cardW, label, value, color));
  y += 26;

  sectionTitle('Market Metrics');
  const metricRow = (label: string, value: string, status: string, statusColor: [number, number, number], shade: boolean) => {
    // Guard every cell and set the row font BEFORE measuring the wrap, so
    // splitTextToSize uses the same metrics the text is drawn with. The
    // value column is 88mm wide (62mm to 150mm); status starts at 156mm.
    const safeLabel = text(label);
    const safeValue = text(value);
    const safeStatus = text(status);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    const valueLines: string[] = doc.splitTextToSize(safeValue, 88);
    const rowH = Math.max(9, valueLines.length * 4.4 + 4.5);
    ensure(rowH);
    if (shade) {
      doc.setFillColor(...LIGHT_BG);
      doc.rect(MARGIN, y - 4, CONTENT_W, rowH, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...DARK);
    doc.text(safeLabel, MARGIN + 2, y + 1);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...DARK);
    doc.text(valueLines, MARGIN + 46, y + 1);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...statusColor);
    doc.text(safeStatus, MARGIN + 140, y + 1);
    y += rowH;
  };
  metricRow('Market Size', text(analysis.demand_analysis?.market_size), isNum(marketScore) ? (marketScore >= 7 ? 'Strong' : marketScore >= 5 ? 'Moderate' : 'Limited') : NOT_AVAILABLE, scoreColor(marketScore), false);
  metricRow('Sector', text(analysis.idea_extraction?.sector), 'Industry focus', GREY, true);
  metricRow('Regulatory Risk', isNum(regulatoryRisk) ? `${regulatoryRisk.toFixed(1)}/10` : NOT_AVAILABLE, isNum(regulatoryRisk) ? (regulatoryRisk >= 7 ? 'High risk' : regulatoryRisk >= 5 ? 'Moderate' : 'Low risk') : NOT_AVAILABLE, isNum(regulatoryRisk) ? scoreColor(10 - regulatoryRisk) : GREY, false);
  metricRow('Target Customer', text(analysis.idea_extraction?.target_customer), 'Audience', GREY, true);
  metricRow('Revenue Model', text(analysis.idea_extraction?.revenue_model), 'Monetization', GREY, false);
  y += 4;

  sectionTitle('Key Opportunities');
  bullets((analysis.demand_analysis?.opportunities || []).slice(0, 4));

  sectionTitle('Key Threats');
  bullets((analysis.demand_analysis?.threats || []).slice(0, 3));

  // ----- page 3: competitive landscape ---------------------------------------

  newPage();
  pageTitle('Competitive Landscape');

  const competitors = (analysis.competitor_analysis?.direct_competitors || []).slice(0, 5);
  const barColors: Array<[number, number, number]> = [BLUE, [235, 140, 0], GREEN, RED, [140, 60, 170]];

  sectionTitle('Market Share Distribution');
  if (competitors.length === 0) {
    paragraph('Competitor data not available.', 9.5, GREY);
  } else {
    competitors.forEach((c: any, i: number) => {
      ensure(13);
      const share = parseShare(c.market_share);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...DARK);
      doc.text(`${i + 1}. ${text(c.name, 'Unnamed competitor')}`, MARGIN, y);
      doc.setTextColor(...barColors[i]);
      doc.text(share !== null ? `${share}%` : NOT_AVAILABLE, MARGIN + CONTENT_W, y, { align: 'right' });
      // Track and fill
      doc.setFillColor(228, 228, 228);
      doc.rect(MARGIN, y + 2, CONTENT_W, 2.6, 'F');
      if (share !== null && share > 0) {
        doc.setFillColor(...barColors[i]);
        doc.rect(MARGIN, y + 2, (CONTENT_W * share) / 100, 2.6, 'F');
      }
      y += 10;
    });
    y += 2;
  }

  sectionTitle('Competitor Rankings');
  if (competitors.length === 0) {
    paragraph('Competitor data not available.', 9.5, GREY);
  } else {
    // Header
    ensure(9);
    doc.setFillColor(...NAVY);
    doc.rect(MARGIN, y - 4, CONTENT_W, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text('#', MARGIN + 2, y + 1);
    doc.text('Company', MARGIN + 9, y + 1);
    doc.text('Share', MARGIN + 62, y + 1);
    doc.text('Strength', MARGIN + 78, y + 1);
    doc.text('Weakness', MARGIN + 129, y + 1);
    y += 8;

    competitors.forEach((c: any, i: number) => {
      const strengthLines: string[] = doc.splitTextToSize(text(c.strength), 48);
      const weaknessLines: string[] = doc.splitTextToSize(text(c.weakness), 48);
      const nameLines: string[] = doc.splitTextToSize(text(c.name, 'Unnamed competitor'), 50);
      const rowLines = Math.max(strengthLines.length, weaknessLines.length, nameLines.length);
      const rowH = rowLines * 4 + 4;
      ensure(rowH);
      if (i % 2 === 0) {
        doc.setFillColor(...LIGHT_BG);
        doc.rect(MARGIN, y - 3.5, CONTENT_W, rowH, 'F');
      }
      const share = parseShare(c.market_share);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...NAVY);
      doc.text(`${i + 1}`, MARGIN + 2, y + 1);
      doc.text(nameLines, MARGIN + 9, y + 1);
      doc.setTextColor(...BLUE);
      doc.text(share !== null ? `${share}%` : 'N/A', MARGIN + 62, y + 1);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...DARK);
      doc.text(strengthLines, MARGIN + 78, y + 1);
      doc.text(weaknessLines, MARGIN + 129, y + 1);
      y += rowH;
    });
    y += 4;
  }

  sectionTitle('Strategic Position');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...NAVY);
  ensure(6);
  doc.text('Advantage:', MARGIN, y);
  doc.setFont('helvetica', 'normal');
  y += 5;
  paragraph(text(analysis.competitor_analysis?.competitive_advantage), 9.5, DARK, 2);
  ensure(6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('Threat level:', MARGIN, y);
  y += 5;
  // The model sometimes returns a full sentence here, so wrap it like a paragraph.
  const threat = text(analysis.competitor_analysis?.threat_level);
  const threatColor = threat.toUpperCase().startsWith('HIGH') ? RED : threat === NOT_AVAILABLE ? GREY : AMBER;
  paragraph(threat, 9.5, threatColor, 2);
  y += 3;

  // ----- page 4: SWOT ---------------------------------------------------------

  newPage();
  pageTitle('SWOT Analysis');

  const swot = analysis.swot_analysis;
  const swotBlock = (label: string, color: [number, number, number], items: unknown[] | undefined) => {
    ensure(12);
    doc.setFillColor(...color);
    doc.rect(MARGIN, y - 3, 1.6, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(...color);
    doc.text(`${label} (${items?.length || 0})`, MARGIN + 5, y + 1);
    y += 7;
    bullets((items || []).slice(0, 5));
  };
  swotBlock('STRENGTHS', GREEN, swot?.strengths);
  swotBlock('WEAKNESSES', AMBER, swot?.weaknesses);
  swotBlock('OPPORTUNITIES', BLUE, swot?.opportunities);
  swotBlock('THREATS', RED, swot?.threats);

  // ----- page 5: risk & founder fit --------------------------------------------

  newPage();
  pageTitle('Risk & Founder Fit');

  sectionTitle('Risk Assessment');
  const halfW = (CONTENT_W - 6) / 2;
  statCard(MARGIN, halfW, 'Overall Risk Score', isNum(riskAssessScore) ? `${riskAssessScore.toFixed(1)}/10` : NOT_AVAILABLE, isNum(riskAssessScore) ? scoreColor(10 - riskAssessScore) : GREY);
  statCard(MARGIN + halfW + 6, halfW, 'High Priority Risks', String(analysis.risk_assessment?.high_risks?.length || 0), RED);
  y += 26;

  const highRisks = (analysis.risk_assessment?.high_risks || []).slice(0, 3);
  if (highRisks.length === 0) {
    paragraph('Detailed risk assessment not available for this analysis.', 9.5, GREY);
  } else {
    highRisks.forEach((r: any) => {
      ensure(18);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(...RED);
      doc.text(text(r?.risk), MARGIN, y);
      y += 5;
      paragraph(`Probability: ${text(r?.probability)}  |  Impact: ${text(r?.impact)}`, 9, GREY, 2);
      paragraph(`Mitigation: ${text(r?.mitigation)}`, 9, GREEN, 2);
      y += 1;
    });
  }
  y += 2;

  sectionTitle('Founder-Market Fit');
  statCard(MARGIN, halfW, 'Fit Score', isNum(founderFit) ? `${founderFit.toFixed(1)}/10` : NOT_AVAILABLE, isNum(founderFit) ? BLUE : GREY);
  y += 26;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...NAVY);
  ensure(8);
  doc.text('Required Skills', MARGIN, y);
  y += 6;
  bullets((analysis.founder_fit?.required_skills || []).slice(0, 6));

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...NAVY);
  ensure(8);
  doc.text('How to Improve Fit', MARGIN, y);
  y += 6;
  bullets((analysis.founder_fit?.improvement_areas || []).slice(0, 5));

  // ----- page 6: Bangladesh impact & GTM ----------------------------------------

  newPage();
  pageTitle('Bangladesh Impact & GTM');

  statCard(MARGIN, halfW, 'Impact Score', isNum(bdScore) ? `${bdScore.toFixed(1)}/10` : NOT_AVAILABLE, isNum(bdScore) ? BLUE : GREY);
  statCard(MARGIN + halfW + 6, halfW, 'Localization Recommendations', String(analysis.bangladesh_impact?.localization_recommendations?.length || 0), BLUE);
  y += 26;

  sectionTitle('Market Opportunity');
  paragraph(text(analysis.bangladesh_impact?.market_potential));

  sectionTitle('Localization Recommendations');
  bullets((analysis.bangladesh_impact?.localization_recommendations || []).slice(0, 5));

  sectionTitle('Go-to-Market Roadmap');
  const phase = (label: string, color: [number, number, number], value: unknown) => {
    ensure(12);
    doc.setFillColor(...color);
    doc.rect(MARGIN, y - 3, 1.6, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...color);
    doc.text(label, MARGIN + 5, y + 1);
    y += 6;
    paragraph(text(value), 9.5, DARK, 2);
    y += 1;
  };
  phase('Phase 1: Launch (30 days)', GREEN, analysis.go_to_market?.phase_1);
  phase('Phase 2: Growth (60 days)', AMBER, analysis.go_to_market?.phase_2);
  phase('Phase 3: Scale (90 days)', BLUE, analysis.go_to_market?.phase_3);

  // ----- save --------------------------------------------------------------------

  const filename = `${text(analysis.idea_extraction?.title, 'analysis').replace(/\s+/g, '-').substring(0, 60)}-report-${Date.now()}.pdf`;
  doc.save(filename);
};
