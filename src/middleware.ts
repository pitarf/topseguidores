import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteção da área administrativa
  if (pathname.startsWith('/administracao')) {
    // Não protege a página de login
    if (pathname === '/administracao/login') {
      return NextResponse.next();
    }

    const token = request.cookies.get('admin_token')?.value;

    // Se não tiver token ou o token não for válido
    // (Por simplicidade, estamos comparando com a senha, 
    // mas em um sistema real usaríamos um JWT ou Session ID)
    if (!token || token !== process.env.ADMIN_PASSWORD) {
      const loginUrl = new URL('/administracao/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/administracao/:path*'],
};
