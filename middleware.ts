import { withAuth } from "next-auth/middleware"

export function middleware(request: any) {
  return withAuth(request)
}

export const config = {
  matcher: ['/chat/:path*']
}
