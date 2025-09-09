const https = require('https')
const url = require('url')

function ping(urlToPing) {
  return new Promise((resolve) => {
    const parsed = url.parse(urlToPing)
    const opts = {
      method: 'GET',
      hostname: parsed.hostname,
      path: parsed.path,
    }
    const req = https.request(opts, (res) => {
      resolve({ statusCode: res.statusCode })
    })
    req.on('error', (e) => resolve({ error: e.message }))
    req.end()
  })
}

async function main() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const sitemap = `${siteUrl.replace(/\/$/, '')}/sitemap.xml`
  console.log('Pinging sitemap:', sitemap)

  // Google ping
  const google = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemap)}`
  const bing = `https://www.bing.com/webmaster/ping.aspx?siteMap=${encodeURIComponent(sitemap)}`

  console.log('Pinging Google...')
  console.log(await ping(google))
  console.log('Pinging Bing...')
  console.log(await ping(bing))
}

main()
