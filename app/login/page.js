'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react'; // Додано useEffect
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Settings, ArrowLeft } from 'lucide-react';
import ProfileModal from '../components/ProfileModal';

// --- ХУК ДЛЯ МОКОВАННЯ ДОДАТКОВИХ ДАНИХ (РАННІЙ ДОСТУП) ---
// Цей хук імітує завантаження даних користувача, які не зберігаються в NextAuth сесії
function useProfileData(session) {
    const [profileData, setProfileData] = useState({ userLevel: 'lvl. 23', isReady: false });

    useEffect(() => {
        if (session) {
            // В реальному житті тут має бути fetch до вашого API: /api/auth/profile
            // fetch('/api/auth/profile').then(res => res.json()).then(data => {
            //     setProfileData({ userLevel: data.level, isReady: true });
            // });

            // Заглушка, що імітує завантаження даних
            setTimeout(() => {
                setProfileData({ userLevel: 'LvL. 23', isReady: true });
            }, 100);
        }
    }, [session]);

    return profileData;
}

export default function MenuPage() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();
    const { userLevel, isReady } = useProfileData(session); // Отримуємо рівень

    // --- ДАНІ ЗАГЛУШКИ (ЖОРСТКО КОДОВАНІ ДЛЯ ДИЗАЙНУ) ---
    const establishmentName = 'NAZVA';
    const restaurantAddress = 'Rynok square, 39';
    const restaurantRating = '★★★★☆';
    const RESTAURANT_ID = 1;

    // Дані користувача з сесії
    const userName = session?.user?.name || 'Клієнт';
    const profileInitial = userName.charAt(0);
    const userImage = session?.user?.image;

    // Стан завантаження або неавторизований (перевірка сесії)
    if (status === "loading" || !isReady) { // Додано !isReady для очікування рівня
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

            <main className="pageContainer menuPageContainer">

                {/* --- 1. ХЕДЕР З ФОНОМ (ПОВНА ШИРИНА) --- */}
                <div className="menuHeaderImage updatedHeader">
                    <Image
                        src="/images/restaurant_nazva.jpg"
                        alt="Фон закладу"
                        layout="fill"
                        objectFit="cover"
                        className="menuBackground"
                    />

                    {/* Накладання іконок: ОБМЕЖЕНО width: var(--card-max-width) */}
                    <div className="headerIconsOverlay" style={{maxWidth: 'var(--card-max-width)', margin: '0 auto'}}>
                        <button onClick={() => router.back()} className="headerIconBtn backBtn">
                            <ArrowLeft size={24} />
                        </button>
                        <div className="headerIconsRight">
                            <button className="headerIconBtn settingsBtn">
                                <Settings size={20} />
                            </button>
                            <Link href="/profile" className="headerIconBtn profileBtn" onClick={() => setIsProfileOpen(true)}>
                                <span className="profileLetter">{profileInitial}</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* --- 2. КАРТКА ПРОФІЛЮ (ВИКОРИСТОВУЄ var(--card-max-width)) --- */}
                <div className="relative z-10 w-full" style={{maxWidth: 'var(--card-max-width)', margin: '0 auto'}}>
                    <div className="menuProfileCard updatedCard -mt-20">
                        <div className="cardTopRow">

                            <div className="cardAvatar"></div>

                            <div className="cardInfo">
                                <h2>{establishmentName}</h2>
                                <p className="cardRating">{restaurantRating}</p>
                                <span className="cardAddress">{restaurantAddress}</span>
                            </div>
                            <span className="cardLevel">{userLevel}</span> {/* <--- ВИКОРИСТАННЯ ДИНАМІЧНОГО РІВНЯ */}
                        </div>
                        <div className="cardProgressBarContainer">
                            <div className="cardProgressBarFill" style={{ width: '70%' }}></div>
                        </div>
                    </div>
                </div>

                {/* --- 3. СПИСОК КАТЕГОРІЙ МЕНЮ (ВИКОРИСТОВУЄ var(--nav-max-width)) --- */}
                <div className="primaryMenuContentWrapper updatedDesign pt-8">
                    <nav className="menuNavList updatedList">
                        <Link href={`/menu-secondary?id=${RESTAURANT_ID}&category=Гарячі страви`} className="menuNavItem updatedItem">
                            Кухня
                        </Link>
                        <Link href={`/menu-secondary?id=${RESTAURANT_ID}&category=Напої`} className="menuNavItem updatedItem">
                            Напої
                        </Link>
                        <Link href={`/menu-secondary?id=${RESTAURANT_ID}&category=Алкогольні напої`} className="menuNavItem updatedItem">
                            Алкоголь
                        </Link>
                        <Link href={`/menu-secondary?id=${RESTAURANT_ID}&category=Мерч`} className="menuNavItem updatedItem">
                            Мерч
                        </Link>
                    </nav>
                </div>
            </main>
        </>
    );
}
