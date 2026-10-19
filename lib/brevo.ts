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
