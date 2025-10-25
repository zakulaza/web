// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '../../../../lib/prisma'; // Використовуємо наш єдиний екземпляр Prisma
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
                console.log('--- Authorize Function Start ---'); // Додано
                console.log('Credentials received:', credentials); // Додано

                if (!credentials?.email || !credentials?.password) {
                    console.error('Missing email or password'); // Додано
                    throw new Error('Будь ласка, введіть email та пароль.');
                }

                try { // Додамо try...catch навколо запитів до БД
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email }
                    });

                    console.log('User found in DB:', user); // Додано

                    if (!user || !user.password) {
                        console.error('User not found or password missing'); // Додано
                        throw new Error('Користувача з таким email не знайдено або вхід через Google.');
                    }

                    console.log('Comparing passwords...'); // Додано
                    console.log('Input password:', credentials.password); // Додано
                    console.log('Hashed password from DB:', user.password); // Додано

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    console.log('Password valid:', isPasswordValid); // Додано

                    if (!isPasswordValid) {
                        console.error('Password comparison failed'); // Додано
                        throw new Error('Неправильний пароль.');
                    }

                    console.log('--- Authorize Function Success ---'); // Додано
                    // Повертаємо об'єкт користувача, який відповідає структурі User в Prisma
                    // Важливо: NextAuth очікує принаймні `id`, `email`, `name`, `image`
                    return {
                        id: user.id.toString(), // ID має бути рядком для JWT
                        email: user.email,
                        name: user.name,
                        image: user.image,
                        role: user.role, // Додаємо роль
                    };
                } catch (dbError) {
                    console.error("Database error during authorization:", dbError); // Додано
                    throw new Error("Помилка під час перевірки даних."); // Загальна помилка для користувача
                }
            }
        })
    ],

    session: {
        strategy: 'jwt',
    },

    secret: process.env.NEXTAUTH_SECRET,

    pages: {
        signIn: '/login',
        error: '/login',
    },

    callbacks: {
        async jwt({ token, user }) {
            // При першому вході (з authorize або OAuth) додаємо роль до токена
            if (user) {
                token.role = user.role;
                // Додаємо ID користувача до токена
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            // Додаємо роль та ID з токена до об'єкта сесії
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