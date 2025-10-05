# NASA Biology App Setup Guide

## Quick Start

### 1. Set up Environment Variables

Create a `.env` file in the `apps/web` directory:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@hostname:port/database_name

# Authentication (generate a random string)
AUTH_SECRET=your-random-secret-here

# Optional: CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:4000
```

**Important**: Replace the DATABASE_URL with your actual PostgreSQL database connection string.

### 2. Set up Database

Run the database setup script:

```bash
npm run setup-db
```

This will create all necessary tables in your database.

### 3. Start the Development Server

```bash
npm run dev
```

The app will be available at http://localhost:4000

### 4. Load Sample Data (Optional)

Visit the app and click "Load Sample Data" to populate the database with sample NASA research publications.

## Database Setup Options

### Option A: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database: `createdb nasa_biology`
3. Set DATABASE_URL: `postgresql://username:password@localhost:5432/nasa_biology`

### Option B: Neon Database (Recommended)

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string to your `.env` file

### Option C: Docker PostgreSQL

```bash
docker run --name nasa-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=nasa_biology -p 5432:5432 -d postgres
```

Then set: `DATABASE_URL=postgresql://postgres:password@localhost:5432/nasa_biology`

## Troubleshooting

### Database Connection Issues

- Verify your DATABASE_URL is correct
- Ensure the database server is running
- Check firewall settings if using a remote database

### API Errors

- Make sure the database schema is created (`npm run setup-db`)
- Check the browser console for detailed error messages
- Verify all environment variables are set

### Data Fetching Issues

The app requires:
1. Database connection configured
2. Database schema created
3. Sample data loaded (or real data imported)

## Features

- **Publications**: Browse and search NASA research publications
- **AI Insights**: Generate AI-powered research insights
- **Analytics**: View research trends and statistics
- **Knowledge Graph**: Visualize research relationships

## API Endpoints

- `GET /api/publications` - Fetch publications with search/filter
- `POST /api/publications` - Create new publication
- `GET /api/insights` - Fetch AI insights
- `POST /api/insights` - Create new insight
- `POST /api/analyze` - AI analysis operations
- `POST /api/seed-data` - Load sample data

