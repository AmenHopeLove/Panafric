import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { consultation_id, amount, email, name } = body;

        if (!consultation_id || !amount || !email) {
            return NextResponse.json({ error: "Missing required payment fields" }, { status: 400 });
        }

        // Ideally, here you would call the Flutterwave v3 API:
        // const response = await flw.Charge.standard({
        //     tx_ref: `PALF-${consultation_id}-${Date.now()}`,
        //     amount: amount,
        //     currency: "USD",
        //     payment_options: "card, mobilemoney, ussd",
        //     redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/client?payment=success`,
        //     customer: { email, name },
        //     customizations: { title: "Pan-Afric Law Firm", logo: "..." }
        // });

        // For now, since we don't have the active Flutterwave secret key, we mock the URL generation:
        const mockPaymentUrl = `/client?payment=success&ref=${consultation_id}`;

        // Update the Supabase record to indicate a payment is pending
        await supabase
            .from('consultations')
            .update({ status: 'payment_pending' })
            .eq('id', consultation_id);

        return NextResponse.json({ 
            success: true, 
            payment_url: mockPaymentUrl 
        }, { status: 200 });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
