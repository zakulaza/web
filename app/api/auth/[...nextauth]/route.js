// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions = {
    adapter: PrismaAdapter(prisma),

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),

        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log('--- Authorize Function Start ---');
                console.log('Credentials received:', credentials);

                if (!credentials?.email || !credentials?.password) {
                    console.error('Missing email or password');
                    throw new Error('Будь ласка, введіть email та пароль.');
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email }
                    });

                    console.log('User found in DB:', user);

                    if (!user || !user.password) {
                        console.error('User not found or password missing');
                        throw new Error('Користувача з таким email не знайдено або вхід через Google.');
                    }

                    console.log('Comparing passwords...');
                    console.log('Input password:', credentials.password);
                    console.log('Hashed password from DB:', user.password);

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    console.log('Password valid:', isPasswordValid);

                    if (!isPasswordValid) {
                        console.error('Password comparison failed');
                        throw new Error('Неправильний пароль.');
                    }

                    console.log('--- Authorize Function Success ---');
                    return {
                        id: user.id.toString(),
                        email: user.email,
                        name: user.name,
                        image: user.image,
                        role: user.role,
                    };
                } catch (dbError) {
                    console.error("Database error during authorization:", dbError);
                    throw new Error("Помилка під час перевірки даних.");
                }
            }
        })
    ],

    session: {
        strategy: 'jwt',
        // --- ВИДАЛЕНО 'maxAge: 0' ---
        // Повертаємо до конфігурації за замовчуванням, яка у вас працювала
    },

    secret: process.env.NEXTAUTH_SECRET,

    pages: {
        signIn: '/login',
        error: '/login',
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.role = token.role;
                session.user.id = token.id;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };