const BREVO_API = 'https://api.brevo.com/v3'

async function bf(path: string, init?: RequestInit) {
  return fetch(`${BREVO_API}${path}`, {
    ...init,
    headers: {
      'api-key': process.env.BREVO_API_KEY as string,
      accept: 'application/json',
      'content-type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
}

/** Upsert a contact and add them to one or more list IDs (by numeric ID). */
export async function upsertContact(params: {
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  listIds?: number[]
}) {
  const { email, firstName, lastName, phone, listIds } = params
  const attributes: Record<string, string> = {}
  if (firstName) attributes.FIRSTNAME = firstName
  if (lastName) attributes.LASTNAME = lastName
  if (phone) attributes.SMS = phone

  await bf('/contacts', {
    method: 'POST',
    body: JSON.stringify({
      email,
      attributes,
      listIds: listIds ?? [],
      updateEnabled: true,
    }),
  })
}

/**
 * Find or create a Brevo list by name. Returns the numeric list ID.
 * Caches the result in-process so we only hit the API once per cold start.
 */
const listIdCache = new Map<string, number>()
export async function getOrCreateList(name: string, folderId?: number): Promise<number> {
  if (listIdCache.has(name)) return listIdCache.get(name)!
  // Try to find existing list
  const res = await bf('/contacts/lists?limit=50&offset=0')
  if (res.ok) {
    const data = await res.json() as { lists?: { id: number; name: string }[] }
    const existing = data.lists?.find((l) => l.name === name)
    if (existing) { listIdCache.set(name, existing.id); return existing.id }
  }
  // Create it
  const body: Record<string, unknown> = { name, isVisible: true }
  if (folderId) body.folderId = folderId
  const createRes = await bf('/contacts/lists', { method: 'POST', body: JSON.stringify(body) })
  const created = await createRes.json() as { id: number }
  listIdCache.set(name, created.id)
  return created.id
}

/** Remove a contact from a list by list ID. Best-effort. */
export async function removeFromList(email: string, listId: number) {
  await bf(`/contacts/lists/${listId}/contacts/remove`, {
    method: 'POST',
    body: JSON.stringify({ emails: [email] }),
  })
}

/** Send a transactional email via Brevo. */
export async function sendEmail(params: {
  to: { email: string; name?: string }[]
  subject: string
  htmlContent: string
  senderName?: string
  senderEmail?: string
}) {
  const res = await bf('/smtp/email', {
    method: 'POST',
    body: JSON.stringify({
      sender: {
        name: params.senderName ?? 'Team Curran',
        email: params.senderEmail ?? 'no-reply@teamcurran.com',
      },
      to: params.to,
      subject: params.subject,
      htmlContent: params.htmlContent,
    }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Brevo sendEmail failed (${res.status}): ${text}`)
  }
}
