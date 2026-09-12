const UPSTREAM_BASE = 'https://musicfun.it-incubator.app/api/1.0'
const ALLOWED_ORIGIN = 'http://localhost:5173'
const BODY_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE']

export default async function handler(request) {
  try {
    const API_KEY = process.env.MUSICFUN_API_KEY

    if (!API_KEY) {
      return new Response(JSON.stringify({ message: 'MUSICFUN_API_KEY is not configured on Vercel' }), {
        status: 503,
        headers: { 'content-type': 'application/json' },
      })
    }

    const url = new URL(request.url, 'http://localhost')
    const params = url.searchParams
    const path = params.get('__path') || ''
    params.delete('__path')
    const query = params.toString()
    const upstream = `${UPSTREAM_BASE}/${path}` + (query ? `?${query}` : '')

    const headers = {
      'API-KEY': API_KEY,
      Origin: ALLOWED_ORIGIN,
    }
    const auth = request.headers.get('authorization')
    if (auth) headers.Authorization = auth
    const accept = request.headers.get('accept')
    if (accept) headers.Accept = accept

    const method = (request.method || 'GET').toUpperCase()

    const init = { method, headers }
    if (BODY_METHODS.includes(method)) {
      const body = await request.text()
      headers['Content-Type'] = request.headers.get('content-type') || 'application/json'
      if (body) init.body = body
    }

    const upstreamRes = await fetch(upstream, init)

    const resHeaders = new Headers()
    const contentType = upstreamRes.headers.get('content-type')
    if (contentType) resHeaders.set('content-type', contentType)
    const location = upstreamRes.headers.get('location')
    if (location) resHeaders.set('location', location)
    const setCookie = upstreamRes.headers.get('set-cookie')
    if (setCookie) resHeaders.set('set-cookie', setCookie)

    return new Response(await upstreamRes.text(), { status: upstreamRes.status, headers: resHeaders })
  } catch (err) {
    return new Response(JSON.stringify({ message: `Proxy error: ${err.message}` }), {
      status: 502,
      headers: { 'content-type': 'application/json' },
    })
  }
}