import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register');
  
  // 認証が必要なページへのアクセスでトークンがない場合
  if (!token && !isAuthPage) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // すでに認証済みでログインページなどにアクセスした場合
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

// 認証が必要なパスを指定
export const config = {
  matcher: [
    // 認証が必要なパス
    '/dashboard/:path*',
    '/documents/:path*',
    '/templates/:path*',
    '/settings/:path*',
    // 認証ページ（リダイレクト用）
    '/login',
    '/register',
  ],
};
