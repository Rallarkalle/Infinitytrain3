# InfinityTrain - Learning Tracker

A comprehensive employee training and learning management system with progress tracking, collaborative comments, and rich resource management.

## Features

- **Topic Management**: Organize training content into topics with customizable icons
- **Subtopics & Resources**: Create detailed subtopics with markdown-based resources
- **Progress Tracking**: Track employee understanding levels (Not Addressed, Basic, Good, Fully Understood)
- **Collaborative Learning**: Add comments, images, and drawings to subtopics
- **User Roles**: Admin and employee roles with appropriate permissions
- **Persistent Storage**: SQLite database for reliable data persistence

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite, TailwindCSS, Radix UI
- **Backend**: Express.js, Node.js
- **Database**: 
  - **Production**: Supabase (PostgreSQL) - Free 500MB tier
  - **Development**: SQLite (better-sqlite3) - Zero config
- **Deployment**: Render.com - Free tier available

## Local Development

### Prerequisites

- Node.js 20.x or higher
- npm

### Setup

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd Infinitytrain3
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   
   This will start both the backend API and the Vite dev server. The application will be available at `http://localhost:5000`.

### Development Scripts

- `npm run dev` - Start development server with hot reload
- `npm run dev:client` - Start only the Vite client dev server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - Run TypeScript type checking

## Deploying to Render + Supabase

### Quick Deploy (100% Free)

This application uses **Supabase** for the database (free 500MB PostgreSQL) and **Render** for hosting.

**👉 See [DEPLOYMENT-SUPABASE.md](./DEPLOYMENT-SUPABASE.md) for complete step-by-step instructions.**

### Quick Summary

1. **Supabase Setup** (5 minutes):
   - Create free Supabase account
   - Create new project
   - Run `supabase-schema.sql` in SQL Editor
   - Copy your `SUPABASE_URL` and `SUPABASE_ANON_KEY`

2. **Render Setup** (5 minutes):
   - Push code to GitHub
   - Create new Web Service on Render
   - Add environment variables:
     - `SUPABASE_URL`
     - `SUPABASE_ANON_KEY`
   - Deploy!

### Why Supabase?

- ✅ **100% Free** - 500MB database, no expiration
- ✅ **PostgreSQL** - Full-featured relational database
- ✅ **Automatic Backups** - 7 days included
- ✅ **Real-time Ready** - Built-in subscriptions
- ✅ **No Paid Disk Required** - Unlike Render's persistent disks ($$$)

### Database Storage

- **Local Development**: SQLite (`training.db` in project root)
- **Production (Render)**: Supabase PostgreSQL (cloud-hosted)

The app automatically detects which database to use based on environment variables.

## Default Users

The application comes with pre-configured demo users:

- **Admin**: admin@oceaninfinity.com
- **Employee 1**: sarah@oceaninfinity.com
- **Employee 2**: john@oceaninfinity.com

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and store
│   └── public/            # Static assets
├── server/                 # Backend Express application
│   ├── app.ts             # Express app setup
│   ├── routes.ts          # API routes
│   ├── sqlite-storage.ts  # Database layer
│   └── index-prod.ts      # Production entry point
├── render.yaml            # Render deployment config
└── package.json           # Dependencies and scripts
```

## API Endpoints

### Topics
- `GET /api/topics` - Get all topics
- `POST /api/topics` - Create a new topic
- `PUT /api/topics/:id` - Update a topic
- `DELETE /api/topics/:id` - Soft delete a topic
- `POST /api/topics/:id/restore` - Restore a deleted topic

### Progress
- `GET /api/progress/:userId` - Get user progress
- `POST /api/progress` - Save progress update

### Users
- `GET /api/users/:id` - Get user by ID

### Comments
- `POST /api/comments` - Add a comment to a subtopic

## Production Considerations

### Scaling

- Supabase free tier supports up to 50,000 monthly active users
- For larger deployments, Supabase paid tiers offer more storage and bandwidth
- Render can be upgraded to paid plans for always-on service

### Backups

- Supabase automatically backs up your database (7 days on free tier)
- Supabase paid plans offer daily backups with 30-day retention
- You can export SQL dumps anytime from Supabase dashboard

### Performance

- Static assets are served efficiently via Express
- Vite optimizes the frontend bundle
- Supabase PostgreSQL provides excellent query performance
- Render free tier spins down after 15 min inactivity (first request ~30s)

## Support & Issues

For issues, feature requests, or contributions, please open an issue in the GitHub repository.

## License

MIT
