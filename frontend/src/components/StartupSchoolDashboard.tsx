import { useState } from 'react';

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
      case 'beginner': return '#00ff41';
      case 'intermediate': return '#ffaa44';
      case 'advanced': return '#ff4444';
      default: return '#00ffee';
    }
  };

  const loadCourses = async () => {
    try {
      const response = await fetch('http://localhost:9001/api/school/courses');
      const data = await response.json();
      setCourses(data.courses || []);
    } catch (error) {
      console.error('Failed to load courses:', error);
    }
  };

  const loadMentors = async () => {
    try {
      const response = await fetch('http://localhost:9001/api/school/mentors');
      const data = await response.json();
      setMentors(data.mentors || []);
    } catch (error) {
      console.error('Failed to load mentors:', error);
    }
  };

  const loadThreads = async () => {
    try {
      const response = await fetch('http://localhost:9001/api/school/forum/threads');
      const data = await response.json();
      setThreads(data.threads || []);
    } catch (error) {
      console.error('Failed to load threads:', error);
    }
  };

  const renderAcademyTab = () => (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#00ff41' }}>🎓 Founder Academy</h3>
        <button
          onClick={loadCourses}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#00ff41',
            color: '#0f2a47',
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
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid rgba(0, 255, 238, 0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
              <h4 style={{ color: '#00ffee', margin: 0 }}>{course.title}</h4>
              <span style={{
                backgroundColor: getDifficultyColor(course.difficulty),
                color: '#0f2a47',
                padding: '0.25rem 0.75rem',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>
                {course.difficulty}
              </span>
            </div>
            <p style={{ color: '#aaa', fontSize: '0.9rem', margin: '0.5rem 0' }}>
              {course.description}
            </p>
            <div style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              <div>By {course.instructor}</div>
              <div>{course.duration_hours} hours • {course.enrolled} enrolled</div>
              <div>Completion: {course.completion_rate}%</div>
            </div>
            <button style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#0055ff',
              color: '#fff',
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
        <h3 style={{ margin: 0, color: '#00ff41' }}>💬 Peer Community</h3>
        <button
          onClick={loadThreads}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#00ff41',
            color: '#0f2a47',
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
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            padding: '1.25rem',
            borderRadius: '8px',
            borderLeft: '3px solid #00ffee'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
              <h4 style={{ color: '#fff', margin: '0 0 0.25rem 0' }}>{thread.title}</h4>
              <span style={{
                backgroundColor: 'rgba(0, 255, 238, 0.2)',
                color: '#00ffee',
                padding: '0.25rem 0.75rem',
                borderRadius: '4px',
                fontSize: '0.8rem'
              }}>
                {thread.category}
              </span>
            </div>
            <div style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              Posted by {thread.author}
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', color: '#aaa', fontSize: '0.8rem' }}>
              <span>👁️ {thread.views} views</span>
              <span>💬 {thread.replies} replies</span>
              <span>👍 {thread.votes} votes</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMentorshipTab = () => (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#00ff41' }}>🤝 Mentorship Program</h3>
        <button
          onClick={loadMentors}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#00ff41',
            color: '#0f2a47',
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
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 165, 0, 0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
              <h4 style={{ color: '#ffaa44', margin: 0 }}>{mentor.name}</h4>
              <div style={{
                backgroundColor: 'rgba(255, 215, 0, 0.2)',
                color: '#ffd700',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>
                ⭐ {mentor.rating}
              </div>
            </div>
            <div style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              <div><strong>Expertise:</strong></div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                {mentor.expertise.map((exp, i) => (
                  <span key={i} style={{
                    backgroundColor: 'rgba(255, 165, 0, 0.2)',
                    color: '#ffaa44',
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
              backgroundColor: '#0055ff',
              color: '#fff',
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
      backgroundColor: '#0f2a47',
      color: '#fff',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1px solid #00ffee'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        borderBottom: '1px solid #00ffee'
      }}>
        {[
          { key: 'academy', label: '🎓 Academy', icon: '🎓' },
          { key: 'community', label: '💬 Community', icon: '💬' },
          { key: 'mentorship', label: '🤝 Mentors', icon: '🤝' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            style={{
              padding: '1rem',
              backgroundColor: activeTab === tab.key ? 'rgba(0, 255, 238, 0.2)' : 'transparent',
              color: activeTab === tab.key ? '#00ffee' : '#888',
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
