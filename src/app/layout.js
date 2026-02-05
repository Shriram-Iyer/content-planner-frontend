import './globals.css';
import Link from 'next/link';

export const metadata = {
    title: 'Content Planner - Social Media Management',
    description: 'Plan and manage your social media posts across multiple platforms',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            </head>
            <body>
                <nav className="navbar">
                    <div className="container navbar-content">
                        <Link href="/" className="logo">
                            <span className="logo-icon">📅</span>
                            <span>Content Planner</span>
                        </Link>
                        <ul className="nav-links">
                            <li><Link href="/">Posts</Link></li>
                            <li><Link href="/create">Create</Link></li>
                            <li><Link href="/dashboard">Dashboard</Link></li>
                        </ul>
                    </div>
                </nav>
                <main className="container">
                    {children}
                </main>
            </body>
        </html>
    );
}
