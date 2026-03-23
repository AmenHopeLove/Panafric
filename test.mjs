import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nwvitrdhgbqwioyqefbz.supabase.co';
const supabaseKey = 'sb_publishable_Er7cV4ZgludymfpPNsR_eg_lAjcsDac';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    const { data, error } = await supabase.from('news').select('id, title, image_url').order('id', { ascending: false }).limit(3);
    if (error) console.error(error);
    console.log(JSON.stringify(data, null, 2));
}
run();
