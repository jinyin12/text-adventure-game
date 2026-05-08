const DEEPSEEK_BASE = 'https://api.deepseek.com'

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)
    const targetUrl = `${DEEPSEEK_BASE}${url.pathname}`

    const headers: Record<string, string> = {}
    for (const [key, value] of request.headers.entries()) {
      if (key.toLowerCase() === 'authorization' || key.toLowerCase() === 'content-type') {
        headers[key] = value
      }
    }
    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json'
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      })
    }

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: request.method !== 'GET' ? request.body : undefined,
    })

    const responseHeaders = new Headers(response.headers)
    responseHeaders.set('Access-Control-Allow-Origin', '*')
    responseHeaders.set('Access-Control-Expose-Headers', '*')

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    })
  },
}
