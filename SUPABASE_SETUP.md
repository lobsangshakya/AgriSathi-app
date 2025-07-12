# Supabase Setup Guide for AgriSathi

This guide will help you set up Supabase as the backend and authentication system for your AgriSathi app.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `agrisathi-app`
   - Database Password: Choose a strong password
   - Region: Select the region closest to your users
6. Click "Create new project"

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy the following values:
   - Project URL (e.g., `https://your-project-id.supabase.co`)
   - Anon public key (starts with `eyJ...`)

## 3. Set Up Environment Variables

Create a `.env` file in your project root with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the values with your actual Supabase project credentials.

## 4. Set Up the Database Schema

1. In your Supabase dashboard, go to SQL Editor
2. Copy and paste the contents of `supabase-schema.sql` into the editor
3. Click "Run" to execute the schema

This will create:
- User profiles table
- Crop recommendations table
- Disease detections table
- Community posts table
- Experts and consultations tables
- Weather data table
- Notifications table
- Row Level Security (RLS) policies
- Sample data

## 5. Configure Authentication

1. Go to Authentication > Settings in your Supabase dashboard
2. Configure the following settings:

### Site URL
Add your app's URL:
- For development: `http://localhost:5173`
- For production: `https://your-domain.com`

### Redirect URLs
Add these redirect URLs:
- `http://localhost:5173/auth/callback`
- `http://localhost:5173/profile`
- `https://your-domain.com/auth/callback` (for production)
- `https://your-domain.com/profile` (for production)

### Email Templates
Customize the email templates for:
- Confirm signup
- Magic link
- Change email address
- Reset password

## 6. Set Up Storage (Optional)

If you want to enable image uploads:

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `images`
3. Set the bucket to public
4. Configure the storage policies in the SQL editor:

```sql
-- Allow authenticated users to upload images
CREATE POLICY "Users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow public access to view images
CREATE POLICY "Anyone can view images" ON storage.objects
  FOR SELECT USING (true);
```

## 7. Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Try to sign up with a new account
3. Check your email for the confirmation link
4. Verify that the user profile is created in the database

## 8. Database Tables Overview

### Profiles
- Extends Supabase auth.users
- Stores user profile information
- Includes farming details, stats, and achievements

### Crop Recommendations
- Location-based crop suggestions
- Seasonal recommendations
- Benefits and requirements for each crop

### Disease Detections
- Stores AI disease detection results
- Links to user profiles
- Includes confidence scores and recommendations

### Community Posts
- User-generated content
- Categories and engagement metrics
- Public read access, authenticated write access

### Experts & Consultations
- Expert profiles and specializations
- Consultation requests and responses
- Rating system

### Weather Data
- Location-based weather information
- Forecast data
- Public read access

### Notifications
- User-specific notifications
- Read/unread status
- Various notification types

## 9. Security Features

The schema includes Row Level Security (RLS) policies that ensure:

- Users can only access their own data
- Public read access for community content
- Authenticated users can create content
- Proper data isolation between users

## 10. Troubleshooting

### Common Issues

1. **Environment variables not loading**
   - Make sure your `.env` file is in the project root
   - Restart your development server after adding environment variables

2. **Authentication not working**
   - Check that your Supabase URL and anon key are correct
   - Verify redirect URLs are properly configured
   - Check browser console for errors

3. **Database errors**
   - Ensure the schema has been properly executed
   - Check that RLS policies are in place
   - Verify table names match the code

4. **CORS errors**
   - Add your domain to the allowed origins in Supabase settings
   - Check that your site URL is correctly configured

### Getting Help

- Check the [Supabase documentation](https://supabase.com/docs)
- Review the [Supabase JavaScript client docs](https://supabase.com/docs/reference/javascript)
- Join the [Supabase Discord community](https://discord.supabase.com)

## 11. Production Deployment

When deploying to production:

1. Update environment variables with production values
2. Configure production redirect URLs
3. Set up proper CORS settings
4. Consider using environment-specific configurations
5. Set up monitoring and logging

## 12. Next Steps

After setting up Supabase:

1. Test all authentication flows
2. Verify database operations work correctly
3. Test file uploads (if enabled)
4. Set up monitoring and analytics
5. Configure backup strategies
6. Set up CI/CD pipelines

Your AgriSathi app is now ready to use Supabase for backend services and authentication! 