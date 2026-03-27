import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nwvitrdhgbqwioyqefbz.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53dml0cmRoZ2Jxd2lveXFlZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MDYxMTQsImV4cCI6MjA4Njk4MjExNH0.IT5dgda1vgIt2A50OPkCdKy2zbgdAl_45RRyo1CnjLE';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function run() {
    try {
        const { data: members, error: fetchErr } = await supabase
            .from('network_applications')
            .select('id, full_name, profile_image_url');
            
        if (fetchErr) throw fetchErr;
        
        console.log("All members:", members.map(m => m.full_name));

        const toDeleteIds = members.filter(m => 
            m.full_name?.toLowerCase().includes("amanuel") ||
            m.full_name?.toLowerCase().includes("helina") ||
            m.full_name?.toLowerCase().includes("biruk") ||
            (m.profile_image_url && m.profile_image_url.includes("placeholder")) // sometimes test entries just have a generic name
        ).map(m => m.id);

        console.log(`Found ${toDeleteIds.length} members to delete.`);
        
        if (toDeleteIds.length > 0) {
            const { error: delErr } = await supabase
                .from('network_applications')
                .delete()
                .in('id', toDeleteIds);
                
            if (delErr) {
                console.error("Delete failed:", delErr);
            } else {
                console.log("Successfully deleted test profiles by ID.");
            }
        }
    } catch (e) {
        console.error(e);
    }
}

run();
