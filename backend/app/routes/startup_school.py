"""
Startup School API Routes
"""

from fastapi import APIRouter, HTTPException
from typing import List, Optional
from app.services.startup_school import startup_school_service

router = APIRouter(prefix="/api/school", tags=["Startup School"])


# ========== FOUNDER ACADEMY ==========

@router.get("/courses")
async def get_courses(difficulty: Optional[str] = None):
    """Get available courses"""
    try:
        courses = startup_school_service.get_courses(difficulty)
        return {
            'success': True,
            'courses': courses,
            'count': len(courses)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/courses/{course_id}")
async def get_course_details(course_id: str):
    """Get course details"""
    try:
        course = startup_school_service.get_course_details(course_id)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")

        return {
            'success': True,
            'course': course
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/courses/{course_id}/enroll")
async def enroll_course(course_id: str, user_id: str):
    """Enroll in course"""
    try:
        success = startup_school_service.enroll_course(user_id, course_id)
        if not success:
            raise HTTPException(status_code=404, detail="Course not found")

        return {
            'success': True,
            'message': 'Successfully enrolled in course',
            'course_id': course_id
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ========== PEER COMMUNITY ==========

@router.get("/forum/categories")
async def get_forum_categories():
    """Get forum categories"""
    try:
        categories = startup_school_service.get_forum_categories()
        return {
            'success': True,
            'categories': categories
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/forum/threads")
async def get_forum_threads(category: Optional[str] = None):
    """Get forum threads"""
    try:
        threads = startup_school_service.get_forum_threads(category)
        return {
            'success': True,
            'threads': threads,
            'count': len(threads)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/forum/threads/create")
async def create_forum_thread(title: str, content: str, author: str, category: str):
    """Create forum thread"""
    try:
        thread = startup_school_service.create_forum_thread(title, content, author, category)
        return {
            'success': True,
            'thread': {
                'id': thread.thread_id,
                'title': thread.title,
                'author': thread.author,
                'category': thread.category
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/forum/threads/{thread_id}/upvote")
async def upvote_thread(thread_id: str):
    """Upvote forum thread"""
    try:
        success = startup_school_service.upvote_thread(thread_id)
        if not success:
            raise HTTPException(status_code=404, detail="Thread not found")

        return {
            'success': True,
            'message': 'Thank you for your vote!'
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ========== MENTORSHIP PROGRAM ==========

@router.get("/mentors")
async def get_mentors(expertise: Optional[str] = None):
    """Get available mentors"""
    try:
        mentors = startup_school_service.get_mentors(expertise)
        return {
            'success': True,
            'mentors': mentors,
            'count': len(mentors)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/mentors/{mentor_id}")
async def get_mentor_details(mentor_id: str):
    """Get mentor profile"""
    try:
        mentor = startup_school_service.get_mentor_details(mentor_id)
        if not mentor:
            raise HTTPException(status_code=404, detail="Mentor not found")

        return {
            'success': True,
            'mentor': mentor
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/mentorship/request")
async def request_mentorship(mentor_id: str, mentee_id: str, focus_areas: List[str]):
    """Request mentorship"""
    try:
        match = startup_school_service.request_mentorship(mentor_id, mentee_id, focus_areas)
        return {
            'success': True,
            'match': {
                'id': match.match_id,
                'mentor': mentor_id,
                'mentee': mentee_id,
                'focus_areas': match.focus_areas,
                'status': 'pending_approval'
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/mentorship/status")
async def get_mentorship_status(user_id: str):
    """Get mentorship status"""
    try:
        status = startup_school_service.get_mentorship_status(user_id)
        return {
            'success': True,
            'status': status
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ========== DASHBOARD & SUMMARY ==========

@router.get("/summary")
async def get_school_summary():
    """Get startup school summary"""
    try:
        summary = startup_school_service.get_school_summary()
        return {
            'success': True,
            'summary': summary
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
