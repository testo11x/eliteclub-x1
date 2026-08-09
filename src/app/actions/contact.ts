'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitContactMessage(prevState: any, formData: FormData) {
  try {
    const firstName = formData.get('firstName')?.toString() || ''
    const lastName = formData.get('lastName')?.toString() || ''
    const email = formData.get('email')?.toString() || ''
    const subject = formData.get('subject')?.toString() || 'general'
    const message = formData.get('message')?.toString() || ''

    if (!firstName || !lastName || !email || !message) {
      return { success: false, error: 'Please fill in all required fields.' }
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('contact_messages')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: email,
        subject: subject,
        message: message,
      })

    if (error) {
      console.error('Supabase error inserting contact message:', error)
      return { success: false, error: 'Failed to send message. Please try again later.' }
    }

    revalidatePath('/contact')
    return { success: true }
  } catch (err) {
    console.error('Error submitting contact form:', err)
    return { success: false, error: 'An unexpected error occurred. Please try again later.' }
  }
}
