import os
import json
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "auto")

# Auto-detect provider based on key format
def detect_provider():
    if not API_KEY:
        return "demo"
    if API_KEY.startswith("sk-ant-"):
        return "anthropic"
    elif API_KEY.startswith("sk-"):
        return "openai"
    elif API_KEY.startswith("euri-"):
        return "custom"
    else:
        return "demo"

PROVIDER = detect_provider() if LLM_PROVIDER == "auto" else LLM_PROVIDER

print(f"[LLM] Using provider: {PROVIDER}")
print(f"[LLM] API Key format: {API_KEY[:20]}...")

# ============================================================================
# Demo Mode Responses (for testing without API keys)
# ============================================================================

DEMO_RESPONSES = {
    "idea_extraction": {
        "title": "Cloud Kitchen - Mirpur",
        "description": "Ready-to-eat meal service in Mirpur",
        "sector": "food_delivery",
        "target_customer": "Working professionals",
        "revenue_model": "Per-order commission",
        "location": "Mirpur, Dhaka"
    },
    "demand_analysis": {
        "score": 7.5,
        "market_size": "৳2-5 billion annually in Dhaka",
        "competition": "Foodpanda, Shyam's Delivery",
        "opportunities": [
            "High demand from office workers",
            "Late-night delivery gap",
            "Corporate bulk orders"
        ],
        "threats": [
            "Low profit margins (15-20%)",
            "High customer acquisition cost",
            "Delivery logistics complexity"
        ]
    },
    "regulatory_analysis": {
        "risk_score": 4.0,
        "key_regulators": ["BSTI", "NBR", "City Corporation"],
        "critical_approvals": "Food business license + Trade license",
        "estimated_timeline": 45,
        "cost_estimate": 75000,
        "warnings": "BSTI food safety certification mandatory. Must comply with hygiene standards."
    },
    "business_canvas": {
        "key_partners": ["Food suppliers", "Delivery platforms", "Cloud kitchen chains"],
        "key_activities": ["Food preparation", "Quality control", "Delivery coordination"],
        "key_resources": {"kitchen": 500000, "delivery_fleet": 300000, "tech": 100000},
        "value_proposition": "Fresh, affordable, quick delivery",
        "customer_segments": ["Office workers", "Students", "Busy professionals"],
        "channels": ["Mobile app", "Website", "Phone orders"],
        "customer_relationships": ["24/7 support", "Loyalty program"],
        "revenue_streams": {"per_order": 50, "bulk_contracts": 5000},
        "cost_structure": {"rent": 80000, "ingredients": 40, "labor": 120000, "delivery": 50000}
    },
    "investor_questions": [
        {"question": "What is your target market size in Dhaka?", "category": "market"},
        {"question": "How will you handle BSTI food safety compliance?", "category": "regulatory"},
        {"question": "What is your customer acquisition cost?", "category": "financials"},
        {"question": "Why are you better than Foodpanda?", "category": "execution"},
        {"question": "What is your path to profitability?", "category": "financials"},
        {"question": "How do you ensure food quality at scale?", "category": "execution"},
        {"question": "What is your supply chain strategy?", "category": "execution"},
        {"question": "How much funding do you need?", "category": "financials"},
        {"question": "Who is your team?", "category": "team"},
        {"question": "What is your growth target for year 1?", "category": "market"}
    ],
    "competitor_analysis": {
        "market_overview": {
            "total_market": "৳2-5 billion annual",
            "growth_rate": "15% YoY",
            "key_regions": "Dhaka, Chittagong, Sylhet"
        },
        "direct_competitors": [
            {
                "rank": 1,
                "name": "Foodpanda",
                "market_share": 35,
                "market_share_display": "35%",
                "estimated_revenue": "৳700Cr+",
                "strength": "Strong logistics network",
                "weakness": "High commission rates (25-30%)",
                "impact": "Market leader, set industry standards",
                "users": "2M+ active users",
                "coverage": "Nationwide"
            },
            {
                "rank": 2,
                "name": "Uber Eats",
                "market_share": 25,
                "market_share_display": "25%",
                "estimated_revenue": "৳500Cr+",
                "strength": "Global brand, tech expertise",
                "weakness": "International pricing model",
                "impact": "Brought premium positioning to market",
                "users": "1.5M+ active users",
                "coverage": "Major cities"
            },
            {
                "rank": 3,
                "name": "Shyam's Delivery",
                "market_share": 20,
                "market_share_display": "20%",
                "estimated_revenue": "৳400Cr+",
                "strength": "Local expertise, cultural fit",
                "weakness": "Limited geographic expansion",
                "impact": "Local preference builder, community trust",
                "users": "800K+ active users",
                "coverage": "Dhaka metro only"
            },
            {
                "rank": 4,
                "name": "NowNow (Grameenphone)",
                "market_share": 12,
                "market_share_display": "12%",
                "estimated_revenue": "৳240Cr+",
                "strength": "Telecom integration, payment leverage",
                "weakness": "Limited restaurant partners",
                "impact": "Leveraging telco ecosystem advantages",
                "users": "400K+ active users",
                "coverage": "Select areas"
            },
            {
                "rank": 5,
                "name": "Other Local Players",
                "market_share": 8,
                "market_share_display": "8%",
                "estimated_revenue": "৳160Cr+",
                "strength": "Niche focus, hyper-local",
                "weakness": "Limited resources",
                "impact": "Specialized delivery for neighborhoods",
                "users": "Variable",
                "coverage": "Specific zones"
            }
        ],
        "indirect_competitors": [
            {"type": "Traditional Restaurants", "impact": "HOME DELIVERY - 30% margin loss to aggregators"},
            {"type": "QR Code Ordering", "impact": "ZERO COMMISSION - but limited reach"},
            {"type": "WhatsApp Groups", "impact": "ORGANIC - community-based ordering"},
            {"type": "Hotel Room Service", "impact": "CAPTIVE MARKET - hotels control distribution"},
            {"type": "Cloud Kitchens", "impact": "DIRECT TO CONSUMER - own delivery"},
            {"type": "Subscription Services", "impact": "RECURRING REVENUE - change buying patterns"}
        ],
        "market_trends": {
            "trend_1": "Consolidation: Large players acquiring smaller ones",
            "trend_2": "Hyper-personalization: AI-driven recommendations",
            "trend_3": "Ghost Kitchens: Emergence of delivery-only restaurants",
            "trend_4": "Sustainability: Eco-friendly packaging focus"
        },
        "competitive_advantage": "Hyper-local focus in Mirpur with same-day delivery guarantee + transparent pricing (15% lower commission)",
        "market_gaps": [
            "Evening convenience meals (6-11 PM) for professionals",
            "Corporate bulk orders (100+ meals)",
            "Subscription meal plans",
            "Diabetic/Health-conscious meal options"
        ],
        "threat_level": "HIGH",
        "threat_details": "Foodpanda has ৳700Cr+ revenue, deep pockets for expansion. Uber Eats has global backing. Difficult to compete on logistics alone.",
        "opportunity_level": "MEDIUM-HIGH",
        "opportunity_details": "Serve underserved neighborhoods, focus on niche segments (health-conscious, corporate, budget-conscious)"
    },
    "bangladesh_impact": {
        "local_regulations": ["BSTI food safety", "City Corporation license", "NBR tax registration", "Child labor compliance"],
        "market_potential": "৳2-5 billion annual market, 15% YoY growth",
        "cultural_factors": "High preference for home-cooked food, religious dietary restrictions, mobile-first adoption",
        "economic_factors": "Rising middle class, increasing urbanization, growing digital payments",
        "supply_chain": "Abundant local ingredients, developing cold chain infrastructure",
        "impact_score": 8.2,
        "localization_recommendations": ["Partner with local suppliers", "Offer payment flexibility", "Train Bangladeshi drivers"]
    },
    "swot_analysis": {
        "strengths": ["Local market knowledge", "Low initial investment", "High demand"],
        "weaknesses": ["No capital for marketing", "Limited tech team", "No delivery fleet"],
        "opportunities": ["Expand to other cities", "B2B corporate meals", "Subscription model"],
        "threats": ["Competition from established players", "Economic downturn", "Supply chain disruption"]
    },
    "go_to_market": {
        "phase_1": "Pilot in 2 Mirpur zones for 30 days, target 50 orders/day",
        "phase_2": "Expand to 5 Dhaka zones within 60 days, hire 3 delivery partners",
        "phase_3": "Launch corporate tie-ups, introduce subscription (90 days)",
        "customer_acquisition": "Instagram + TikTok (80%), referral (15%), partnerships (5%)",
        "pricing_strategy": "15% lower than Foodpanda for first 100 orders",
        "partnership_targets": ["IT companies", "BPO offices", "University hostels"]
    },
    "risk_assessment": {
        "high_risks": [
            {"risk": "Logistics failure", "probability": "HIGH", "impact": "Customer churn", "mitigation": "Backup delivery partners"},
            {"risk": "Food poisoning incident", "probability": "MEDIUM", "impact": "Legal action", "mitigation": "Insurance + BSTI certified kitchen"}
        ],
        "medium_risks": [
            {"risk": "Market saturation", "probability": "MEDIUM", "impact": "Price wars", "mitigation": "Premium positioning"},
            {"risk": "Funding shortage", "probability": "HIGH", "impact": "Shutdown", "mitigation": "Bootstrap + pre-sales"}
        ],
        "overall_risk_score": 6.8
    },
    "founder_fit": {
        "required_skills": ["Operations management", "Food industry knowledge", "Digital marketing"],
        "team_recommendations": "Need co-founder with supply chain expertise",
        "experience_gaps": "No previous startup experience, limited food industry knowledge",
        "fit_score": 6.5,
        "improvement_areas": ["Get food business internship", "Take digital marketing course", "Build advisory board"]
    }
}

