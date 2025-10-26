// app/components/ProfileModal.js
'use client';

import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { MapPin, Award, Coffee, Map, X } from 'lucide-react'; // Імпортуємо іконки

export default function ProfileModal({ isOpen, onClose }) {
    const { data: session } = useSession();

    if (!isOpen) {
        return null;
    }

    const handleSignOut = () => {
        signOut({ callbackUrl: '/login' });
    };

    return (
        <div className="profileOverlay" onClick={onClose}>
            <div className="profileModal updatedProfileModal" onClick={(e) => e.stopPropagation()}>
                <button className="profileCloseButton" onClick={onClose}>
                    <X size={24} /> {/* Заміна × */}
                </button>

                <div className="updatedProfileHeader">
                    <div className="updatedProfileAvatar">
                        {session?.user?.image ? (
                            <Image src={session.user.image} alt="Avatar" width={50} height={50} style={{ borderRadius: '50%' }}/>
                        ) : (
                            <span>{session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || 'A'}</span>
                        )}
                    </div>
                    <div className="updatedProfileName">
                        <h3>{session?.user?.name || 'User'}</h3>
                        <p>{session?.user?.email}</p>
                    </div>
                    <div className="updatedProfileLevel">
                        {/* TODO: Отримувати level з сесії */}
                        <span>{1} lvl.</span>
                    </div>
                </div>

                {/* Обгортка для контенту з прокруткою */}
                <div className="profileModalContent">
                    <div className="updatedProfileStats">
                        <div className="statCard">
                            <span className="statIcon"><MapPin size={22} /></span> {/* Заміна 📍 */}
                            <h4>Restaurants</h4>
                            <p><strong>2</strong> visited</p> {/* TODO: Динамічні дані */}
                            <span>Lviv, Kyiv</span>
                        </div>
                        <div className="statCard">
                            <span className="statIcon"><Award size={22} /></span> {/* Заміна 🏆 */}
                            <h4>Achievements</h4>
                            {/* TODO: Динамічні дані */}
                            <p><strong>{2}</strong> unlocked</p>
                        </div>
                    </div>

                    <button className="updatedMyItemsButton">My Items</button>

                    <div className="updatedAchievementsList">
                        <h4>Achievements</h4>
                        <div className="achievementItem">
                            <span className="achievementIcon"><Coffee size={24} /></span> {/* Заміна ☕️ */}
                            <div>
                                <h5>Coffee Lover</h5>
                                <p>Tried 10 different coffee items</p>
                            </div>
                        </div>
                        <div className="achievementItem">
                            <span className="achievementIcon"><Map size={24} /></span> {/* Заміна 🗺️ */}
                            <div>
                                <h5>Explorer</h5>
                                <p>Visited 5 different restaurants</p>
                            </div>
                        </div>
                    </div>
                </div> {/* Кінець profileModalContent */}

                {/* Кнопка "Вийти" тепер поза блоком прокрутки */}
                <button
                    onClick={handleSignOut}
                    className="modalButton secondary"
                    // Стилі для розміщення внизу, застосовуються через CSS
                >
                    Вийти
                </button>
            </div>
        </div>
    );
}