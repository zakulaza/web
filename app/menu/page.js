// app/menu/page.js
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ProfileModal from '../components/ProfileModal';
import { ArrowLeft, Settings, User } from 'lucide-react'; // Імпортуємо іконки

export default function MenuPage() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();

    // Стан завантаження або неавторизований (перевірка сесії)
    if (status === "loading") {
        return <main className="pageContainer menuPageContainer"><div className="loadingText">Завантаження...</div></main>;
    }
    if (status === "unauthenticated") {
        router.push('/login');
        return null;
    }

    return (
        <>
            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
            />

            {/* Контейнер сторінки */}
            <main className="pageContainer menuPageContainer">

                {/* Обгортка контенту */}
                <div className="primaryMenuContentWrapper updatedDesign">

                    {/* Хедер з фоновим зображенням та іконками */}
                    <div className="menuHeaderImage updatedHeader">
                        {/* Іконки у хедері */}
                        <div className="headerIconsOverlay">
                            <button onClick={() => router.back()} className="headerIconBtn backBtn">
                                <ArrowLeft size={20} strokeWidth={2.5} /> {/* Заміна ← */}
                            </button>
                            <div className="headerIconsRight">
                                <button className="headerIconBtn settingsBtn">
                                    <Settings size={20} strokeWidth={2.5} /> {/* Заміна ⚙️ */}
                                </button>
                                <button className="headerIconBtn profileBtn" onClick={() => setIsProfileOpen(true)}>
                                    {session?.user?.image ? (
                                        <img src={session.user.image} alt="profile" />
                                    ) : (
                                        <User size={20} strokeWidth={2.5} /> // Заміна 👤
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Оновлена картка профілю */}
                    <div className="menuProfileCard updatedCard">
                        <div className="cardTopRow">
                            <div className="cardAvatar"></div>
                            <div className="cardInfo">
                                {/* Ім'я користувача або назва */}
                                <h2>{session?.user?.name || 'NAZVA'}</h2>
                                <p className="cardRating">★★★★☆</p>
                                <span className="cardAddress">Rynok square, 39</span>
                            </div>
                            <div className="cardLevel">
                                {/* TODO: Отримувати level з сесії */}
                                <span>lvl. 23</span>
                            </div>
                        </div>
                        <div className="cardProgressBarContainer">
                            {/* TODO: Отримувати progress з сесії */}
                            <div className="cardProgressBarFill" style={{ width: '40%' }}></div>
                        </div>
                    </div>

                    {/* Оновлений список меню */}
                    <nav className="menuNavList updatedList">
                        <Link href="/menu-secondary?category=Гарячі страви" className="menuNavItem updatedItem">
                            Кухня
                        </Link>
                        <Link href="/menu-secondary?category=Напої" className="menuNavItem updatedItem">
                            Напої
                        </Link>
                        <Link href="/menu-secondary?category=Алкогольні напої" className="menuNavItem updatedItem">
                            Алкоголь
                        </Link>
                        <Link href="/menu-secondary?category=Мерч" className="menuNavItem updatedItem">
                            Мерч
                        </Link>
                    </nav>
                </div>
            </main>
        </>
    );
}