# ============================================================================
# OpenAI Implementation
# ============================================================================

def call_openai(prompt, max_tokens=1000):
    """Call OpenAI API (requires sk- key)"""
    try:
        import openai
        openai.api_key = API_KEY

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=max_tokens,
            temperature=0.7
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"[OpenAI Error] {e}")
        return None

# ============================================================================
# Custom/Unknown API Implementation
# ============================================================================

def call_custom_api(prompt, max_tokens=1000):
    """Call custom/unknown API"""
    print(f"[Custom API] Using key starting with: {API_KEY[:20]}...")
    print(f"[Custom API] Note: This key format may not be recognized")
    return None

# ============================================================================
# Main LLM Functions
# ============================================================================

def extract_idea_fields(idea_text: str) -> dict:
    """Extract structured fields from raw idea text"""

    if PROVIDER == "demo":
        return DEMO_RESPONSES["idea_extraction"]

    prompt = f"""
    Analyze this startup idea and extract structured information.

    Idea: {idea_text}

    Return ONLY valid JSON with these fields:
    - title: Short 1-line title
    - description: 1-2 sentence description
    - sector: e.g., "fintech", "food_delivery", "agritech"
    - target_customer: Who is the primary customer?
    - revenue_model: How will it make money?
    - location: Where will it operate?

    RETURN ONLY JSON, NO OTHER TEXT.
    """

    if PROVIDER == "openai":
        response = call_openai(prompt, 500)
    elif PROVIDER == "custom":
        response = call_custom_api(prompt, 500)
    elif PROVIDER == "anthropic":
        from anthropic import Anthropic
        client = Anthropic(api_key=API_KEY)
        msg = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=500,
            messages=[{"role": "user", "content": prompt}]
        )
        response = msg.content[0].text
    else:
        return DEMO_RESPONSES["idea_extraction"]

    if not response:
        return DEMO_RESPONSES["idea_extraction"]

    try:
        return json.loads(response)
    except:
        return DEMO_RESPONSES["idea_extraction"]


