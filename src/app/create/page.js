'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { postsApi, researchApi } from '@/lib/api';

const PLATFORMS = ['Twitter', 'Reddit', 'LinkedIn', 'Instagram'];
const STATUSES = ['drafted', 'scheduled', 'posted'];

export default function CreatePostPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        platform: 'Twitter',
        scheduled_date: '',
        status: 'drafted',
        keyword: ''
    });

    // Research state
    const [researchKeyword, setResearchKeyword] = useState('');
    const [researchResults, setResearchResults] = useState([]);
    const [researchLoading, setResearchLoading] = useState(false);
    const [researchError, setResearchError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleResearch = async () => {
        if (!researchKeyword.trim()) {
            setResearchError('Please enter a keyword');
            return;
        }

        try {
            setResearchLoading(true);
            setResearchError(null);
            const data = await researchApi.search(researchKeyword);
            setResearchResults(data.results || []);
            // Save keyword to form
            setFormData(prev => ({ ...prev, keyword: researchKeyword }));
        } catch (err) {
            setResearchError('Failed to fetch Reddit results. Check if Reddit API is configured.');
            console.error(err);
        } finally {
            setResearchLoading(false);
        }
    };

    const handleUseIdea = (title, selftext) => {
        const inspirationText = selftext ? `\n\nInspiration: ${title}\n${selftext}` : `\n\nInspiration from: ${title}`;
        setFormData(prev => ({
            ...prev,
            content: prev.content + inspirationText
        }));

        // Scroll to form
        const formElement = document.getElementById('post-form');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await postsApi.create(formData);
            router.push('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create post');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="page-header">
                <h1 className="page-title">Create New Post</h1>
                <p className="page-subtitle">Plan your next social media content</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {/* Research Section - Uses FREE APIs (no auth required) */}
            <div className="research-section">
                <h3 style={{ marginBottom: '1rem' }}>🔍 Research Content Ideas</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                    Get inspiration from quotes and advice. Enter a keyword to find related content ideas.
                </p>
                <div className="research-header">
                    <input
                        type="text"
                        className="form-input research-input"
                        placeholder="Enter keyword (e.g., 'success', 'motivation', 'work')"
                        value={researchKeyword}
                        onChange={(e) => setResearchKeyword(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleResearch()}
                    />
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={handleResearch}
                        disabled={researchLoading}
                    >
                        {researchLoading ? 'Searching...' : 'Get Ideas'}
                    </button>
                </div>

                {researchError && (
                    <div className="alert alert-error" style={{ marginTop: '1rem' }}>
                        {researchError}
                    </div>
                )}

                {researchResults.length > 0 && (
                    <div className="research-results">
                        <h4 style={{ marginBottom: '0.75rem' }}>💡 Content Ideas:</h4>
                        {researchResults.map((result, index) => (
                            <div key={index} className="research-item">
                                <div className="research-item-title">{result.title}</div>
                                <div className="research-item-meta">
                                    <span className="post-badge" style={{ background: 'var(--primary)', fontSize: '0.7rem' }}>
                                        {result.source || 'API'}
                                    </span>
                                    {result.tags && result.tags.length > 0 && (
                                        <span style={{ marginLeft: '0.5rem', color: 'var(--text-muted)' }}>
                                            Tags: {result.tags.join(', ')}
                                        </span>
                                    )}
                                </div>
                                {result.content && (
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                                        "{result.content}"
                                    </p>
                                )}
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-sm"
                                    style={{ marginTop: '0.5rem' }}
                                    onClick={() => handleUseIdea(result.title, result.content)}
                                >
                                    Use as Inspiration
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Post Form */}
            <div className="card" style={{ marginTop: '2rem' }}>
                <form id="post-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Title *</label>
                        <input
                            type="text"
                            name="title"
                            className="form-input"
                            placeholder="e.g., Promo Update"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Content *</label>
                        <textarea
                            name="content"
                            className="form-textarea"
                            placeholder="Write your post content here..."
                            value={formData.content}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label className="form-label">Platform *</label>
                            <select
                                name="platform"
                                className="form-select"
                                value={formData.platform}
                                onChange={handleChange}
                                required
                            >
                                {PLATFORMS.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Scheduled Date *</label>
                            <input
                                type="date"
                                name="scheduled_date"
                                className="form-input"
                                value={formData.scheduled_date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Status *</label>
                            <select
                                name="status"
                                className="form-select"
                                value={formData.status}
                                onChange={handleChange}
                                required
                            >
                                {STATUSES.map(s => (
                                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {formData.keyword && (
                        <div className="form-group">
                            <label className="form-label">Research Keyword</label>
                            <input
                                type="text"
                                name="keyword"
                                className="form-input"
                                value={formData.keyword}
                                onChange={handleChange}
                                readOnly
                                style={{ background: 'var(--surface)' }}
                            />
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : '✨ Create Post'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => router.push('/')}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
