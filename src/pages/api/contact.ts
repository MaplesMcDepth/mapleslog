import type { APIRoute } from 'astro';

const AGENTMAIL_API_KEY = import.meta.env.AGENTMAIL_API_KEY;
const AGENTMAIL_INBOX_EMAIL = import.meta.env.AGENTMAIL_INBOX_EMAIL;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const name = String(body.name || '').trim();
    const contact = String(body.contact || '').trim();
    const topic = String(body.topic || 'General').trim();
    const message = String(body.message || '').trim();

    if (!name || !contact || !message) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!AGENTMAIL_API_KEY || !AGENTMAIL_INBOX_EMAIL) {
      return new Response(JSON.stringify({ ok: false, error: 'Mail service is not configured yet' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const agentMailResponse = await fetch(`https://api.agentmail.to/v0/inboxes/${AGENTMAIL_INBOX_EMAIL}/drafts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AGENTMAIL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: [AGENTMAIL_INBOX_EMAIL],
        subject: `[Maples Log] ${topic} from ${name}`,
        text: `New Maples Log contact form submission\n\nName: ${name}\nContact: ${contact}\nTopic: ${topic}\n\nMessage:\n${message}`,
      }),
    });

    if (!agentMailResponse.ok) {
      const errorText = await agentMailResponse.text();
      return new Response(JSON.stringify({ ok: false, error: 'AgentMail request failed', detail: errorText }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
