// Clover Hosted Checkout — same merchant as gi-preorder (shared account).
// Requires CLOVER_API_TOKEN, CLOVER_MERCHANT_ID, CLOVER_ENVIRONMENT in Vercel env.

type CloverEnvironment = 'sandbox' | 'production'

const API_BASE: Record<CloverEnvironment, string> = {
  sandbox: 'https://apisandbox.dev.clover.com',
  production: 'https://api.clover.com',
}

function environment(): CloverEnvironment {
  return process.env.CLOVER_ENVIRONMENT === 'production' ? 'production' : 'sandbox'
}

export function isCloverConfigured(): boolean {
  return Boolean(process.env.CLOVER_API_TOKEN && process.env.CLOVER_MERCHANT_ID)
}

function authHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${process.env.CLOVER_API_TOKEN}`,
    'X-Clover-Merchant-Id': process.env.CLOVER_MERCHANT_ID!,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
}

export interface CloverLineItem {
  name: string
  price: number
  unitQty: number
}

export interface CreateCheckoutParams {
  lineItems: CloverLineItem[]
  customer?: { email?: string; firstName?: string; lastName?: string }
  externalReferenceId: string
  successUrl: string
  cancelUrl: string
}

export async function createHostedCheckout(
  params: CreateCheckoutParams
): Promise<{ checkoutSessionId: string; href: string }> {
  if (!isCloverConfigured()) {
    throw new Error('Clover is not configured (CLOVER_API_TOKEN / CLOVER_MERCHANT_ID missing)')
  }

  const url = `${API_BASE[environment()]}/invoicingcheckoutservice/v1/checkouts`
  const res = await fetch(url, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      customer: params.customer ?? {},
      shoppingCart: { lineItems: params.lineItems },
      externalReferenceId: params.externalReferenceId,
      redirectUrls: {
        success: params.successUrl,
        failure: params.cancelUrl,
        cancel: params.cancelUrl,
      },
    }),
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Clover checkout failed (${res.status}): ${text}`)
  }

  const data = (await res.json()) as { checkoutSessionId?: string; href?: string }
  if (!data.href || !data.checkoutSessionId) {
    throw new Error(`Clover response missing href/checkoutSessionId: ${JSON.stringify(data)}`)
  }
  return { checkoutSessionId: data.checkoutSessionId, href: data.href }
}
