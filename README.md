# Content Planner Frontend

Next.js frontend for the Social Media Content Planner application.

## Features

- Full CRUD UI for managing posts
- **Smart Content Research**: Get keyword-specific ideas from Wikipedia, Quotes, and Templates
- **Auto-scroll UX**: Smooth scrolling to form when using inspiration
- Dashboard with Chart.js visualizations (pie & line charts)
- Modern dark theme with responsive design

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **HTTP Client**: Axios
- **Charts**: Chart.js + react-chartjs-2
- **Styling**: Custom CSS

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/content-planner-frontend.git
cd content-planner-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

**Required variables:**
- `NEXT_PUBLIC_API_URL`: Backend API URL (e.g., `http://localhost:5000`)

### 4. Start the development server

```bash
npm run dev
```

App opens at `http://localhost:3000`

## Pages

| Path | Description |
|------|-------------|
| `/` | Posts list (home page) |
| `/create` | Create new post form + Research |
| `/edit/[id]` | Edit existing post |
| `/post/[id]` | Post detail view |
| `/dashboard` | Analytics with charts |

## Deployment (Vercel)

1. Import GitHub repo to Vercel (Select the `content-planner-frontend` directory as Root if in a monorepo, or just the repo if separated).
2. **Environment Variables**:
    - `NEXT_PUBLIC_API_URL`: Your deployed Backend URL.
    - Example: `https://content-planner-backend.onrender.com` (Ensure no trailing slash)
3. Deploy!

## How to Test

### CRUD Flow

1. **Open app**: Go to `http://localhost:3000`
2. **Create post**: 
   - Click "Create New Post"
   - Fill: Title="Promo Update", Content="Our latest offer", Platform="Twitter", Date=tomorrow, Status="drafted"
   - **Research Content**: Enter "marketing" and click "Get Ideas"
   - **Use Inspiration**: Click "Use as Inspiration" on any result -> form auto-scrolls down
   - Submit form
3. **View post**: Click on any post card to see details
4. **Edit post**: Click "Edit" button, change fields, save
5. **Delete post**: Click "Delete" button, confirm

### Dashboard Flow

1. Navigate to `/dashboard`
2. View pie chart (posts by platform)
3. View line chart (posts by scheduled month)
4. Create/delete posts and refresh - charts update

### Keyword Research Feature

1. Go to Create or Edit page
2. Enter keyword (e.g., "programming", "business", "life")
3. Click "Get Ideas"
4. See 5 curated results (Quotes, Tips, Facts) based on your keyword
5. Click "Use as Inspiration" to append to your content

## Project Structure

```
src/
├── app/
│   ├── layout.js           # Root layout + navigation
│   ├── page.js             # Home (posts list)
│   ├── globals.css         # Global styles
│   ├── create/
│   │   └── page.js         # Create post form
│   ├── edit/
│   │   └── [id]/
│   │       └── page.js     # Edit post form
│   ├── post/
│   │   └── [id]/
│   │       └── page.js     # Post details
│   └── dashboard/
│       └── page.js         # Analytics dashboard
└── lib/
    └── api.js              # Axios API client
```

## License

MIT
