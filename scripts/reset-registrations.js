const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Manually parse .env file
try {
  const envPath = path.resolve(__dirname, '../.env')
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim().replace(/^"(.*)"$/, '$1')
      process.env[key.trim()] = value
    }
  })
} catch (err) {
  console.warn('Could not read .env file, relying on existing process.env')
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Checked .env and process.env.')
  console.log('Available keys:', Object.keys(process.env).filter(k => k.includes('SUPABASE')))
  process.exit(1)
}

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

  if (!data || data.length === 0) {
    console.log('No registrations found.')
    return
  }

  console.log(`Found ${data.length} registrations. Resetting...`)

  for (const registration of data) {
    process.stdout.write(`Resetting ${registration.full_name} (${registration.id})... `)
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
      console.log('FAILED')
      console.error(`Error resetting ${registration.full_name}:`, updateError)
    } else {
      console.log('DONE')
    }
  }

  console.log('Finished resetting registrations.')
}

resetRegistrations()
