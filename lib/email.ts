import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Email recipients by category
const EMAIL_RECIPIENTS: Record<string, string[]> = {
    'HR': ['smbhuwad@bullows.com', 'pbdhamal@bullows.com', 'rnnile@bullows.com', 'prwaghulade@bullows.com'],
    'Admin': ['smbhuwad@bullows.com', 'pbdhamal@bullows.com', 'rnnile@bullows.com', 'prwaghulade@bullows.com'],
    'Other': ['smbhuwad@bullows.com', 'pbdhamal@bullows.com', 'rnnile@bullows.com', 'prwaghulade@bullows.com'],
    'IT': ['erp@bullows.com', 'prwaghulade@bullows.com'],
    'Payroll': ['rnnile@bullows.com', 'prwaghulade@bullows.com'],
};

interface TicketEmailData {
    ticketId: string;
    subject: string;
    category: string;
    description: string;
    employeeName: string;
    employeeEmail: string;
}

export async function sendTicketNotification(data: TicketEmailData): Promise<boolean> {
    const recipients = EMAIL_RECIPIENTS[data.category] || EMAIL_RECIPIENTS['Other'];

    // If no API key is configured, log and return
    if (!process.env.RESEND_API_KEY) {
        console.log(`[EMAIL SIMULATION - No API Key]`);
        console.log(`To: ${recipients.join(', ')}`);
        console.log(`Subject: New Support Ticket: ${data.subject}`);
        console.log(`From: ${data.employeeName} (${data.employeeEmail})`);
        console.log(`Category: ${data.category}`);
        console.log(`Description: ${data.description}`);
        return true;
    }

    try {
        const { error } = await resend.emails.send({
            from: 'B Team Support <noreply@bullows.com>',
            to: recipients,
            subject: `[B Team] New Support Ticket: ${data.subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 24px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">B TEAM Support</h1>
                    </div>
                    <div style="padding: 24px; background: #f9fafb; border: 1px solid #e5e7eb;">
                        <h2 style="color: #1f2937; margin-top: 0;">New Support Ticket</h2>
                        
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280; width: 120px;">Ticket ID:</td>
                                <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">#${data.ticketId}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280;">Category:</td>
                                <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">${data.category}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280;">Submitted By:</td>
                                <td style="padding: 8px 0; color: #1f2937;">${data.employeeName} (${data.employeeEmail})</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280;">Subject:</td>
                                <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">${data.subject}</td>
                            </tr>
                        </table>
                        
                        <div style="margin-top: 16px; padding: 16px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
                            <h3 style="margin-top: 0; color: #374151; font-size: 14px;">Description:</h3>
                            <p style="color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${data.description}</p>
                        </div>
                        
                        <div style="margin-top: 24px; text-align: center;">
                            <a href="https://b-team-app.vercel.app/dashboard/admin/tickets" 
                               style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                                View in Admin Panel
                            </a>
                        </div>
                    </div>
                    <div style="padding: 16px; text-align: center; color: #9ca3af; font-size: 12px;">
                        This is an automated notification from B Team App.
                    </div>
                </div>
            `,
        });

        if (error) {
            console.error('Failed to send email:', error);
            return false;
        }

        console.log(`[EMAIL SENT] Ticket #${data.ticketId} notification sent to: ${recipients.join(', ')}`);
        return true;

    } catch (error) {
        console.error('Email sending error:', error);
        return false;
    }
}


export async function sendOtpEmail(email: string, otp: string): Promise<boolean> {
    // Simulation
    if (!process.env.RESEND_API_KEY) {
        console.log(`[OTP SIMULATION]`);
        console.log(`To: ${email}`);
        console.log(`Code: ${otp}`);
        return true;
    }

    try {
        const { error } = await resend.emails.send({
            from: 'B Team Security <noreply@bullows.com>',
            to: email,
            subject: `[B Team] Your Verification Code: ${otp}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #333;">Verify Your Email</h2>
                    <p>Use the following One-Time Password (OTP) to complete your registration:</p>
                    <div style="background: #f4f4f5; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #000;">${otp}</span>
                    </div>
                    <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
                </div>
            `,
        });
        if (error) { console.error(error); return false; }
        return true;
    } catch (error) {
        console.error('Email sending error:', error);
        return false;
    }
}
