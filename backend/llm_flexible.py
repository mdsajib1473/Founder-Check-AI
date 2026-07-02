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
    ]
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
