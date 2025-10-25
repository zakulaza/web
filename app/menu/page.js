'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react'; // Для перевірки логіну
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProfileModal from '../components/ProfileModal';

export default function MenuPage() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Отримуємо 'status' сесії (loading, authenticated, unauthenticated)
    const { data: session, status } = useSession();
    const router = useRouter();

    // 1. Стан завантаження: показуємо завантажувач
    if (status === "loading") {
        // Використовуємо класи-контейнери, щоб фон був правильним
        return (
            <main className="pageContainer menuPageContainer">
                <div style={{ padding: '2rem', textAlign: 'center' }}>Завантаження...</div>
            </main>
        );
    }

    // 2. Стан "не автентифікований": відправляємо на логін
    if (status === "unauthenticated") {
        router.push('/login');
        return null; // Повертаємо null, поки йде перенаправлення
    }

    // 3. Стан "автентифікований": показуємо сторінку
    return (
        <>
            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
            />

            <main className="pageContainer menuPageContainer">
                {/* Обгортка, яка обмежує ширину */}
                <div className="primaryMenuContentWrapper">

                    <div className="menuHeaderImage">
                        {/* Іконка профілю, яка відкриває модалку */}
                        <div className="profileIcon" onClick={() => setIsProfileOpen(true)}>
                            {/* Перевіряємо, чи є зображення з Google */}
                            {session?.user?.image ? (
                                <img
                                    src={session.user.image}
                                    alt={session.user.name || 'Profile'}
                                    style={{
                                        borderRadius: '50%',
                                        width: '40px',
                                        height: '40px',
                                        objectFit: 'cover'
                                    }}
                                />
                            ) : (
                                '👤' // Заглушка, якщо зображення немає
                            )}
                        </div>
                    </div>

                    {/* Картка профілю ресторану */}
                    <div className="menuProfileCard">
                        <div className="menuProfileAvatar"></div>
                        <div className="menuProfileInfo">
                            {/* Можна показати ім'я користувача або назву ресторану */}
                            <h2>{session?.user?.name || 'NAZVA'}</h2>
                            <p>★★★★☆</p>
                            <span>Буковель, 32</span>
                        </div>
                        <div className="menuProfileLevel">
                            <div className="menuProgressBarContainer">
                                <div className="menuProgressBarFill" style={{ width: '75%' }}></div>
                            </div>
                            <span>lvl. 23</span>
                        </div>
                    </div>

                    {/* Навігація по категоріях */}
                    <nav className="menuNavList">
                        {/* Виправлене посилання для "Кухні" */}
                        <Link href="/menu-secondary?category=Гарячі страви" className="menuNavItem">
                            Кухня
                        </Link>
                        <Link href="/menu-secondary?category=Напої" className="menuNavItem">
                            Напої
                        </Link>
                        <Link href="/menu-secondary?category=Алкоголь" className="menuNavItem">
                            Алкоголь
                        </Link>
                        <Link href="/menu-secondary?category=Mapu" className="menuNavItem">
                            Mapu
                        </Link>
                    </nav>
                </div>
            </main>
        </>
    );
}