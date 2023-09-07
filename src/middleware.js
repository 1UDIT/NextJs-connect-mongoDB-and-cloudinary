import { NextResponse } from 'next/server'
 
export function middleware(request) {
  if (request.nextUrl.pathname.startsWith('/')) {
    return NextResponse.rewrite(new URL('/', request.url))
  }
 
  if (request.nextUrl.pathname.startsWith('/Animescheduler')) {
    return NextResponse.rewrite(new URL('/scheduler', request.url))
  }
}
export const config = {
    matcher: '/Animescheduler',
}