import { withAuth } from "next-auth/middleware"

export default withAuth({
    callbacks: {
        authorized: ({ token }) => {
            if (!token) return false
            return token.role === "admin"
        }
    }
})

export const config = {
    matcher: ["/admin/:path*"]
}