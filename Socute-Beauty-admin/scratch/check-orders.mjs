import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jvybxhqhfivfxvvihlos.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_174bfjRS2QkS23QlvAsd8w__T8Eb09_";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function check() {
  const { data: products } = await supabase.from('products').select('id, name');
  console.log('Products count:', products?.length ?? 0);

  const { data: categories } = await supabase.from('categories').select('id, name');
  console.log('Categories count:', categories?.length ?? 0);

  const { data: orders, error } = await supabase.from('orders').select('*');
  console.log('Anon Orders count:', orders?.length ?? 0, 'Error:', error?.message ?? 'None');
}

check();
