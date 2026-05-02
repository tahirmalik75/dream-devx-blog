// update-site-name.js
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

async function updateName() {
  console.log('Updating Site Name to: dream-devx-blog');
  const { error } = await supabase
    .from('site_settings')
    .upsert({ id: 1, site_name: 'dream-devx-blog' });
  
  if (error) {
    console.error('Error updating name:', error.message);
  } else {
    console.log('✅ Site name successfully updated in the database!');
  }
}

updateName();
