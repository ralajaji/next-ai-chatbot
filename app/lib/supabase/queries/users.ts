import { supabaseServer } from '../server';

export async function syncUserToSupabase(user: {
  email: string;
  name?: string | null;
  image?: string | null;
}) {
  try {
    const { error } = await supabaseServer
      .from('users')
      .upsert(
        {
          email: user.email,
          name: user.name,
          image: user.image,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'email' } // Specify the unique column
      );

    if (error) {
      console.error('Error upserting user:', error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error syncing user to Supabase:', error);
    return { success: false, error };
  }
}
