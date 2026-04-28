import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (body.password === process.env.ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true });
      
      // Salva a senha correta como um token de sessão
      response.cookies.set('admin_token', body.password, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // Mantém logado por 7 dias
        path: '/',
      });
      
      return response;
    }
    
    return NextResponse.json(
      { error: 'Senha incorreta. Tente novamente.' }, 
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro interno no servidor' }, 
      { status: 500 }
    );
  }
}