def analyze_demand(idea_text: str, target_customer: str) -> dict:
    if PROVIDER == "demo":
        return DEMO_RESPONSES["demand_analysis"]

    prompt = f"""
    Analyze market demand for this idea:
    {idea_text}
    Target: {target_customer}

    Return JSON with score (1-10), market_size, competition, opportunities (3), threats (2).
    RETURN ONLY JSON.
    """

    if PROVIDER == "openai":
        response = call_openai(prompt, 800)
    elif PROVIDER == "anthropic":
        from anthropic import Anthropic
        client = Anthropic(api_key=API_KEY)
        msg = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=800,
            messages=[{"role": "user", "content": prompt}]
        )
        response = msg.content[0].text
    else:
        return DEMO_RESPONSES["demand_analysis"]

    if not response:
        return DEMO_RESPONSES["demand_analysis"]

    try:
        return json.loads(response)
    except:
        return DEMO_RESPONSES["demand_analysis"]


def analyze_regulatory_risks(idea_text: str, sector: str) -> dict:
    if PROVIDER == "demo":
        return DEMO_RESPONSES["regulatory_analysis"]

    prompt = f"""
    Analyze regulatory risks for a {sector} startup in Bangladesh.
    Idea: {idea_text}

    Consider: NBR (tax), RJSC (registration), BIDA, BTRC (telecom), BSTI (food), Bangladesh Bank (fintech), City Corporation (licenses).

    Return JSON with risk_score (1-10), key_regulators, critical_approvals, estimated_timeline (days), cost_estimate (BDT), warnings.
    RETURN ONLY JSON.
    """

    if PROVIDER == "openai":
        response = call_openai(prompt, 800)
    elif PROVIDER == "anthropic":
        from anthropic import Anthropic
        client = Anthropic(api_key=API_KEY)
        msg = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=800,
            messages=[{"role": "user", "content": prompt}]
        )
        response = msg.content[0].text
    else:
        return DEMO_RESPONSES["regulatory_analysis"]

    if not response:
        return DEMO_RESPONSES["regulatory_analysis"]

    try:
        return json.loads(response)
    except:
        return DEMO_RESPONSES["regulatory_analysis"]


