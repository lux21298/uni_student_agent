export function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return `https://${process.env.NEXT_PUBLIC_APP_URL}`
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  // fallback to localhost
  return process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000'
    : `https://${process.env.NEXT_PUBLIC_APP_URL || ''}`
}

export function getMcpEndpoint() {
  return `${getBaseUrl()}/api/mcp`
}
