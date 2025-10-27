// app/components/ProfileModal.js
'use client';

import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Award, Coffee, Map, X, Store, DollarSign, Loader2 } from 'lucide-react'; // Додано Loader2
import { useState, useEffect } from 'react'; // <--- ДОДАНО

// --- Компонент для Ачівки ---
// (Ми виносимо це, щоб уникнути дублювання коду)
function AchievementItem({ icon, name, description }) {
    // Проста мапа для іконок (ви можете розширити її)
    const getIcon = (iconName) => {
        switch (iconName.toLowerCase()) {
            case 'coffee':
                return <Coffee size={24} />;
            case 'map':
                return <Map size={24} />;
            default:
                return <Award size={24} />;
        }
    };

    return (
        <div className="flex items-center gap-4 bg-gray-100 rounded-xl p-4 mb-3">
            <span className="text-2xl flex-shrink-0 text-gray-700">
                {getIcon(icon)}
            </span>
            <div>
                <h5 className="m-0 mb-0.5 text-sm font-semibold">{name}</h5>
                <p className="m-0 text-xs text-gray-600">{description}</p>
            </div>
        </div>
    );
}


export default function ProfileModal({ isOpen, onClose }) {
    const { data: session } = useSession();
    const role = session?.user?.role;

    // --- СТАН ДЛЯ ЗБЕРЕЖЕННЯ АЧІВОК ---
    const [achievements, setAchievements] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- ЕФЕКТ ДЛЯ ЗАВАНТАЖЕННЯ АЧІВОК ---
    useEffect(() => {
        // Завантажуємо дані лише якщо модалка відкрита і це не власник
        if (isOpen && role !== 'OWNER') {
            setIsLoading(true);
            setError(null);

            fetch('/api/achievements')
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Failed to load achievements');
                    }
                    return res.json();
                })
                .then(data => {
                    setAchievements(data);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setError(err.message);
                    setIsLoading(false);
                });
        }
        // Скидаємо стан, якщо модалка закрита
        if (!isOpen) {
            setAchievements([]);
            setIsLoading(false);
            setError(null);
        }
    }, [isOpen, role]); // Пере-завантажуємо, якщо модалка відкривається


    if (!isOpen) {
        return null;
    }

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' });
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 z-50" onClick={onClose}>
            <div className="bg-white rounded-xl w-full max-w-md shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <button className="absolute top-3 right-4 text-2xl text-gray-400 cursor-pointer z-10 hover:text-gray-600" onClick={onClose}>
                    <X size={24} />
                </button>

                {/* ... (Хедер профілю залишається без змін) ... */}
                <div className="bg-gradient-to-r from-[#1db954] to-[#1ed760] text-white p-6 flex items-center gap-4 flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center text-2xl font-medium flex-shrink-0">
                        {session?.user?.image ? (
                            <Image
                                src={session.user.image}
                                alt="Avatar"
                                width={50}
                                height={50}
                                className="rounded-full"
                            />
                        ) : (
                            <span>{session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || 'A'}</span>
                        )}
                    </div>
                    <div className="flex-grow overflow-hidden">
                        <h3 className="m-0 text-base font-semibold truncate">{session?.user?.name || 'User'}</h3>
                        <p className="m-0 text-xs opacity-80 truncate">{session?.user?.email}</p>
                    </div>
                    <div className="text-sm font-medium bg-black/20 px-3 py-1 rounded-full flex-shrink-0 whitespace-nowrap">
                        <span>{role === 'OWNER' ? 'Owner' : 'lvl. 1'}</span>
                    </div>
                </div>

                {/* profileModalContent (блок з прокруткою) */}
                <div className="p-6 overflow-y-auto flex-grow">

                    {role === 'OWNER' ? (
                        // --- 1. ВМІСТ ДЛЯ ВЛАСНИКА ---
                        <>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-100 rounded-xl p-4 text-center">
                                    <span className="text-2xl block mb-2 mx-auto"><Store size={22} /></span>
                                    <h4 className="m-0 text-sm font-semibold text-gray-600 mb-1">Мої заклади</h4>
                                    <p className="m-0 text-sm"><strong className="text-lg font-bold text-black">1</strong></p>
                                </div>
                                <div className="bg-gray-100 rounded-xl p-4 text-center">
                                    <span className="text-2xl block mb-2 mx-auto"><DollarSign size={22} /></span>
                                    <h4 className="m-0 text-sm font-semibold text-gray-600 mb-1">Дохід (місяць)</h4>
                                    <p className="m-0 text-sm"><strong className="text-lg font-bold text-black">0</strong> грн</p>
                                </div>
                            </div>

                            <Link
                                href="/manage/restaurants"
                                onClick={onClose}
                                className="block w-full p-3 rounded-xl bg-blue-600 text-white text-base font-bold cursor-pointer mb-6 transition hover:bg-blue-700 flex-shrink-0 text-center no-underline"
                            >
                                Управління закладами
                            </Link>
                        </>
                    ) : (
                        // --- 2. ВМІСТ ДЛЯ КОРИСТУВАЧА ---
                        <>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {/* ... (Статистика "Restaurants visited" ... ) ... */}
                                <div className="bg-gray-100 rounded-xl p-4 text-center">
                                    <span className="text-2xl block mb-2 mx-auto"><MapPin size={22} /></span>
                                    <h4 className="m-0 text-sm font-semibold text-gray-600 mb-1">Restaurants</h4>
                                    <p className="m-0 text-sm"><strong className="text-lg font-bold text-black">2</strong> visited</p>
                                    <span className="text-xs text-gray-500">Lviv, Kyiv</span>
                                </div>
                                <div className="bg-gray-100 rounded-xl p-4 text-center">
                                    <span className="text-2xl block mb-2 mx-auto"><Award size={22} /></span>
                                    <h4 className="m-0 text-sm font-semibold text-gray-600 mb-1">Achievements</h4>
                                    <p className="m-0 text-sm"><strong className="text-lg font-bold text-black">{achievements.length}</strong> unlocked</p>
                                </div>
                            </div>

                            <button className="block w-full p-3 rounded-xl bg-[#1db954] text-white text-base font-bold cursor-pointer mb-6 transition hover:bg-[#1aa34a] flex-shrink-0">
                                My Items
                            </button>

                            {/* --- ДИНАМІЧНИЙ СПИСОК АЧІВОК --- */}
                            <div className="text-left flex-shrink-0">
                                <h4 className="m-0 mb-4 text-base font-semibold text-gray-800">Achievements</h4>

                                {isLoading && (
                                    <div className="flex justify-center items-center p-4">
                                        <Loader2 className="animate-spin" size={24} />
                                    </div>
                                )}
                                {error && (
                                    <p className="text-red-600 text-sm">Помилка завантаження ачівок.</p>
                                )}
                                {!isLoading && !error && achievements.length === 0 && (
                                    <p className="text-gray-500 text-sm">У вас поки немає ачівок.</p>
                                )}

                                {!isLoading && !error && achievements.map(ach => (
                                    <AchievementItem
                                        key={ach.id}
                                        icon={ach.icon}
                                        name={ach.name}
                                        description={ach.description}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Кнопка "Вийти" (спільна для обох) */}
                <button
                    onClick={handleSignOut}
                    className="px-4 py-2 rounded-lg font-medium text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 m-6 mt-0 flex-shrink-0 w-[calc(100%-3rem)] self-center"
                >
                    Вийти
                </button>
            </div>
        </div>
    );
}