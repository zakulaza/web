'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Settings, ArrowLeft } from 'lucide-react';
import ProfileModal from '../components/ProfileModal';

export default function MenuPage() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();

    // --- ДАНІ ЗАГЛУШКИ (ЖОРСТКО КОДОВАНІ) ---
    const establishmentName = 'NAZVA';
    const restaurantAddress = 'Rynok square, 39';
    const userLevel = 'lvl. 23';
    const restaurantRating = '★★★★☆';
    const RESTAURANT_ID = 1;

    // Дані користувача з сесії
    const userName = session?.user?.name || 'Клієнт';
    const profileInitial = userName.charAt(0);
    const userImage = session?.user?.image;

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
                            {/* ВИПРАВЛЕННЯ: КНОПКА ПРОФІЛЮ ЯК У menu-secondary/page.js */}
                            <span className="headerIconBtn profileBtn" onClick={() => setIsProfileOpen(true)}>
                                {session?.user?.image ? (
                                    <img src={userImage} alt="profile" className="headerProfileImage" />
                                ) : (
                                    <span className="profileLetter">{profileInitial}</span>
                                )}
                            </span>
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
                            <span className="cardLevel">{userLevel}</span>
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
