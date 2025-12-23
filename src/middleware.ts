import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value

  // Define paths that are public (no auth needed)
  const publicPaths = ['/signin', '/signup', '/forgot-password']
  const isPublicPath = publicPaths.some((path) => 
    request.nextUrl.pathname.startsWith(path)
  )

  // If there is no token and the path is not public, redirect to signin
  if (!token && !isPublicPath) {
    const loginUrl = new URL('/signin', request.url)
    // Optional: Add redirect query param to return user after login
    // loginUrl.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If there is a token and user is on a public path (like login), 
  // you might want to redirect them to dashboard (optional, depends on requirement)
  // if (token && isPublicPath) {
  //   return NextResponse.redirect(new URL('/', request.url))
  // }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (if you have an assets folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