def generate_business_canvas(idea_text: str, sector: str) -> dict:
    if PROVIDER == "demo":
        return DEMO_RESPONSES["business_canvas"]

    prompt = f"""
    Create a Business Model Canvas for this startup:
    {idea_text} ({sector})

    Return JSON with: key_partners, key_activities, key_resources, value_proposition, customer_segments, channels, customer_relationships, revenue_streams, cost_structure.
    All costs in BDT.
    RETURN ONLY JSON.
    """

    if PROVIDER == "openai":
        response = call_openai(prompt, 1000)
    elif PROVIDER == "anthropic":
        from anthropic import Anthropic
        client = Anthropic(api_key=API_KEY)
        msg = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1000,
            messages=[{"role": "user", "content": prompt}]
        )
        response = msg.content[0].text
    else:
        return DEMO_RESPONSES["business_canvas"]

    if not response:
        return DEMO_RESPONSES["business_canvas"]

    try:
        return json.loads(response)
    except:
        return DEMO_RESPONSES["business_canvas"]


def generate_investor_questions(idea_text: str, sector: str) -> list:
    if PROVIDER == "demo":
        return DEMO_RESPONSES["investor_questions"]

    prompt = f"""
    Generate 10 tough investor questions for this startup:
    {idea_text} ({sector})

    Return JSON array of objects with 'question' and 'category' (market/execution/financials/team).
    RETURN ONLY JSON.
    """

    if PROVIDER == "openai":
        response = call_openai(prompt, 1200)
    elif PROVIDER == "anthropic":
        from anthropic import Anthropic
        client = Anthropic(api_key=API_KEY)
        msg = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1200,
            messages=[{"role": "user", "content": prompt}]
        )
        response = msg.content[0].text
    else:
        return DEMO_RESPONSES["investor_questions"]

    if not response:
        return DEMO_RESPONSES["investor_questions"]

    try:
        return json.loads(response)
    except:
        return DEMO_RESPONSES["investor_questions"]


def analyze_competitors(idea_text: str, sector: str) -> dict:
    if PROVIDER == "demo":
        return DEMO_RESPONSES["competitor_analysis"]

    prompt = f"""
    Analyze competitors for this Bangladesh startup:
    {idea_text} ({sector})

    Return JSON with: direct_competitors (list with name, market_share, strength, weakness), indirect_competitors (list), competitive_advantage, market_gaps, threat_level.
    All market shares as percentages.
    RETURN ONLY JSON.
    """

    if PROVIDER == "openai":
        response = call_openai(prompt, 1000)
    elif PROVIDER == "anthropic":
        from anthropic import Anthropic
        client = Anthropic(api_key=API_KEY)
        msg = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1000,
            messages=[{"role": "user", "content": prompt}]
        )
        response = msg.content[0].text
    else:
        return DEMO_RESPONSES["competitor_analysis"]

    if not response:
        return DEMO_RESPONSES["competitor_analysis"]

    try:
        return json.loads(response)
    except:
        return DEMO_RESPONSES["competitor_analysis"]


def analyze_bangladesh_impact(idea_text: str, sector: str) -> dict:
    if PROVIDER == "demo":
        return DEMO_RESPONSES["bangladesh_impact"]

    prompt = f"""
    Analyze Bangladesh-specific impact and localization for this startup:
    {idea_text} ({sector})

    Consider: Local regulations, market potential in BDT, cultural factors, economic factors, supply chain, localization recommendations.
    Return JSON with all above fields + impact_score (1-10).
    RETURN ONLY JSON.
    """

    if PROVIDER == "openai":
        response = call_openai(prompt, 1000)
    elif PROVIDER == "anthropic":
        from anthropic import Anthropic
        client = Anthropic(api_key=API_KEY)
        msg = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1000,
            messages=[{"role": "user", "content": prompt}]
        )
        response = msg.content[0].text
    else:
        return DEMO_RESPONSES["bangladesh_impact"]

    if not response:
        return DEMO_RESPONSES["bangladesh_impact"]

    try:
        return json.loads(response)
    except:
        return DEMO_RESPONSES["bangladesh_impact"]


