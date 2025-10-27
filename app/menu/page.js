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
        // pageContainer + menuPageContainer + loadingText
        return (
            <main className="w-full min-h-screen flex flex-col bg-white justify-start">
                <div className="p-8 text-center text-gray-500">Завантаження...</div>
            </main>
        );
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

            {/* pageContainer + menuPageContainer */}
            <main className="w-full min-h-screen flex flex-col bg-white justify-start">

                {/* --- 1. ХЕДЕР З ФОНОМ (ПОВНА ШИРИНА) --- */}
                {/* menuHeaderImage + updatedHeader. Використовуємо h-clamp */}
                <div className="w-full h-[clamp(200px,30vh,250px)] bg-gray-100 bg-cover bg-center relative flex-shrink-0">
                    <Image
                        src="/images/restaurant_nazva.jpg"
                        alt="Фон закладу"
                        layout="fill"
                        objectFit="cover"
                        className="absolute inset-0" // Tailwind-еквівалент
                    />

                    {/* headerIconsOverlay (з max-w-[1600px] з CSS var --card-max-width) */}
                    <div className="absolute inset-x-0 top-0 p-4 sm:p-6 flex justify-between items-center bg-gradient-to-b from-black/30 to-transparent w-full max-w-[1600px] mx-auto">
                        {/* headerIconBtn + backBtn */}
                        <button onClick={() => router.back()} className="bg-white/80 text-gray-800 rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-lg sm:text-xl cursor-pointer transition backdrop-blur-sm shadow-md hover:bg-white/95 font-bold">
                            <ArrowLeft size={24} />
                        </button>
                        {/* headerIconsRight */}
                        <div className="flex gap-3">
                            {/* headerIconBtn + settingsBtn */}
                            <button className="bg-white/80 text-gray-800 rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-lg sm:text-xl cursor-pointer transition backdrop-blur-sm shadow-md hover:bg-white/95">
                                <Settings size={20} />
                            </button>
                            {/* headerIconBtn + profileBtn (Виправлено на button) */}
                            <button onClick={() => setIsProfileOpen(true)} className="bg-white/80 text-gray-800 rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-lg sm:text-xl cursor-pointer transition backdrop-blur-sm shadow-md hover:bg-white/95 overflow-hidden">
                                {userImage ? (
                                    <Image src={userImage} alt="Profile" width={40} height={40} className="rounded-full object-cover w-full h-full" />
                                ) : (
                                    <span className="font-semibold">{profileInitial}</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- 2. КАРТКА ПРОФІЛЮ (max-w-[1600px] з CSS var --card-max-width) --- */}
                <div className="relative z-10 w-full max-w-[1600px] mx-auto">
                    {/* menuProfileCard + updatedCard + -mt-20 */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 relative z-10 text-left -mt-20">
                        {/* cardTopRow */}
                        <div className="flex items-center gap-4 mb-4">
                            {/* cardAvatar */}
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-200 border-2 sm:border-4 border-white flex-shrink-0 flex items-center justify-center"></div>
                            
                            {/* cardInfo */}
                            <div className="flex-grow overflow-hidden">
                                <h2 className="m-0 text-xl sm:text-2xl font-semibold truncate">{establishmentName}</h2>
                                <p className="mt-0.5 mb-1 text-yellow-500 text-sm">{restaurantRating}</p>
                                <span className="text-sm text-gray-500 truncate block">{restaurantAddress}</span>
                            </div>
                            {/* cardLevel */}
                            <span className="text-sm font-semibold text-gray-700 self-start">{userLevel}</span>
                        </div>
                        {/* cardProgressBarContainer */}
                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            {/* cardProgressBarFill */}
                            <div className="h-full bg-green-500 rounded-full" style={{ width: '70%' }}></div>
                        </div>
                    </div>
                </div>

                {/* --- 3. СПИСОК КАТЕГОРІЙ МЕНЮ (max-w-[1200px] з CSS var --nav-max-width) --- */}
                {/* primaryMenuContentWrapper (max-w-[1600px]) */}
                <div className="w-full mx-auto max-w-[1600px] flex-grow flex flex-col pt-8">
                    {/* menuNavList + updatedList (max-w-[1200px]) */}
                    <nav className="max-w-[1200px] mx-auto flex flex-col gap-6 w-full px-4 sm:px-6 pb-6 sm:pb-8 text-left flex-grow overflow-y-auto justify-center relative z-10">
                        {/* menuNavItem + updatedItem */}
                        <Link href={`/menu-secondary?id=${RESTAURANT_ID}&category=Гарячі страви`} className="w-full text-lg p-5 sm:p-6 rounded-2xl shadow-lg text-center transition-all duration-200 ease-in-out no-underline font-bold bg-gray-50 text-gray-800 hover:shadow-xl hover:bg-white">
                            Кухня
                        </Link>
                        <Link href={`/menu-secondary?id=${RESTAURANT_ID}&category=Напої`} className="w-full text-lg p-5 sm:p-6 rounded-2xl shadow-lg text-center transition-all duration-200 ease-in-out no-underline font-bold bg-gray-50 text-gray-800 hover:shadow-xl hover:bg-white">
                            Напої
                        </Link>
                        <Link href={`/menu-secondary?id=${RESTAURANT_ID}&category=Алкогольні напої`} className="w-full text-lg p-5 sm:p-6 rounded-2xl shadow-lg text-center transition-all duration-200 ease-in-out no-underline font-bold bg-gray-50 text-gray-800 hover:shadow-xl hover:bg-white">
                            Алкоголь
                        </Link>
                        <Link href={`/menu-secondary?id=${RESTAURANT_ID}&category=Мерч`} className="w-full text-lg p-5 sm:p-6 rounded-2xl shadow-lg text-center transition-all duration-200 ease-in-out no-underline font-bold bg-gray-50 text-gray-800 hover:shadow-xl hover:bg-white">
                            Мерч
                        </Link>
                    </nav>
                </div>
            </main>
        </>
    );
}