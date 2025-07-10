// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('devplanner.session')?.value;
  const publicPaths = ['/login', '/signup', '/'];
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

  // Public path handling
  if (isPublicPath) {
    if (sessionToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protected path handling
  if (!sessionToken) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Verify token via API route
  try {
    const verifyResponse = await fetch(new URL('/api/verify-token', request.url), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: sessionToken }),
    });

    const { success } = await verifyResponse.json();
    
    if (!success) {
      const response = NextResponse.redirect(new URL('/sign-in', request.url));
      response.cookies.delete('devplanner.session');
      return response;
    }

    return NextResponse.next();
  } catch (error) {
    const response = NextResponse.redirect(new URL('/sign-in', request.url));
    response.cookies.delete('devplanner.session');
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};