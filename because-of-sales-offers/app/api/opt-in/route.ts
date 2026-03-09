import { NextRequest, NextResponse } from 'next/server'

// ── TYPES ──────────────────────────────────────────────────────────────────
interface OptInPayload {
  email:          string
  opted_in_at:    string
  source:         string
  offers_claimed: string[]
  // survey data will be joined here once Beehiiv webhook is wired up
  survey?: {
    sales_experience?: string
    what_they_sell?:   string
    current_role?:     string
    annual_income?:    string
  }
}

// ── HANDLER ────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body: OptInPayload = await req.json()

    if (!body.email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 })
    }

    // ── TODO: persist to Supabase ──────────────────────────────────────────
    // const { error } = await supabase.from('opt_ins').insert([{
    //   email:          body.email,
    //   opted_in_at:    body.opted_in_at,
    //   source:         body.source,
    //   offers_claimed: body.offers_claimed,
    //   survey:         body.survey ?? null,
    // }])
    // if (error) throw error

    // ── TODO: forward to partner (email / webhook) ─────────────────────────
    // await sendPartnerEmail({ ...body })

    console.log('[opt-in]', JSON.stringify(body, null, 2))

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[opt-in error]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// ── Beehiiv webhook receiver ───────────────────────────────────────────────
// POST /api/opt-in/survey  (set this as your Beehiiv webhook URL)
// Beehiiv will send subscriber + survey data here after page 2 completes.
// Store by email so it can be joined when the user opts into an offer.
