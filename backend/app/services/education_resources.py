"""
Educational & Resources - Learning modules, articles, glossary, FAQs
"""

from typing import Dict, List, Optional
from datetime import datetime
from dataclasses import dataclass
from enum import Enum


class ResourceType(str, Enum):
    ARTICLE = "article"
    VIDEO = "video"
    GUIDE = "guide"
    CASE_STUDY = "case_study"
    GLOSSARY = "glossary"
    FAQ = "faq"
    TUTORIAL = "tutorial"


class Difficulty(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


@dataclass
class LearningModule:
    """Learning module"""
    module_id: str
    title: str
    description: str
    category: str  # market-data, unit-economics, pitch-deck, fundraising, business-planning
    content: str
    difficulty: Difficulty
    duration_minutes: int
    topics_covered: List[str]
    created_at: datetime
    order: int


@dataclass
class Article:
    """Expert article or case study"""
    article_id: str
    title: str
    author: str
    content: str
    resource_type: ResourceType
    category: str
    tags: List[str]
    reading_time_minutes: int
    published_date: datetime
    updated_date: datetime
    featured: bool


@dataclass
class GlossaryTerm:
    """Glossary term with definition"""
    term_id: str
    term: str
    definition: str
    category: str
    related_terms: List[str]
    example: Optional[str]


@dataclass
class FAQ:
    """FAQ entry"""
    faq_id: str
    question: str
    answer: str
    category: str
    helpful_count: int
    related_topics: List[str]
    video_url: Optional[str]


@dataclass
class HelpContext:
    """Contextual help for features"""
    help_id: str
    feature: str
    brief_explanation: str
    detailed_explanation: str
    related_glossary_terms: List[str]
    related_articles: List[str]
    video_tutorial_url: Optional[str]


class EducationResourcesService:
    """Service for managing educational content"""

    def __init__(self):
        self.learning_modules: Dict[str, LearningModule] = {}
        self.articles: Dict[str, Article] = {}
        self.glossary: Dict[str, GlossaryTerm] = {}
        self.faqs: Dict[str, FAQ] = {}
        self.help_contexts: Dict[str, HelpContext] = {}

        self._initialize_content()

    def _initialize_content(self):
        """Initialize educational content"""
        # Learning Modules
        self.learning_modules = {
            'market-data-101': LearningModule(
                module_id='market-data-101',
                title='How to Read Market Data',
                description='Learn to analyze TAM/SAM/SOM and market trends',
                category='market-data',
                content='''
                Market sizing is critical for any startup. This module covers:

                1. TAM (Total Addressable Market) - The total revenue opportunity
                2. SAM (Serviceable Addressable Market) - What you can realistically capture
                3. SOM (Serviceable Obtainable Market) - Year 1 realistic revenue

                Best practices:
                - Use multiple data sources (industry reports, government data)
                - Be conservative in estimates
                - Update annually as market evolves
                - Compare to industry benchmarks

                Common mistakes:
                - Overestimating TAM
                - Not adjusting for market saturation
                - Ignoring geographic boundaries
                ''',
                difficulty=Difficulty.BEGINNER,
                duration_minutes=15,
                topics_covered=['TAM', 'SAM', 'SOM', 'Market sizing', 'Analysis'],
                created_at=datetime.utcnow(),
                order=1
            ),
            'unit-economics-101': LearningModule(
                module_id='unit-economics-101',
                title='Understanding Unit Economics',
                description='Master CAC, LTV, payback period, and profitability',
                category='unit-economics',
                content='''
                Unit economics determines if your business model is sustainable.

                Key metrics:
                1. CAC (Customer Acquisition Cost) - Cost to acquire one customer
                2. LTV (Lifetime Value) - Total profit from one customer
                3. LTV:CAC Ratio - Should be > 3x for healthy business
                4. Payback Period - Months to recover CAC from customer

                Healthy thresholds:
                - CAC < 10% of LTV
                - LTV:CAC ratio > 3x
                - Payback period < 12 months

                How to calculate:
                CAC = Total Marketing Spend / New Customers Acquired
                LTV = Average Revenue Per User × Gross Margin × Customer Lifespan
                ''',
                difficulty=Difficulty.INTERMEDIATE,
                duration_minutes=20,
                topics_covered=['CAC', 'LTV', 'Unit economics', 'Profitability'],
                created_at=datetime.utcnow(),
                order=2
            ),
            'pitch-deck-guide': LearningModule(
                module_id='pitch-deck-guide',
                title='Pitch Deck Best Practices',
                description='Create compelling investor presentations',
                category='pitch-deck',
                content='''
                A great pitch deck tells a compelling story. Essential slides:

                1. Problem - What pain point exists?
                2. Solution - Your unique approach
                3. Market Size - TAM/SAM/SOM
                4. Business Model - How you make money
                5. Traction - Proof of progress
                6. Team - Why you\'ll succeed
                7. Financials - 3-year projections
                8. Funding Ask - How much and use of funds

                Best practices:
                - 10-15 slides maximum
                - Each slide 1-2 minutes to present
                - Focus on story, not data density
                - Use visuals over text
                - Practice 20+ times before pitching

                Common mistakes:
                - Too many slides
                - Unproven claims
                - Weak team slides
                - Unrealistic financial projections
                ''',
                difficulty=Difficulty.INTERMEDIATE,
                duration_minutes=25,
                topics_covered=['Pitch deck', 'Investor relations', 'Presentation'],
                created_at=datetime.utcnow(),
                order=3
            ),
            'fundraising-guide': LearningModule(
                module_id='fundraising-guide',
                title='The Fundraising Process Guide',
                description='Navigate seed rounds and investor relations',
                category='fundraising',
                content='''
                Fundraising is a 3-6 month process. Stages:

                PREPARATION (4-6 weeks)
                - Create pitch deck
                - Write 1-pager
                - Build financial model
                - Get warm introductions

                OUTREACH (4-8 weeks)
                - Target 50-100 investors
                - Send personalized emails with intros
                - Expect 2-5% positive response rate
                - Follow up relentlessly

                MEETINGS (4-6 weeks)
                - Initial meetings: 20-30 min
                - Due diligence: 2-3 deeper meetings
                - Reference calls
                - Term sheet negotiation

                Typical rounds in Bangladesh:
                - Seed: $100K - $500K
                - Series A: $500K - $2M
                - Series B: $2M - $10M+

                Key metrics investors care about:
                - Growth rate (>10% monthly for SaaS)
                - Burn rate and runway
                - Unit economics (CAC, LTV)
                - Market size and positioning
                ''',
                difficulty=Difficulty.ADVANCED,
                duration_minutes=30,
                topics_covered=['Fundraising', 'Investors', 'Seed round', 'Series A'],
                created_at=datetime.utcnow(),
                order=4
            ),
            'business-planning-101': LearningModule(
                module_id='business-planning-101',
                title='Business Planning 101',
                description='Create a solid business plan framework',
                category='business-planning',
                content='''
                A business plan aligns your team and attracts investors.

                Core sections:

                1. EXECUTIVE SUMMARY (1 page)
                   - What? Why? How? When?

                2. COMPANY DESCRIPTION
                   - Vision, mission, values
                   - Location and legal structure

                3. MARKET ANALYSIS
                   - Industry overview
                   - Target customer
                   - Market size (TAM/SAM/SOM)

                4. ORGANIZATION & MANAGEMENT
                   - Team bios
                   - Organizational structure
                   - Advisory board

                5. MARKETING & SALES STRATEGY
                   - Go-to-market plan
                   - Customer acquisition strategy
                   - Pricing strategy

                6. FINANCIAL PROJECTIONS
                   - Revenue forecast (3 years)
                   - Expense projection
                   - Cash flow analysis
                   - Break-even analysis

                7. FUNDING REQUEST
                   - Amount needed
                   - Use of funds
                   - Exit strategy

                Pro tips:
                - Update quarterly
                - Keep to 20-30 pages
                - Use data, not opinions
                - Be honest about risks
                ''',
                difficulty=Difficulty.BEGINNER,
                duration_minutes=20,
                topics_covered=['Business planning', 'Strategy', 'Financial planning'],
                created_at=datetime.utcnow(),
                order=5
            )
        }

        # Featured Articles
        self.articles = {
            'bd-success-story-1': Article(
                article_id='bd-success-story-1',
                title='How Foodpanda Became Bangladesh\'s Delivery Leader',
                author='Startup Reporter',
                content='''
                Foodpanda started in 2012 with a simple idea: online food delivery in Bangladesh.

                Key lessons:
                1. First-mover advantage in untapped market
                2. Strong logistics network
                3. Aggressive expansion to Dhaka
                4. Multiple funding rounds to scale

                Timeline:
                - 2012: Founded in Dhaka
                - 2014: 10,000+ restaurants
                - 2016: Series B funding
                - 2020: Market leader with 35% share

                Success factors:
                - Understood local market
                - Built reliable logistics
                - Invested in customer experience
                - Strategic partnerships with restaurants

                Lessons for founders:
                - Start with specific use case
                - Build sustainable unit economics
                - Geographic expansion matters
                - Customer trust is critical
                ''',
                resource_type=ResourceType.CASE_STUDY,
                category='success-stories',
                tags=['e-commerce', 'food-delivery', 'scaling', 'Bangladesh'],
                reading_time_minutes=10,
                published_date=datetime.utcnow(),
                updated_date=datetime.utcnow(),
                featured=True
            ),
            'bd-success-story-2': Article(
                article_id='bd-success-story-2',
                title='Daraz: Building E-commerce in South Asia',
                author='Industry Analyst',
                content='''
                Daraz revolutionized online shopping in Bangladesh and beyond.

                Business model:
                1. Marketplace connecting sellers and buyers
                2. Logistics infrastructure (DarazX)
                3. Payment solutions

                Growth metrics:
                - 2012-2022: From 0 to $1B+ GMV
                - Expanded to 5 countries
                - Millions of active users
                - Thousands of sellers

                Key innovations:
                - Cash on delivery (crucial for trust)
                - Local logistics network
                - Mobile-first app
                - Seller empowerment programs

                Strategic moves:
                - Raised Series A, B, C funding
                - Acquired by Alibaba Group (2018)
                - Used capital for infrastructure
                - Expanded to Pakistan, Myanmar, Thailand

                Takeaways:
                - Regional opportunity identification
                - Infrastructure as competitive advantage
                - Trust-building in emerging markets
                - Local adaptation of global model
                ''',
                resource_type=ResourceType.CASE_STUDY,
                category='success-stories',
                tags=['e-commerce', 'marketplace', 'scaling', 'South Asia'],
                reading_time_minutes=12,
                published_date=datetime.utcnow(),
                updated_date=datetime.utcnow(),
                featured=True
            ),
            'common-mistakes': Article(
                article_id='common-mistakes',
                title='Top 10 Mistakes Bangladesh Startups Make',
                author='Founder Success',
                content='''
                Learning from others' mistakes can save months and money.

                1. WRONG PROBLEM
                   Problem: Building solution to problem nobody has
                   Solution: Spend 2+ months talking to 50+ potential customers

                2. NO UNIT ECONOMICS
                   Problem: Growing revenue but burning cash
                   Solution: Calculate CAC, LTV before scaling

                3. WEAK TEAM
                   Problem: All founders from same background
                   Solution: Build diverse team with complementary skills

                4. NO MARKET RESEARCH
                   Problem: Assuming you know the market
                   Solution: Research TAM/SAM/SOM with data

                5. PREMATURE SCALING
                   Problem: Hiring fast before product-market fit
                   Solution: Validate market demand first

                6. POOR FINANCIAL PLANNING
                   Problem: Burning money without clear runway
                   Solution: Build 3-year financial projections

                7. IGNORING COMPETITION
                   Problem: Thinking no one else does what you do
                   Solution: Analyze competitors and find differentiation

                8. NO DISTRIBUTION STRATEGY
                   Problem: Building product but no customer acquisition plan
                   Solution: Know exactly how to reach first 1000 customers

                9. CASH BURN PROBLEMS
                   Problem: Running out of cash before revenue kicks in
                   Solution: Plan for 18-24 month runway minimum

                10. FOUNDER CONFLICT
                   Problem: Co-founder disputes derailing business
                   Solution: Have clear vesting schedule and exit plan
                ''',
                resource_type=ResourceType.GUIDE,
                category='best-practices',
                tags=['mistakes', 'lessons', 'startup-survival'],
                reading_time_minutes=8,
                published_date=datetime.utcnow(),
                updated_date=datetime.utcnow(),
                featured=True
            )
        }

        # Glossary terms
        self.glossary = {
            'cac': GlossaryTerm(
                term_id='cac',
                term='CAC (Customer Acquisition Cost)',
                definition='Total cost to acquire one paying customer. Calculated as total marketing spend divided by new customers acquired.',
                category='unit-economics',
                related_terms=['LTV', 'payback-period', 'unit-economics'],
                example='If you spend $10,000 on marketing and acquire 100 customers, your CAC is $100.'
            ),
            'ltv': GlossaryTerm(
                term_id='ltv',
                term='LTV (Lifetime Value)',
                definition='Total profit a business expects to earn from a customer over their entire relationship.',
                category='unit-economics',
                related_terms=['CAC', 'LTV-CAC-ratio', 'churn-rate'],
                example='A customer paying $10/month with 50% gross margin staying 3 years has LTV = $10 × 0.5 × 36 = $180.'
            ),
            'tam': GlossaryTerm(
                term_id='tam',
                term='TAM (Total Addressable Market)',
                definition='The total revenue opportunity available if a company captured 100% market share in its addressable market.',
                category='market-sizing',
                related_terms=['SAM', 'SOM', 'market-size'],
                example='Online food delivery market in South Asia worth $50 billion is the TAM for a food delivery startup.'
            ),
            'mvp': GlossaryTerm(
                term_id='mvp',
                term='MVP (Minimum Viable Product)',
                definition='A product with just enough features to satisfy early customers and gather feedback for product development.',
                category='product-development',
                related_terms=['product-market-fit', 'iteration', 'launch'],
                example='A ride-sharing MVP might be a basic app with booking and payment, without advanced features.'
            ),
            'burn-rate': GlossaryTerm(
                term_id='burn-rate',
                term='Burn Rate',
                definition='The rate at which a company uses cash from its reserves. Typically measured as monthly cash burn.',
                category='finance',
                related_terms=['runway', 'cash-flow', 'profitability'],
                example='If you have $100,000 and burn $10,000 per month, your runway is 10 months.'
            ),
            'product-market-fit': GlossaryTerm(
                term_id='product-market-fit',
                term='Product-Market Fit',
                definition='When a product satisfies a strong market demand and has found the right target customer.',
                category='product-development',
                related_terms=['MVP', 'customer-validation', 'scaling'],
                example='When customers request features and stay engaged, you\'ve achieved product-market fit.'
            )
        }

        # FAQs
        self.faqs = {
            'faq-1': FAQ(
                faq_id='faq-1',
                question='How should I calculate my market size?',
                answer='Use top-down, bottom-up, and value chain approaches:\n\n1. TOP-DOWN: Total market size × your addressable segment\n2. BOTTOM-UP: Target customers × average revenue per customer\n3. VALUE CHAIN: Industry reports on similar markets\n\nUse all three to triangulate.',
                category='market-analysis',
                helpful_count=245,
                related_topics=['TAM', 'SAM', 'SOM', 'market-sizing'],
                video_url='https://example.com/market-sizing-video'
            ),
            'faq-2': FAQ(
                faq_id='faq-2',
                question='What\'s a healthy LTV:CAC ratio?',
                answer='Healthy benchmarks:\n- SaaS: LTV:CAC > 3x (or 4x for funded startups)\n- E-commerce: LTV:CAC > 2x\n- Marketplace: LTV:CAC > 3x\n\nBelow 2x means customer acquisition is too expensive for the value created.',
                category='unit-economics',
                helpful_count=189,
                related_topics=['CAC', 'LTV', 'profitability', 'unit-economics'],
                video_url='https://example.com/ltv-cac-video'
            ),
            'faq-3': FAQ(
                faq_id='faq-3',
                question='How long should my runway be?',
                answer='Recommended runways:\n- Early stage (pre-product): 12-18 months\n- Seed stage (post-MVP): 12-24 months\n- Series A: 18-24 months\n- Series B+: 24-36 months\n\nLonger runway = less pressure to raise, more time to find product-market fit.',
                category='fundraising',
                helpful_count=167,
                related_topics=['burn-rate', 'fundraising', 'cash-flow', 'runway'],
                video_url='https://example.com/runway-video'
            ),
            'faq-4': FAQ(
                faq_id='faq-4',
                question='When am I ready to fundraise?',
                answer='Readiness checklist:\n✓ Clear problem statement (customer interviews)\n✓ MVP built and launched\n✓ Early traction (50+ users or $1K+ revenue)\n✓ Founder team aligned on vision\n✓ Financial model (3-year projection)\n✓ Differentiation story\n\nMost investors want to see product-market fit signals.',
                category='fundraising',
                helpful_count=312,
                related_topics=['fundraising', 'pitch-deck', 'product-market-fit', 'traction'],
                video_url='https://example.com/fundraising-readiness-video'
            )
        }

        # Help contexts for platform features
        self.help_contexts = {
            'financial-dashboard': HelpContext(
                help_id='financial-dashboard',
                feature='Financial Projections Dashboard',
                brief_explanation='View 3-year revenue projections and unit economics for your startup.',
                detailed_explanation='''
                The Financial Dashboard shows:
                - Revenue projections (conservative/base/optimistic scenarios)
                - Unit economics (CAC, LTV, payback period)
                - Profitability timeline
                - Cash flow analysis
                - Break-even analysis

                Use this to:
                - Understand financial health
                - Plan fundraising needs
                - Model different growth scenarios
                - Track KPIs
                ''',
                related_glossary_terms=['CAC', 'LTV', 'burn-rate', 'runway'],
                related_articles=['common-mistakes'],
                video_tutorial_url='https://example.com/financial-dashboard-tutorial'
            ),
            'market-intel': HelpContext(
                help_id='market-intel',
                feature='Market Intelligence Dashboard',
                brief_explanation='Access real-time market data, competitor analysis, and industry benchmarks.',
                detailed_explanation='''
                Market Intelligence provides:
                - Live market sizing (TAM/SAM/SOM)
                - Competitor tracking and analysis
                - Industry benchmarks for your sector
                - Market trends and sentiment
                - Growth rate analysis

                Use this to:
                - Validate market opportunity
                - Understand competitive landscape
                - Benchmark your metrics
                - Make data-driven decisions
                ''',
                related_glossary_terms=['TAM', 'market-sizing', 'product-market-fit'],
                related_articles=['common-mistakes'],
                video_tutorial_url='https://example.com/market-intel-tutorial'
            ),
            'product-validation': HelpContext(
                help_id='product-validation',
                feature='Product Validation Module',
                brief_explanation='Prioritize features, conduct customer interviews, and define your MVP.',
                detailed_explanation='''
                Product Validation helps with:
                - Feature prioritization (MoSCoW method)
                - Customer development framework
                - Interview templates and analysis
                - MVP definition and planning
                - Dependency mapping

                Use this to:
                - Focus on most important features
                - Validate customer needs
                - Plan realistic MVP
                - Avoid building wrong product
                ''',
                related_glossary_terms=['MVP', 'product-market-fit', 'customer-validation'],
                related_articles=['unit-economics-101'],
                video_tutorial_url='https://example.com/product-validation-tutorial'
            )
        }

    # ========== LEARNING MODULES ==========

    def get_learning_modules(self, category: Optional[str] = None) -> List[Dict]:
        """Get learning modules"""
        modules = list(self.learning_modules.values())

        if category:
            modules = [m for m in modules if m.category == category]

        return sorted([{
            'id': m.module_id,
            'title': m.title,
            'description': m.description,
            'category': m.category,
            'difficulty': m.difficulty.value,
            'duration_minutes': m.duration_minutes,
            'topics_covered': m.topics_covered
        } for m in modules], key=lambda m: m.get('order', 999))

    def get_module_content(self, module_id: str) -> Optional[Dict]:
        """Get full module content"""
        module = self.learning_modules.get(module_id)
        if not module:
            return None

        return {
            'id': module.module_id,
            'title': module.title,
            'description': module.description,
            'content': module.content,
            'difficulty': module.difficulty.value,
            'duration_minutes': module.duration_minutes,
            'topics_covered': module.topics_covered
        }

    # ========== ARTICLES & CASE STUDIES ==========

    def get_articles(self, category: Optional[str] = None, featured_only: bool = False) -> List[Dict]:
        """Get articles"""
        articles = list(self.articles.values())

        if featured_only:
            articles = [a for a in articles if a.featured]

        if category:
            articles = [a for a in articles if a.category == category]

        return [{
            'id': a.article_id,
            'title': a.title,
            'author': a.author,
            'type': a.resource_type.value,
            'category': a.category,
            'tags': a.tags,
            'reading_time_minutes': a.reading_time_minutes,
            'published_date': a.published_date.isoformat(),
            'featured': a.featured
        } for a in articles]

    def get_article_content(self, article_id: str) -> Optional[Dict]:
        """Get full article content"""
        article = self.articles.get(article_id)
        if not article:
            return None

        return {
            'id': article.article_id,
            'title': article.title,
            'author': article.author,
            'content': article.content,
            'type': article.resource_type.value,
            'category': article.category,
            'tags': article.tags,
            'reading_time_minutes': article.reading_time_minutes,
            'published_date': article.published_date.isoformat()
        }

    # ========== GLOSSARY ==========

    def search_glossary(self, query: str) -> List[Dict]:
        """Search glossary by term"""
        query_lower = query.lower()
        results = []

        for term in self.glossary.values():
            if query_lower in term.term.lower() or query_lower in term.definition.lower():
                results.append({
                    'id': term.term_id,
                    'term': term.term,
                    'definition': term.definition,
                    'category': term.category,
                    'related_terms': term.related_terms,
                    'example': term.example
                })

        return results

    def get_glossary_term(self, term_id: str) -> Optional[Dict]:
        """Get specific glossary term"""
        term = self.glossary.get(term_id)
        if not term:
            return None

        return {
            'id': term.term_id,
            'term': term.term,
            'definition': term.definition,
            'category': term.category,
            'related_terms': term.related_terms,
            'example': term.example
        }

    def get_all_glossary_terms(self) -> List[Dict]:
        """Get all glossary terms"""
        return [{
            'id': t.term_id,
            'term': t.term,
            'category': t.category
        } for t in sorted(self.glossary.values(), key=lambda t: t.term)]

    # ========== FAQs ==========

    def get_faqs(self, category: Optional[str] = None) -> List[Dict]:
        """Get FAQs"""
        faqs = list(self.faqs.values())

        if category:
            faqs = [f for f in faqs if f.category == category]

        return [{
            'id': f.faq_id,
            'question': f.question,
            'category': f.category,
            'helpful_count': f.helpful_count,
            'related_topics': f.related_topics,
            'has_video': f.video_url is not None
        } for f in faqs]

    def get_faq_detail(self, faq_id: str) -> Optional[Dict]:
        """Get full FAQ details"""
        faq = self.faqs.get(faq_id)
        if not faq:
            return None

        return {
            'id': faq.faq_id,
            'question': faq.question,
            'answer': faq.answer,
            'category': faq.category,
            'helpful_count': faq.helpful_count,
            'related_topics': faq.related_topics,
            'video_url': faq.video_url
        }

    def mark_faq_helpful(self, faq_id: str) -> bool:
        """Mark FAQ as helpful"""
        faq = self.faqs.get(faq_id)
        if not faq:
            return False

        faq.helpful_count += 1
        return True

    # ========== CONTEXTUAL HELP ==========

    def get_contextual_help(self, feature: str) -> Optional[Dict]:
        """Get contextual help for a feature"""
        help_ctx = self.help_contexts.get(feature)
        if not help_ctx:
            return None

        return {
            'id': help_ctx.help_id,
            'feature': help_ctx.feature,
            'brief_explanation': help_ctx.brief_explanation,
            'detailed_explanation': help_ctx.detailed_explanation,
            'related_glossary_terms': help_ctx.related_glossary_terms,
            'related_articles': help_ctx.related_articles,
            'video_tutorial_url': help_ctx.video_tutorial_url
        }

    # ========== DASHBOARD SUMMARY ==========

    def get_education_summary(self) -> Dict:
        """Get education resources summary"""
        return {
            'total_modules': len(self.learning_modules),
            'total_articles': len(self.articles),
            'glossary_terms': len(self.glossary),
            'total_faqs': len(self.faqs),
            'modules_by_category': self._count_by_category(self.learning_modules.values(), 'category'),
            'articles_by_category': self._count_by_category(self.articles.values(), 'category'),
            'featured_articles': len([a for a in self.articles.values() if a.featured]),
            'total_reading_hours': sum(a.reading_time_minutes for a in self.articles.values()) / 60
        }

    def _count_by_category(self, items, category_key):
        """Count items by category"""
        counts = {}
        for item in items:
            category = getattr(item, category_key)
            counts[category] = counts.get(category, 0) + 1
        return counts


# Global education service instance
education_resources_service = EducationResourcesService()
