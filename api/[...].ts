import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    // Import the server dynamically
    const { default: serverHandler } = await import('../dist/server.js');
    
    // Create a proper Request object
    const request = new Request(
      `https://${req.headers.host}${req.url}`,
      {
        method: req.method,
        headers: new Headers(req.headers as Record<string, string>),
        body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
      }
    );

    // Call the server handler
    const response = await serverHandler.fetch(request, {}, {});

    // Set response headers
    const headers = new Map(response.headers);
    for (const [key, value] of headers) {
      res.setHeader(key, value);
    }

    res.status(response.status);
    const text = await response.text();
    res.send(text);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error', details: String(error) });
  }
};
