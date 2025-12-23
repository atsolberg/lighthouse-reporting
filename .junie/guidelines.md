# LH Reporting - Developer Guidelines

## Project Overview

LH Reporting is a web application for reporting and visualizing Lighthouse scores, built with React and Remix.

## Tech Stack

- **Frontend**: React 19, React Router 7, Recharts for data visualization
- **Styling**: Tailwind CSS
- **Backend**: Express.js
- **Database**: SQLite with Prisma ORM
- **Build Tool**: Vite
- **Type Checking**: TypeScript
- **Testing**: Vitest, Testing Library
- **Code Quality**: ESLint, Prettier
- **Deployment**: Fly.io with Docker

## Project Structure

```
lh-reporting/
├── app/                    # Main application code
│   ├── assets/             # Static assets
│   ├── hooks/              # React hooks
│   ├── models/             # Data models and database interactions
│   ├── routes/             # Route components and definitions
│   ├── root.jsx            # Root component
│   ├── types.d.ts          # TypeScript type definitions
│   └── utils.js            # Utility functions
├── prisma/                 # Prisma schema and migrations
├── public/                 # Public static files
└── test/                   # Test setup
```

## Getting Started

### Setup

```sh
# Install dependencies
npm install

# Set up the database (generate, migrate, seed)
npm run setup
```

### Development

```sh
# Start the development server
npm run dev
```

### Testing

```sh
# Run tests
npm test

# Type checking
npm run typecheck
```

## Common Tasks

### Database Operations

- Database schema is defined in `prisma/schema.prisma`
- Run `npm run setup` after schema changes
- Database models are accessed through the `app/models/` directory

### Adding New Routes

1. Create a new component in `app/routes/`
2. Update route definitions if necessary

### Code Quality

- Run `npm run lint` to check for linting issues
- Run `npm run format` to automatically format code
- Follow TypeScript types defined in `app/types.d.ts`

## Deployment

- Merges to `main` branch are automatically deployed to production
- Merges to `dev` branch are deployed to staging
- Deployments are handled by GitHub Actions
