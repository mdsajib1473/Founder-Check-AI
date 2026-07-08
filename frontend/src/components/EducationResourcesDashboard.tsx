import { useState } from 'react';
import { API_BASE_URL } from '../config';

interface LearningModule {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration_minutes: number;
  topics_covered: string[];
}

interface Article {
  id: string;
  title: string;
  author: string;
  reading_time_minutes: number;
  category: string;
  featured: boolean;
}

interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: string;
  example?: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful_count: number;
  has_video: boolean;
}

const EducationResourcesDashboard = () => {
  const [activeTab, setActiveTab] = useState<'modules' | 'articles' | 'glossary' | 'faqs' | 'help'>('modules');
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [glossaryTerms, setGlossaryTerms] = useState<GlossaryTerm[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadModules = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/education/modules`);
      const data = await response.json();
      setModules(data.modules || []);
    } catch (error) {
      console.error('Failed to load modules:', error);
    }
  };

  const loadArticles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/education/articles`);
      const data = await response.json();
      setArticles(data.articles || []);
    } catch (error) {
      console.error('Failed to load articles:', error);
    }
  };

  const loadGlossary = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/education/glossary`);
      const data = await response.json();
      setGlossaryTerms(data.terms || []);
    } catch (error) {
      console.error('Failed to load glossary:', error);
    }
  };

  const loadFAQs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/education/faqs`);
      const data = await response.json();
      setFaqs(data.faqs || []);
    } catch (error) {
      console.error('Failed to load FAQs:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'beginner': return '#5A6B48';
      case 'intermediate': return '#9C6B1F';
      case 'advanced': return '#9C6B1F';
      default: return '#5a6169';
    }
  };

  const renderModulesTab = () => (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#5A6B48', marginBottom: '1.5rem' }}>Learning Modules</h3>
        <button
          onClick={() => {
            loadModules();
            setSelectedModule(null);
          }}
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
          Load Modules
        </button>
      </div>

      {selectedModule ? (
        <div style={{
          backgroundColor: 'rgba(90, 107, 72, 0.10)',
          padding: '2rem',
          borderRadius: '8px',
          border: '1px solid rgba(90, 107, 72, 0.10)'
        }}>
          <button
            onClick={() => setSelectedModule(null)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#5a6169',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
          >
            ← Back
          </button>
          <h2 style={{ color: '#5a6169', marginTop: 0 }}>{selectedModule.title}</h2>
          <div style={{ color: '#8b9096', marginBottom: '1rem' }}>
            {selectedModule.difficulty} • {selectedModule.duration_minutes} mins
          </div>
          <div style={{ color: '#23282e', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
            {selectedModule.content}
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {modules.map(module => (
            <div
              key={module.id}
              onClick={async () => {
                const response = await fetch(`${API_BASE_URL}/api/education/modules/${module.id}`);
                const data = await response.json();
                setSelectedModule(data.module);
              }}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0)',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '1px solid rgba(90, 107, 72, 0.10)',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(90, 107, 72, 0.10)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0)';
              }}
            >
              <h4 style={{ color: '#5a6169', margin: '0 0 0.5rem 0' }}>{module.title}</h4>
              <p style={{ color: '#8b9096', fontSize: '0.9rem', margin: '0.5rem 0' }}>
                {module.description}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '1rem' }}>
                <span style={{
                  backgroundColor: getDifficultyColor(module.difficulty),
                  color: '#23282e',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  {module.difficulty}
                </span>
                <span style={{ color: '#8b9096', fontSize: '0.8rem' }}>
                  {module.duration_minutes} mins
                </span>
              </div>
              <div style={{ marginTop: '0.75rem', color: '#5a6169', fontSize: '0.8rem' }}>
                {module.topics_covered.join(' • ')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderArticlesTab = () => (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#5A6B48', marginBottom: '1.5rem' }}>Articles & Case Studies</h3>
        <button
          onClick={() => {
            loadArticles();
            setSelectedArticle(null);
          }}
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
          Load Articles
        </button>
      </div>

      {selectedArticle ? (
        <div style={{
          backgroundColor: 'rgba(90, 107, 72, 0.10)',
          padding: '2rem',
          borderRadius: '8px',
          border: '1px solid rgba(90, 107, 72, 0.10)'
        }}>
          <button
            onClick={() => setSelectedArticle(null)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#5a6169',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
          >
            ← Back
          </button>
          <h2 style={{ color: '#5a6169', marginTop: 0 }}>{selectedArticle.title}</h2>
          <div style={{ color: '#8b9096', marginBottom: '1rem' }}>
            By {selectedArticle.author} • {selectedArticle.reading_time_minutes} min read
          </div>
          <div style={{ color: '#23282e', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
            {selectedArticle.content}
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {articles.map(article => (
            <div
              key={article.id}
              onClick={async () => {
                const response = await fetch(`${API_BASE_URL}/api/education/articles/${article.id}`);
                const data = await response.json();
                setSelectedArticle(data.article);
              }}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0)',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '1px solid rgba(156, 107, 31, 0.10)',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h4 style={{ color: '#9C6B1F', margin: '0 0 0.5rem 0' }}>{article.title}</h4>
                  <p style={{ color: '#8b9096', margin: 0, fontSize: '0.9rem' }}>
                    By {article.author} • {article.reading_time_minutes} min read
                  </p>
                </div>
                {article.featured && (
                  <span style={{
                    backgroundColor: 'rgba(156, 107, 31, 0.10)',
                    color: '#9C6B1F',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    Featured
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderGlossaryTab = () => (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#5A6B48', marginBottom: '1.5rem' }}>Glossary</h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            placeholder="Search glossary terms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: 'rgba(35, 40, 46, 0.08)',
              border: '1px solid #5a6169',
              color: '#23282e',
              borderRadius: '4px'
            }}
          />
          <button
            onClick={async () => {
              if (!searchQuery) {
                loadGlossary();
              } else {
                const response = await fetch(`${API_BASE_URL}/api/education/glossary/search?q=${encodeURIComponent(searchQuery)}`);
                const data = await response.json();
                setGlossaryTerms(data.results || []);
              }
            }}
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
            Search
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {glossaryTerms.map(term => (
          <div key={term.id} style={{
            backgroundColor: 'rgba(0, 0, 0, 0)',
            padding: '1.25rem',
            borderRadius: '8px',
            borderLeft: '3px solid #5a6169'
          }}>
            <h4 style={{ color: '#5a6169', margin: '0 0 0.5rem 0' }}>{term.term}</h4>
            <p style={{ color: '#23282e', margin: '0.5rem 0', lineHeight: '1.5' }}>
              {term.definition}
            </p>
            {term.example && (
              <div style={{
                backgroundColor: 'rgba(90, 107, 72, 0.10)',
                padding: '0.75rem',
                borderRadius: '4px',
                marginTop: '0.75rem',
                color: '#8b9096',
                fontSize: '0.9rem'
              }}>
                <strong style={{ color: '#5A6B48' }}>Example:</strong> {term.example}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderFAQsTab = () => (
    <div style={{ padding: '2rem' }}>
      <h3 style={{ color: '#5A6B48', marginBottom: '1.5rem' }}>Frequently Asked Questions</h3>
      <button
        onClick={loadFAQs}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#5A6B48',
          color: '#ffffff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
          marginBottom: '2rem'
        }}
      >
        Load FAQs
      </button>

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {faqs.map(faq => (
          <div key={faq.id} style={{
            backgroundColor: 'rgba(0, 0, 0, 0)',
            padding: '1.25rem',
            borderRadius: '8px',
            borderLeft: '3px solid #5A6B48'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <h4 style={{ color: '#23282e', margin: '0 0 0.5rem 0' }}>{faq.question}</h4>
              {faq.has_video && (
                <span style={{
                  backgroundColor: 'rgba(156, 107, 31, 0.10)',
                  color: '#9C6B1F',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  Video
                </span>
              )}
            </div>
            <p style={{ color: '#8b9096', margin: '0.5rem 0', lineHeight: '1.5' }}>
              {faq.helpful_count} people found this helpful
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHelpTab = () => (
    <div style={{ padding: '2rem' }}>
      <h3 style={{ color: '#5A6B48', marginBottom: '1.5rem' }}>Help & Support</h3>

      <div style={{
        backgroundColor: 'rgba(90, 107, 72, 0.10)',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '1px solid rgba(90, 107, 72, 0.10)',
        marginBottom: '2rem'
      }}>
        <h4 style={{ color: '#5a6169', marginTop: 0 }}>Dashboard Features Help</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          <button
            style={{
              padding: '1rem',
              backgroundColor: 'rgba(0, 0, 0, 0)',
              color: '#23282e',
              border: '1px solid #5a6169',
              borderRadius: '4px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Financial Dashboard</div>
            <small style={{ color: '#8b9096' }}>Revenue projections & unit economics</small>
          </button>
          <button
            style={{
              padding: '1rem',
              backgroundColor: 'rgba(0, 0, 0, 0)',
              color: '#23282e',
              border: '1px solid #5a6169',
              borderRadius: '4px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Market Intel</div>
            <small style={{ color: '#8b9096' }}>Market data & competitor analysis</small>
          </button>
          <button
            style={{
              padding: '1rem',
              backgroundColor: 'rgba(0, 0, 0, 0)',
              color: '#23282e',
              border: '1px solid #5a6169',
              borderRadius: '4px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Product Validation</div>
            <small style={{ color: '#8b9096' }}>Feature prioritization & MVP planning</small>
          </button>
          <button
            style={{
              padding: '1rem',
              backgroundColor: 'rgba(0, 0, 0, 0)',
              color: '#23282e',
              border: '1px solid #5a6169',
              borderRadius: '4px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Integrations</div>
            <small style={{ color: '#8b9096' }}>Connect Slack, Notion, and more</small>
          </button>
        </div>
      </div>

      <div style={{
        backgroundColor: 'rgba(90, 107, 72, 0.10)',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '1px solid rgba(90, 107, 72, 0.10)'
      }}>
        <h4 style={{ color: '#5A6B48', marginTop: 0 }}>Getting Started</h4>
        <ol style={{ color: '#8b9096', lineHeight: '1.8' }}>
          <li>Start with the learning modules to understand key concepts</li>
          <li>Read success stories to learn from Bangladesh startups</li>
          <li>Use glossary to understand startup terminology</li>
          <li>Browse FAQs for quick answers to common questions</li>
          <li>Access contextual help within dashboard features</li>
        </ol>
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
        gridTemplateColumns: 'repeat(5, 1fr)',
        borderBottom: '1px solid #5a6169'
      }}>
        {[
          { key: 'modules', label: 'Modules', icon: '' },
          { key: 'articles', label: 'Articles', icon: '' },
          { key: 'glossary', label: 'Glossary', icon: '' },
          { key: 'faqs', label: 'FAQs', icon: '' },
          { key: 'help', label: 'Help', icon: '' }
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
              fontWeight: activeTab === tab.key ? 'bold' : 'normal',
              fontSize: '0.85rem'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'modules' && renderModulesTab()}
        {activeTab === 'articles' && renderArticlesTab()}
        {activeTab === 'glossary' && renderGlossaryTab()}
        {activeTab === 'faqs' && renderFAQsTab()}
        {activeTab === 'help' && renderHelpTab()}
      </div>
    </div>
  );
};

export default EducationResourcesDashboard;
