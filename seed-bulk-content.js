// seed-bulk-content.js
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

const bulkPosts = [
  // LIFESTYLE (6)
  { title: "Slow Living: Finding Peace in a Fast World", category: "Lifestyle", excerpt: "Learn how to slow down and enjoy the small moments." },
  { title: "The Ultimate Guide to Sustainable Fashion", category: "Lifestyle", excerpt: "How to build a wardrobe that respects the planet." },
  { title: "Mastering the Art of Journaling", category: "Lifestyle", excerpt: "Transform your thoughts through daily writing habits." },
  { title: "Urban Gardening for Small Apartments", category: "Lifestyle", excerpt: "Grow your own food, even with zero outdoor space." },
  { title: "Creating a Tech-Free Sanctuary at Home", category: "Lifestyle", excerpt: "Designated spaces to disconnect and recharge." },
  { title: "The Psychology of Scent in Home Design", category: "Lifestyle", excerpt: "Using aromatherapy to enhance your living environment." },

  // BUSINESS (6)
  { title: "Ethical AI: The New Corporate Responsibility", category: "Business", excerpt: "How companies are navigating the ethics of automation." },
  { title: "Bootstrapping Your Business in 2026", category: "Business", excerpt: "How to build a profitable company without outside funding." },
  { title: "The Rise of Circular Economy Models", category: "Business", excerpt: "Turning waste into wealth for a sustainable future." },
  { title: "Emotional Intelligence in Remote Leadership", category: "Business", excerpt: "Leading with empathy across digital borders." },
  { title: "Gen Z in the Workforce: Changing Expectations", category: "Business", excerpt: "Adapting your management style for the new generation." },
  { title: "Crisis Management in the Age of Social Media", category: "Business", excerpt: "How to protect your brand when things go wrong." },

  // HEALTH (6)
  { title: "Gut Health: The Second Brain Connection", category: "Health", excerpt: "Why your digestive system is the key to mental health." },
  { title: "Intermittent Fasting: Myths vs Science", category: "Health", excerpt: "A deep dive into the real benefits of timed eating." },
  { title: "Biohacking Your Longevity", category: "Health", excerpt: "Practical tips to live a longer, healthier life." },
  { title: "The Importance of Strength Training for All Ages", category: "Health", excerpt: "Why muscle mass is your best insurance policy." },
  { title: "Holistic Approaches to Stress Reduction", category: "Health", excerpt: "Combining ancient wisdom with modern science." },
  { title: "Hydration: More Than Just Drinking Water", category: "Health", excerpt: "Optimizing your electrolyte balance for peak performance." },

  // TRAVEL (6)
  { title: "Cultural Etiquette: A Guide for Global Travelers", category: "Travel", excerpt: "How to respect local traditions wherever you go." },
  { title: "Sustainable Travel: Leaving a Positive Footprint", category: "Travel", excerpt: "Eco-friendly tips for the conscious adventurer." },
  { title: "The Best Budget-Friendly European Cities", category: "Travel", excerpt: "Discover Europe without breaking the bank." },
  { title: "Exploring the Ancient Ruins of Petra", category: "Travel", excerpt: "A journey through the stone city of Jordan." },
  { title: "The Digital Nomad's Guide to Bali", category: "Travel", excerpt: "Everything you need to work and live in paradise." },
  { title: "Winter Magic: The Northern Lights in Iceland", category: "Travel", excerpt: "How to chase the Aurora Borealis successfully." },

  // FOOD (6)
  { title: "Plant-Based Protein: Beyond Tofu", category: "Food", excerpt: "Exploring the world of lentils, tempeh, and seitan." },
  { title: "The Science of Sourdough Baking", category: "Food", excerpt: "Understanding the chemistry behind the perfect crust." },
  { title: "Traditional Spice Blends from Around the World", category: "Food", excerpt: "From Berbere to Garam Masala: A flavor journey." },
  { title: "The Health Benefits of Fermented Foods", category: "Food", excerpt: "Why Kimchi and Sauerkraut are superfoods." },
  { title: "Mastering One-Pot Cooking for Families", category: "Food", excerpt: "Delicious meals with minimal cleanup." },
  { title: "Crafting the Perfect Home Espresso", category: "Food", excerpt: "Become your own barista with these expert tips." },

  // FINANCE (6)
  { title: "Investing for Beginners: Stocks vs Bonds", category: "Finance", excerpt: "Building a balanced portfolio from scratch." },
  { title: "Real Estate Investing in a Shifting Market", category: "Finance", excerpt: "Is now the right time to buy your first property?" },
  { title: "Understanding Cryptocurrency Wallets", category: "Finance", excerpt: "How to keep your digital assets safe and secure." },
  { title: "The FIRE Movement: Financial Independence", category: "Finance", excerpt: "Retiring early through aggressive saving and investing." },
  { title: "Budgeting for Travel: Your Dream Trip is Possible", category: "Finance", excerpt: "How to save for adventure without sacrificing daily life." },
  { title: "Navigating Taxes for Freelancers", category: "Finance", excerpt: "Stay compliant and maximize your deductions." },

  // EDUCATION (6)
  { title: "The Power of Lifelong Learning", category: "Education", excerpt: "Why education shouldn't stop after graduation." },
  { title: "Critical Thinking in the Age of AI", category: "Education", excerpt: "Developing the skills to navigate a world of deepfakes." },
  { title: "Language Learning Hacks for Adults", category: "Education", excerpt: "Become fluent faster with these immersion techniques." },
  { title: "The Importance of Soft Skills in STEM", category: "Education", excerpt: "Why engineers and scientists need communication skills." },
  { title: "Alternative Education: Montessori to Waldorf", category: "Education", excerpt: "Exploring different philosophies for child development." },
  { title: "Upskilling: Staying Relevant in a Changing Economy", category: "Education", excerpt: "The best skills to learn for the future of work." }
].map(p => ({
  ...p,
  slug: p.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'),
  content: `<h2>${p.title}</h2><p>This is a professional article about ${p.title}. ${p.excerpt}</p><p>Coming soon: Detailed insights, expert interviews, and practical guides on this topic.</p>`,
  published: true,
  author: "Admin",
  read_time: Math.floor(Math.random() * 5) + 3,
  created_at: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
  cover_image: `https://images.unsplash.com/photo-1500000000000?auto=format&fit=crop&q=80&w=1200&${p.category.toLowerCase()}`
}));

async function seed() {
  console.log(`Inserting ${bulkPosts.length} more articles...`);
  const { error } = await supabase.from('posts').insert(bulkPosts);
  
  if (error) {
    console.error('Error seeding data:', error.message);
  } else {
    console.log(`✅ Successfully added ${bulkPosts.length} new articles to dream devx!`);
  }
}

seed();
