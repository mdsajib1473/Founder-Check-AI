import React, { useState } from 'react'

interface Props {
  analysis_id?: number;
}

type Tab = 'team' | 'advisors' | 'investors' | 'comments' | 'activity'

const CollaborationHub: React.FC<Props> = () => {
  const [activeTab, setActiveTab] = useState<Tab>('team');
  const [workspaceMembers, setWorkspaceMembers] = useState<any[]>([
    { user_id: '1', name: 'John (Founder)', role: 'admin', joined_at: '2026-07-01' },
    { user_id: '2', name: 'Sarah (Co-founder)', role: 'member', joined_at: '2026-07-01' }
  ]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [advisors] = useState<any[]>([
    {
      advisor_id: 'a1',
      name: 'Dr. Ahmed Khan',
      expertise: ['Tech', 'Fintech'],
      rating: 4.9,
      hourly_rate: 1000,
      reviews: 45
    },
    {
      advisor_id: 'a2',
      name: 'Fatima Begum',
      expertise: ['E-commerce', 'Logistics'],
      rating: 4.8,
      hourly_rate: 800,
      reviews: 32
    }
  ]);
  const [comments, setComments] = useState<any[]>([
    {
      comment_id: '1',
      author: 'John',
      text: 'Great market analysis! We should focus on segment A.',
      created_at: '2 hours ago'
    },
    {
      comment_id: '2',
      author: 'Sarah',
      text: 'Agreed. I also think the CAC is conservative.',
      created_at: '1 hour ago'
    }
  ]);
  const [newComment, setNewComment] = useState('');
  const [outreachStatus] = useState<any[]>([
    {
      investor: 'Venture Partners',
      status: 'viewed',
      sent: '3 days ago'
    },
    {
      investor: 'Angel Network',
      status: 'interested',
      sent: '5 days ago'
    }
  ]);

  const handleInviteMember = () => {
    if (inviteEmail.trim()) {
      setWorkspaceMembers([...workspaceMembers, {
        user_id: Date.now().toString(),
        name: inviteEmail.split('@')[0],
        role: 'member',
        joined_at: new Date().toLocaleDateString()
      }]);
      setInviteEmail('');
    }
  };

  const handleRequestConsultation = (advisor: any) => {
    alert(`Consultation request sent to ${advisor.name}!`);
  };

  const addComment = () => {
    if (newComment.trim()) {
      setComments([...comments, {
        comment_id: Date.now().toString(),
        author: 'You',
        text: newComment,
        created_at: 'just now'
      }]);
      setNewComment('');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#23282e', marginBottom: '24px' }}>Collaboration & Networking</h2>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(35, 40, 46, 0.08)', flexWrap: 'wrap' }}>
        {[
          { id: 'team' as Tab, label: 'Team Workspace' },
          { id: 'advisors' as Tab, label: 'Advisor Network' },
          { id: 'investors' as Tab, label: 'Investor Connect' },
          { id: 'comments' as Tab, label: 'Comments' },
          { id: 'activity' as Tab, label: 'Activity' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 16px',
              background: activeTab === tab.id ? 'rgba(90, 107, 72, 0.10)' : 'transparent',
              border: activeTab === tab.id ? '1px solid #5A6B48' : '1px solid rgba(35, 40, 46, 0.08)',
              color: activeTab === tab.id ? '#5A6B48' : '#5a6169',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: activeTab === tab.id ? '700' : '600'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Team Tab */}
      {activeTab === 'team' && (
        <div>
          <h3 style={{ color: '#23282e', marginBottom: '16px', fontSize: '16px' }}>Team Members</h3>

          {/* Invite */}
          <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(35, 40, 46, 0.05)', borderRadius: '8px', border: '1px solid rgba(35, 40, 46, 0.05)' }}>
            <h4 style={{ color: '#5a6169', marginBottom: '12px', fontSize: '14px' }}>Invite Team Member</h4>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="email"
                placeholder="Email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  background: 'rgba(35, 40, 46, 0.08)',
                  border: '1px solid rgba(35, 40, 46, 0.08)',
                  borderRadius: '6px',
                  color: '#5a6169',
                  fontSize: '13px'
                }}
              />
              <button
                onClick={handleInviteMember}
                style={{
                  padding: '10px 16px',
                  background: '#5A6B48',
                  color: '#23282e',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Invite
              </button>
            </div>
          </div>

          {/* Members List */}
          <div style={{ display: 'grid', gap: '12px' }}>
            {workspaceMembers.map((member, i) => (
              <div key={i} style={{ padding: '16px', background: 'rgba(35, 40, 46, 0.08)', borderRadius: '8px', border: '1px solid rgba(35, 40, 46, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ color: '#23282e', fontWeight: '600', marginBottom: '4px' }}>{member.name}</p>
                  <p style={{ color: '#8b9096', fontSize: '12px' }}>Role: {member.role} • Joined {member.joined_at}</p>
                </div>
                <span style={{ padding: '4px 12px', background: member.role === 'admin' ? 'rgba(156, 107, 31, 0.10)' : 'rgba(90, 107, 72, 0.10)', color: member.role === 'admin' ? '#9C6B1F' : '#5A6B48', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
                  {member.role}
                </span>
              </div>
            ))}
          </div>

          {/* Workspace Stats */}
          <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={{ padding: '16px', background: 'rgba(35, 40, 46, 0.05)', borderRadius: '8px' }}>
              <p style={{ color: '#8b9096', fontSize: '12px', marginBottom: '4px' }}>Total Members</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#5a6169' }}>{workspaceMembers.length}</p>
            </div>
            <div style={{ padding: '16px', background: 'rgba(90, 107, 72, 0.10)', borderRadius: '8px' }}>
              <p style={{ color: '#8b9096', fontSize: '12px', marginBottom: '4px' }}>Comments</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#5A6B48' }}>{comments.length}</p>
            </div>
            <div style={{ padding: '16px', background: 'rgba(35, 40, 46, 0.05)', borderRadius: '8px' }}>
              <p style={{ color: '#8b9096', fontSize: '12px', marginBottom: '4px' }}>Shared Analyses</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#5a6169' }}>3</p>
            </div>
          </div>
        </div>
      )}

      {/* Advisors Tab */}
      {activeTab === 'advisors' && (
        <div>
          <h3 style={{ color: '#23282e', marginBottom: '16px', fontSize: '16px' }}>Find Expert Advisors</h3>
          <p style={{ color: '#8b9096', marginBottom: '20px', fontSize: '13px' }}>Connect with experienced mentors in your sector</p>

          <div style={{ display: 'grid', gap: '16px' }}>
            {advisors.map((advisor, i) => (
              <div key={i} style={{ padding: '20px', background: 'rgba(35, 40, 46, 0.05)', borderRadius: '8px', border: '1px solid rgba(35, 40, 46, 0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ color: '#23282e', marginBottom: '8px', fontSize: '15px', fontWeight: '600' }}>
                      {advisor.name}
                    </h4>
                    <p style={{ color: '#8b9096', fontSize: '12px', marginBottom: '12px' }}>
                      {advisor.rating} ({advisor.reviews} reviews)
                    </p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {advisor.expertise.map((exp: string, j: number) => (
                        <span key={j} style={{ padding: '4px 12px', background: 'rgba(90, 107, 72, 0.10)', color: '#5A6B48', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#5a6169', fontWeight: '700', marginBottom: '12px' }}>৳{advisor.hourly_rate}/hour</p>
                    <button
                      onClick={() => handleRequestConsultation(advisor)}
                      style={{
                        padding: '10px 16px',
                        background: '#5a6169',
                        color: '#23282e',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '12px'
                      }}
                    >
                      Request
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Investors Tab */}
      {activeTab === 'investors' && (
        <div>
          <h3 style={{ color: '#23282e', marginBottom: '16px', fontSize: '16px' }}>Investor Outreach</h3>

          <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(90, 107, 72, 0.10)', borderRadius: '8px', border: '2px solid #5A6B48' }}>
            <h4 style={{ color: '#5A6B48', marginBottom: '12px', fontSize: '14px' }}>Send to Investors</h4>
            <p style={{ color: '#5a6169', fontSize: '12px', marginBottom: '12px' }}>Share your analysis with angel investors and VCs</p>
            <button style={{ padding: '10px 16px', background: '#5A6B48', color: '#23282e', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}>
              Share with Investors
            </button>
          </div>

          <h4 style={{ color: '#23282e', marginBottom: '16px', fontSize: '14px' }}>Outreach Status</h4>
          <div style={{ display: 'grid', gap: '12px' }}>
            {outreachStatus.map((item, i) => (
              <div key={i} style={{ padding: '16px', background: 'rgba(35, 40, 46, 0.05)', borderRadius: '8px', border: '1px solid rgba(35, 40, 46, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ color: '#23282e', fontWeight: '600' }}>{item.investor}</p>
                  <p style={{ color: '#8b9096', fontSize: '12px' }}>Sent {item.sent}</p>
                </div>
                <span style={{ padding: '6px 12px', background: item.status === 'interested' ? 'rgba(90, 107, 72, 0.10)' : item.status === 'viewed' ? 'rgba(35, 40, 46, 0.05)' : 'rgba(156, 107, 31, 0.10)', color: item.status === 'interested' ? '#5A6B48' : item.status === 'viewed' ? '#5a6169' : '#9C6B1F', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments Tab */}
      {activeTab === 'comments' && (
        <div>
          <h3 style={{ color: '#23282e', marginBottom: '16px', fontSize: '16px' }}>Team Discussion</h3>

          {/* New Comment */}
          <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(90, 107, 72, 0.10)', borderRadius: '8px', border: '1px solid rgba(90, 107, 72, 0.10)' }}>
            <textarea
              placeholder="Add your comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(35, 40, 46, 0.08)',
                border: '1px solid rgba(35, 40, 46, 0.08)',
                borderRadius: '6px',
                color: '#5a6169',
                fontSize: '13px',
                marginBottom: '12px',
                minHeight: '80px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
            <button
              onClick={addComment}
              style={{
                padding: '10px 16px',
                background: '#5A6B48',
                color: '#23282e',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Comment
            </button>
          </div>

          {/* Comments List */}
          <div style={{ display: 'grid', gap: '12px' }}>
            {comments.map((comment, i) => (
              <div key={i} style={{ padding: '16px', background: 'rgba(35, 40, 46, 0.08)', borderRadius: '8px', border: '1px solid rgba(35, 40, 46, 0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <p style={{ color: '#23282e', fontWeight: '600', fontSize: '13px' }}>{comment.author}</p>
                  <p style={{ color: '#8b9096', fontSize: '11px' }}>{comment.created_at}</p>
                </div>
                <p style={{ color: '#5a6169', fontSize: '13px', lineHeight: '1.5' }}>{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div>
          <h3 style={{ color: '#23282e', marginBottom: '16px', fontSize: '16px' }}>Team Activity</h3>

          <div style={{ display: 'grid', gap: '12px' }}>
            {[
              { time: '2 hours ago', action: 'John shared analysis with Sarah', icon: '' },
              { time: '4 hours ago', action: 'Sarah commented on Market Analysis', icon: '' },
              { time: '1 day ago', action: 'Team workspace created', icon: '' },
              { time: '1 day ago', action: 'John added Sarah as team member', icon: '' }
            ].map((activity, i) => (
              <div key={i} style={{ padding: '16px', background: 'rgba(35, 40, 46, 0.08)', borderRadius: '8px', border: '1px solid rgba(35, 40, 46, 0.08)', display: 'flex', gap: '12px' }}>
                <span style={{ fontSize: '20px', minWidth: '24px', textAlign: 'center' }}>{activity.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#5a6169', fontSize: '13px' }}>{activity.action}</p>
                  <p style={{ color: '#8b9096', fontSize: '11px', marginTop: '4px' }}>{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaborationHub;
