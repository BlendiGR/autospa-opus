# AutoSpa Opus

A modern tyre hotel management system built with Next.js 15, featuring real-time inventory tracking, customer management, and multi-language support.

## Features

- 🏨 **Tyre Hotel Management** - Track tyre storage with location-based organization
- 👥 **Customer Management** - Link tyres to customers with contact information
- 🔐 **Secure Authentication** - NextAuth.js with credentials provider
- 🌍 **Multi-language Support** - English, Finnish, and Albanian
- 📧 **Email Notifications** - Password reset with React Email templates
- 📱 **Responsive Design** - Mobile-first UI with Tailwind CSS

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js v5
- **Styling:** Tailwind CSS v4
- **Forms:** React Hook Form + Zod validation
- **Email:** React Email + Nodemailer
- **i18n:** next-intl

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- SMTP server (for emails)

### Installation

```bash
# Clone the repository
git clone https://github.com/BlendiGR/autospa-opus.git
cd autospa-opus

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Environment Variables

See `.env.example` for required environment variables.

## Project Structure

```
├── app/
│   ├── actions/          # Server actions
│   ├── (routes-authed)/  # Protected routes
│   └── (password-change)/ # Password reset flow
├── components/
│   ├── dashboard/        # Dashboard components
│   ├── login/            # Auth components
│   ├── ui/               # Reusable UI components
│   └── emails/           # Email templates
├── hooks/                # Custom React hooks
├── lib/
│   ├── schemas/          # Zod validation schemas
│   └── utils/            # Utility functions
├── contexts/             # React Context providers
├── services/             # External services (email)
├── messages/             # i18n translation files
└── prisma/               # Database schema & migrations
```

## Scripts

| Command                | Description               |
| ---------------------- | ------------------------- |
| `npm run dev`          | Start development server  |
| `npm run build`        | Build for production      |
| `npm run start`        | Start production server   |
| `npm run lint`         | Run ESLint                |
| `npm run format`       | Format code with Prettier |
| `npm run format:check` | Check code formatting     |

## License

Private - All rights reserved
