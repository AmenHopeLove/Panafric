import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';
import { sendNotificationEmail, sendConfirmationEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { type, payload } = body; 

        if (type === 'internship') {
            const { error } = await supabase.from('internship_applications').insert([payload]);
            if (error) throw error;
            
            await sendNotificationEmail({
                subject: `New Internship Application: ${payload.full_name}`,
                html: `
                    <h3>New Internship / Career Application</h3>
                    <p><strong>Name:</strong> ${payload.full_name}</p>
                    <p><strong>Email:</strong> ${payload.email}</p>
                    <p><strong>University:</strong> ${payload.university} (${payload.major})</p>
                    <p><strong>LinkedIn:</strong> ${payload.linkedin_url}</p>
                    <p><strong>Cover Letter:</strong><br/>${payload.cover_letter}</p>
                `
            });

            await sendConfirmationEmail({
                to: payload.email,
                subject: "Application Received - Pan-Afric Law Firm Careers",
                html: `
                    <h3>Dear ${payload.full_name},</h3>
                    <p>Thank you for applying to the Pan-Afric Law Firm. We have securely received your application materials.</p>
                    <p>Our recruitment team will review your profile and contact you if there is a potential match.</p>
                    <p>Best regards,<br/>Careers Team<br/>Pan-Afric Law Firm</p>
                `
            });
            return NextResponse.json({ success: true }, { status: 200 });
        }

        if (type === 'network') {
            const { error } = await supabase.from('network_applications').insert([payload]);
            if (error) throw error;
            
            await sendNotificationEmail({
                subject: `New Network Membership Request: ${payload.full_name}`,
                html: `
                    <h3>New Network Application</h3>
                    <p><strong>Name:</strong> ${payload.full_name} (${payload.firm_name})</p>
                    <p><strong>Email:</strong> ${payload.email}</p>
                    <p><strong>Location:</strong> ${payload.location}</p>
                    <p><strong>Expertise:</strong> ${payload.practice_areas?.join(', ') || 'None specified'}</p>
                    <br/>
                    <p><strong>Message:</strong> ${payload.message || 'N/A'}</p>
                `
            });

            await sendConfirmationEmail({
                to: payload.email,
                subject: "Network Application Received - Pan-Afric Law Firm",
                html: `
                    <h3>Dear ${payload.full_name},</h3>
                    <p>Thank you for applying to join the Pan-Afric Law Network.</p>
                    <p>Your application is currently securely stored and under review by our membership committee. You will be notified of your status shortly.</p>
                    <p>Best regards,<br/>Membership Committee<br/>Pan-Afric Law Firm & Network</p>
                `
            });
            return NextResponse.json({ success: true }, { status: 200 });
        }

        return NextResponse.json({ error: "Invalid application type" }, { status: 400 });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
