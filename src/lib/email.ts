import nodemailer from 'nodemailer';

// Configure the SMTP transporter using standard NodeMail options
export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'mail.panafric.com', // Fallback example
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE === 'false' ? false : true, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendNotificationEmail = async ({
    subject,
    text,
    html,
}: {
    subject: string;
    text?: string;
    html?: string;
}) => {
    // Skip if strictly in dev without SMTP
    if (!process.env.SMTP_USER) {
        console.log("⚠️ Email not sent: SMTP_USER not configured. (Would have sent Admin Notification)");
        return false;
    }

    try {
        const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
        await transporter.sendMail({
            from: `"PALF Portal" <${process.env.SMTP_USER}>`,
            to: adminEmail,
            subject: `[PALF Admin] ${subject}`,
            text: text,
            html: html || text,
        });
        console.log("Admin notification email sent:", subject);
        return true;
    } catch (error) {
        console.error("Error sending notification email:", error);
        return false;
    }
};

export const sendConfirmationEmail = async ({
    to,
    subject,
    text,
    html,
}: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}) => {
    if (!process.env.SMTP_USER) {
        console.log(`⚠️ Email not sent to ${to}: SMTP_USER not configured. (Would have sent Confirmation)`);
        return false;
    }
    
    try {
        await transporter.sendMail({
            from: `"Pan-Afric Law Firm" <${process.env.SMTP_USER}>`,
            to,
            subject,
            text,
            html: html || text,
        });
        console.log("Confirmation email sent to:", to);
        return true;
    } catch (error) {
        console.error("Error sending confirmation email:", error);
        return false;
    }
};
