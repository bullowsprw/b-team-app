import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Note: In a real app, you would import a db adapter here.
// For Phase 1 (Foundation), we are using a credential provider mock to allow UI development.

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // Stub authentication for Phase 1 verification
                if (credentials?.email === "admin@bullows.com" && credentials?.password === "admin123") {
                    return {
                        id: "1",
                        name: "Admin User",
                        email: "admin@bullows.com",
                        role: "admin",
                    };
                }

                // Return null if user data could not be retrieved
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
            }
            return session;
        }
    }
};
