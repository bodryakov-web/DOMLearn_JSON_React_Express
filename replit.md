# JavaScript Learning Platform

## Overview

This is a full-stack JavaScript learning platform designed to help students learn JavaScript through structured lessons, tests, and tasks. The application follows a clean architecture with a React frontend and Express backend, using PostgreSQL for data persistence through Drizzle ORM.

## Recent Changes

**January 2025:**
- Fixed section navigation links on the home page - "Раздел 1", "Раздел 2" links in level cards now properly navigate to section pages
- Implemented working mobile navigation with hamburger menu containing 4 level links
- Created functional level overview pages with section navigation
- Admin panel successfully moved from /admin to /bod route
- All navigation between levels, sections, and lessons is now functional

## User Preferences

Preferred communication style: Simple, everyday language.
Admin credentials: bodryakov.web / Anna-140275
Admin panel access: /bod (changed from /admin)
Interface language: Russian
Design preference: Gray-blue color palette, minimalist adaptive design
Mobile UI: Hamburger menu with only 4 level links, separate level pages with section navigation

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Library**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: Express sessions with PostgreSQL storage
- **Development**: Hot reload with Vite integration

### Database Schema
- **Schema Definition**: Shared TypeScript schema using Zod for validation
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Migrations**: File-based migrations in `/migrations` directory
- **Configuration**: Environment-based database URL configuration

## Key Components

### Learning Structure
1. **Levels**: Top-level learning categories (4 levels: Basics, Data Structures, Functions, Advanced Topics)
2. **Sections**: Sub-categories within each level
3. **Lessons**: Individual learning units containing theory, tests, and tasks

### Content Management
- **Rich Text Editor**: Full-featured editor for lesson content creation
- **Test System**: Multiple-choice questions with 4 options each
- **Task System**: Programming exercises with descriptions
- **Media Support**: Image and video embedding capabilities

### Authentication & Authorization
- **Admin System**: Single admin user with hardcoded credentials
- **Session Management**: Remember me functionality with persistent sessions
- **Protected Routes**: Admin panel access control

### User Interface
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Theme System**: Light/dark mode toggle with persistent preferences
- **Navigation**: Collapsible sidebar with lesson hierarchy
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Data Flow

### Client-Side Data Flow
1. React Query manages server state and caching
2. Forms use React Hook Form with Zod validation
3. UI components communicate through props and context
4. Theme and preferences stored in localStorage

### Server-Side Data Flow
1. Express routes handle API requests
2. Drizzle ORM translates queries to PostgreSQL
3. File storage system manages lesson content as JSON
4. Session middleware handles authentication state

### Content Structure
- Lessons stored as JSON files in organized directories
- Media files stored alongside lesson content
- Database stores structural information and relationships
- File system provides content flexibility for admin editing

## External Dependencies

### Production Dependencies
- **Database**: Neon PostgreSQL for cloud hosting
- **UI Components**: Radix UI for accessible primitives
- **Validation**: Zod for runtime type checking
- **Query Management**: TanStack Query for server state
- **Date Handling**: date-fns for date utilities

### Development Dependencies
- **Build Tools**: Vite for fast development and building
- **TypeScript**: Full type safety across the stack
- **ESLint/Prettier**: Code quality and formatting (implied)

### Hosting Requirements
- Node.js runtime environment
- PostgreSQL database access
- File system access for content storage
- Environment variable support for configuration

## Deployment Strategy

### Build Process
1. Frontend builds to `/dist/public` via Vite
2. Backend compiles to `/dist` via esbuild
3. Single deployment artifact contains both frontend and backend
4. Environment-specific configuration through variables

### Database Management
- Drizzle migrations for schema changes
- Environment-based connection strings
- Neon database for production hosting
- Local PostgreSQL for development

### Content Management
- JSON files for lesson content storage
- File system organization mirrors lesson hierarchy
- Admin panel provides rich editing interface
- Real-time content updates without deployment

### Scalability Considerations
- Stateless server design for horizontal scaling
- CDN-ready static asset organization
- Database connection pooling through Neon
- Session storage in PostgreSQL for multi-instance support

The application is designed for educational use with a focus on simplicity, maintainability, and ease of content management. The architecture supports future enhancements while maintaining the core requirement of being deployable on simple hosting platforms.