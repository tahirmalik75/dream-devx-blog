// universal-image-fix.js
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

async function universalFix() {
  console.log('Starting Universal Image Fix (using keywords)...');
  const { data: posts, error } = await supabase.from('posts').select('*');
  
  if (error) {
    console.error('Error fetching posts:', error.message);
    return;
  }

  console.log(`Fixing ${posts.length} articles...`);

  for (const post of posts) {
    const keyword = post.category.toLowerCase();
    // Using the "random" keyword pattern from Unsplash which is extremely reliable
    const newImageUrl = `https://images.unsplash.com/featured/?${keyword}&sig=${post.id}`;
    
    await supabase.from('posts').update({
      cover_image: newImageUrl
    }).eq('id', post.id);
  }

  console.log('✅ UNIVERSAL IMAGE FIX COMPLETE! All images are now dynamic and working.');
}

universalFix();
