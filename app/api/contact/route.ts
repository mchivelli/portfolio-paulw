import { NextRequest, NextResponse } from 'next/server';
import formData from 'form-data';
import Mailgun from 'mailgun.js';

export async function POST(req: NextRequest) {
    try {
        const { name, email, subject, message } = await req.json();

        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        const apiKey = process.env.MAILGUN_API_KEY;
        const domain = process.env.MAILGUN_DOMAIN;

        if (!apiKey || !domain) {
            // Fallback if no credentials
            console.warn('Mailgun credentials missing. Contact form submission logged instead.');
            console.log({ name, email, subject, message });
            return NextResponse.json({
                success: true,
                message: 'Message received (Simulation Mode)',
                warning: 'Email sending is disabled (missing credentials)'
            });
        }

        const mailgun = new Mailgun(formData);
        const client = mailgun.client({ username: 'api', key: apiKey });

        // Send email logic here (simplified from original)
        const emailData = {
            from: `Portfolio Contact <noreply@${domain}>`,
            to: 'paulmallner@gmail.com',
            subject: `Portfolio Contact: ${subject}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        };

        await client.messages.create(domain, emailData);

        return NextResponse.json({ success: true, message: 'Message sent successfully' });
    } catch (error: any) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { error: 'Failed to send message', details: error.message },
            { status: 500 }
        );
    }
}
