'use server'

/**
 * Email service for sending replies to customers
 * Uses Resend (https://resend.com) - Free tier available
 * 
 * Setup:
 * 1. Sign up at https://resend.com
 * 2. Add your Resend API key to .env.local: RESEND_API_KEY=your_key
 * 3. Verify your domain or use Resend's test domain
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY
const ADMIN_EMAIL = 'admin@summitclean.com'
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev'

export async function sendReplyEmail(
  customerEmail: string,
  customerName: string,
  originalMessage: string,
  replyText: string
) {
  if (!RESEND_API_KEY) {
    console.warn('[EMAIL] RESEND_API_KEY not configured. Email not sent.')
    return {
      success: false,
      error: 'RESEND_API_KEY is missing. Add the API key in .env.local to enable customer email delivery.',
      stage: 'missing_api_key',
    }
  }

  try {
    const emailHtml = `
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0F5B4F 0%, #093D35 100%); padding: 30px; border-radius: 12px; color: white; margin-bottom: 20px;">
            <h1 style="margin: 0; font-size: 24px;">Summit Clean Co.</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Re: Your Message</p>
          </div>

          <div style="margin-bottom: 20px;">
            <p style="margin: 0 0 10px 0;">Hi ${customerName},</p>
            <p style="margin: 0 0 15px 0;">Thank you for reaching out to Summit Clean Co. We've received your inquiry and wanted to respond:</p>
          </div>

          <div style="background: #F5F7F2; border-left: 4px solid #0F5B4F; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <p style="margin: 0; font-weight: 600; color: #0F5B4F; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Our Reply:</p>
            <p style="margin: 10px 0 0 0; white-space: pre-wrap; color: #14221F;">${escapeHtml(replyText)}</p>
          </div>

          <div style="background: #F0F0F0; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 12px; color: #666; font-weight: 500;">Your original message:</p>
            <p style="margin: 8px 0 0 0; font-size: 13px; color: #555; font-style: italic; white-space: pre-wrap;">"${escapeHtml(originalMessage)}"</p>
          </div>

          <div style="border-top: 1px solid #DCE5E1; padding-top: 20px;">
            <p style="margin: 0 0 10px 0; font-size: 14px;">Need anything else? Feel free to reach out:</p>
            <ul style="margin: 10px 0; padding-left: 20px; font-size: 13px;">
              <li><strong>Phone:</strong> 778-548-3365</li>
              <li><strong>Email:</strong> admin@summitclean.com</li>
              <li><strong>Website:</strong> summitclean.com</li>
            </ul>
          </div>

          <div style="border-top: 1px solid #DCE5E1; padding-top: 20px; margin-top: 20px;">
            <p style="margin: 0; font-size: 12px; color: #999;">
              © 2026 Summit Clean Co. All rights reserved.
            </p>
          </div>
        </body>
      </html>
    `

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: customerEmail,
        subject: 'Re: Your message to Summit Clean Co.',
        html: emailHtml,
        reply_to: process.env.FROM_EMAIL || FROM_EMAIL,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Resend API error:', error)
      return { 
        success: false, 
        error: `Failed to send email: ${error.message || 'Unknown error'}` 
      }
    }

    const result = await response.json()
    return { success: true, messageId: result.id }
  } catch (error) {
    console.error('Email service error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    }
  }
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (char) => map[char])
}
