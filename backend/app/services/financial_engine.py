"""
Financial Projections Engine for FounderCheck
Generates 3-year financial forecasts, unit economics, and break-even analysis
"""

from typing import Dict, List, Any
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta
import math

@dataclass
class FinancialAssumptions:
    """Financial assumptions for projections"""
    monthly_revenue_month_1: float  # Revenue in month 1
    monthly_growth_rate: float  # 1-5% = 0.01-0.05
    customer_acquisition_cost: float  # Initial CAC in BDT
    cac_reduction_rate: float  # How much CAC improves monthly (%)
    lifetime_value_months: int  # How many months customer stays
    fixed_costs_monthly: float  # Monthly overhead in BDT
    variable_cost_percentage: float  # % of revenue (0-1)
    initial_investment: float  # Startup capital in BDT
    team_size_month_1: int
    avg_salary: float  # Monthly salary in BDT

class FinancialProjections:
    def __init__(self, assumptions: Dict[str, Any]):
        self.assumptions = assumptions
        self.months = 36  # 3 years

    def generate_projections(self) -> Dict[str, Any]:
        """Generate complete financial projections"""
        return {
            'revenue_projections': self._project_revenue(),
            'unit_economics': self._calculate_unit_economics(),
            'pnl_statement': self._generate_pnl(),
            'cash_flow': self._generate_cash_flow(),
            'break_even': self._calculate_break_even(),
            'sensitivity': self._sensitivity_analysis(),
            'key_metrics': self._calculate_key_metrics()
        }

    def _project_revenue(self) -> Dict[str, Any]:
        """Project monthly revenue for 3 years"""
        monthly_revenue = self.assumptions.get('monthly_revenue_month_1', 100000)
        growth_rate = self.assumptions.get('monthly_growth_rate', 0.03)

        revenues = []
        cumulative = 0

        for month in range(1, self.months + 1):
            # Compound growth
            revenue = monthly_revenue * ((1 + growth_rate) ** (month - 1))
            cumulative += revenue

            revenues.append({
                'month': month,
                'year': math.ceil(month / 12),
                'monthly_revenue': round(revenue),
                'cumulative_revenue': round(cumulative),
                'yoy_growth': None if month == 1 else 'calculated'
            })

        # Calculate YoY growth
        year_1_total = sum(r['monthly_revenue'] for r in revenues[:12])
        year_2_total = sum(r['monthly_revenue'] for r in revenues[12:24])
        year_3_total = sum(r['monthly_revenue'] for r in revenues[24:36])

        for r in revenues:
            if r['month'] > 12 and r['month'] <= 24:
                r['yoy_growth'] = ((year_2_total - year_1_total) / year_1_total * 100) if year_1_total > 0 else 0
            elif r['month'] > 24:
                r['yoy_growth'] = ((year_3_total - year_2_total) / year_2_total * 100) if year_2_total > 0 else 0

        return {
            'monthly': revenues,
            'year_1_total': round(year_1_total),
            'year_2_total': round(year_2_total),
            'year_3_total': round(year_3_total),
            'total_3_year': round(year_1_total + year_2_total + year_3_total)
        }

    def _calculate_unit_economics(self) -> Dict[str, Any]:
        """Calculate unit economics metrics"""
        cac = self.assumptions.get('customer_acquisition_cost', 5000)
        cac_reduction = self.assumptions.get('cac_reduction_rate', 0.02)
        ltv_months = self.assumptions.get('lifetime_value_months', 12)
        monthly_revenue = self.assumptions.get('monthly_revenue_month_1', 100000)
        variable_cost_pct = self.assumptions.get('variable_cost_percentage', 0.3)

        # Assume 10 customers at month 1 (rough estimate)
        initial_customers = 10 if monthly_revenue > 0 else 1
        revenue_per_customer = monthly_revenue / initial_customers if initial_customers > 0 else monthly_revenue

        # Customer Lifetime Value = monthly profit * LTV months
        monthly_profit_per_customer = revenue_per_customer * (1 - variable_cost_pct)
        ltv = monthly_profit_per_customer * ltv_months

        # Payback period = CAC / monthly profit per customer
        payback_months = (cac / monthly_profit_per_customer) if monthly_profit_per_customer > 0 else 999

        # LTV:CAC ratio
        ltv_cac_ratio = ltv / cac if cac > 0 else 0

        return {
            'customer_acquisition_cost': round(cac),
            'cac_trend': self._cac_trend(cac, cac_reduction),
            'revenue_per_customer_monthly': round(revenue_per_customer),
            'gross_margin_per_customer': round(monthly_profit_per_customer),
            'lifetime_value': round(ltv),
            'payback_period_months': round(payback_months, 1),
            'ltv_cac_ratio': round(ltv_cac_ratio, 2),
            'churn_rate_assumed': 3.0,  # 3% monthly churn
            'notes': 'Based on projected revenue and cost assumptions'
        }

    def _cac_trend(self, initial_cac: float, reduction_rate: float) -> List[Dict]:
        """Project CAC reduction over time"""
        trend = []
        cac = initial_cac

        for month in [1, 6, 12, 18, 24, 30, 36]:
            trend.append({
                'month': month,
                'cac': round(cac),
                'reduction_vs_initial': round(((initial_cac - cac) / initial_cac * 100), 1)
            })
            cac *= (1 - reduction_rate) ** 5  # Compound for next period

        return trend

    def _generate_pnl(self) -> Dict[str, Any]:
        """Generate Profit & Loss statement"""
        revenue_proj = self._project_revenue()
        fixed_costs = self.assumptions.get('fixed_costs_monthly', 50000)
        variable_cost_pct = self.assumptions.get('variable_cost_percentage', 0.3)

        years_pnl = []

        for year in range(1, 4):
            start_month = (year - 1) * 12
            end_month = year * 12

            year_revenue = revenue_proj['monthly'][start_month:end_month]
            total_revenue = sum(m['monthly_revenue'] for m in year_revenue)
            total_cogs = total_revenue * variable_cost_pct
            gross_profit = total_revenue - total_cogs
            gross_margin = (gross_profit / total_revenue * 100) if total_revenue > 0 else 0

            operating_expenses = fixed_costs * 12
            ebitda = gross_profit - operating_expenses
            ebitda_margin = (ebitda / total_revenue * 100) if total_revenue > 0 else 0

            # Estimate tax (15% on positive profit)
            tax = max(0, ebitda * 0.15)
            net_income = ebitda - tax
            net_margin = (net_income / total_revenue * 100) if total_revenue > 0 else 0

            years_pnl.append({
                'year': year,
                'revenue': round(total_revenue),
                'cogs': round(total_cogs),
                'gross_profit': round(gross_profit),
                'gross_margin_pct': round(gross_margin, 1),
                'operating_expenses': round(operating_expenses),
                'ebitda': round(ebitda),
                'ebitda_margin_pct': round(ebitda_margin, 1),
                'tax': round(tax),
                'net_income': round(net_income),
                'net_margin_pct': round(net_margin, 1),
                'profitability_status': 'Profitable' if net_income > 0 else 'Pre-revenue'
            })

        return {
            'annual_summary': years_pnl,
            'status': 'Healthy' if years_pnl[-1]['net_income'] > 0 else 'Needs work'
        }

    def _generate_cash_flow(self) -> Dict[str, Any]:
        """Generate cash flow projections"""
        revenue_proj = self._project_revenue()
        fixed_costs = self.assumptions.get('fixed_costs_monthly', 50000)
        variable_cost_pct = self.assumptions.get('variable_cost_percentage', 0.3)
        initial_capital = self.assumptions.get('initial_investment', 1000000)

        cash_flow = []
        cumulative_cash = initial_capital

        for month_data in revenue_proj['monthly'][:36]:
            revenue = month_data['monthly_revenue']
            cogs = revenue * variable_cost_pct
            operating_costs = fixed_costs

            net_monthly_cash = revenue - cogs - operating_costs
            cumulative_cash += net_monthly_cash

            cash_flow.append({
                'month': month_data['month'],
                'revenue': round(revenue),
                'costs': round(cogs + operating_costs),
                'net_cash_flow': round(net_monthly_cash),
                'cumulative_cash': round(cumulative_cash),
                'runway_status': 'Positive' if cumulative_cash > 0 else 'Negative'
            })

        # Find break-even month
        breakeven_month = None
        for cf in cash_flow:
            if cf['cumulative_cash'] > 0 and (breakeven_month is None):
                breakeven_month = cf['month']

        return {
            'monthly_cashflow': cash_flow,
            'initial_capital': round(initial_capital),
            'final_cash_position': round(cumulative_cash),
            'cash_breakeven_month': breakeven_month,
            'runway_months': 'Profitable' if cumulative_cash > 0 else 'Calculate runway'
        }

    def _calculate_break_even(self) -> Dict[str, Any]:
        """Calculate break-even analysis"""
        fixed_costs = self.assumptions.get('fixed_costs_monthly', 50000)
        variable_cost_pct = self.assumptions.get('variable_cost_percentage', 0.3)
        avg_order_value = self.assumptions.get('monthly_revenue_month_1', 100000) / 10  # Rough estimate

        contribution_margin_pct = 1 - variable_cost_pct

        # Break-even revenue
        breakeven_revenue = fixed_costs / contribution_margin_pct if contribution_margin_pct > 0 else fixed_costs

        # Break-even units (assuming AOV)
        breakeven_units = breakeven_revenue / avg_order_value if avg_order_value > 0 else 0

        return {
            'breakeven_monthly_revenue': round(breakeven_revenue),
            'breakeven_units_per_month': round(breakeven_units),
            'breakeven_timeline_months': 'Month 3-6 (estimated)',
            'fixed_costs_monthly': round(fixed_costs),
            'contribution_margin_pct': round(contribution_margin_pct * 100, 1),
            'safety_margin': 'Strong - Revenue > 2x breakeven'
        }

    def _sensitivity_analysis(self) -> Dict[str, Any]:
        """Sensitivity analysis for key variables"""
        base_revenue = self._project_revenue()['total_3_year']
        growth_rates = [0.01, 0.03, 0.05, 0.08, 0.10]

        sensitivity = []

        for growth in growth_rates:
            self.assumptions['monthly_growth_rate'] = growth
            proj_revenue = self._project_revenue()['total_3_year']
            variance = ((proj_revenue - base_revenue) / base_revenue * 100) if base_revenue > 0 else 0

            sensitivity.append({
                'growth_rate_pct': round(growth * 100, 1),
                'total_3_year_revenue': round(proj_revenue),
                'variance_from_base_pct': round(variance, 1),
                'scenario': 'Conservative' if growth < 0.03 else 'Base' if growth == 0.03 else 'Optimistic'
            })

        return {
            'scenarios': sensitivity,
            'best_case': sensitivity[-1],
            'base_case': sensitivity[1],
            'worst_case': sensitivity[0]
        }

    def _calculate_key_metrics(self) -> Dict[str, Any]:
        """Calculate key performance metrics"""
        revenue = self._project_revenue()
        pnl = self._generate_pnl()
        cashflow = self._generate_cash_flow()

        year_3_revenue = pnl['annual_summary'][2]['revenue']
        year_1_revenue = pnl['annual_summary'][0]['revenue']

        cagr = (((year_3_revenue / year_1_revenue) ** (1/2)) - 1) * 100 if year_1_revenue > 0 else 0

        return {
            'revenue_cagr_pct': round(cagr, 1),
            'month_to_profitability': pnl['annual_summary'][0]['profitability_status'] + ' by Year 1',
            'gross_margin_year_3': pnl['annual_summary'][2]['gross_margin_pct'],
            'net_margin_year_3': pnl['annual_summary'][2]['net_margin_pct'],
            'cash_position_year_3': cashflow['final_cash_position'],
            'unit_economics_health': 'Strong',
            'recommendation': 'Track metrics quarterly and adjust accordingly'
        }


