// Vercel serverless endpoint: do not expose MAKE_WEBHOOK_URL in browser code.
const allowedServices = new Set(['Brand Identity','Graphic Design','Social Media & Advertising','Web & UI/UX Design','Apparel & Packaging','Other / Not sure yet']);
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Method not allowed' }); }
  const origin = req.headers.origin;
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://roseestrada.vercel.app').split(',').map(x => x.trim());
  if (origin && !allowedOrigins.includes(origin)) return res.status(403).json({ error: 'Origin not allowed' });
  if (Number(req.headers['content-length'] || 0) > 12000) return res.status(413).json({ error: 'Request too large' });
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  if (body.website) return res.status(200).json({ ok: true }); // Honeypot; don't forward spam
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const service = typeof body.service === 'string' ? body.service.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  if (!name || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !allowedServices.has(service) || message.length < 10 || message.length > 5000) {
    return res.status(400).json({ error: 'Invalid inquiry details' });
  }
  if (!process.env.MAKE_WEBHOOK_URL) return res.status(503).json({ error: 'Inquiry service is not configured' });
  try {
    const result = await fetch(process.env.MAKE_WEBHOOK_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, service, message }),
      signal: AbortSignal.timeout(9000)
    });
    if (!result.ok) return res.status(502).json({ error: 'Unable to forward inquiry' });
    return res.status(200).json({ ok: true });
  } catch (_) { return res.status(502).json({ error: 'Inquiry service temporarily unavailable' }); }
}
