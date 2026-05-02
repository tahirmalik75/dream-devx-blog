// seed-more-content.js
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

const morePosts = [
  {
    title: "How Web3 is Changing the Internet Forever",
    slug: "how-web3-changing-internet",
    excerpt: "Exploring the decentralization of the web and what it means for creators and users.",
    content: "<h2>The Next Evolution of the Web</h2><p>Web3 is more than just crypto. It's about data ownership and peer-to-peer interactions without middlemen.</p><h3>Key Pillars</h3><ul><li>Blockchain technology</li><li>Self-sovereign identity</li><li>Decentralized Autonomous Organizations (DAOs)</li></ul>",
    category: "Technology",
    published: true,
    author: "Admin",
    read_time: 8,
    cover_image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1200"
  },
  {
    title: "Smart Saving: How to Build Your Emergency Fund Fast",
    slug: "smart-saving-emergency-fund",
    excerpt: "Financial peace starts with having a safety net. Here is how to build one in 6 months.",
    content: "<h2>Security First</h2><p>An emergency fund is your financial insurance policy. Without it, one car repair can ruin your progress.</p><p>Aim for 3-6 months of expenses. Start small, automate your savings, and only touch it for real emergencies.</p>",
    category: "Finance",
    published: true,
    author: "Admin",
    read_time: 5,
    cover_image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=1200"
  },
  {
    title: "10 Quick & Healthy Meals for Busy Professionals",
    slug: "quick-healthy-meals-professionals",
    excerpt: "Stop ordering takeout. These 15-minute meals are delicious and nutritious.",
    content: "<h2>Eating Well on a Schedule</h2><p>You don't need hours to cook a healthy meal. Focus on high-protein, quick-cook ingredients like eggs, salmon, and pre-washed greens.</p><h3>The 15-Minute Menu</h3><ul><li>Avocado toast with poached egg</li><li>Quinoa and black bean salad</li><li>Lemon garlic pan-seared tilapia</li></ul>",
    category: "Food",
    published: true,
    author: "Admin",
    read_time: 4,
    cover_image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1200"
  },
  {
    title: "The Rise of Online Learning: What's Next for Education?",
    slug: "rise-of-online-learning",
    excerpt: "Traditional classrooms are changing. Discover the future of hybrid and digital education.",
    content: "<h2>Learning Without Borders</h2><p>The global classroom is here. Online platforms are making high-quality education accessible to anyone with an internet connection.</p><p>We are moving toward personalized, AI-driven learning paths that adapt to each student's unique pace and style.</p>",
    category: "Education",
    published: true,
    author: "Admin",
    read_time: 6,
    cover_image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=1200"
  },
  {
    title: "Designing Your Home for Maximum Productivity",
    slug: "home-office-design-productivity",
    excerpt: "Your environment affects your focus. Small changes to your room can boost your output.",
    content: "<h2>The Workspace Psychology</h2><p>A cluttered desk leads to a cluttered mind. Use natural light, ergonomic furniture, and a touch of greenery to create a space you love working in.</p><p>Separate your 'work zone' from your 'relax zone' to help your brain switch modes effectively.</p>",
    category: "Lifestyle",
    published: true,
    author: "Admin",
    read_time: 5,
    cover_image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=1200"
  },
  {
    title: "The Power of Daily Meditation: 10 Minutes to Peace",
    slug: "power-of-daily-meditation",
    excerpt: "Science-backed benefits of mindfulness and how to build the habit.",
    content: "<h2>Mind Over Matter</h2><p>Meditation isn't just for monks. It's a workout for your brain that reduces stress and improves focus.</p><p>Start with just 5 minutes a day. Focus on your breath. When your mind wanders, gently bring it back.</p>",
    category: "Health",
    published: true,
    author: "Admin",
    read_time: 4,
    cover_image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200"
  },
  {
    title: "Remote Work: Building a Strong Culture from Afar",
    slug: "remote-work-culture",
    excerpt: "Managing a distributed team requires new tools and a different mindset.",
    content: "<h2>Connection Without Office Walls</h2><p>Culture isn't about ping-pong tables; it's about trust and communication. In a remote world, intentionality is everything.</p><p>Use video calls for connection, not just status updates. Create digital watercoolers for casual talk.</p>",
    category: "Business",
    published: true,
    author: "Admin",
    read_time: 7,
    cover_image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200"
  },
  {
    title: "Solo Travel Guide: Best Destinations for Your First Trip",
    slug: "solo-travel-guide-destinations",
    excerpt: "Traveling alone is a life-changing experience. Here is where to go first.",
    content: "<h2>The Freedom of Solo Travel</h2><p>Solo travel forces you out of your comfort zone and helps you discover who you really are.</p><h3>Top First-Timer Picks</h3><ul><li>Iceland (Safest in the world)</li><li>Japan (Unique and easy to navigate)</li><li>Portugal (Friendly and affordable)</li></ul>",
    category: "Travel",
    published: true,
    author: "Admin",
    read_time: 8,
    cover_image: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&q=80&w=1200"
  }
];

async function seed() {
  console.log('Inserting 8 more demo articles...');
  const { error } = await supabase.from('posts').insert(morePosts);
  
  if (error) {
    console.error('Error seeding data:', error.message);
  } else {
    console.log('✅ Successfully added 8 more articles to dream devx!');
  }
}

seed();
