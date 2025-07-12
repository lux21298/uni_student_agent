import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers)
 
  // Set the x-url header with the request's base URL
  requestHeaders.set('x-url', request.url)
 
  // Return the response with the modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}
 
export const config = {
  matcher: '/api/:path*',
}
