import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',

            credentials: {
                username: { label: 'username', type: 'UserName' },
                password: { label: 'password', type: 'password' },
            },
            async authorize(credentials, req) {
                const user = { id: 1, name: 'Admin', password: 'test' };
                console.log('login', process.env.BASE_Login, credentials, "us", process.env.BASE_Login === credentials.username)
                if (process.env.BASE_Login === credentials.username && process.env.BASE_passWord === credentials.password) {
                    return {
                        id: user.id,
                        name: user.name,
                        randomKey: "Hey",
                    };
                } else {
                    // Return an object that will pass error information through to the client-side.
                    throw new Error(JSON.stringify(false));
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET_KEY,
    session: {
        strategy: "jwt"
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET_KEY
    },
    // callbacks: {
    //     session: ({ session, token }) => {
    //         console.log(session, token, "se");
    //         return {
    //             ...session,
    //             user: {
    //                 ...session.user,
    //                 id: token.id,
    //                 randomKey: token.jti,
    //             },
    //         };
    //     },
    //     jwt: ({ token, user }) => {
    //         console.log(user, token, "sessions");
    //         if (user) {
    //             const u = user;
    //             return {
    //                 ...token,
    //                 id: u.id,
    //                 randomKey: u.jti,
    //             };
    //         }
    //         return token;
    //     },
    // },

    // callbacks: {
    //     async jwt({ token, user, trigger, session }) {
    //         if (trigger === "update") {
    //             return { ...token, ...session.user };
    //         }
    //         return { ...token, ...user };
    //     },

    //     async session({ session, token }) {
    //         session.user = token;
    //         return session;
    //     },
    // },

};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 