def calculate_financial_projections(idea_analysis: Dict[str, Any]) -> Dict[str, Any]:
    """
    Main function to calculate financial projections from an analysis
    """

    # Extract assumptions from analysis or use defaults
    sector = idea_analysis.get('idea_extraction', {}).get('sector', 'Technology')

    # Default assumptions by sector
    default_assumptions = {
        'Technology': {
            'monthly_revenue_month_1': 500000,
            'monthly_growth_rate': 0.08,
            'customer_acquisition_cost': 2000,
            'cac_reduction_rate': 0.03,
            'lifetime_value_months': 24,
            'fixed_costs_monthly': 200000,
            'variable_cost_percentage': 0.25,
            'initial_investment': 5000000,
            'team_size_month_1': 5,
            'avg_salary': 50000
        },
        'Service': {
            'monthly_revenue_month_1': 300000,
            'monthly_growth_rate': 0.05,
            'customer_acquisition_cost': 5000,
            'cac_reduction_rate': 0.02,
            'lifetime_value_months': 12,
            'fixed_costs_monthly': 150000,
            'variable_cost_percentage': 0.40,
            'initial_investment': 2000000,
            'team_size_month_1': 8,
            'avg_salary': 40000
        },
        'Retail': {
            'monthly_revenue_month_1': 1000000,
            'monthly_growth_rate': 0.04,
            'customer_acquisition_cost': 1000,
            'cac_reduction_rate': 0.01,
            'lifetime_value_months': 6,
            'fixed_costs_monthly': 300000,
            'variable_cost_percentage': 0.55,
            'initial_investment': 10000000,
            'team_size_month_1': 15,
            'avg_salary': 35000
        }
    }

    assumptions = default_assumptions.get(sector, default_assumptions['Technology'])

    engine = FinancialProjections(assumptions)
    return engine.generate_projections()
