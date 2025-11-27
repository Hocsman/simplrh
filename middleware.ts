import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  // Let all requests through - let pages handle auth via requireOrganization()
  // This avoids middleware complexity that can cause infinite loops
  return NextResponse.next({
    request: req,
  })
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public folder
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
}