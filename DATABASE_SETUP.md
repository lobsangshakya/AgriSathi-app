# Database Setup Guide - AgriSathi

This guide will help you set up Supabase database and enable real authentication and data storage for your AgriSathi application.

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Connect to your GitHub account or sign up
4. Create a new project:
   - **Project Name**: `AgriSathi`
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users

### Step 2: Get Your Credentials
1. Go to Project Settings → API
2. Copy these values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ...`)

### Step 3: Set Up Database
1. Go to SQL Editor in your Supabase dashboard
2. Copy the entire contents of `supabase-schema.sql` file
3. Paste and click "Run" to create all tables

### Step 4: Configure Environment
1. Copy `.env.example` to `.env`
2. Fill in your Supabase credentials:
   ```bash
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
   ```

### Step 5: Start the App
```bash
npm run dev
```

That's it! Your app now has real authentication and database.

## 📋 Detailed Setup Instructions

### Database Schema Overview

The following tables are created:

#### `users`
- User profiles and authentication data
- Stores: name, email, phone, location, crops, etc.
- **Security**: Row Level Security (RLS) enabled

#### `community_posts`
- User-generated community posts
- Stores: title, content, category, image, likes, comments
- **Permissions**: Authenticated users can create/update own posts

#### `chat_messages`
- AI chatbot conversation history
- Stores: user_id, content, sender (user/bot), type
- **Privacy**: Users can only see their own messages

#### `disease_analysis`
- Plant disease detection history
- Stores: image_url, disease_name, confidence, recommendations
- **Security**: Users can only access their own analysis

#### `weather_data`
- Cached weather information (public read access)
- Stores: location, temperature, humidity, forecast
- **Performance**: Auto-expires after 1 hour

#### `user_achievements`
- Gamification achievements
- Stores: title, points, icon, earned_at

#### `user_stats`
- User statistics and credits
- Stores: posts_shared, helpful_answers, questions_asked, credits_earned

### Security Features

#### Row Level Security (RLS)
- **Users can only access their own data**
- **Community posts are publicly readable**
- **Weather data is publicly accessible**
- **Service role can manage system data**

#### Automatic Timestamps
- `created_at` and `updated_at` managed automatically
- Triggers ensure data consistency

#### Data Validation
- Email uniqueness enforced
- Enum values checked (sender, type, severity)
- Foreign key constraints prevent orphaned data

## 🔧 Advanced Configuration

### Custom API Integration

If you want to integrate real external APIs:

1. **Weather Data** (OpenWeather):
   ```bash
   VITE_OPENWEATHER_API_KEY=your_openweather_key
   ```

2. **Disease Detection** (Plant.id):
   ```bash
   VITE_PLANT_ID_API_KEY=your_plant_id_key
   ```

3. **Agriculture Data**:
   ```bash
   VITE_AGRICULTURE_API_KEY=your_agriculture_key
   ```

### Development vs Production

#### Development Mode
```bash
VITE_USE_MOCK_APIS=true
```
- Uses mock data for testing
- No real API calls
- Faster development

#### Production Mode
```bash
VITE_USE_MOCK_APIS=false
```
- Uses real Supabase database
- Real authentication
- External API integration

## 🧪 Testing the Setup

### 1. Test Authentication
1. Start the app: `npm run dev`
2. Go to login page
3. Create a new account
4. Verify user data appears in Supabase dashboard

### 2. Test Data Storage
1. Create a community post
2. Check `community_posts` table
3. Test chat functionality
4. Check `chat_messages` table

### 3. Test Security
1. Try to access another user's data (should fail)
2. Verify RLS policies are working
3. Check authentication flow

## 🚨 Troubleshooting

### Common Issues

#### "Missing Supabase environment variables"
**Solution**: Check your `.env` file contains both URL and key

#### "Database relation does not exist"
**Solution**: Run the SQL schema in Supabase SQL Editor

#### "Permission denied" errors
**Solution**: Check RLS policies and user authentication

#### "CORS policy" errors
**Solution**: Add your localhost to Supabase CORS settings

### Debug Mode
Enable debug logging:
```bash
VITE_DEBUG=true
```

This will show detailed authentication and API logs in browser console.

## 📊 Monitoring

### Supabase Dashboard
Monitor:
- **Authentication**: User signups, logins
- **Database**: Query performance, storage
- **Storage**: File uploads (if enabled)
- **Functions**: Edge function usage

### Local Development
Use browser DevTools to monitor:
- Network requests to Supabase
- Authentication state changes
- Local storage usage

## 🔐 Security Best Practices

### Environment Variables
- Never commit `.env` to version control
- Use different keys for development/production
- Rotate keys regularly

### Database Security
- RLS policies are enabled by default
- Users can only access their own data
- Service role for system operations

### Authentication
- Passwords are hashed by Supabase
- Session tokens automatically refresh
- Secure HTTP-only cookies

## 🚀 Deployment

### Environment Setup
1. Set production environment variables in your hosting platform
2. Update Supabase CORS settings
3. Run database migrations if needed

### Production Checklist
- [ ] Supabase project created
- [ ] Database schema applied
- [ ] Environment variables set
- [ ] CORS configured
- [ ] Authentication tested
- [ ] Data operations tested
- [ ] Security policies verified

## 📞 Support

### Supabase Documentation
- [Database Guide](https://supabase.com/docs/guides/database)
- [Auth Guide](https://supabase.com/docs/guides/auth)
- [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)

### AgriSathi Support
- Check the `CLEANUP_SUMMARY.md` for project overview
- Review code comments for implementation details
- Test all features before production deployment

---

**🎉 Congratulations!** Your AgriSathi app now has a complete backend with Supabase!
