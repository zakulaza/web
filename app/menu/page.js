// app/menu/page.js
'use client';

import Link from 'next/link';
import { useState } from 'react';
import ProfileModal from '../components/ProfileModal';

export default function MenuPage() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <>
            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
            />

            {/* ВИКОРИСТОВУЄМО НОВИЙ КЛАС-КОНТЕЙНЕР */}
            <main className="pageContainer menuPageContainer">
                {/* Обгортка, яка обмежує ширину */}
                <div className="primaryMenuContentWrapper">
                    <div className="menuHeaderImage">
                        <div className="profileIcon" onClick={() => setIsProfileOpen(true)}>
                            👤
                        </div>
                    </div>

                    <div className="menuProfileCard">
                        <div className="menuProfileAvatar"></div>
                        <div className="menuProfileInfo">
                            <h2>NAZVA</h2>
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

                    <nav className="menuNavList">
                        {/* ОНОВЛЕНЕ ПОСИЛАННЯ */}
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