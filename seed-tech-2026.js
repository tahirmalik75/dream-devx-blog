// seed-tech-2026.js
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

const techPosts = [
  {
    title: "Digital Coworkers: The Shift from Chatbots to Agentic AI",
    slug: "shift-to-agentic-ai-2026",
    excerpt: "In 2026, AI is no longer just answering questions—it's executing complex multi-step tasks autonomously.",
    content: "<h2>Beyond the Chatbox</h2><p>The biggest story of 2026 is the transition from generative AI to agentic AI. While 2024 was about talking to AI, 2026 is about AI doing the work for you.</p><h3>What is Agentic AI?</h3><p>Agentic systems can reason, plan, and use software tools independently. They don't just write an email; they research the recipient, schedule the meeting, and prepare the briefing docs without being asked twice.</p>",
    category: "Technology",
    published: true,
    featured: true,
    author: "Admin",
    read_time: 7,
    created_at: "2026-05-02T10:00:00Z",
    cover_image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200"
  },
  {
    title: "Haven-1: The World's First Commercial Space Station Launches",
    slug: "haven-1-commercial-space-station",
    excerpt: "Vast Space is set to launch the first private orbital habitat this month, marking a new era of space commercialization.",
    content: "<h2>A New Home in Orbit</h2><p>Scheduled for May 2026, the launch of Haven-1 is a pivotal moment for the space industry. As NASA prepares to retire the ISS, private companies are stepping up to fill the void.</p><h3>Microgravity Research for Everyone</h3><p>Haven-1 will support crews of four and provide a platform for manufacturing and pharmaceutical research in zero-G, previously only available to government agencies.</p>",
    category: "Technology",
    published: true,
    featured: false,
    author: "Admin",
    read_time: 6,
    created_at: "2026-05-01T14:30:00Z",
    cover_image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=1200"
  },
  {
    title: "Quantum-as-a-Service: Solving Real Business Problems",
    slug: "quantum-as-a-service-2026",
    excerpt: "Quantum computing has moved from the lab to the cloud, allowing businesses to solve optimization problems in seconds.",
    content: "<h2>Utility is Here</h2><p>2026 is the year of 'useful' quantum. Companies are now using hybrid workflows that combine classical supercomputers with quantum processors to discover new materials and optimize logistics chains.</p><p>Cloud providers now offer QaaS (Quantum-as-a-Service), lowering the barrier to entry for mid-sized firms.</p>",
    category: "Technology",
    published: true,
    featured: false,
    author: "Admin",
    read_time: 8,
    created_at: "2026-04-28T09:15:00Z",
    cover_image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1200"
  },
  {
    title: "Sodium-Ion Batteries: The End of the Lithium Monopoly?",
    slug: "sodium-ion-battery-revolution-2026",
    excerpt: "With lithium prices remaining volatile, sodium-ion technology is emerging as a cheaper and more sustainable alternative.",
    content: "<h2>The Future of Storage</h2><p>Commercial production of sodium-ion batteries has ramped up significantly in 2026. While slightly less energy-dense than lithium, they are significantly cheaper and use earth-abundant materials.</p><p>This shift is expected to lower the cost of entry-level electric vehicles and large-scale renewable energy storage systems globally.</p>",
    category: "Technology",
    published: true,
    featured: false,
    author: "Admin",
    read_time: 5,
    created_at: "2026-04-25T11:00:00Z",
    cover_image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1200"
  },
  {
    title: "Physical AI: Robots Finally Enter the Messy Real World",
    slug: "physical-ai-embodied-robotics-2026",
    excerpt: "Advanced 'Embodied AI' is giving robots the perception and navigation skills needed for warehouse and home use.",
    content: "<h2>Intelligence in Motion</h2><p>Robots are finally getting out of their cages. Thanks to Physical AI, machines can now perceive and interact with messy, unpredictable environments like logistics centers and even our homes.</p><p>The integration of foundation models into robotic vision has reduced training time from months to days.</p>",
    category: "Technology",
    published: true,
    featured: false,
    author: "Admin",
    read_time: 6,
    created_at: "2026-04-22T16:45:00Z",
    cover_image: "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&q=80&w=1200"
  },
  {
    title: "6G and LEO Satellites: The Future of Global Connectivity",
    slug: "future-of-global-connectivity-2026",
    excerpt: "The integration of 6G testing and Low Earth Orbit constellations is creating a truly borderless internet.",
    content: "<h2>A Connected Planet</h2><p>In 2026, 'no signal' is becoming a thing of the past. The fusion of terrestrial 5G/6G networks with massive LEO satellite constellations is providing high-speed internet to the most remote corners of the Earth.</p><p>This is driving a new wave of economic growth in developing regions and enabling real-time global collaboration.</p>",
    category: "Technology",
    published: true,
    featured: false,
    author: "Admin",
    read_time: 7,
    created_at: "2026-04-20T13:20:00Z",
    cover_image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200"
  }
];

async function seed() {
  console.log('Unfeaturing previous posts...');
  await supabase.from('posts').update({ featured: false }).eq('featured', true);
  
  console.log('Inserting 6 latest Tech 2026 articles...');
  const { error } = await supabase.from('posts').insert(techPosts);
  
  if (error) {
    console.error('Error seeding data:', error.message);
  } else {
    console.log('✅ Successfully added 6 latest 2026 Technology articles!');
  }
}

seed();
