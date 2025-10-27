// app/auth/check-role/page.js
'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CheckRolePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {

        // Якщо статус 'loading', ми просто чекаємо.
        if (status === 'loading') {
            return;
        }

        // Як тільки статус змінюється...
        if (status === 'authenticated') {
            // УСПІХ: Сесія готова.
            const userRole = session.user?.role;
            if (userRole === 'OWNER') {
                router.replace('/manage/restaurants');
            } else {
                router.replace('/menu');
            }
        }

        if (status === 'unauthenticated') {
            // Якщо щось пішло не так (наприклад, Google відхилив),
            // повертаємо на логін з помилкою.
            router.replace('/login?error=AuthFailed');
        }

    }, [status, session, router]);

    // Поки йде перевірка, показуємо екран завантаження
    return (
        <main className="w-full min-h-screen flex flex-col bg-white justify-center items-center">
            <div className="p-8 text-center text-gray-600">
                <p className="text-lg font-medium">Завершуємо вхід...</p>
                <p>Будь ласка, зачекайте.</p>
            </div>
        </main>
    );
}