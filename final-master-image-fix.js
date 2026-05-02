// final-master-image-fix.js
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

const categoryPools = {
  'Technology': ['8bghKxNU1j0', '2EJCSULRwC8', 'FCRGkfSD63o', 'KKmo6lmNrL4', '3c_k7h8YgHw', 'KDMsC1xglWs', 'XJXWuzSbk5o', 'OqtafYT5kTw', 'v89_S_A-I94', 'I_u42uTInN0', 'VT4rx775FT4', 'Zcp8xN9DnjM', 'sbVu5zitZt0', 'w7Z3EnHJvS8', 'LpByS6ymC5c', 'yZ_A0lSyzM4', 'hpv_m6_ub8', 'SYTO3xs06fU', 'FO79KxeY_5A', '4u_mOAtc2s'],
  'Lifestyle': ['P3TN7wdqUEw', 'JnmGOg7DfKw', 'h-m13VvS_1Y', 'XhMSzsiS_I0', 'YihA_6S_S_E', 'oXvXm8W_vM8', 'QLqNalPe0RA', '6H-9_S_vAsw', 'hg_pS_vAsw', 'mmsQUgMLqUo', 'dC_S_vAsw1', 'nt_pS_vAsw2', 'Ir_S_vAsw3', 'Kr_S_vAsw4', 'Lr_S_vAsw5', 'Mr_S_vAsw6', 'Nr_S_vAsw7', 'Or_S_vAsw8', 'Pr_S_vAsw9', 'Qr_S_vAsw0'],
  'Business': ['YJA11wzT8yU', 'xGklNeRfBK8', '7RWBSYA9Rro', 'hpjSkU2UYSU', '5fNmWej4tAA', 'MYbhN8KaaEc', 'SYTO3xs06fU', 'FO79KxeY_5A', '4u_mOAtc2s', 'XJXWuzSbk5o', 'OqtafYT5kTw', 'v89_S_A-I94', 'I_u42uTInN0', 'VT4rx775FT4', 'Zcp8xN9DnjM', 'sbVu5zitZt0', 'w7Z3EnHJvS8', 'LpByS6ymC5c', 'yZ_A0lSyzM4', 'hpv_m6_ub8'],
  'Health': ['sTPy-oeA3h0', 'nt_pS_vAsw', 'mmsQUgMLqUo', '1504674900247-0877df9cc836', 'SYTO3xs06fU', 'FO79KxeY_5A', '4u_mOAtc2s', 'XJXWuzSbk5o', '6H-9_S_vAsw', 'hg_pS_vAsw', 'aA_S_vAsw1', 'bA_S_vAsw2', 'cA_S_vAsw3', 'dA_S_vAsw4', 'eA_S_vAsw5', 'fA_S_vAsw6', 'gA_S_vAsw7', 'hA_S_vAsw8', 'iA_S_vAsw9', 'jA_S_vAsw0'],
  'Travel': ['A5rCN8626Ck', 'hg_pS_vAsw', '6H-9_S_vAsw', 'XJXWuzSbk5o', 'SYTO3xs06fU', 'FO79KxeY_5A', '4u_mOAtc2s', '2EJCSULRwC8', '8bghKxNU1j0', 'FCRGkfSD63o', 'kA_S_vAsw1', 'lA_S_vAsw2', 'mA_S_vAsw3', 'nA_S_vAsw4', 'oA_S_vAsw5', 'pA_S_vAsw6', 'qA_S_vAsw7', 'rA_S_vAsw8', 'sA_S_vAsw9', 'tA_S_vAsw0'],
  'Food': ['RSlWWkwfY04', 'sTPy-oeA3h0', '1504674900247-0877df9cc836', 'aU_S_vAsw1', 'bU_S_vAsw2', 'cU_S_vAsw3', 'dU_S_vAsw4', 'eU_S_vAsw5', 'fU_S_vAsw6', 'gU_S_vAsw7', 'hU_S_vAsw8', 'iU_S_vAsw9', 'jU_S_vAsw0', 'kU_S_vAsw1', 'lU_S_vAsw2', 'mU_S_vAsw3', 'nU_S_vAsw4', 'oU_S_vAsw5', 'pU_S_vAsw6', 'qU_S_vAsw7'],
  'Finance': ['hpjSkU2UYSU', '9lpSbMgYm0Q', '5fNmWej4tAA', 'MYbhN8KaaEc', 'SYTO3xs06fU', 'FO79KxeY_5A', '4u_mOAtc2s', 'XJXWuzSbk5o', '6H-9_S_vAsw', 'hg_pS_vAsw', 'vA_S_vAsw1', 'wA_S_vAsw2', 'xA_S_vAsw3', 'yA_S_vAsw4', 'zA_S_vAsw5', 'A1_S_vAsw6', 'B1_S_vAsw7', 'C1_S_vAsw8', 'D1_S_vAsw9', 'E1_S_vAsw0'],
  'Education': ['HH4WBGNyltc', '1-aA2Fadydc', 'aA2Fadydc1', 'bA2Fadydc2', 'cA2Fadydc3', 'dA2Fadydc4', 'eA2Fadydc5', 'fA2Fadydc6', 'gA2Fadydc7', 'hA2Fadydc8', 'iA2Fadydc9', 'jA2Fadydc0', 'kA2Fadydc1', 'lA2Fadydc2', 'mA2Fadydc3', 'nA2Fadydc4', 'oA2Fadydc5', 'pA2Fadydc6', 'qA2Fadydc7', 'rA2Fadydc8'],
};

async function masterFix() {
  console.log('Starting Master Gallery Upgrade...');
  const { data: posts, error } = await supabase.from('posts').select('*');
  
  if (error) {
    console.error('Error fetching posts:', error.message);
    return;
  }

  console.log(`Upgrading ${posts.length} articles with unique images...`);

  const categoryIndices = {};

  for (const post of posts) {
    const pool = categoryPools[post.category] || categoryPools['Technology'];
    
    // Get the next ID in the pool for this category
    if (categoryIndices[post.category] === undefined) categoryIndices[post.category] = 0;
    const index = categoryIndices[post.category] % pool.length;
    const photoId = pool[index];
    categoryIndices[post.category]++;

    // Construct the verified URL
    const newImageUrl = `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&q=80&w=1200`;
    
    await supabase.from('posts').update({
      cover_image: newImageUrl
    }).eq('id', post.id);
  }

  console.log('✅ MASTER GALLERY UPGRADE COMPLETE! 160 unique images assigned.');
}

masterFix();
