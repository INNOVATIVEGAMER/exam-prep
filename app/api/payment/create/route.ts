import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getRazorpay } from '@/lib/razorpay'

export async function POST(request: NextRequest) {
  try {
    // 1. Verify auth — getUser() makes a network call to Supabase auth server,
    //    required for security in API routes (unlike getSession which trusts cookie).
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse and validate request body
    const { paperId } = await request.json()
    if (!paperId) {
      return NextResponse.json({ error: 'paperId is required' }, { status: 400 })
    }

    // 3. Fetch paper to get price — use admin client to bypass RLS
    const admin = createAdminClient()
    const { data: paper, error: paperError } = await admin
      .from('papers')
      .select('id, title, price, is_free')
      .eq('id', paperId)
      .single()

    if (paperError || !paper) {
      return NextResponse.json({ error: 'Paper not found' }, { status: 404 })
    }

    if (paper.is_free || paper.price === 0) {
      return NextResponse.json({ error: 'Paper is free' }, { status: 400 })
    }

    // 4. Check if already purchased to avoid duplicate orders
    const { data: existing } = await admin
      .from('purchases')
      .select('id, status')
      .eq('user_id', user.id)
      .eq('paper_id', paperId)
      .eq('status', 'paid')
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'Already purchased' }, { status: 400 })
    }

    // 5. Create Razorpay order — price is already stored in paisa
    const order = await getRazorpay().orders.create({
      amount: paper.price,
      currency: 'INR',
      receipt: `receipt_${user.id.slice(0, 8)}_${paperId.slice(0, 8)}`,
    })

    // 6. Insert purchase row with 'created' status (upsert handles retry case)
    const { error: insertError } = await admin
      .from('purchases')
      .upsert(
        {
          user_id: user.id,
          paper_id: paperId,
          amount: paper.price,
          razorpay_order_id: order.id,
          status: 'created',
        },
        { onConflict: 'user_id,paper_id' }
      )

    if (insertError) {
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    // 7. Return order details to the client for checkout modal
    return NextResponse.json({
      orderId: order.id,
      amount: paper.price,
      currency: 'INR',
      paperTitle: paper.title,
    })
  } catch (err) {
    // Razorpay SDK throws non-Error objects; JSON.stringify to capture full details
    let msg: string
    if (err instanceof Error) {
      msg = err.message
    } else {
      try { msg = JSON.stringify(err) } catch { msg = String(err) }
    }
    console.error('[payment/create] error:', msg)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
