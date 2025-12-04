import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
// These should be set in your deployment environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client for frontend use
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => !!supabase;

// Upload profile picture to Supabase Storage
export async function uploadProfilePicture(userId: string, file: File): Promise<string | null> {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPG, PNG, and WebP are allowed.');
  }

  // Validate file size (500 KB = 512000 bytes)
  if (file.size > 512000) {
    throw new Error('File size must be less than 500 KB.');
  }

  // Get file extension
  const fileExt = file.name.split('.').pop();
  const fileName = `avatar.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  try {
    // Delete old avatar if exists
    const { data: existingFiles } = await supabase.storage
      .from('profile-imgs')
      .list(userId);

    if (existingFiles && existingFiles.length > 0) {
      await supabase.storage
        .from('profile-imgs')
        .remove(existingFiles.map(f => `${userId}/${f.name}`));
    }

    // Upload new avatar
    const { data, error } = await supabase.storage
      .from('profile-imgs')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile-imgs')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    // Re-throw for handling in component
    throw error;
  }
}
