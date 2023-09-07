import { NextResponse } from 'next/server'

export function middleware(request) {

  if (request.nextUrl.pathname.startsWith('/Animescheduler')) {
    return NextResponse.rewrite(new URL('/Animescheduler', request.url))
  }
  if (request.nextUrl.pathname.startsWith('/Treading')) {
    return NextResponse.rewrite(new URL('/Treading', request.url))
  }
}

export const config = {
  matcher: ['/Animescheduler', '/Treading'],
}