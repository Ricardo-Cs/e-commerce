// src/types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface User {
        id: string | number;
        role: string;
        accessToken: string;
        name: string;
    }

    interface Session {
        user: {
            id: string | number;
            role: string;
            accessToken: string;
            name: string;
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string | number;
        role: string;
        accessToken: string;
        name: string;
    }
}