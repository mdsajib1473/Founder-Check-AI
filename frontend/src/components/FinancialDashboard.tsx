import React, { useState } from 'react'

interface FinancialData {
  revenue_projections: {
    monthly: any[];
    year_1_total: number;
    year_2_total: number;
    year_3_total: number;
    total_3_year: number;
  };
  unit_economics: {
    customer_acquisition_cost: number;
    revenue_per_customer_monthly: number;
    lifetime_value: number;
    payback_period_months: number;
    ltv_cac_ratio: number;
    cac_trend: any[];
  };
  pnl_statement: {
    annual_summary: any[];
    status: string;
  };
  cash_flow: {
    monthly_cashflow: any[];
    initial_capital: number;
    final_cash_position: number;
    cash_breakeven_month: number | null;
  };
  break_even: {
    breakeven_monthly_revenue: number;
    breakeven_units_per_month: number;
    fixed_costs_monthly: number;
    contribution_margin_pct: number;
  };
  sensitivity: {
    scenarios: any[];
    best_case: any;
    base_case: any;
    worst_case: any;
  };
  key_metrics: {
    revenue_cagr_pct: number;
    month_to_profitability: string;
    gross_margin_year_3: number;
    net_margin_year_3: number;
    cash_position_year_3: number;
  };
}

interface Props {
  financial: FinancialData;
  startup_title: string;
}

