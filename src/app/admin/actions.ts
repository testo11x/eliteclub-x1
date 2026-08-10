'use server'

import { createAdminClient } from '@/utils/supabase/admin'

export async function adminResetPassword(userId: string) {
  try {
    const supabaseAdmin = createAdminClient()
    
    // Force update the password for the specific user in the auth table
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: 'GermanGears123!',
    })

    if (error) throw error

    return { success: true, message: 'Password successfully reset to GermanGears123!' }
  } catch (error: any) {
    console.error('Error resetting password:', error)
    return { success: false, message: error.message || 'Failed to reset password.' }
  }
}

export async function adminGetCustomers() {
  try {
    const supabaseAdmin = createAdminClient()
    
    // Fetch auth users to get emails (requires service role)
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
    if (usersError) throw usersError

    // Fetch profiles
    const { data: profiles, error: profilesError } = await supabaseAdmin.from('profiles').select('*')
    if (profilesError) throw profilesError

    // Merge profiles with emails
    const merged = profiles.map(profile => {
      const user = users.users.find(u => u.id === profile.id)
      return {
        ...profile,
        email: user?.email || 'N/A'
      }
    })

    // Sort by created_at descending
    merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return { success: true, data: merged }
  } catch (error: any) {
    console.error('Error fetching customers:', error)
    return { success: false, data: [] }
  }
}

export async function adminDeleteCustomer(userId: string) {
  try {
    const supabaseAdmin = createAdminClient()
    
    // Completely delete the user from auth.users (cascades to profiles)
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (error) throw error

    return { success: true, message: 'Customer successfully deleted.' }
  } catch (error: any) {
    console.error('Error deleting customer:', error)
    return { success: false, message: error.message || 'Failed to delete customer.' }
  }
}
