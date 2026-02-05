'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { postsApi } from '@/lib/api';

export default function PostDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            setLoading(true);
            const data = await postsApi.getById(id);
            setPost(data);
            setError(null);
        } catch (err) {
            setError('Failed to load post');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            await postsApi.delete(id);
            router.push('/');
        } catch (err) {
            alert('Failed to delete post');
            console.error(err);
        }
    };

    const getPlatformClass = (platform) => {
        return `badge-${platform.toLowerCase()}`;
    };

    const getStatusClass = (status) => {
        return `badge-${status}`;
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="empty-state">
                <div className="empty-icon">❌</div>
                <h2 className="empty-title">Post not found</h2>
                <p>{error || 'The requested post does not exist.'}</p>
                <Link href="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                    Back to Posts
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="page-header">
                <h1 className="page-title">{post.title}</h1>
                <div className="post-meta" style={{ marginTop: '1rem' }}>
                    <span className={`post-badge ${getPlatformClass(post.platform)}`}>
                        {post.platform}
                    </span>
                    <span className={`post-badge ${getStatusClass(post.status)}`}>
                        {post.status}
                    </span>
                </div>
            </div>

            <div className="card">
                <div className="detail-grid">
                    <div className="detail-row">
                        <span className="detail-label">📅 Scheduled Date</span>
                        <span className="detail-value">{formatDate(post.scheduled_date)}</span>
                    </div>

                    <div className="detail-row">
                        <span className="detail-label">📝 Content</span>
                        <span className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>
                            {post.content}
                        </span>
                    </div>

                    {post.keyword && (
                        <div className="detail-row">
                            <span className="detail-label">🔍 Research Keyword</span>
                            <span className="detail-value">{post.keyword}</span>
                        </div>
                    )}

                    <div className="detail-row">
                        <span className="detail-label">🕐 Created</span>
                        <span className="detail-value">{formatDate(post.created_at)}</span>
                    </div>

                    <div className="detail-row">
                        <span className="detail-label">🔄 Last Updated</span>
                        <span className="detail-value">{formatDate(post.updated_at)}</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                    <Link href={`/edit/${post.id}`} className="btn btn-primary">
                        ✏️ Edit Post
                    </Link>
                    <button onClick={handleDelete} className="btn btn-danger">
                        🗑️ Delete Post
                    </button>
                    <Link href="/" className="btn btn-secondary">
                        ← Back to Posts
                    </Link>
                </div>
            </div>
        </>
    );
}
