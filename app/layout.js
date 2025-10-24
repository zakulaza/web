import './globals.css';

export const metadata = {
    title: 'NAZVA - Гейміфіковане меню',
    description: 'Вхід для кастомерів та власників',
};

export default function RootLayout({ children }) {
    return (
        <html lang="uk" suppressHydrationWarning={true}>
        <body>{children}</body>
        </html>
    );
}