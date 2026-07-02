"""
Startup School Features - Founder Academy, Community, Mentorship
"""

from typing import Dict, List, Optional
from datetime import datetime
from dataclasses import dataclass
from enum import Enum


class CourseDifficulty(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


@dataclass
class Course:
    """Academy course"""
    course_id: str
    title: str
    description: str
    difficulty: CourseDifficulty
    duration_hours: int
    instructor: str
    topics: List[str]
    enrolled_count: int
    completion_rate: float
    has_certificate: bool


@dataclass
class Mentor:
    """Mentor profile"""
    mentor_id: str
    name: str
    expertise: List[str]
    background: str
    bio: str
    availability: str
    response_time_hours: int
    rating: float
    mentees_count: int


@dataclass
class ForumThread:
    """Community forum thread"""
    thread_id: str
    title: str
    content: str
    author: str
    category: str
    created_at: datetime
    replies_count: int
    views_count: int
    helpful_votes: int


@dataclass
class MentorshipMatch:
    """Mentor-mentee matching"""
    match_id: str
    mentor_id: str
    mentee_id: str
    start_date: datetime
    end_date: Optional[datetime]
    focus_areas: List[str]
    status: str  # active, completed, paused
    meetings_scheduled: int


class StartupSchoolService:
    """Service for startup school and community features"""

    def __init__(self):
        self.courses: Dict[str, Course] = {}
        self.mentors: Dict[str, Mentor] = {}
        self.forum_threads: Dict[str, ForumThread] = {}
        self.mentorship_matches: Dict[str, MentorshipMatch] = {}
        self.user_enrollments: Dict[str, List[str]] = {}

        self._initialize_content()

    def _initialize_content(self):
        """Initialize academy courses and mentors"""
        # Founder Academy Courses
        self.courses = {
            'course-ideation': Course(
                course_id='course-ideation',
                title='Ideation & Problem Validation',
                description='Learn how to identify problems worth solving',
                difficulty=CourseDifficulty.BEGINNER,
                duration_hours=4,
                instructor='Startup Mentor',
                topics=['Problem identification', 'Customer interviews', 'Validation'],
                enrolled_count=245,
                completion_rate=78.5,
                has_certificate=True
            ),
            'course-mvp': Course(
                course_id='course-mvp',
                title='Building Your First MVP',
                description='Strategies for minimum viable product development',
                difficulty=CourseDifficulty.BEGINNER,
                duration_hours=6,
                instructor='Product Expert',
                topics=['MVP design', 'Rapid prototyping', 'User testing'],
                enrolled_count=312,
                completion_rate=82.3,
                has_certificate=True
            ),
            'course-fundraising': Course(
                course_id='course-fundraising',
                title='Fundraising Masterclass',
                description='Complete guide to seed funding and beyond',
                difficulty=CourseDifficulty.ADVANCED,
                duration_hours=8,
                instructor='Fundraising Expert',
                topics=['Pitch decks', 'Term sheets', 'Due diligence', 'Negotiations'],
                enrolled_count=156,
                completion_rate=71.2,
                has_certificate=True
            ),
            'course-growth': Course(
                course_id='course-growth',
                title='Growth Hacking & Scaling',
                description='Rapid growth strategies for early-stage startups',
                difficulty=CourseDifficulty.INTERMEDIATE,
                duration_hours=7,
                instructor='Growth Strategist',
                topics=['Viral loops', 'Retention', 'Unit economics', 'Metrics'],
                enrolled_count=189,
                completion_rate=75.8,
                has_certificate=True
            ),
            'course-finance': Course(
                course_id='course-finance',
                title='Startup Finance & Accounting',
                description='Financial fundamentals every founder needs to know',
                difficulty=CourseDifficulty.INTERMEDIATE,
                duration_hours=5,
                instructor='Finance Advisor',
                topics=['P&L', 'Cash flow', 'Burn rate', 'Unit economics'],
                enrolled_count=198,
                completion_rate=79.1,
                has_certificate=True
            )
        }

        # Expert Mentors
        self.mentors = {
            'mentor-1': Mentor(
                mentor_id='mentor-1',
                name='Ahmed Hassan',
                expertise=['SaaS', 'B2B', 'Fundraising', 'Growth'],
                background='Founded 2 successful startups, Investor',
                bio='Serial entrepreneur with 15+ years in tech',
                availability='Weekdays 6-8 PM',
                response_time_hours=4,
                rating=4.9,
                mentees_count=8
            ),
            'mentor-2': Mentor(
                mentor_id='mentor-2',
                name='Fatima Khan',
                expertise=['E-commerce', 'Operations', 'Team building', 'Supply chain'],
                background='Operations director at major retailer',
                bio='Expert in building scalable operations',
                availability='Weekdays 5-7 PM, Weekends',
                response_time_hours=2,
                rating=4.8,
                mentees_count=6
            ),
            'mentor-3': Mentor(
                mentor_id='mentor-3',
                name='Rahul Sharma',
                expertise=['Product', 'User experience', 'Customer development'],
                background='Product lead at Series B startup',
                bio='Passionate about building products users love',
                availability='Flexible, 48h notice',
                response_time_hours=8,
                rating=4.7,
                mentees_count=5
            )
        }

    # ========== FOUNDER ACADEMY ==========

    def get_courses(self, difficulty: Optional[str] = None) -> List[Dict]:
        """Get available courses"""
        courses = list(self.courses.values())

        if difficulty:
            courses = [c for c in courses if c.difficulty.value == difficulty]

        return [{
            'id': c.course_id,
            'title': c.title,
            'description': c.description,
            'difficulty': c.difficulty.value,
            'duration_hours': c.duration_hours,
            'instructor': c.instructor,
            'enrolled': c.enrolled_count,
            'completion_rate': c.completion_rate,
            'certificate': c.has_certificate
        } for c in courses]

    def get_course_details(self, course_id: str) -> Optional[Dict]:
        """Get full course details"""
        course = self.courses.get(course_id)
        if not course:
            return None

        return {
            'id': course.course_id,
            'title': course.title,
            'description': course.description,
            'difficulty': course.difficulty.value,
            'duration_hours': course.duration_hours,
            'instructor': course.instructor,
            'topics': course.topics,
            'enrolled': course.enrolled_count,
            'completion_rate': course.completion_rate,
            'certificate': course.has_certificate
        }

    def enroll_course(self, user_id: str, course_id: str) -> bool:
        """Enroll user in course"""
        course = self.courses.get(course_id)
        if not course:
            return False

        if user_id not in self.user_enrollments:
            self.user_enrollments[user_id] = []

        if course_id not in self.user_enrollments[user_id]:
            self.user_enrollments[user_id].append(course_id)
            course.enrolled_count += 1

        return True

    # ========== PEER COMMUNITY ==========

    def create_forum_thread(self, title: str, content: str, author: str, category: str) -> ForumThread:
        """Create forum thread"""
        thread_id = f"thread_{len(self.forum_threads)}"

        thread = ForumThread(
            thread_id=thread_id,
            title=title,
            content=content,
            author=author,
            category=category,
            created_at=datetime.utcnow(),
            replies_count=0,
            views_count=0,
            helpful_votes=0
        )

        self.forum_threads[thread_id] = thread
        return thread

    def get_forum_threads(self, category: Optional[str] = None) -> List[Dict]:
        """Get forum threads"""
        threads = list(self.forum_threads.values())

        if category:
            threads = [t for t in threads if t.category == category]

        return sorted([{
            'id': t.thread_id,
            'title': t.title,
            'author': t.author,
            'category': t.category,
            'created_at': t.created_at.isoformat(),
            'replies': t.replies_count,
            'views': t.views_count,
            'votes': t.helpful_votes
        } for t in threads], key=lambda t: t['views'], reverse=True)

    def get_forum_categories(self) -> List[str]:
        """Get forum categories"""
        categories = set()
        for thread in self.forum_threads.values():
            categories.add(thread.category)

        return sorted(list(categories)) if categories else ['General', 'Fundraising', 'Product', 'Growth', 'Hiring']

    def upvote_thread(self, thread_id: str) -> bool:
        """Upvote forum thread"""
        thread = self.forum_threads.get(thread_id)
        if not thread:
            return False

        thread.helpful_votes += 1
        return True

    # ========== MENTORSHIP PROGRAM ==========

    def get_mentors(self, expertise: Optional[str] = None) -> List[Dict]:
        """Get available mentors"""
        mentors = list(self.mentors.values())

        if expertise:
            mentors = [m for m in mentors if expertise in m.expertise]

        return sorted([{
            'id': m.mentor_id,
            'name': m.name,
            'expertise': m.expertise,
            'background': m.background,
            'availability': m.availability,
            'response_time': m.response_time_hours,
            'rating': m.rating,
            'mentees': m.mentees_count
        } for m in mentors], key=lambda m: m['rating'], reverse=True)

    def get_mentor_details(self, mentor_id: str) -> Optional[Dict]:
        """Get mentor profile"""
        mentor = self.mentors.get(mentor_id)
        if not mentor:
            return None

        return {
            'id': mentor.mentor_id,
            'name': mentor.name,
            'expertise': mentor.expertise,
            'background': mentor.background,
            'bio': mentor.bio,
            'availability': mentor.availability,
            'response_time': mentor.response_time_hours,
            'rating': mentor.rating,
            'mentees': mentor.mentees_count
        }

    def request_mentorship(self, mentor_id: str, mentee_id: str, focus_areas: List[str]) -> MentorshipMatch:
        """Request mentorship"""
        match_id = f"match_{len(self.mentorship_matches)}"

        match = MentorshipMatch(
            match_id=match_id,
            mentor_id=mentor_id,
            mentee_id=mentee_id,
            start_date=datetime.utcnow(),
            end_date=None,
            focus_areas=focus_areas,
            status='active',
            meetings_scheduled=0
        )

        self.mentorship_matches[match_id] = match
        return match

    def get_mentorship_status(self, user_id: str) -> Dict:
        """Get mentorship status for user"""
        active_matches = []
        for match in self.mentorship_matches.values():
            if (match.mentee_id == user_id or match.mentor_id == user_id) and match.status == 'active':
                active_matches.append({
                    'mentor': self.mentors[match.mentor_id].name if match.mentor_id in self.mentors else 'Unknown',
                    'mentee': match.mentee_id,
                    'focus_areas': match.focus_areas,
                    'meetings_scheduled': match.meetings_scheduled,
                    'started': match.start_date.isoformat()
                })

        return {
            'active_matches': len(active_matches),
            'matches': active_matches
        }

    # ========== DASHBOARD SUMMARY ==========

    def get_school_summary(self) -> Dict:
        """Get startup school summary"""
        total_enrolled = sum(len(users) for users in self.user_enrollments.values())

        return {
            'total_courses': len(self.courses),
            'total_mentors': len(self.mentors),
            'total_members': len(self.user_enrollments),
            'total_enrolled': total_enrolled,
            'forum_threads': len(self.forum_threads),
            'active_mentorships': len([m for m in self.mentorship_matches.values() if m.status == 'active']),
            'avg_course_rating': sum(c.completion_rate for c in self.courses.values()) / len(self.courses) if self.courses else 0,
            'avg_mentor_rating': sum(m.rating for m in self.mentors.values()) / len(self.mentors) if self.mentors else 0
        }


# Global startup school service instance
startup_school_service = StartupSchoolService()
