import { useState } from 'react';
import { API_BASE_URL } from '../config';

interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration_hours: number;
  instructor: string;
  enrolled: number;
  completion_rate: number;
}

interface Mentor {
  id: string;
  name: string;
  expertise: string[];
  availability: string;
  rating: number;
  mentees: number;
}

interface ForumThread {
  id: string;
  title: string;
  author: string;
  category: string;
  replies: number;
  views: number;
  votes: number;
}

const StartupSchoolDashboard = () => {
  const [activeTab, setActiveTab] = useState<'academy' | 'community' | 'mentorship'>('academy');
  const [courses, setCourses] = useState<Course[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [threads, setThreads] = useState<ForumThread[]>([]);

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'beginner': return '#5A6B48';
      case 'intermediate': return '#9C6B1F';
      case 'advanced': return '#9C6B1F';
      default: return '#5a6169';
    }
  };

  const loadCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/school/courses`);
      const data = await response.json();
      setCourses(data.courses || []);
    } catch (error) {
      console.error('Failed to load courses:', error);
    }
  };

  const loadMentors = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/school/mentors`);
      const data = await response.json();
      setMentors(data.mentors || []);
    } catch (error) {
      console.error('Failed to load mentors:', error);
    }
  };

  const loadThreads = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/school/forum/threads`);
      const data = await response.json();
      setThreads(data.threads || []);
    } catch (error) {
      console.error('Failed to load threads:', error);
    }
  };

  const renderAcademyTab = () => (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#5A6B48' }}>Founder Academy</h3>
        <button
          onClick={loadCourses}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#5A6B48',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Load Courses
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        {courses.map(course => (
          <div key={course.id} style={{
            backgroundColor: 'rgba(0, 0, 0, 0)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid rgba(90, 107, 72, 0.10)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
              <h4 style={{ color: '#5a6169', margin: 0 }}>{course.title}</h4>
              <span style={{
                backgroundColor: getDifficultyColor(course.difficulty),
                color: '#23282e',
                padding: '0.25rem 0.75rem',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>
                {course.difficulty}
              </span>
            </div>
            <p style={{ color: '#8b9096', fontSize: '0.9rem', margin: '0.5rem 0' }}>
              {course.description}
            </p>
            <div style={{ color: '#8b9096', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              <div>By {course.instructor}</div>
              <div>{course.duration_hours} hours • {course.enrolled} enrolled</div>
              <div>Completion: {course.completion_rate}%</div>
            </div>
            <button style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#5a6169',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              Enroll Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCommunityTab = () => (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#5A6B48' }}>Peer Community</h3>
        <button
          onClick={loadThreads}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#5A6B48',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Load Discussions
        </button>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {threads.map(thread => (
          <div key={thread.id} style={{
            backgroundColor: 'rgba(0, 0, 0, 0)',
            padding: '1.25rem',
            borderRadius: '8px',
            borderLeft: '3px solid #5a6169'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
              <h4 style={{ color: '#23282e', margin: '0 0 0.25rem 0' }}>{thread.title}</h4>
              <span style={{
                backgroundColor: 'rgba(90, 107, 72, 0.10)',
                color: '#5a6169',
                padding: '0.25rem 0.75rem',
                borderRadius: '4px',
                fontSize: '0.8rem'
              }}>
                {thread.category}
              </span>
            </div>
            <div style={{ color: '#8b9096', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              Posted by {thread.author}
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', color: '#8b9096', fontSize: '0.8rem' }}>
              <span>{thread.views} views</span>
              <span>{thread.replies} replies</span>
              <span>{thread.votes} votes</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMentorshipTab = () => (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#5A6B48' }}>Mentorship Program</h3>
        <button
          onClick={loadMentors}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#5A6B48',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Find Mentor
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {mentors.map(mentor => (
          <div key={mentor.id} style={{
            backgroundColor: 'rgba(0, 0, 0, 0)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid rgba(156, 107, 31, 0.10)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
              <h4 style={{ color: '#9C6B1F', margin: 0 }}>{mentor.name}</h4>
              <div style={{
                backgroundColor: 'rgba(156, 107, 31, 0.10)',
                color: '#9C6B1F',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>
                {mentor.rating}
              </div>
            </div>
            <div style={{ color: '#8b9096', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              <div><strong>Expertise:</strong></div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                {mentor.expertise.map((exp, i) => (
                  <span key={i} style={{
                    backgroundColor: 'rgba(156, 107, 31, 0.10)',
                    color: '#9C6B1F',
                    padding: '0.1rem 0.5rem',
                    borderRadius: '3px',
                    fontSize: '0.75rem'
                  }}>
                    {exp}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <div>Availability: {mentor.availability}</div>
                <div>Mentees: {mentor.mentees}</div>
              </div>
            </div>
            <button style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#5a6169',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              Request Mentorship
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{
      backgroundColor: '#ffffff',
      color: '#23282e',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1px solid #5a6169'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        borderBottom: '1px solid #5a6169'
      }}>
        {[
          { key: 'academy', label: 'Academy', icon: '' },
          { key: 'community', label: 'Community', icon: '' },
          { key: 'mentorship', label: 'Mentors', icon: '' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            style={{
              padding: '1rem',
              backgroundColor: activeTab === tab.key ? 'rgba(90, 107, 72, 0.10)' : 'transparent',
              color: activeTab === tab.key ? '#5a6169' : '#8b9096',
              border: 'none',
              cursor: 'pointer',
              fontWeight: activeTab === tab.key ? 'bold' : 'normal'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'academy' && renderAcademyTab()}
        {activeTab === 'community' && renderCommunityTab()}
        {activeTab === 'mentorship' && renderMentorshipTab()}
      </div>
    </div>
  );
};

export default StartupSchoolDashboard;
