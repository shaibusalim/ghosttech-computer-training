import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function resetRegistrations() {
  console.log('Fetching registrations...')
  const { data, error: fetchError } = await supabase
    .from('registrations')
    .select('id, full_name, status, payment_status')

  if (fetchError) {
    console.error('Error fetching registrations:', fetchError)
    return
  }

  console.log(`Found ${data.length} registrations. Resetting...`)

  for (const registration of data) {
    console.log(`Resetting ${registration.full_name} (${registration.id})...`)
    const { error: updateError } = await supabase
      .from('registrations')
      .update({
        status: 'pending_payment',
        payment_status: 'none',
        payment_confirmed_at: null,
        payment_amount: null,
        payment_reference: null,
      })
      .eq('id', registration.id)

    if (updateError) {
      console.error(`Error resetting ${registration.full_name}:`, updateError)
    }
  }

  console.log('Finished resetting registrations.')
}

resetRegistrations()
