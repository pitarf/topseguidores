import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Proteger as rotas de administração, mas ignorar a própria tela de login
  if (pathname.startsWith('/administracao') && !pathname.startsWith('/administracao/login')) {
    const adminToken = req.cookies.get('admin_token')?.value;
    
    // Validação simples (token igual a senha)
    if (adminToken === process.env.ADMIN_PASSWORD) {
      return NextResponse.next();
    }
    
    // Se não tiver o token correto, redireciona para a tela de login estilizada
    return NextResponse.redirect(new URL('/administracao/login', req.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/administracao/:path*', '/admin/:path*'],
};
