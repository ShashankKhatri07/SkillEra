import { createClient } from '@supabase/supabase-js';

// These environment variables should be configured in your deployment environment.
// For local development, you can use a .env file.
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase URL or Key is not set. Database features will be disabled. App will run in offline mode with mock data.');
}

// Export a memoized client instance. If keys are missing, export null to allow the app to run in a degraded mode (using mock data) instead of crashing.
export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
