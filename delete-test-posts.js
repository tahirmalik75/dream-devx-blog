// delete-test-posts.js
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

async function deleteTests() {
  console.log('Deleting test posts: dream develop.site and Malik');
  
  const { error } = await supabase
    .from('posts')
    .delete()
    .or('title.eq.dream develop.site,title.eq.Malik');
  
  if (error) {
    console.error('Error deleting posts:', error.message);
  } else {
    console.log('✅ Successfully removed the test articles!');
  }
}

deleteTests();
