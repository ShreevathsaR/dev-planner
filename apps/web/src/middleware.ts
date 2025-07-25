import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/', '/sign-in', '/sign-up', '/api/verify-token'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicPath = publicPaths.includes(pathname);
  const sessionToken = request.cookies.get('devplanner.session')?.value;

  if (!sessionToken) {
    if (isPublicPath) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if(sessionToken && isPublicPath) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  try {
    const verifyUrl = new URL('/api/verify-token', request.url);
    const verifyResponse = await fetch(verifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: sessionToken }),
    });

    if (!verifyResponse.ok) throw new Error('Invalid token');

    const { success } = await verifyResponse.json();
    
    if (!success) {
      const response = NextResponse.redirect(new URL('/sign-in', request.url));
      response.cookies.delete('devplanner.session');
      return response;
    }

    return NextResponse.next();
  } catch (error) {
    console.log('Error verifying token:', error);
    const response = NextResponse.redirect(new URL('/sign-in', request.url));
    response.cookies.delete('devplanner.session');
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/auth (auth API routes)
     */
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
};