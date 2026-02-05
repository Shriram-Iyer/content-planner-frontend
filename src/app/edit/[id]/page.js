'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { postsApi, researchApi } from '@/lib/api';

const PLATFORMS = ['Twitter', 'Reddit', 'LinkedIn', 'Instagram'];
const STATUSES = ['drafted', 'scheduled', 'posted'];

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            setLoading(true);
            const post = await postsApi.getById(id);
            setFormData({
                title: post.title,
                content: post.content,
                platform: post.platform,
                scheduled_date: post.scheduled_date,
                status: post.status,
                keyword: post.keyword || ''
            });
            if (post.keyword) {
                setResearchKeyword(post.keyword);
            }
            setError(null);
        } catch (err) {
            setError('Failed to load post');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

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
            setFormData(prev => ({ ...prev, keyword: researchKeyword }));
        } catch (err) {
            setResearchError('Failed to fetch Reddit results');
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
        setSaving(true);
        setError(null);

        try {
            await postsApi.update(id, formData);
            router.push('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update post');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <>
            <div className="page-header">
                <h1 className="page-title">Edit Post</h1>
                <p className="page-subtitle">Update your scheduled content</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {/* Reddit Research Section */}
            <div className="research-section">
                <h3 style={{ marginBottom: '1rem' }}>🔍 Research Topic on Reddit</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                    Search Reddit for content inspiration. Enter a keyword to find trending discussions.
                </p>
                <div className="research-header">
                    <input
                        type="text"
                        className="form-input research-input"
                        placeholder="Enter keyword (e.g., 'social media marketing')"
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
                        {researchLoading ? 'Searching...' : 'Research Topic'}
                    </button>
                </div>

                {researchError && (
                    <div className="alert alert-error" style={{ marginTop: '1rem' }}>
                        {researchError}
                    </div>
                )}

                {researchResults.length > 0 && (
                    <div className="research-results">
                        <h4 style={{ marginBottom: '0.75rem' }}>Top Reddit Results:</h4>
                        {researchResults.map((result, index) => (
                            <div key={index} className="research-item">
                                <div className="research-item-title">{result.title}</div>
                                <div className="research-item-meta">
                                    r/{result.subreddit} • Score: {result.score}
                                </div>
                                {result.selftext && (
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                        {result.selftext}
                                    </p>
                                )}
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-sm"
                                    style={{ marginTop: '0.5rem' }}
                                    onClick={() => handleUseIdea(result.title, result.selftext)}
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
                                style={{ background: 'var(--surface)' }}
                            />
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? 'Saving...' : '💾 Save Changes'}
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
