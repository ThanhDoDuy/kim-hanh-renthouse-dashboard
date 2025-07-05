# Boarding House Management System

A modern web application for managing boarding houses, built with Next.js, React, and TypeScript.

## Features

- 🏠 Room Management
- 👥 Tenant Management
- 💰 Invoice Generation and Tracking
- 📊 Utility Billing
- 📈 Dashboard with Real-time Statistics

## Prerequisites

- Node.js 18 or higher
- pnpm package manager

## Installation

1. Install pnpm (if not already installed):
```bash
npm install -g pnpm
```

2. Install project dependencies:
```bash
pnpm install
```

## Development

To start the development server:
```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Build

To create a production build:
```bash
pnpm build
```

To start the production server:
```bash
pnpm start
```

## Tech Stack

- [Next.js](https://nextjs.org/) - React Framework
- [React](https://reactjs.org/) - UI Library
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Shadcn UI](https://ui.shadcn.com/) - UI Components
- [React Hook Form](https://react-hook-form.com/) - Form Management
- [Zod](https://zod.dev/) - Schema Validation

## Project Structure

```
boarding-house-management/
├── app/                    # Application pages and routes
│   ├── tenants/           # Tenant management
│   ├── rooms/             # Room management
│   ├── invoices/          # Invoice management
│   └── utilities/         # Utility management
├── components/            # Reusable UI components
├── lib/                   # Utility functions
├── hooks/                # Custom React hooks
└── styles/               # Global styles
```

## License

MIT 