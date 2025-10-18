# Supabase Setup Instructions

## 1. Database Schema Setup

Run the following SQL in your Supabase SQL editor:

```sql
-- Create pdf_history table
CREATE TABLE pdf_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pdf_name TEXT NOT NULL,
  analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE pdf_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own pdf history" ON pdf_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pdf history" ON pdf_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own pdf history" ON pdf_history
  FOR DELETE USING (auth.uid() = user_id);
```

## 2. Environment Variables

Create a `.env.local` file in your project root with:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. Features Implemented

✅ **Authentication System**
- Sign up/Sign in forms with email/password
- Global AuthContext for session management
- Protected routes (PDF analysis only for authenticated users)

✅ **PDF History**
- Automatic saving of analyzed PDFs to user's history
- History page showing all user's analyzed documents
- Secure RLS policies ensuring users only see their own data

✅ **Database Security**
- Row Level Security enabled
- Policies for SELECT, INSERT, and DELETE operations
- Foreign key relationship to auth.users table

## 4. Usage

1. Users must sign up/sign in to access PDF analysis
2. Each analyzed PDF is automatically saved to their history
3. Users can view their analysis history via the "View History" button
4. All data is securely isolated per user through RLS policies
