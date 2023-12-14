import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function middleware(request) {
    // const path = request.nextUrl.pathname;

    // const secret = next-auth.session-token;

    
    // const isPublicPath = path === '/';
    // const ishomePath = path === '/homePage';
    
    const token = request.cookies.get(process.env.CookiesSet)?.value || request.cookies.get('next-auth.session-token')?.value 
    console.log(token,'token');

    if ((request.nextUrl.pathname.startsWith('/HomePage') || request.nextUrl.pathname.startsWith('/List')) && token === undefined) {
        return NextResponse.redirect(new URL('/', request.nextUrl))
    }
    return NextResponse.next();
}


// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/HomePage', '/List'
    ]
}

