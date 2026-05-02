// seed-trending-24.js
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

const trendingPosts = [
  // TECHNOLOGY
  { title: "The Synthetic Content Crisis: Trust in the Age of 90% AI Web", category: "Technology", excerpt: "As projections show AI content dominating the web, the search for 'human' verification begins." },
  { title: "Physical AI: The Robot coworkers are finally in our warehouses", category: "Technology", excerpt: "Embodied AI is moving from laboratories into real-world logistics hubs this month." },
  { title: "Quantum Security: Why your 2026 data needs new encryption", category: "Technology", excerpt: "As quantum utility grows, the threat to traditional security becomes a boardroom priority." },

  // FINANCE
  { title: "The Gen Z Investing Boom: How AI Tools are Leveling the Field", category: "Finance", excerpt: "Despite a tight job market, 20-year-olds are building massive ETF portfolios in 2026." },
  { title: "Tariff Impact 2026: Why your tech gadgets still cost more this year", category: "Finance", excerpt: "Lingering trade policies from 2025 continue to put upward pressure on retail prices." },
  { title: "Crypto Utility: Central Bank Digital Currencies (CBDCs) go mainstream", category: "Finance", excerpt: "The shift from 'speculation' to 'daily payment' for digital assets is finally here." },

  // LIFESTYLE
  { title: "The Analog Resurgence: Why Gen Alpha loves Film and Vinyl", category: "Lifestyle", excerpt: "In an AI-saturated world, the young generation is craving anything with a physical heartbeat." },
  { title: "Slower Living: The broad cultural rejection of 'Algorithmic Trends'", category: "Lifestyle", excerpt: "Why millions are deleting social apps to reclaim their focus and intentionality in 2026." },
  { title: "Micro-cations: The Rise of the 48-hour Luxury Escape", category: "Lifestyle", excerpt: "Short, high-quality trips are replacing the long, logistically heavy vacations of the past." },

  // HEALTH
  { title: "Biohacking 2026: The Rise of NAD+ and Cellular Energy Boosters", category: "Health", excerpt: "Mainstream interest in longevity habits is driving a new billion-dollar wellness industry." },
  { title: "Cryotherapy at Home: The next big tech trend for physical recovery", category: "Health", excerpt: "How cold-shock therapy moved from athlete training rooms to family bathrooms." },
  { title: "The Second Brain: Why Gut Health is the focus of 2026 mental health", category: "Health", excerpt: "New research connects the microbiome directly to emotional regulation and focus." },

  // BUSINESS
  { title: "AI-First Workflows: Is this the end of traditional Headcount?", category: "Business", excerpt: "Companies are reorganizing around autonomous agents, leading to massive efficiency gains." },
  { title: "The Ethics of Automation: Corporate Responsibility in 2026", category: "Business", excerpt: "How global brands are balancing profit with the social impact of total AI integration." },
  { title: "Remote Leadership: Emotional Intelligence in the Multi-Agent Workplace", category: "Business", excerpt: "Leading humans and AI agents requires a new set of soft skills for modern managers." },

  // TRAVEL
  { title: "Lux Local: Why artisan villages are the 'New Maldives' in 2026", category: "Travel", excerpt: "High-end travelers are ditching crowded resorts for historic, artisanal towns." },
  { title: "Sustainable Skyways: The first Hydrogen-Electric flights take off", category: "Travel", excerpt: "Green aviation is no longer a dream as short-haul electric routes open across Europe." },
  { title: "Moon Tourism 2026: The first private Habitation modules are ready", category: "Travel", excerpt: "As Haven-1 launches, the conversation around civilian space travel gets serious." },

  // FOOD
  { title: "The Probiotic Boom: Why Kimchi and Kombucha are 2026's Superfoods", category: "Food", excerpt: "Fermented foods are dominating the health-conscious market as gut health awareness peaks." },
  { title: "Lab-Grown Gastronomy: Cultured Meat hits high-end restaurant menus", category: "Food", excerpt: "The ethical and sustainable shift in dining is reaching the world's best chefs." },
  { title: "Regenerative Farming: The new label shoppers are looking for", category: "Food", excerpt: "Beyond 'Organic', consumers in 2026 want food that actively heals the planet." },

  // EDUCATION
  { title: "AI Classrooms: The Teacher's new role as a 'Learning Orchestrator'", category: "Education", excerpt: "As students use AI tutors, humans are focusing on ethics, logic, and creativity." },
  { title: "Lifelong Learning: The 2026 shift to 'Stackable Micro-credentials'", category: "Education", excerpt: "Traditional degrees are losing ground to targeted, AI-verified skill badges." },
  { title: "The Critical Thinking Crisis: Teaching truth in a world of deepfakes", category: "Education", excerpt: "Developing the 'human filter' is now the most important subject in schools." }
].map(p => ({
  ...p,
  slug: p.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'),
  content: `
    <h2>The 2026 Perspective: ${p.title}</h2>
    <p>This is a breaking news report from <strong>dream devx</strong>. ${p.excerpt}</p>
    <p>As we move through May 2026, the trends we are seeing are not just temporary shifts—they are fundamental changes in how we live and work. From the integration of <strong>Agentic AI</strong> into our daily routines to the resurgence of <strong>Analog Hobbies</strong>, the world is finding a new balance between high-tech efficiency and human authenticity.</p>
    <blockquote>"2026 is the year we stop asking what technology CAN do, and start asking what it SHOULD do for us." - Industry Analyst</blockquote>
    <p>Our team of experts is monitoring this situation closely. Stay tuned to our <strong>${p.category}</strong> section for daily updates, in-depth analysis, and practical guides on how to navigate these changes.</p>
    <h3>Key Takeaways for This Week:</h3>
    <ul>
      <li>Stay intentional with your digital consumption.</li>
      <li>Invest in skills that AI cannot replicate (Creativity, Empathy, Complex Ethics).</li>
      <li>Look for local, sustainable alternatives in your travel and food choices.</li>
    </ul>
    <p>The future is arriving faster than ever. At dream devx, we are here to help you lead the way.</p>
  `,
  published: true,
  author: "Admin",
  read_time: 6,
  created_at: new Date().toISOString(),
  cover_image: `https://images.unsplash.com/photo-1500000000000?auto=format&fit=crop&q=80&w=1200&trending-${p.category.toLowerCase()}`
}));

async function seed() {
  console.log(`Inserting ${trendingPosts.length} trending articles...`);
  const { error } = await supabase.from('posts').insert(trendingPosts);
  
  if (error) {
    console.error('Error seeding data:', error.message);
  } else {
    console.log(`✅ Successfully added ${trendingPosts.length} viral trending articles to dream devx!`);
  }
}

seed();
