import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { jwtDecode } from "jwt-decode"

interface CustomJwtPayload {
    id: number;
    isAdmin: boolean;
    name: string;
    iat: number;
    exp: number;
}

const handler = NextAuth({
    providers: [
        Credentials({
            credentials: { email: {}, password: {} },

            async authorize(credentials) {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: credentials?.email,
                        password: credentials?.password
                    })
                })

                if (!res.ok) return null

                const data = await res.json()

                if (data && data.token) {
                    const decoded = jwtDecode<CustomJwtPayload>(data.token);

                    return {
                        id: decoded.id,
                        role: decoded.isAdmin ? "admin" : "user",
                        email: credentials?.email,
                        accessToken: data.token,
                        name: decoded.name
                    }
                }

                return null;
            }
        })
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.accessToken = user.accessToken;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as number
                session.user.role = token.role as string
                session.user.accessToken = token.accessToken as string
                session.user.name = token.name as string;
            }
            return session;
        }
    },
})

export { handler as GET, handler as POST }