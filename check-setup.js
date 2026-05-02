// check-setup.js
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

async function check() {
  const email = 'connect.dreamdev@gmail.com';
  console.log(`Checking status for: ${email}`);

  // 1. Check Supabase Auth
  const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
  const user = users.find(u => u.email === email);
  
  if (!user) {
    console.log('❌ User NOT found in Supabase Auth.');
  } else {
    console.log('✅ User found in Supabase Auth.');
    
    // 2. Check admin_users table
    const { data: adminEntry, error: tableError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (tableError || !adminEntry) {
      console.log('❌ User NOT found in admin_users table. They are not an admin yet!');
      
      // Fix it!
      console.log('Attempting to grant Admin permissions...');
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert({ id: user.id, email: user.email, role: 'admin' });
        
      if (insertError) console.log('❌ Failed to grant permissions:', insertError.message);
      else console.log('✅ Admin permissions GRANTED successfully!');
    } else {
      console.log('✅ User is already an Admin in the database.');
    }
  }
}

check();
