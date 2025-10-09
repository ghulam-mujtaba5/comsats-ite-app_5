import { type NextRequest } from 'next/server'
 
export default function icon() {
  return new Response('', {
    status: 302,
    headers: {
      Location: '/favicon.ico',
    },
  })
}