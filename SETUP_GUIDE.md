# Setup Guide - Executive Experiences Registration

## Quick Start

Follow these steps to get the application running:

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase Database

#### Create a Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Click "New Project"
4. Fill in:
   - Project name: `exec-experience-reg` (or your choice)
   - Database password: (create a strong password)
   - Region: Choose closest to your users
5. Wait for the project to be created (~2 minutes)

#### Create the Database Table
1. In your Supabase project dashboard, click on "SQL Editor" in the left sidebar
2. Click "New Query"
3. Copy the entire contents of `database-schema.sql` from this project
4. Paste it into the SQL editor
5. Click "Run" to execute the SQL
6. You should see a success message

#### Get Your API Credentials
1. Click on "Project Settings" (gear icon) in the left sidebar
2. Click on "API" in the settings menu
3. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (a long string starting with `eyJ...`)

### 3. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` in your text editor

3. Replace the placeholder values with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Testing the Application

### Test Scenarios

Test all four user flows from the PRD:

#### Flow A: Enterprise CHRO who is an Exec Member
1. Fill in contact information
2. Select "Yes" for CHRO
3. Select "5,000+ employees"
4. Select "Yes" for Exec Member
5. You should see: AI@Work, all Exec Chambers, Sponsored Dinner, Exec Member Lunch, CHRO Experience Lunch, VIP Dinner, CHRO Experience Breakfast
6. You should see the Exec Lounge Access notice
7. You should NOT see: CHRO Track Session, Executive Breakfast

#### Flow B: CHRO at company with Under 5,000 employees, not an Exec Member
1. Fill in contact information
2. Select "Yes" for CHRO
3. Select "Under 5,000 employees"
4. Select "No" for Exec Member
5. You should see: AI@Work, all Exec Chambers, CHRO Track Session, Executive Breakfast
6. You should see the Exec Lounge Access notice
7. You should NOT see: Exec Member Lunch, CHRO Experience Lunch/Breakfast, VIP Dinner

#### Flow C: VP of People (not CHRO), not an Exec Member
1. Fill in contact information
2. Select "No" for CHRO
3. Select "No" for Exec Member
4. You should see: AI@Work, all Exec Chambers, Executive Breakfast
5. You should NOT see: Any CHRO-specific programming, Exec Member Lunch, VIP Dinner, Exec Lounge notice

#### Flow D: Exec Member who is not a CHRO
1. Fill in contact information
2. Select "No" for CHRO
3. Select "Yes" for Exec Member
4. You should see: AI@Work, all Exec Chambers, Exec Member Lunch, VIP Dinner, Executive Breakfast
5. You should see the Exec Lounge Access notice
6. You should NOT see: CHRO Experience Lunch/Breakfast, CHRO Track Session

### Verify Database Storage

After submitting a test registration:
1. Go to your Supabase dashboard
2. Click "Table Editor" in the left sidebar
3. Select the "registrations" table
4. You should see your test registration with all fields populated correctly

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub (create a new repository)
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Configure:
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./`
6. Add Environment Variables:
   - Click "Environment Variables"
   - Add `NEXT_PUBLIC_SUPABASE_URL` with your Supabase URL
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` with your Supabase anon key
7. Click "Deploy"
8. Your app will be live at `https://your-project.vercel.app`

### Custom Domain (Optional)

1. In Vercel, go to your project settings
2. Click "Domains"
3. Add your custom domain (e.g., `register.transform.us`)
4. Follow the DNS configuration instructions

## Email Configuration (Optional)

To enable automated confirmation emails:

### Option 1: Supabase Edge Functions + Resend

1. Install Supabase CLI: `npm install -g supabase`
2. Create an account at [resend.com](https://resend.com)
3. Get your Resend API key
4. Create a Supabase Edge Function for sending emails
5. Update the API route to trigger the edge function

### Option 2: Direct Email Service Integration

1. Choose an email service (SendGrid, Mailgun, AWS SES, etc.)
2. Get API credentials
3. Add to `.env.local`:
   ```
   EMAIL_SERVICE_API_KEY=your_key_here
   EMAIL_FROM=exec@transform.us
   ```
4. Update `app/api/register/route.ts` to send emails after successful registration

## Troubleshooting

### "Failed to save registration" error
- Check that your Supabase credentials in `.env.local` are correct
- Verify the database table was created successfully
- Check the browser console for detailed error messages

### Activities not showing after answering questions
- Make sure all three qualification questions are answered
- Check the browser console for JavaScript errors

### Logo not displaying
- Ensure `logo.png` is in the `public` folder
- Try clearing your browser cache

## Support

For technical issues or questions, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

