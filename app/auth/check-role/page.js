// app/auth/check-role/page.js
'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CheckRolePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        // Як тільки сесія завантажиться...
        if (status === 'authenticated') {
            // Перевіряємо роль і перенаправляємо
            if (session?.user?.role === 'OWNER') {
                router.replace('/manage/restaurants'); // replace, щоб не можна було повернутись назад
            } else {
                router.replace('/menu');
            }
        } else if (status === 'unauthenticated') {
            // Якщо з якоїсь причини не вдалося увійти, повертаємо на логін
            router.replace('/login');
        }
        // Залежності: status, session, router
    }, [status, session, router]);

    // Поки йде перевірка, показуємо завантаження
    return (
        <main className="pageContainer menuPageContainer">
            <div style={{ padding: '2rem', textAlign: 'center' }}>Перевірка ролі...</div>
        </main>
    );
}