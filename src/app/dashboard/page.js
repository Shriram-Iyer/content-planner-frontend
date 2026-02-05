'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { statsApi } from '@/lib/api';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const PLATFORM_COLORS = {
    Twitter: '#1da1f2',
    Reddit: '#ff4500',
    LinkedIn: '#0077b5',
    Instagram: '#e1306c',
};

export default function DashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const data = await statsApi.getStats();
            setStats(data);
            setError(null);
        } catch (err) {
            setError('Failed to load dashboard data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="empty-state">
                <div className="empty-icon">📊</div>
                <h2 className="empty-title">Dashboard Error</h2>
                <p>{error}</p>
                <button onClick={fetchStats} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                    Retry
                </button>
            </div>
        );
    }

    // Prepare pie chart data
    const platformLabels = Object.keys(stats?.platforms || {});
    const platformValues = Object.values(stats?.platforms || {});
    const platformBgColors = platformLabels.map(p => PLATFORM_COLORS[p] || '#6366f1');

    const pieData = {
        labels: platformLabels,
        datasets: [
            {
                data: platformValues,
                backgroundColor: platformBgColors,
                borderColor: '#1e293b',
                borderWidth: 2,
            },
        ],
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#f1f5f9',
                    font: { size: 14 },
                    padding: 20,
                },
            },
            title: {
                display: false,
            },
        },
    };

    // Prepare line chart data
    const trendLabels = (stats?.trends || []).map(t => t.month);
    const trendValues = (stats?.trends || []).map(t => t.count);

    const lineData = {
        labels: trendLabels,
        datasets: [
            {
                label: 'Posts Scheduled',
                data: trendValues,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#6366f1',
                pointBorderColor: '#fff',
                pointRadius: 6,
                pointHoverRadius: 8,
            },
        ],
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                    color: '#94a3b8',
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                    color: '#94a3b8',
                    stepSize: 1,
                },
            },
        },
    };

    const hasData = stats?.total > 0;

    return (
        <>
            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
                <p className="page-subtitle">Analytics and insights for your social media content</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">{stats?.total || 0}</div>
                    <div className="stat-label">Total Posts</div>
                </div>
                {Object.entries(stats?.platforms || {}).map(([platform, count]) => (
                    <div
                        key={platform}
                        className="stat-card"
                        style={{ background: PLATFORM_COLORS[platform] || 'var(--gradient)' }}
                    >
                        <div className="stat-value">{count}</div>
                        <div className="stat-label">{platform}</div>
                    </div>
                ))}
            </div>

            {!hasData ? (
                <div className="empty-state">
                    <div className="empty-icon">📊</div>
                    <h2 className="empty-title">No data yet</h2>
                    <p>Create some posts to see analytics</p>
                    <Link href="/create" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        Create Post
                    </Link>
                </div>
            ) : (
                <div className="charts-grid">
                    {/* Pie Chart - Posts by Platform */}
                    <div className="card chart-container">
                        <h3 className="chart-title">📊 Posts by Platform</h3>
                        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                            <Pie data={pieData} options={pieOptions} />
                        </div>
                    </div>

                    {/* Line Chart - Posts Trend */}
                    <div className="card chart-container">
                        <h3 className="chart-title">📈 Posts Trend Over Time</h3>
                        <Line data={lineData} options={lineOptions} />
                    </div>
                </div>
            )}

            {/* Refresh Button */}
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <button onClick={fetchStats} className="btn btn-secondary">
                    🔄 Refresh Data
                </button>
            </div>
        </>
    );
}