const FinancialDashboard: React.FC<Props> = ({ financial }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'pnl' | 'cashflow' | 'uniteconomics' | 'sensitivity'>('overview');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value).replace('BDT', '৳').trim();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#23282e', marginBottom: '30px' }}>Financial Projections & Analysis</h2>

      {/* Key Metrics Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '30px' }}>
        <div style={{ padding: '20px', background: 'rgba(35, 40, 46, 0.05)', borderRadius: '8px', border: '1px solid rgba(35, 40, 46, 0.05)' }}>
          <p style={{ fontSize: '12px', color: '#8b9096', marginBottom: '8px', textTransform: 'uppercase' }}>3-Year Total Revenue</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#5a6169' }}>{formatCurrency(financial.revenue_projections.total_3_year)}</p>
          <p style={{ fontSize: '11px', color: '#5a6169', marginTop: '4px' }}>Year 1: {formatCurrency(financial.revenue_projections.year_1_total)}</p>
        </div>

        <div style={{ padding: '20px', background: 'rgba(90, 107, 72, 0.10)', borderRadius: '8px', border: '1px solid rgba(90, 107, 72, 0.10)' }}>
          <p style={{ fontSize: '12px', color: '#8b9096', marginBottom: '8px', textTransform: 'uppercase' }}>Revenue CAGR</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#5A6B48' }}>{financial.key_metrics.revenue_cagr_pct}%</p>
          <p style={{ fontSize: '11px', color: '#5a6169', marginTop: '4px' }}>Compound Annual Growth</p>
        </div>

        <div style={{ padding: '20px', background: 'rgba(90, 107, 72, 0.10)', borderRadius: '8px', border: '1px solid rgba(90, 107, 72, 0.10)' }}>
          <p style={{ fontSize: '12px', color: '#8b9096', marginBottom: '8px', textTransform: 'uppercase' }}>Year 3 Net Margin</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#5A6B48' }}>{financial.key_metrics.net_margin_year_3}%</p>
          <p style={{ fontSize: '11px', color: '#5a6169', marginTop: '4px' }}>Profitability trajectory</p>
        </div>

        <div style={{ padding: '20px', background: 'rgba(35, 40, 46, 0.05)', borderRadius: '8px', border: '1px solid rgba(35, 40, 46, 0.05)' }}>
          <p style={{ fontSize: '12px', color: '#8b9096', marginBottom: '8px', textTransform: 'uppercase' }}>LTV:CAC Ratio</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#5a6169' }}>{financial.unit_economics.ltv_cac_ratio}x</p>
          <p style={{ fontSize: '11px', color: '#5a6169', marginTop: '4px' }}>Unit economics health</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid rgba(35, 40, 46, 0.08)', paddingBottom: '16px', flexWrap: 'wrap' }}>
        {[
          { id: 'overview' as const, label: 'Overview' },
          { id: 'pnl' as const, label: 'P&L Statement' },
          { id: 'cashflow' as const, label: 'Cash Flow' },
          { id: 'uniteconomics' as const, label: 'Unit Economics' },
          { id: 'sensitivity' as const, label: 'Sensitivity' }
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
              fontWeight: activeTab === tab.id ? '700' : '600',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#23282e', marginBottom: '20px', fontSize: '16px', fontWeight: '700' }}>Revenue Projection (3 Years)</h3>
          <div style={{ padding: '20px', background: 'rgba(35, 40, 46, 0.04)', borderRadius: '8px', border: '1px solid rgba(35, 40, 46, 0.08)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
              {[
                { year: 'Year 1', amount: financial.revenue_projections.year_1_total },
                { year: 'Year 2', amount: financial.revenue_projections.year_2_total },
                { year: 'Year 3', amount: financial.revenue_projections.year_3_total }
              ].map((year_data, i) => (
                <div key={i} style={{ padding: '16px', background: 'rgba(35, 40, 46, 0.05)', borderRadius: '6px', border: '1px solid rgba(35, 40, 46, 0.05)' }}>
                  <p style={{ fontSize: '12px', color: '#8b9096', marginBottom: '8px' }}>{year_data.year}</p>
                  <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#5a6169' }}>{formatCurrency(year_data.amount)}</p>
                </div>
              ))}
            </div>

            {/* Simple bar chart visualization */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '150px' }}>
              {[financial.revenue_projections.year_1_total, financial.revenue_projections.year_2_total, financial.revenue_projections.year_3_total].map((amount, i) => {
                const maxAmount = Math.max(
                  financial.revenue_projections.year_1_total,
                  financial.revenue_projections.year_2_total,
                  financial.revenue_projections.year_3_total
                );
                const height = (amount / maxAmount) * 100;
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <div
                      style={{
                        width: '100%',
                        height: `${height}%`,
                        background: 'linear-gradient(180deg, #5A6B48 0%, #5a6169 100%)',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        paddingBottom: '8px',
                        color: '#23282e',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        minHeight: '20px'
                      }}
                    >
                      {formatCurrency(amount)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Break-even Analysis */}
          <h3 style={{ color: '#23282e', marginBottom: '20px', marginTop: '30px', fontSize: '16px', fontWeight: '700' }}>Break-Even Analysis</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div style={{ padding: '20px', background: 'rgba(156, 107, 31, 0.10)', borderRadius: '8px', border: '1px solid rgba(156, 107, 31, 0.10)' }}>
              <p style={{ fontSize: '12px', color: '#8b9096', marginBottom: '8px', textTransform: 'uppercase' }}>Break-Even Monthly Revenue</p>
              <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#9C6B1F' }}>{formatCurrency(financial.break_even.breakeven_monthly_revenue)}</p>
              <p style={{ fontSize: '11px', color: '#5a6169', marginTop: '8px' }}>Fixed Costs: {formatCurrency(financial.break_even.fixed_costs_monthly)}</p>
              <p style={{ fontSize: '11px', color: '#5a6169' }}>Contribution Margin: {financial.break_even.contribution_margin_pct}%</p>
            </div>

            <div style={{ padding: '20px', background: 'rgba(90, 107, 72, 0.10)', borderRadius: '8px', border: '1px solid rgba(90, 107, 72, 0.10)' }}>
              <p style={{ fontSize: '12px', color: '#8b9096', marginBottom: '8px', textTransform: 'uppercase' }}>Profitability Timeline</p>
              <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#5A6B48' }}>{financial.key_metrics.month_to_profitability}</p>
              <p style={{ fontSize: '11px', color: '#5a6169', marginTop: '8px' }}>Strong trajectory</p>
            </div>
          </div>
        </div>
      )}

      {/* P&L Tab */}
      {activeTab === 'pnl' && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#23282e', marginBottom: '20px' }}>Profit & Loss Statement</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr style={{ background: '#23282e', color: '#ffffff' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Metric</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Year 1</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Year 2</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Year 3</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Revenue', key: 'revenue' },
                { label: 'COGS', key: 'cogs' },
                { label: 'Gross Profit', key: 'gross_profit' },
                { label: 'Gross Margin %', key: 'gross_margin_pct' },
                { label: 'Operating Expenses', key: 'operating_expenses' },
                { label: 'EBITDA', key: 'ebitda' },
                { label: 'EBITDA Margin %', key: 'ebitda_margin_pct' },
                { label: 'Net Income', key: 'net_income' },
                { label: 'Net Margin %', key: 'net_margin_pct' }
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(35, 40, 46, 0.08)', background: i % 2 === 0 ? 'rgba(35, 40, 46, 0.08)' : 'transparent' }}>
                  <td style={{ padding: '12px', color: '#5a6169', fontWeight: '600' }}>{row.label}</td>
                  {[0, 1, 2].map(year => {
                    const value = financial.pnl_statement.annual_summary[year][row.key];
                    const isPercentage = row.key.includes('_pct');
                    return (
                      <td key={year} style={{ padding: '12px', textAlign: 'right', color: '#8b9096' }}>
                        {isPercentage ? `${value}%` : formatCurrency(value)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Cash Flow Tab */}
      {activeTab === 'cashflow' && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#23282e', marginBottom: '20px' }}>Cash Flow Analysis</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
            <div style={{ padding: '20px', background: 'rgba(35, 40, 46, 0.05)', borderRadius: '8px', border: '1px solid rgba(35, 40, 46, 0.05)' }}>
              <p style={{ fontSize: '12px', color: '#8b9096', marginBottom: '8px' }}>Initial Capital</p>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#5a6169' }}>{formatCurrency(financial.cash_flow.initial_capital)}</p>
            </div>

            <div style={{ padding: '20px', background: 'rgba(90, 107, 72, 0.10)', borderRadius: '8px', border: '1px solid rgba(90, 107, 72, 0.10)' }}>
              <p style={{ fontSize: '12px', color: '#8b9096', marginBottom: '8px' }}>Year 3 Cash Position</p>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#5A6B48' }}>{formatCurrency(financial.cash_flow.final_cash_position)}</p>
            </div>

            <div style={{ padding: '20px', background: financial.cash_flow.cash_breakeven_month ? 'rgba(90, 107, 72, 0.10)' : 'rgba(156, 107, 31, 0.10)', borderRadius: '8px', border: `1px solid ${financial.cash_flow.cash_breakeven_month ? 'rgba(90, 107, 72, 0.10)' : 'rgba(156, 107, 31, 0.10)'}` }}>
              <p style={{ fontSize: '12px', color: '#8b9096', marginBottom: '8px' }}>Cash Break-Even</p>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: financial.cash_flow.cash_breakeven_month ? '#5A6B48' : '#9C6B1F' }}>
                {financial.cash_flow.cash_breakeven_month ? `Month ${financial.cash_flow.cash_breakeven_month}` : 'Requires funding'}
              </p>
            </div>
          </div>

          <div style={{ padding: '20px', background: 'rgba(35, 40, 46, 0.04)', borderRadius: '8px', border: '1px solid rgba(35, 40, 46, 0.08)', overflow: 'auto', maxHeight: '400px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: 'rgba(90, 107, 72, 0.10)', color: '#5A6B48', position: 'sticky', top: 0 }}>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Month</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>Revenue</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>Costs</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>Net Flow</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>Cumulative Cash</th>
                </tr>
              </thead>
              <tbody>
                {financial.cash_flow.monthly_cashflow.slice(0, 12).map((month, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(35, 40, 46, 0.08)', background: month.cumulative_cash > 0 ? 'rgba(90, 107, 72, 0.10)' : 'rgba(156, 107, 31, 0.10)' }}>
                    <td style={{ padding: '8px', color: '#5a6169' }}>M{month.month}</td>
                    <td style={{ padding: '8px', textAlign: 'right', color: '#8b9096' }}>{formatCurrency(month.revenue)}</td>
                    <td style={{ padding: '8px', textAlign: 'right', color: '#8b9096' }}>{formatCurrency(month.costs)}</td>
                    <td style={{ padding: '8px', textAlign: 'right', color: month.net_cash_flow > 0 ? '#5A6B48' : '#9C6B1F' }}>{formatCurrency(month.net_cash_flow)}</td>
                    <td style={{ padding: '8px', textAlign: 'right', color: month.cumulative_cash > 0 ? '#5A6B48' : '#9C6B1F', fontWeight: '600' }}>{formatCurrency(month.cumulative_cash)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Unit Economics Tab */}
      {activeTab === 'uniteconomics' && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#23282e', marginBottom: '20px' }}>Unit Economics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
            <div style={{ padding: '20px', background: 'rgba(156, 107, 31, 0.10)', borderRadius: '8px', border: '1px solid rgba(156, 107, 31, 0.10)' }}>
              <p style={{ fontSize: '12px', color: '#8b9096', marginBottom: '8px' }}>Customer Acquisition Cost</p>
              <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#9C6B1F' }}>{formatCurrency(financial.unit_economics.customer_acquisition_cost)}</p>
            </div>

            <div style={{ padding: '20px', background: 'rgba(90, 107, 72, 0.10)', borderRadius: '8px', border: '1px solid rgba(90, 107, 72, 0.10)' }}>
              <p style={{ fontSize: '12px', color: '#8b9096', marginBottom: '8px' }}>Lifetime Value</p>
              <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#5A6B48' }}>{formatCurrency(financial.unit_economics.lifetime_value)}</p>
            </div>

            <div style={{ padding: '20px', background: 'rgba(35, 40, 46, 0.05)', borderRadius: '8px', border: '1px solid rgba(35, 40, 46, 0.05)' }}>
              <p style={{ fontSize: '12px', color: '#8b9096', marginBottom: '8px' }}>Payback Period</p>
              <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#5a6169' }}>{financial.unit_economics.payback_period_months} months</p>
            </div>

            <div style={{ padding: '20px', background: 'rgba(35, 40, 46, 0.05)', borderRadius: '8px', border: '1px solid rgba(35, 40, 46, 0.05)' }}>
              <p style={{ fontSize: '12px', color: '#8b9096', marginBottom: '8px' }}>Monthly Revenue/Customer</p>
              <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#5a6169' }}>{formatCurrency(financial.unit_economics.revenue_per_customer_monthly)}</p>
            </div>
          </div>

          <h4 style={{ color: '#23282e', marginBottom: '16px', marginTop: '30px' }}>CAC Trend (Improving Over Time)</h4>
          <div style={{ padding: '20px', background: 'rgba(35, 40, 46, 0.04)', borderRadius: '8px', border: '1px solid rgba(35, 40, 46, 0.08)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
              {financial.unit_economics.cac_trend.map((point, i) => (
                <div key={i} style={{ padding: '12px', background: 'rgba(35, 40, 46, 0.05)', borderRadius: '6px', border: '1px solid rgba(35, 40, 46, 0.05)', textAlign: 'center' }}>
                  <p style={{ fontSize: '11px', color: '#8b9096', marginBottom: '4px' }}>Month {point.month}</p>
                  <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#5a6169' }}>{formatCurrency(point.cac)}</p>
                  <p style={{ fontSize: '10px', color: '#5A6B48' }}>-{point.reduction_vs_initial}% vs initial</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sensitivity Tab */}
      {activeTab === 'sensitivity' && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#23282e', marginBottom: '20px' }}>Sensitivity Analysis (Growth Rate Scenarios)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '30px' }}>
            {financial.sensitivity.scenarios.map((scenario, i) => (
              <div
                key={i}
                style={{
                  padding: '20px',
                  background: scenario.scenario === 'Conservative' ? 'rgba(156, 107, 31, 0.10)' : scenario.scenario === 'Base' ? 'rgba(90, 107, 72, 0.10)' : 'rgba(90, 107, 72, 0.10)',
                  borderRadius: '8px',
                  border: `2px solid ${scenario.scenario === 'Conservative' ? 'rgba(156, 107, 31, 0.10)' : scenario.scenario === 'Base' ? 'rgba(90, 107, 72, 0.10)' : 'rgba(90, 107, 72, 0.10)'}`
                }}
              >
                <p style={{ fontSize: '12px', color: '#8b9096', marginBottom: '8px', textTransform: 'uppercase' }}>
                  {scenario.scenario === 'Conservative' ? '⬇ Conservative' : scenario.scenario === 'Base' ? 'Base Case' : '⬆Optimistic'}
                </p>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#5a6169', marginBottom: '4px' }}>Growth: {scenario.growth_rate_pct}%/month</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: scenario.scenario === 'Conservative' ? '#9C6B1F' : scenario.scenario === 'Base' ? '#5A6B48' : '#5A6B48' }}>
                  {formatCurrency(scenario.total_3_year_revenue)}
                </p>
                <p style={{ fontSize: '11px', color: scenario.variance_from_base_pct >= 0 ? '#5A6B48' : '#9C6B1F', marginTop: '8px' }}>
                  {scenario.variance_from_base_pct >= 0 ? '+' : ''}{scenario.variance_from_base_pct}% vs base
                </p>
              </div>
            ))}
          </div>

          <div style={{ padding: '20px', background: 'rgba(90, 107, 72, 0.10)', borderRadius: '8px', border: '2px solid #5A6B48' }}>
            <h4 style={{ color: '#5A6B48', marginBottom: '12px' }}>What This Means</h4>
            <ul style={{ color: '#5a6169', fontSize: '13px', lineHeight: '1.8', margin: 0, paddingLeft: '20px' }}>
              <li>Scenario planning helps understand key drivers</li>
              <li>Conservative: 1% monthly growth (low acquisition)</li>
              <li>Base Case: 3% monthly growth (moderate growth)</li>
              <li>Optimistic: 10% monthly growth (viral/strong demand)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialDashboard;
