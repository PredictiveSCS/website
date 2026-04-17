export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fname, lname, email, company, challenge } = req.body;

    // Basic validation
    if (!fname || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'PSCS Website <noreply@email.predictivescs.com>',
        to: ['sales@predictivescs.com'],
        reply_to: email,
        subject: `New Inquiry from ${fname} ${lname || ''} — ${company || 'No company listed'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #232B17; padding: 24px 28px; border-radius: 8px 8px 0 0;">
              <h2 style="color: #92B072; margin: 0; font-size: 18px;">New Infrastructure Audit Request</h2>
            </div>
            <div style="background: #f8f9f6; padding: 28px; border: 1px solid #e2e8d9; border-top: none; border-radius: 0 0 8px 8px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #6B8544; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; vertical-align: top; width: 120px;">Name</td>
                  <td style="padding: 10px 0; color: #232B17; font-size: 15px;">${fname} ${lname || ''}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6B8544; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; vertical-align: top;">Email</td>
                  <td style="padding: 10px 0; color: #232B17; font-size: 15px;"><a href="mailto:${email}" style="color: #6B8544;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6B8544; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; vertical-align: top;">Company</td>
                  <td style="padding: 10px 0; color: #232B17; font-size: 15px;">${company || 'Not provided'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6B8544; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; vertical-align: top;">Challenge</td>
                  <td style="padding: 10px 0; color: #232B17; font-size: 15px; line-height: 1.6;">${challenge || 'Not provided'}</td>
                </tr>
              </table>
              <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #d4dcc8;">
                <p style="font-size: 12px; color: #92B072; margin: 0;">Submitted from predictivescs.com contact form</p>
              </div>
            </div>
          </div>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend error:', data);
      return res.status(500).json({ error: 'Failed to send email.' });
    }

    return res.status(200).json({ success: true, message: 'Email sent successfully.' });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
