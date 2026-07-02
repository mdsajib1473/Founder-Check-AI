"""
Educational & Resources API Routes
"""

from fastapi import APIRouter, HTTPException
from typing import Optional
from app.services.education_resources import education_resources_service

router = APIRouter(prefix="/api/education", tags=["Education & Resources"])


# ========== LEARNING MODULES ==========

@router.get("/modules")
async def get_learning_modules(category: Optional[str] = None):
    """Get all learning modules"""
    try:
        modules = education_resources_service.get_learning_modules(category)
        return {
            'success': True,
            'modules': modules,
            'count': len(modules),
            'category': category
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/modules/{module_id}")
async def get_module_content(module_id: str):
    """Get full module content"""
    try:
        module = education_resources_service.get_module_content(module_id)
        if not module:
            raise HTTPException(status_code=404, detail="Module not found")

        return {
            'success': True,
            'module': module
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ========== ARTICLES & CASE STUDIES ==========

@router.get("/articles")
async def get_articles(category: Optional[str] = None, featured: bool = False):
    """Get articles and case studies"""
    try:
        articles = education_resources_service.get_articles(category, featured)
        return {
            'success': True,
            'articles': articles,
            'count': len(articles)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/articles/{article_id}")
async def get_article_content(article_id: str):
    """Get full article content"""
    try:
        article = education_resources_service.get_article_content(article_id)
        if not article:
            raise HTTPException(status_code=404, detail="Article not found")

        return {
            'success': True,
            'article': article
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ========== GLOSSARY ==========

@router.get("/glossary")
async def get_all_glossary():
    """Get all glossary terms"""
    try:
        terms = education_resources_service.get_all_glossary_terms()
        return {
            'success': True,
            'terms': terms,
            'count': len(terms)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/glossary/search")
async def search_glossary(q: str):
    """Search glossary"""
    try:
        if not q or len(q) < 2:
            raise HTTPException(status_code=400, detail="Query must be at least 2 characters")

        results = education_resources_service.search_glossary(q)
        return {
            'success': True,
            'results': results,
            'count': len(results),
            'query': q
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/glossary/{term_id}")
async def get_glossary_term(term_id: str):
    """Get glossary term details"""
    try:
        term = education_resources_service.get_glossary_term(term_id)
        if not term:
            raise HTTPException(status_code=404, detail="Term not found")

        return {
            'success': True,
            'term': term
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ========== FAQs ==========

@router.get("/faqs")
async def get_faqs(category: Optional[str] = None):
    """Get FAQs"""
    try:
        faqs = education_resources_service.get_faqs(category)
        return {
            'success': True,
            'faqs': faqs,
            'count': len(faqs)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/faqs/{faq_id}")
async def get_faq_detail(faq_id: str):
    """Get full FAQ details"""
    try:
        faq = education_resources_service.get_faq_detail(faq_id)
        if not faq:
            raise HTTPException(status_code=404, detail="FAQ not found")

        return {
            'success': True,
            'faq': faq
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/faqs/{faq_id}/helpful")
async def mark_faq_helpful(faq_id: str):
    """Mark FAQ as helpful"""
    try:
        success = education_resources_service.mark_faq_helpful(faq_id)
        if not success:
            raise HTTPException(status_code=404, detail="FAQ not found")

        return {
            'success': True,
            'message': 'Thank you for your feedback!',
            'faq_id': faq_id
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ========== CONTEXTUAL HELP ==========

@router.get("/help/{feature}")
async def get_contextual_help(feature: str):
    """Get contextual help for a feature"""
    try:
        help_ctx = education_resources_service.get_contextual_help(feature)
        if not help_ctx:
            return {
                'success': True,
                'help': None,
                'message': 'No help available for this feature yet'
            }

        return {
            'success': True,
            'help': help_ctx
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ========== DASHBOARD & SUMMARY ==========

@router.get("/summary")
async def get_education_summary():
    """Get education resources summary"""
    try:
        summary = education_resources_service.get_education_summary()
        return {
            'success': True,
            'summary': summary
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ========== SEARCH ==========

@router.get("/search")
async def search_all(q: str):
    """Search across all educational resources"""
    try:
        if not q or len(q) < 2:
            raise HTTPException(status_code=400, detail="Query must be at least 2 characters")

        results = {
            'modules': education_resources_service.get_learning_modules(),
            'articles': education_resources_service.get_articles(),
            'glossary': education_resources_service.search_glossary(q),
            'faqs': education_resources_service.get_faqs()
        }

        # Filter by query
        filtered_modules = [m for m in results['modules'] if q.lower() in m.get('title', '').lower()]
        filtered_articles = [a for a in results['articles'] if q.lower() in a.get('title', '').lower()]
        filtered_faqs = [f for f in results['faqs'] if q.lower() in f.get('question', '').lower()]

        return {
            'success': True,
            'query': q,
            'results': {
                'modules': filtered_modules,
                'articles': filtered_articles,
                'glossary_terms': results['glossary'],
                'faqs': filtered_faqs
            },
            'total_results': len(filtered_modules) + len(filtered_articles) + len(results['glossary']) + len(filtered_faqs)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
