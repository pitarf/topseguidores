import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Só atua dentro da pasta /administracao
  if (pathname.startsWith('/administracao')) {
    // Ignora a página de login para não dar loop
    if (pathname.includes('/login')) {
      return NextResponse.next();
    }

    const token = request.cookies.get('admin_token')?.value;
    const adminPass = process.env.ADMIN_PASSWORD;

    // Se não tiver logado, manda para o login
    if (!token || token !== adminPass) {
      return NextResponse.redirect(new URL('/administracao/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/administracao/:path*'],
};
