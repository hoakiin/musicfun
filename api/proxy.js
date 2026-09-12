const UPSTREAM_BASE = 'https://musicfun.it-incubator.app/api/1.0'
const ALLOWED_ORIGIN = 'http://localhost:5173'

function readBody(req) {
  return new Promise(resolve => {
    const chunks = []
    req.on('data', chunk => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', () => resolve(Buffer.alloc(0)))
  })
}

module.exports = async function handler(req, res) {
  try {
    const API_KEY = process.env.MUSICFUN_API_KEY

    if (!API_KEY) {
      res.status(503).json({ message: 'MUSICFUN_API_KEY is not configured on Vercel' })
      return
    }

    const parsed = new URL(req.url || '', 'http://localhost')
    const params = parsed.searchParams
    const path = params.get('__path') || ''
    params.delete('__path')
    const query = params.toString()
    const upstream = `${UPSTREAM_BASE}/${path}` + (query ? `?${query}` : '')

    const headers = {
      'API-KEY': API_KEY,
      Origin: ALLOWED_ORIGIN,
    }
    if (req.headers.authorization) headers.Authorization = req.headers.authorization
    if (req.headers.accept) headers.Accept = req.headers.accept

    const method = (req.method || 'GET').toUpperCase()

    let upstreamRes
    if (method === 'GET' || method === 'HEAD') {
      upstreamRes = await fetch(upstream, { method, headers })
    } else {
      const body = await readBody(req)
      headers['Content-Type'] = req.headers['content-type'] || 'application/json'
      upstreamRes = await fetch(upstream, { method, headers, body })
    }

    res.status(upstreamRes.status)

    const contentType = upstreamRes.headers.get('content-type')
    if (contentType) res.setHeader('content-type', contentType)

    const location = upstreamRes.headers.get('location')
    if (location) res.setHeader('location', location)

    const setCookie = upstreamRes.headers.get('set-cookie')
    if (setCookie) res.setHeader('set-cookie', setCookie)

    res.send(await upstreamRes.text())
  } catch (err) {
    res.status(502).json({ message: `Proxy error: ${err.message}` })
  }
}