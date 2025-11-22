// src/types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
    interface User {
        id: string | number;
        role: string;
        accessToken: string;
    }

    interface Session {
        user: {
            id: string | number;
            role: string;
            accessToken: string;
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string | number;
        role: string;
        accessToken: string;
    }
}