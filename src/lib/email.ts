import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
})

const emailFrom = process.env.EMAIL_FROM || 'Rutland Farm Park <bookings@rutlandfarmpark.co.uk>'
const notificationTo = process.env.EMAIL_NOTIFICATION_TO || 'info@rutlandfarmpark.com'

interface BookingConfirmationEmail {
  customerName: string
  customerEmail: string
  bookingReference: string
  date: string
  tickets: Array<{
    ticketName: string
    quantity: number
    unitPrice: number
  }>
  totalAmount: number
}

export async function sendBookingConfirmation({
  customerName,
  customerEmail,
  bookingReference,
  date,
  tickets,
  totalAmount,
}: BookingConfirmationEmail) {
  const formattedDate = new Date(date).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const ticketRows = tickets
    .map(
      (t) =>
        `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${t.ticketName}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${t.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">£${((t.unitPrice * t.quantity) / 100).toFixed(2)}</td>
        </tr>`
    )
    .join('')

  const html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a2e;">
      <div style="background: #2d6a4f; padding: 24px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Rutland Farm Park</h1>
      </div>
      <div style="padding: 32px 24px;">
        <h2 style="color: #2d6a4f; margin-top: 0;">Booking Confirmed!</h2>
        <p>Hi ${customerName},</p>
        <p>Thank you for your booking. We look forward to seeing you!</p>

        <div style="background: #f8f9fa; border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="margin: 0 0 8px;"><strong>Booking Reference:</strong> ${bookingReference}</p>
          <p style="margin: 0 0 8px;"><strong>Date:</strong> ${formattedDate}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
          <thead>
            <tr style="background: #f8f9fa;">
              <th style="padding: 8px; text-align: left;">Ticket</th>
              <th style="padding: 8px; text-align: center;">Qty</th>
              <th style="padding: 8px; text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${ticketRows}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 8px; font-weight: bold;">Total</td>
              <td style="padding: 8px; text-align: right; font-weight: bold;">£${(totalAmount / 100).toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        <div style="background: #fefae0; border-radius: 8px; padding: 16px; margin: 24px 0;">
          <h3 style="margin-top: 0; color: #bc6c25;">Important Information</h3>
          <ul style="margin: 0; padding-left: 20px; color: #555;">
            <li>Please arrive by your selected entry time</li>
            <li>Free parking is available on site</li>
            <li>Animal food bags can be purchased in the shop</li>
            <li>Daphne's Tea Room is available for refreshments</li>
          </ul>
        </div>

        <p style="color: #666; font-size: 14px;">
          If you need to make changes to your booking, please contact us at
          <a href="mailto:info@rutlandfarmpark.com" style="color: #2d6a4f;">info@rutlandfarmpark.com</a>
          or call <a href="tel:01572722122" style="color: #2d6a4f;">01572 722122</a>.
        </p>
      </div>
      <div style="background: #1b4332; padding: 16px; text-align: center; color: #a7c4a0; font-size: 12px;">
        <p style="margin: 0;">Rutland Farm Park · Uppingham Road, Oakham, LE15 6JD</p>
        <p style="margin: 4px 0 0;">01572 722122 · info@rutlandfarmpark.com</p>
      </div>
    </div>
  `

  try {
    await transporter.sendMail({
      from: emailFrom,
      to: customerEmail,
      subject: `Booking Confirmation - ${bookingReference}`,
      html,
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to send booking confirmation email:', error)
    return { success: false, error }
  }
}

export async function sendContactNotification({
  name,
  email,
  phone,
  message,
}: {
  name: string
  email: string
  phone?: string
  message: string
}) {
  const html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2d6a4f;">New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      <p><strong>Message:</strong></p>
      <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${message}</div>
    </div>
  `

  try {
    await transporter.sendMail({
      from: emailFrom,
      to: notificationTo,
      subject: `Contact Form: ${name}`,
      html,
      replyTo: email,
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to send contact notification:', error)
    return { success: false, error }
  }
}