def analyze_swot(idea_text: str, sector: str) -> dict:
    if PROVIDER == "demo":
        return DEMO_RESPONSES["swot_analysis"]

    prompt = f"""
    Generate comprehensive SWOT analysis for this startup:
    {idea_text} ({sector})

    Return JSON with: strengths (list), weaknesses (list), opportunities (list), threats (list).
    Each list item should be a short string (max 50 chars).
    RETURN ONLY JSON.
    """

    if PROVIDER == "openai":
        response = call_openai(prompt, 1000)
    elif PROVIDER == "anthropic":
        from anthropic import Anthropic
        client = Anthropic(api_key=API_KEY)
        msg = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1000,
            messages=[{"role": "user", "content": prompt}]
        )
        response = msg.content[0].text
    else:
        return DEMO_RESPONSES["swot_analysis"]

    if not response:
        return DEMO_RESPONSES["swot_analysis"]

    try:
        return json.loads(response)
    except:
        return DEMO_RESPONSES["swot_analysis"]


def generate_gtm_strategy(idea_text: str, sector: str) -> dict:
    if PROVIDER == "demo":
        return DEMO_RESPONSES["go_to_market"]

    prompt = f"""
    Create a Go-to-Market strategy for this Bangladesh startup:
    {idea_text} ({sector})

    Return JSON with: phase_1, phase_2, phase_3 (execution plan), customer_acquisition (channels), pricing_strategy, partnership_targets.
    Make it practical and Bangladesh-focused.
    RETURN ONLY JSON.
    """

    if PROVIDER == "openai":
        response = call_openai(prompt, 1200)
    elif PROVIDER == "anthropic":
        from anthropic import Anthropic
        client = Anthropic(api_key=API_KEY)
        msg = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1200,
            messages=[{"role": "user", "content": prompt}]
        )
        response = msg.content[0].text
    else:
        return DEMO_RESPONSES["go_to_market"]

    if not response:
        return DEMO_RESPONSES["go_to_market"]

    try:
        return json.loads(response)
    except:
        return DEMO_RESPONSES["go_to_market"]


def assess_risks(idea_text: str, sector: str) -> dict:
    if PROVIDER == "demo":
        return DEMO_RESPONSES["risk_assessment"]

    prompt = f"""
    Assess critical risks for this Bangladesh startup:
    {idea_text} ({sector})

    Return JSON with: high_risks (list of {risk, probability, impact, mitigation}), medium_risks (same format), overall_risk_score (1-10).
    RETURN ONLY JSON.
    """

    if PROVIDER == "openai":
        response = call_openai(prompt, 1000)
    elif PROVIDER == "anthropic":
        from anthropic import Anthropic
        client = Anthropic(api_key=API_KEY)
        msg = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1000,
            messages=[{"role": "user", "content": prompt}]
        )
        response = msg.content[0].text
    else:
        return DEMO_RESPONSES["risk_assessment"]

    if not response:
        return DEMO_RESPONSES["risk_assessment"]

    try:
        return json.loads(response)
    except:
        return DEMO_RESPONSES["risk_assessment"]


def assess_founder_fit(idea_text: str, sector: str) -> dict:
    if PROVIDER == "demo":
        return DEMO_RESPONSES["founder_fit"]

    prompt = f"""
    Assess founder fit for this startup idea:
    {idea_text} ({sector})

    Return JSON with: required_skills (list), team_recommendations (string), experience_gaps (string), fit_score (1-10), improvement_areas (list).
    RETURN ONLY JSON.
    """

    if PROVIDER == "openai":
        response = call_openai(prompt, 1000)
    elif PROVIDER == "anthropic":
        from anthropic import Anthropic
        client = Anthropic(api_key=API_KEY)
        msg = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1000,
            messages=[{"role": "user", "content": prompt}]
        )
        response = msg.content[0].text
    else:
        return DEMO_RESPONSES["founder_fit"]

    if not response:
        return DEMO_RESPONSES["founder_fit"]

    try:
        return json.loads(response)
    except:
        return DEMO_RESPONSES["founder_fit"]
