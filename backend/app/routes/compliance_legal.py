"""
Compliance & Legal API Routes
"""

from fastapi import APIRouter, HTTPException
from typing import Dict, Optional
from app.services.compliance_legal import compliance_legal_service

router = APIRouter(prefix="/api/compliance", tags=["Compliance & Legal"])


# ========== REGULATORY CHECKLIST ==========

@router.get("/checklist")
async def get_compliance_checklist(category: Optional[str] = None):
    """Get regulatory compliance checklist"""
    try:
        items = compliance_legal_service.get_compliance_checklist(category)
        return {'success': True, 'items': items, 'count': len(items)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/checklist/{item_id}/update")
async def update_compliance_status(item_id: str, status: str):
    """Update compliance item status"""
    try:
        success = compliance_legal_service.update_compliance_status(item_id, status)
        if not success:
            raise HTTPException(status_code=404, detail="Item not found")
        return {'success': True, 'message': 'Status updated'}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/summary")
async def get_compliance_summary():
    """Get compliance summary"""
    try:
        summary = compliance_legal_service.get_compliance_summary()
        return {'success': True, 'summary': summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ========== LEGAL DOCUMENT GENERATOR ==========

@router.get("/templates")
async def get_legal_templates():
    """Get available legal templates"""
    try:
        templates = compliance_legal_service.get_legal_templates()
        return {'success': True, 'templates': templates, 'count': len(templates)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate")
async def generate_legal_document(template_id: str, customizations: Dict):
    """Generate legal document"""
    try:
        doc = compliance_legal_service.generate_document(template_id, customizations)
        if not doc:
            raise HTTPException(status_code=404, detail="Template not found")
        return {'success': True, 'document': doc}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ========== IP PROTECTION GUIDE ==========

@router.get("/ip-guides")
async def get_ip_guides():
    """Get IP protection guides"""
    try:
        guides = compliance_legal_service.get_ip_guides()
        return {'success': True, 'guides': guides, 'count': len(guides)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/ip-guides/{guide_id}")
async def get_ip_guide_details(guide_id: str):
    """Get IP guide details"""
    try:
        guide = compliance_legal_service.get_ip_guide_details(guide_id)
        if not guide:
            raise HTTPException(status_code=404, detail="Guide not found")
        return {'success': True, 'guide': guide}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ========== DASHBOARD ==========

@router.get("/dashboard")
async def get_compliance_dashboard():
    """Get compliance dashboard"""
    try:
        dashboard = compliance_legal_service.get_compliance_dashboard()
        return {'success': True, 'dashboard': dashboard}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
