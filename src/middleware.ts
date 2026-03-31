import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const hostname = request.headers.get('host') || ''
    
    // Domain redirection: panafriclawfirm.com -> palf-web-platform.vercel.app
    if (hostname.includes('panafriclawfirm.com')) {
        const nextUrl = new URL(request.nextUrl.pathname + request.nextUrl.search, 'https://palf-web-platform.vercel.app')
        return NextResponse.redirect(nextUrl)
    }

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({ name, value, ...options })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({ name, value, ...options })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({ name, value: '', ...options })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({ name, value: '', ...options })
                },
            },
        }
    )

    // Use getUser() for secure server-side session validation
    const { data: { user } } = await supabase.auth.getUser()

    const isLoginPage = request.nextUrl.pathname === '/login'
    const isProtectedPage = request.nextUrl.pathname.startsWith('/admin') || 
                            request.nextUrl.pathname.startsWith('/client') || 
                            request.nextUrl.pathname.startsWith('/member')

    // 1. If user is logged in and on /login, we let the client side redirect them 
    //    based on their specific role (Admin, Client, Member) to the correct dashboard.
    //    We don't redirect here because middleware doesn't know their role.

    // 2. If user is NOT logged in and on a protected route, move to /login
    if (isProtectedPage && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return response
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
