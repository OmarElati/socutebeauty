const { createClient } = require('c:/Users/MSI/socute-beauty/velvet-aura-admin/node_modules/@supabase/supabase-js');
const fs = require('fs');

const url = 'https://oczlqoqrfsldhfvhaumh.supabase.co';
const key = 'sb_publishable_XRRV-ubMlQYxckCiXgYWQA_xN3rYV6T';
const supabase = createClient(url, key);

async function applyMigration() {
  const sql = fs.readFileSync('c:/Users/MSI/socute-beauty/nav_nodes_migration.sql', 'utf8');
  const lines = sql.split('\n').filter(l => l.startsWith('INSERT INTO public.nav_nodes'));

  const rows = lines.map(line => {
    const m = line.match(/VALUES \('([^']+)', '([^']+)', '([^']+)', (NULL|'[^']+'), (\d+), (true|false)\);/);
    if (!m) return null;
    return {
      id: m[1],
      label: m[2].replace(/''/g, "'"),
      slug: m[3].replace(/''/g, "'"),
      parent_id: m[4] === 'NULL' ? null : m[4].replace(/'/g, ''),
      sort_order: parseInt(m[5], 10),
      active: m[6] === 'true'
    };
  }).filter(Boolean);

  console.log(`Parsed ${rows.length} rows.`);

  const level0 = rows.filter(r => r.parent_id === null);
  const level1 = rows.filter(r => r.parent_id !== null && level0.some(l0 => l0.id === r.parent_id));
  const level2 = rows.filter(r => r.parent_id !== null && !level0.some(l0 => l0.id === r.parent_id));

  console.log(`Level 0: ${level0.length}, Level 1: ${level1.length}, Level 2: ${level2.length}`);

  const { data: res0, error: err0 } = await supabase.from('nav_nodes').upsert(level0);
  if (err0) {
    console.error('Error inserting Level 0:', err0);
    return;
  }
  console.log('Inserted Level 0 successfully.');

  const { data: res1, error: err1 } = await supabase.from('nav_nodes').upsert(level1);
  if (err1) {
    console.error('Error inserting Level 1:', err1);
    return;
  }
  console.log('Inserted Level 1 successfully.');

  const { data: res2, error: err2 } = await supabase.from('nav_nodes').upsert(level2);
  if (err2) {
    console.error('Error inserting Level 2:', err2);
    return;
  }
  console.log('Inserted Level 2 successfully.');

  const { count } = await supabase.from('nav_nodes').select('*', { count: 'exact', head: true });
  console.log(`Total nav_nodes in Supabase: ${count}`);
}

applyMigration();
