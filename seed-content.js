// seed-content.js
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

const demoPosts = [
  {
    title: "The Art of Minimalist Living in a Digital Age",
    slug: "minimalist-living-digital-age",
    excerpt: "Discover how stripping away the noise can lead to a more focused and fulfilling lifestyle.",
    content: "<h2>Why Minimalism Matters</h2><p>In a world of constant notifications and endless consumerism, the art of minimalism is more relevant than ever. It's not just about owning fewer things; it's about making room for what truly matters.</p><h3>How to Start</h3><ul><li>Audit your digital space</li><li>Practice intentional spending</li><li>Focus on quality over quantity</li></ul>",
    category: "Lifestyle",
    published: true,
    featured: false,
    author: "Admin",
    read_time: 4,
    cover_image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=1200"
  },
  {
    title: "5 Growth Strategies for Small Startups in 2026",
    slug: "startup-growth-strategies-2026",
    excerpt: "How to scale your business effectively in an ever-changing economic landscape.",
    content: "<h2>Scaling Sustainably</h2><p>Growth is the goal, but scaling too fast can be a death sentence for startups. Here are five proven strategies to grow your business without losing your soul.</p><p>1. Hyper-focus on customer retention. 2. Leverage AI for operational efficiency. 3. Build a community, not just a customer base. 4. Prioritize agile decision making. 5. Invest in your employer brand.</p>",
    category: "Business",
    published: true,
    featured: true,
    author: "Admin",
    read_time: 6,
    cover_image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=1200"
  },
  {
    title: "Why Sleep is the Secret Weapon for High Performance",
    slug: "sleep-secret-weapon-performance",
    excerpt: "Learn the science behind why a good night's rest is better than any productivity hack.",
    content: "<h2>The Science of Rest</h2><p>Sleep is not a luxury; it's a physiological necessity. When we skip sleep, we're not just tired—we're chemically impaired.</p><h3>The Benefits of 8 Hours</h3><p>Consistent sleep improves memory consolidation, emotional regulation, and physical recovery. If you want to perform at your peak, you must prioritize your pillow.</p>",
    category: "Health",
    published: true,
    featured: false,
    author: "Admin",
    read_time: 5,
    cover_image: "https://images.unsplash.com/photo-1541480601022-23057d163484?auto=format&fit=crop&q=80&w=1200"
  },
  {
    title: "Hidden Gems: Why Your Next Trip Should be to Northern Italy",
    slug: "hidden-gems-northern-italy",
    excerpt: "Beyond Venice and Milan, discover the breathtaking landscapes of the Dolomites.",
    content: "<h2>The Magic of the North</h2><p>Italy is famous for Rome and Florence, but the true magic lies in the rugged peaks of the north. From the serene shores of Lake Como to the jagged Dolomites, Northern Italy is a traveler's paradise.</p><p>Don't miss the local cuisine, which swaps pasta for polenta and heavy sauces for fresh alpine flavors.</p>",
    category: "Travel",
    published: true,
    featured: false,
    author: "Admin",
    read_time: 7,
    cover_image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=80&w=1200"
  }
];

async function seed() {
  console.log('Inserting demo articles...');
  const { error } = await supabase.from('posts').insert(demoPosts);
  
  if (error) {
    console.error('Error seeding data:', error.message);
  } else {
    console.log('✅ Successfully added 4 new articles to dream devx!');
  }
}

seed();
