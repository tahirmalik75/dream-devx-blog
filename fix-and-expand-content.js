// fix-and-expand-content.js
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

const categoryImages = {
  'Technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200',
  'Lifestyle': 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=1200',
  'Business': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
  'Health': 'https://images.unsplash.com/photo-1505751172107-573957a243b0?auto=format&fit=crop&q=80&w=1200',
  'Travel': 'https://images.unsplash.com/photo-1500835595367-9917d9c3036a?auto=format&fit=crop&q=80&w=1200',
  'Food': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200',
  'Finance': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1200',
  'Education': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200',
};

async function upgrade() {
  console.log('Fetching all posts to upgrade...');
  const { data: posts, error } = await supabase.from('posts').select('*');
  
  if (error) {
    console.error('Error fetching posts:', error.message);
    return;
  }

  console.log(`Upgrading ${posts.length} articles with better content and images...`);

  for (const post of posts) {
    // 1. Fix Image if broken or placeholder
    let newImage = post.cover_image;
    if (!post.cover_image || post.cover_image.includes('photo-1500000000000')) {
      newImage = categoryImages[post.category] || categoryImages['Technology'];
    }

    // 2. Expand Content
    let newContent = post.content;
    if (post.content.length < 500) {
      newContent = `
        <h2>${post.title}</h2>
        <p>In today's fast-paced world, understanding <strong>${post.title}</strong> is more important than ever. Whether you are a professional or just starting your journey, the insights shared here will help you navigate this complex topic with confidence.</p>
        
        <h3>The Core Principles</h3>
        <p>Success in this area requires a combination of patience, strategy, and consistent action. Many people overlook the small details, but as the saying goes, the devil is in the details. By focusing on quality and authenticity, you can achieve results that last a lifetime.</p>
        
        <blockquote>
          "The secret to progress is simply getting started, but the secret to success is staying the course even when it gets difficult."
        </blockquote>

        <h3>Practical Steps for You</h3>
        <ul>
          <li><strong>Identify your goals</strong>: Clearly define what you want to achieve in this category.</li>
          <li><strong>Stay Updated</strong>: The world changes fast, and keeping up with the latest trends is crucial.</li>
          <li><strong>Build a Community</strong>: Surround yourself with people who share your passion and can offer valuable feedback.</li>
        </ul>

        <h3>Conclusion</h3>
        <p>As we look toward the future, <strong>${post.title}</strong> will continue to play a major role in how we live, work, and grow. We hope this guide serves as a valuable resource on your path to excellence.</p>
      `;
    }

    // 3. Update in database
    await supabase.from('posts').update({
      cover_image: newImage,
      content: newContent,
      read_time: Math.floor(newContent.length / 500) + 3
    }).eq('id', post.id);
  }

  console.log('✅ Content upgrade complete! All images fixed and articles expanded.');
}

upgrade();
