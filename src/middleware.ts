import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteção da área administrativa
  if (pathname.startsWith('/administracao')) {
    // Permite acessar a página de login
    if (pathname === '/administracao/login') {
      return NextResponse.next();
    }

    const adminToken = request.cookies.get('admin_token')?.value;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Se não houver token ou se o token não bater com a senha configurada
    if (!adminToken || adminToken !== adminPassword) {
      const loginUrl = new URL('/administracao/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/administracao/:path*'],
};
