// app/layout.js
import './globals.css';
import Providers from './providers'; // NextAuth провайдер
import { CartProvider } from '../context/CartContext'; // Імпортуємо CartProvider

export const metadata = {
    title: 'NAZVA - Гейміфіковане меню',
    description: 'Вхід для кастомерів та власників',
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="uk" suppressHydrationWarning={true}>
        <body>
        {/* Огортаємо Providers (NextAuth) */}
        <Providers>
            {/* Всередині огортаємо CartProvider */}
            <CartProvider>
                {children}
            </CartProvider>
        </Providers>
        </body>
        </html>
    );
}