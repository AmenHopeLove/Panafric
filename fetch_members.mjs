import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nwvitrdhgbqwioyqefbz.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53dml0cmRoZ2Jxd2lveXFlZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MDYxMTQsImV4cCI6MjA4Njk4MjExNH0.IT5dgda1vgIt2A50OPkCdKy2zbgdAl_45RRyo1CnjLE';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function run() {
    try {
        const { data: members, error: fetchErr } = await supabase
            .from('network_applications')
            .select('*')
            .eq('status', 'approved');
            
        if (fetchErr) throw fetchErr;
        
        console.log("Remaining Approved Members:");
        members.forEach(m => console.log(`- ID: ${m.id}, Name: ${m.full_name}`));
    } catch (e) {
        console.error(e);
    }
}

run();
