// update-email.js
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

function loadEnv() {
  const envFile = fs.readFileSync('.env.local', 'utf8');
  const env = {};
  envFile.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join('=').trim();
      if (key && value) env[key] = value;
    }
  });
  return env;
}

const env = loadEnv();
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function update() {
  console.log('Updating site email...');
  const { error } = await supabase
    .from('site_settings')
    .update({ contact_email: 'connect.dreamdev@gmail.com' })
    .eq('id', 1);

  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('✅ Email updated to connect.dreamdev@gmail.com');
  }
}

update();
