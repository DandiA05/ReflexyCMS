import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value
  const userRole = request.cookies.get('userRole')?.value
  const { pathname } = request.nextUrl

  // Define paths that are public (no auth needed)
  const publicPaths = ['/signin', '/signup', '/forgot-password']
  const isPublicPath = publicPaths.some((path) => 
    pathname.startsWith(path)
  )

  // If there is no token and the path is not public, redirect to signin
  if (!token && !isPublicPath) {
    const loginUrl = new URL('/signin', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // If authenticated, check role-based access
  if (token && !isPublicPath) {
    // Admin has access to everything
    if (userRole === 'admin') {
      return NextResponse.next()
    }

    // Staff restrictions
    if (userRole === 'staff') {
      if (pathname.startsWith('/master/karyawan')) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    // Manager restrictions: only Overhead, Transaksi, Monitoring
    if (userRole === 'manager') {
      const allowedPaths = ['/', '/pengeluaran', '/transaksi', '/monitoring', '/profile']
      const isAllowed = allowedPaths.some(path => pathname === path || pathname.startsWith(path + '/'))
      
      if (!isAllowed) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
  }

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
