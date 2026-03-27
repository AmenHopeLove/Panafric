import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';
import { sendNotificationEmail, sendConfirmationEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { full_name, email, subject, message, date_requested, time_requested } = body;

        // 1. Insert into Supabase
        const { data, error } = await supabase
            .from('consultations')
            .insert([{ full_name, email, subject, message, date_requested, time_requested }])
            .select();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // 2. Notify Admin
        await sendNotificationEmail({
            subject: `New Consultation Request: ${subject}`,
            html: `
                <h3>New Consultation Request</h3>
                <p><strong>Name:</strong> ${full_name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Date & Time:</strong> ${date_requested || 'Not specified'} at ${time_requested || 'Not specified'}</p>
                <br/>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        });

        // 3. Send Confirmation to Client
        await sendConfirmationEmail({
            to: email,
            subject: "Your Consultation Request is Received - Pan-Afric Law Firm",
            html: `
                <h3>Hello ${full_name},</h3>
                <p>Thank you for contacting Pan-Afric Law Firm & Network.</p>
                <p>We have successfully received your consultation request regarding <strong>${subject}</strong>.</p>
                <p>Our team will review your inquiry and get back to you shortly to confirm your appointment details.</p>
                <br/>
                <p>Warm regards,<br/>The Administrative Team<br/>Pan-Afric Law Firm</p>
            `
        });

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
