// reset-admin.js
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Simple function to read .env.local without needing 'dotenv'
function loadEnv() {
  const envFile = fs.readFileSync('.env.local', 'utf8');
  const env = {};
  envFile.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
  });
  return env;
}

const env = loadEnv();

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

async function resetPassword() {
  const email = 'connect.dreamdev@gmail.com';
  const newPassword = 'NewAdminPassword123!';

  console.log(`Attempting to reset password for ${email}...`);

  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    console.error('User not found!');
    return;
  }

  const { error } = await supabase.auth.admin.updateUserById(user.id, {
    password: newPassword
  });

  if (error) {
    console.error('Error resetting password:', error.message);
  } else {
    console.log('--------------------------------------------------');
    console.log('SUCCESS! Your password has been reset.');
    console.log(`Email: ${email}`);
    console.log(`New Password: ${newPassword}`);
    console.log('--------------------------------------------------');
  }
}

resetPassword();
