# Executive Experiences Registration - Transform 2026

A Next.js web application for managing executive registrations for Transform 2026 conference programming.

## Features

- **Conditional Logic**: Shows only eligible activities based on role, company size, and membership status
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Database Integration**: Supabase for data storage
- **Email Confirmation**: Automated confirmation emails (requires setup)
- **Unlisted Page**: Not indexed by search engines (robots: noindex)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings > API to find your credentials
4. Run the SQL in `database-schema.sql` in the Supabase SQL Editor to create the registrations table

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── register/          # Registration submission endpoint
│   │   └── registration/[id]/ # Fetch registration data
│   ├── confirmation/          # Confirmation page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Main registration form
│   └── globals.css           # Global styles
├── lib/
│   ├── activities.ts         # Activity definitions and eligibility logic
│   ├── supabase.ts          # Supabase client
│   └── types.ts             # TypeScript types
├── public/
│   └── logo.png             # Transform logo
└── database-schema.sql      # Database schema
```

## Conditional Logic

The application implements the following eligibility rules:

- **All Attendees**: AI@Work Session, Exec Chambers Sessions (Mon, Tue, Wed)
- **Enterprise CHROs** (CHRO + 5,000+ employees): Sponsored Dinner, CHRO Experience Lunch, VIP Dinner, CHRO Experience Breakfast
- **Growth-Stage CHROs** (CHRO + Under 5,000 employees): CHRO Track Session
- **Exec Members**: Exec Member Lunch, VIP Dinner
- **Exec Lounge Access**: Automatically granted to all CHROs and Exec Members

## Email Configuration (Optional)

To enable automated confirmation emails, you can:

1. Use Supabase Edge Functions with a service like Resend or SendGrid
2. Add an email service integration in `app/api/register/route.ts`
3. Configure email templates based on the PRD specifications

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings
4. Deploy

### Other Platforms

This is a standard Next.js app and can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

## Database Schema

The `registrations` table stores:
- Contact information (name, email, company, title)
- Qualification answers (CHRO status, company size, membership)
- Activity selections (11 boolean fields)
- Logistics (hotel, dates, dietary restrictions)

See `database-schema.sql` for the complete schema.

## Support

For questions or issues, contact the development team.

