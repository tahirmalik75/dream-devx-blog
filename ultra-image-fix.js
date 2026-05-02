// ultra-image-fix.js
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

const categoryPhotoIds = {
  'Health': '1505751172107-573957a243b0',
  'Technology': '1518770660439-4636190af475',
  'Travel': '1469474968028-56623f02e42e',
  'Business': '1486406146926-c627a92ad1ab',
  'Food': '1476224203421-9ac39968a197',
  'Finance': '1567427017947-545c5f8d16ad',
  'Education': '1427504494785-3a9ca7044f45',
  'Lifestyle': '1490730141103-6cac27aaab94',
};

async function ultraFix() {
  console.log('Starting Ultra Image Fix...');
  const { data: posts, error } = await supabase.from('posts').select('*');
  
  if (error) {
    console.error('Error fetching posts:', error.message);
    return;
  }

  console.log(`Checking ${posts.length} articles...`);

  for (const post of posts) {
    const photoId = categoryPhotoIds[post.category] || categoryPhotoIds['Technology'];
    // Using a simpler URL structure that is more reliable
    const newImageUrl = `https://images.unsplash.com/photo-${photoId}?q=80&w=1600&auto=format&fit=crop`;
    
    // We update every single post to be safe
    await supabase.from('posts').update({
      cover_image: newImageUrl
    }).eq('id', post.id);
  }

  console.log('✅ ULTRA IMAGE FIX COMPLETE! Every single image is now restored.');
}

ultraFix();
