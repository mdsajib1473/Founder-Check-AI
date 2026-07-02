"""
Compliance & Legal - Regulatory checklist, legal documents, IP protection
"""

from typing import Dict, List, Optional
from datetime import datetime
from dataclasses import dataclass


@dataclass
class ComplianceItem:
    """Compliance checklist item"""
    item_id: str
    title: str
    description: str
    category: str
    status: str  # pending, in_progress, completed
    deadline: Optional[datetime]
    priority: str  # high, medium, low


@dataclass
class LegalTemplate:
    """Legal document template"""
    template_id: str
    name: str
    content: str
    document_type: str
    country: str
    customizable_fields: List[str]


@dataclass
class IPGuide:
    """IP Protection guide"""
    guide_id: str
    title: str
    steps: List[str]
    resources: List[str]
    estimated_cost: str
    timeline: str


class ComplianceLegalService:
    """Service for compliance, legal documents, and IP protection"""

    def __init__(self):
        self.compliance_items: Dict[str, ComplianceItem] = {}
        self.legal_templates: Dict[str, LegalTemplate] = {}
        self.ip_guides: Dict[str, IPGuide] = {}
        self.user_documents: Dict[str, List[str]] = {}

        self._initialize_content()

    def _initialize_content(self):
        """Initialize compliance and legal content"""
        # Bangladesh Compliance Checklist
        self.compliance_items = {
            'company-registration': ComplianceItem(
                item_id='company-registration',
                title='Company Registration',
                description='Register company with Bangladesh Registrar of Joint Stock Companies',
                category='incorporation',
                status='pending',
                deadline=None,
                priority='high'
            ),
            'tax-registration': ComplianceItem(
                item_id='tax-registration',
                title='Tax Registration (BIN)',
                description='Obtain Business Identification Number from NBR',
                category='tax',
                status='pending',
                deadline=None,
                priority='high'
            ),
            'bank-account': ComplianceItem(
                item_id='bank-account',
                title='Business Bank Account',
                description='Open dedicated business bank account',
                category='banking',
                status='pending',
                deadline=None,
                priority='high'
            ),
            'labor-compliance': ComplianceItem(
                item_id='labor-compliance',
                title='Labor Compliance',
                description='Follow Bangladesh Labor Law and BOESL regulations',
                category='hr',
                status='pending',
                deadline=None,
                priority='medium'
            ),
            'data-protection': ComplianceItem(
                item_id='data-protection',
                title='Data Protection Policy',
                description='Implement data protection per Bangladesh Data Protection Act',
                category='privacy',
                status='pending',
                deadline=None,
                priority='high'
            ),
            'insurance': ComplianceItem(
                item_id='insurance',
                title='Business Insurance',
                description='Obtain appropriate business liability insurance',
                category='insurance',
                status='pending',
                deadline=None,
                priority='medium'
            )
        }

        # Legal Document Templates
        self.legal_templates = {
            'tos': LegalTemplate(
                template_id='tos',
                name='Terms of Service',
                content='''TERMS OF SERVICE

1. ACCEPTANCE OF TERMS
By accessing this website, you accept these terms and conditions.

2. USE LICENSE
Permission is granted to temporarily download materials for viewing.

3. DISCLAIMER
Materials provided are on an "as is" basis without warranties.

4. LIMITATIONS
In no case shall our company be liable for damages.

5. ACCURACY OF MATERIALS
Materials on website may contain technical inaccuracies.

6. MODIFICATIONS
We may modify terms at any time.

7. GOVERNING LAW
These terms are governed by Bangladesh law.''',
                document_type='terms_of_service',
                country='Bangladesh',
                customizable_fields=['company_name', 'website_url', 'contact_email']
            ),
            'privacy': LegalTemplate(
                template_id='privacy',
                name='Privacy Policy',
                content='''PRIVACY POLICY

1. INFORMATION WE COLLECT
- Personal information you provide
- Automatically collected data (cookies, logs)

2. HOW WE USE INFORMATION
- Provide and improve services
- Communication and support
- Analytics and research

3. DATA PROTECTION
- We implement security measures
- Data protection per Bangladesh law
- Regular security audits

4. THIRD PARTY SHARING
- No sharing without consent
- Legal requirement exceptions
- Third-party service providers

5. YOUR RIGHTS
- Access your personal data
- Request corrections
- Delete personal data (right to be forgotten)

6. CONTACT US
For privacy concerns, contact us at [contact_email]''',
                document_type='privacy_policy',
                country='Bangladesh',
                customizable_fields=['company_name', 'contact_email', 'data_officer_name']
            ),
            'founder-agreement': LegalTemplate(
                template_id='founder-agreement',
                name='Founder Agreement',
                content='''FOUNDER AGREEMENT

1. PARTIES
[Founder Names] agree to form a partnership.

2. EQUITY SPLIT
- Founder A: [%] equity
- Founder B: [%] equity

3. ROLES & RESPONSIBILITIES
[Define roles and responsibilities]

4. VESTING SCHEDULE
4 year vesting with 1 year cliff

5. TERMINATION PROVISIONS
Upon departure, equity treated per vesting schedule

6. DISPUTE RESOLUTION
Disputes resolved through mediation first

7. GOVERNING LAW
Bangladesh law governs this agreement''',
                document_type='founder_agreement',
                country='Bangladesh',
                customizable_fields=['founder_names', 'equity_splits', 'roles']
            )
        }

        # IP Protection Guides
        self.ip_guides = {
            'trademark': IPGuide(
                guide_id='trademark',
                title='Trademark Registration Guide',
                steps=[
                    'Step 1: Conduct trademark search via Bangladesh IP Office',
                    'Step 2: Prepare application with specifications',
                    'Step 3: File application with IP Office',
                    'Step 4: Pay filing fee (~৳5,000-10,000)',
                    'Step 5: Wait for examination (3-6 months)',
                    'Step 6: Respond to office actions if needed',
                    'Step 7: Receive registration certificate'
                ],
                resources=['Bangladesh IP Office', 'Trademark Agent', 'Legal Counsel'],
                estimated_cost='৳10,000-30,000',
                timeline='6-12 months'
            ),
            'patent': IPGuide(
                guide_id='patent',
                title='Patent Filing Guidance',
                steps=[
                    'Step 1: Document your invention',
                    'Step 2: Conduct prior art search',
                    'Step 3: Write detailed patent application',
                    'Step 4: File with Bangladesh Patent Office',
                    'Step 5: Pay application fee (~৳5,000)',
                    'Step 6: Provisional examination',
                    'Step 7: Complete examination (2-5 years)',
                    'Step 8: Grant or rejection'
                ],
                resources=['Patent Attorney', 'IP Office', 'Technical Documentation'],
                estimated_cost='৳50,000-150,000',
                timeline='2-5 years'
            ),
            'copyright': IPGuide(
                guide_id='copyright',
                title='Copyright Protection Steps',
                steps=[
                    'Step 1: Create original work (automatic copyright)',
                    'Step 2: Document creation date and ownership',
                    'Step 3: Add copyright notice to work',
                    'Step 4: Register with Bangladesh Copyright Office (optional)',
                    'Step 5: Maintain records of creation',
                    'Step 6: Monitor for infringement'
                ],
                resources=['Copyright Office', 'Documentation Systems'],
                estimated_cost='৳1,000-5,000 (optional registration)',
                timeline='Registration: 2-4 weeks (optional)'
            ),
            'nda': IPGuide(
                guide_id='nda',
                title='NDA Template & Execution',
                steps=[
                    'Step 1: Identify confidential information',
                    'Step 2: Draft NDA with clear terms',
                    'Step 3: Specify duration and scope',
                    'Step 4: Define exclusions from confidentiality',
                    'Step 5: Have legal review',
                    'Step 6: Get signatures before disclosure',
                    'Step 7: Keep executed copy secure'
                ],
                resources=['NDA Templates', 'Legal Counsel'],
                estimated_cost='৳5,000-15,000 (legal review)',
                timeline='1-2 weeks to draft'
            )
        }

    # ========== REGULATORY CHECKLIST ==========

    def get_compliance_checklist(self, category: Optional[str] = None) -> List[Dict]:
        """Get compliance checklist"""
        items = list(self.compliance_items.values())

        if category:
            items = [i for i in items if i.category == category]

        return [{
            'id': i.item_id,
            'title': i.title,
            'description': i.description,
            'category': i.category,
            'status': i.status,
            'priority': i.priority,
            'deadline': i.deadline.isoformat() if i.deadline else None
        } for i in items]

    def update_compliance_status(self, item_id: str, status: str) -> bool:
        """Update compliance item status"""
        item = self.compliance_items.get(item_id)
        if not item:
            return False

        item.status = status
        return True

    def get_compliance_summary(self) -> Dict:
        """Get compliance summary"""
        total = len(self.compliance_items)
        completed = len([i for i in self.compliance_items.values() if i.status == 'completed'])
        in_progress = len([i for i in self.compliance_items.values() if i.status == 'in_progress'])
        pending = len([i for i in self.compliance_items.values() if i.status == 'pending'])

        return {
            'total_items': total,
            'completed': completed,
            'in_progress': in_progress,
            'pending': pending,
            'completion_percentage': (completed / total * 100) if total > 0 else 0
        }

    # ========== LEGAL DOCUMENT GENERATOR ==========

    def get_legal_templates(self) -> List[Dict]:
        """Get available legal templates"""
        return [{
            'id': t.template_id,
            'name': t.name,
            'type': t.document_type,
            'country': t.country,
            'fields': t.customizable_fields
        } for t in self.legal_templates.values()]

    def generate_document(self, template_id: str, customizations: Dict) -> Optional[Dict]:
        """Generate legal document with customizations"""
        template = self.legal_templates.get(template_id)
        if not template:
            return None

        content = template.content
        for field, value in customizations.items():
            content = content.replace(f'[{field}]', str(value))

        return {
            'document_id': f"doc_{template_id}_{len(self.user_documents)}",
            'name': template.name,
            'content': content,
            'type': template.document_type,
            'generated_at': datetime.utcnow().isoformat()
        }

    def save_document(self, user_id: str, document: Dict) -> bool:
        """Save generated document"""
        if user_id not in self.user_documents:
            self.user_documents[user_id] = []

        self.user_documents[user_id].append(document['document_id'])
        return True

    # ========== IP PROTECTION GUIDE ==========

    def get_ip_guides(self) -> List[Dict]:
        """Get IP protection guides"""
        return [{
            'id': g.guide_id,
            'title': g.title,
            'cost': g.estimated_cost,
            'timeline': g.timeline
        } for g in self.ip_guides.values()]

    def get_ip_guide_details(self, guide_id: str) -> Optional[Dict]:
        """Get full IP guide details"""
        guide = self.ip_guides.get(guide_id)
        if not guide:
            return None

        return {
            'id': guide.guide_id,
            'title': guide.title,
            'steps': guide.steps,
            'resources': guide.resources,
            'cost': guide.estimated_cost,
            'timeline': guide.timeline
        }

    # ========== DASHBOARD SUMMARY ==========

    def get_compliance_dashboard(self) -> Dict:
        """Get compliance dashboard summary"""
        return {
            'checklist_summary': self.get_compliance_summary(),
            'total_templates': len(self.legal_templates),
            'total_ip_guides': len(self.ip_guides),
            'categories': list(set(i.category for i in self.compliance_items.values()))
        }


# Global compliance service instance
compliance_legal_service = ComplianceLegalService()
