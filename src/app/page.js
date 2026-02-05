'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { postsApi } from '@/lib/api';

export default function HomePage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const data = await postsApi.getAll();
            setPosts(data);
            setError(null);
        } catch (err) {
            setError('Failed to load posts. Make sure the backend is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            await postsApi.delete(id);
            setPosts(posts.filter(post => post.id !== id));
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
            month: 'short',
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

    return (
        <>
            <div className="page-header">
                <h1 className="page-title">Your Posts</h1>
                <p className="page-subtitle">Manage your social media content across all platforms</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div style={{ marginBottom: '2rem' }}>
                <Link href="/create" className="btn btn-primary">
                    ✨ Create New Post
                </Link>
            </div>

            {posts.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <h2 className="empty-title">No posts yet</h2>
                    <p>Create your first post to get started!</p>
                    <Link href="/create" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        Create Post
                    </Link>
                </div>
            ) : (
                <div className="posts-grid">
                    {posts.map((post) => (
                        <div key={post.id} className="card post-card">
                            <div className="post-card-header">
                                <h3 className="post-title">{post.title}</h3>
                            </div>
                            <div className="post-meta">
                                <span className={`post-badge ${getPlatformClass(post.platform)}`}>
                                    {post.platform}
                                </span>
                                <span className={`post-badge ${getStatusClass(post.status)}`}>
                                    {post.status}
                                </span>
                            </div>
                            <p className="post-content">
                                {post.content.length > 100
                                    ? post.content.substring(0, 100) + '...'
                                    : post.content}
                            </p>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                📅 Scheduled: {formatDate(post.scheduled_date)}
                            </div>
                            <div className="post-actions">
                                <Link href={`/post/${post.id}`} className="btn btn-secondary btn-sm">
                                    View
                                </Link>
                                <Link href={`/edit/${post.id}`} className="btn btn-secondary btn-sm">
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(post.id)}
                                    className="btn btn-danger btn-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
