# Turnitin Checker

A modern web application for checking document similarity using official Turnitin integration. Built with Next.js 14 App Router, React, TypeScript, and Supabase Auth.

## Features

- 🔍 **Official Turnitin Integration** - Direct connection to Turnitin servers
- 🔐 **Secure Authentication** - Google and Email login via Supabase
- 📄 **Multiple Input Methods** - Support for text input and file upload (PDF, DOC, DOCX)
- 📊 **Real-time Detection** - Live progress tracking and status updates
- 📥 **Download Reports** - Get detailed similarity reports
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🎨 **Modern UI** - Clean blue-white theme with smooth animations

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: SCSS + Tailwind CSS
- **State Management**: MobX
- **Authentication**: Supabase Auth
- **HTTP Client**: Axios
- **UI Components**: Ant Design
- **Animations**: Lottie Web
- **Analytics**: PostHog + Microsoft Clarity
- **Deployment**: GitLab CI/CD + Vercel

## Prerequisites

- Node.js 18.18.0 or higher (20.x recommended)
- pnpm (package manager)
- Supabase account
- Vercel account
- GitLab account (for CI/CD)

## Getting Started

### 1. Clone the repository

\`\`\`bash
git clone <repository-url>
cd turnitin-checker
\`\`\`

### 2. Install dependencies

\`\`\`bash
# Install pnpm globally if not installed
npm install -g pnpm

# Install project dependencies
pnpm install
\`\`\`

### 3. Set up environment variables

Create a \`.env.local\` file in the root directory:

\`\`\`env

# API Configuration

NEXT_PUBLIC_PREFIX=https://api.answer-ai.com
NEXT_PUBLIC_API_BASE_URL=https://api.answer-ai.com/api/v1

# Supabase Configuration

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# PostHog Analytics (Optional)

NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Microsoft Clarity (Optional)

NEXT_PUBLIC_CLARITY_PROJECT_ID=your_clarity_project_id
\`\`\`

> For detailed PostHog setup instructions, see [POSTHOG_SETUP.md](./POSTHOG_SETUP.md)

### 4. Run the development server

\`\`\`bash
pnpm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Supabase Setup

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Get your project URL and anon key from Settings > API

### 2. Configure Authentication Providers

#### Google OAuth

1. Go to Authentication > Providers in Supabase dashboard
2. Enable Google provider
3. Add your Google OAuth credentials
4. Add authorized redirect URLs:
   - Development: \`http://localhost:3000/auth/callback\`
   - Production: \`https://yourdomain.com/auth/callback\`

#### Email Authentication

1. Enable Email provider in Supabase dashboard
2. Configure email templates if needed

## Project Structure

\`\`\`
turnitin-checker/
├── app/ # Next.js App Router pages
│ ├── auth/ # Authentication callbacks
│ ├── my-tasks/ # My Tasks page
│ ├── layout.tsx # Root layout
│ ├── page.tsx # Home page (Upload)
│ └── globals.css # Global styles
├── components/ # React components
│ ├── AnalyticsProvider/ # Analytics initialization
│ ├── LottieAnimation/ # Lottie animation component
│ ├── LoginModal/ # Login modal component
│ ├── Navbar/ # Navigation bar
│ ├── PostHogProvider/ # PostHog analytics provider
│ ├── PostHogPageView/ # Page view tracking
│ └── TurnitinSubscription/ # Subscription modal
├── lib/ # Library code
│ ├── supabase.ts # Supabase client
│ └── supabase-server.ts # Supabase server client
├── modules/ # Business logic modules
│ ├── api/ # API clients
│ │ ├── main.ts # Main API functions
│ │ └── turnitin.ts # Turnitin API functions
│ ├── request.ts # Axios configuration
│ └── utils.ts # Utility functions
├── stores/ # MobX stores
│ ├── main.ts # Main store
│ └── turnitin.ts # Turnitin store
├── styles/ # Global styles
│ └── library.scss # SCSS mixins and variables
├── scripts/ # Deployment scripts
│ ├── deploy.sh # Deployment script
│ └── setup-server.sh # Server setup script
└── public/ # Static assets
├── images/ # Images
└── lotties/ # Lottie animation files
\`\`\`

## Deployment

### Deployment Architecture

```
GitLab Repository → GitLab CI/CD → Vercel Platform
```

The project uses GitLab CI/CD to build and automatically deploy to Vercel.

### Setup Vercel Deployment

#### 1. Create Vercel Account and Project

1. Sign up at [Vercel](https://vercel.com/)
2. Create a new project or use existing one
3. Get your Vercel credentials:
   - Vercel Token (from [Settings → Tokens](https://vercel.com/account/tokens))
   - Project ID (from Project Settings)
   - Org/Team ID (from Project Settings)

#### 2. Configure GitLab CI/CD Variables

In your GitLab project, go to Settings > CI/CD > Variables and add:

- `VERCEL_TOKEN`: Your Vercel authentication token (Protected, Masked)
- `VERCEL_PROJECT_ID`: Your Vercel project ID (Protected)
- `VERCEL_ORG_ID`: Your Vercel organization/team ID (Protected)

#### 3. Configure Environment Variables in Vercel

In Vercel Dashboard → Settings → Environment Variables, add all required env vars for both Production and Preview environments.

#### 4. Deploy

**Deploy to Preview (Test):**
\`\`\`bash
git push origin test
\`\`\`

**Deploy to Production:**
\`\`\`bash
git push origin master
\`\`\`

The GitLab CI/CD pipeline will automatically build and deploy to Vercel.

### Manual Deployment (Local)

\`\`\`bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to Preview
vercel

# Deploy to Production
vercel --prod
\`\`\`

### Deployment Documentation

For detailed deployment instructions, see:
- [Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md)
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)

## Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm start` - Start production server locally
- `pnpm run lint` - Run ESLint

## API Integration

The application integrates with the Answer AI API for Turnitin functionality:

- File upload
- Text submission
- Detection status polling
- Task management
- User plan information

## Authentication Flow

1. User clicks "Login" button
2. Choose login method (Google OAuth or Magic Link)
3. Redirected to Supabase authentication
4. After authentication, redirected to `/auth/callback`
5. Callback route exchanges code for session
6. User redirected back to home page
7. Session stored securely in cookies
8. PostHog identifies user for analytics

## Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support, please contact your system administrator or open an issue in the repository.
