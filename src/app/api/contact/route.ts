import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sendContactNotification } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      )
    }

    // Save to Payload CMS
    try {
      const payload = await getPayload({ config })
      await payload.create({
        collection: 'contact-submissions',
        data: { name, email, phone: phone || undefined, message },
      })
    } catch (dbError) {
      console.error('Failed to save contact submission to CMS:', dbError)
      // Continue to send email even if CMS save fails
    }

    // Send notification email
    await sendContactNotification({ name, email, phone, message })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
