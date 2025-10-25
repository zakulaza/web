// app/components/ProfileModal.js
'use client';

import { signOut } from 'next-auth/react'; // Імпортуємо функцію виходу

export default function ProfileModal({ isOpen, onClose }) {
    // Якщо модальне вікно не відкрите, нічого не рендеримо
    if (!isOpen) {
        return null;
    }

    // Функція для обробки виходу
    const handleSignOut = () => {
        signOut({ callbackUrl: '/login' }); // Викликаємо signOut і вказуємо, куди перенаправити після виходу
    };

    return (
        // Оверлей (темний фон), який закриває модалку при кліку
        <div className="profileOverlay" onClick={onClose}>
            {/* Саме модальне вікно, клік по якому не закриває його */}
            <div className="profileModal" onClick={(e) => e.stopPropagation()}>
                {/* Кнопка закриття (хрестик) */}
                <button className="profileCloseButton" onClick={onClose}>×</button>

                {/* Заголовок профілю (аватар, ім'я) */}
                <div className="profileHeader">
                    <div className="profileAvatar">P</div> {/* Можна замінити на Image з сесії */}
                    <div className="profileInfo">
                        <h2>NAZVA</h2> {/* Можна замінити на ім'я з сесії */}
                        <p>Profile</p>
                    </div>
                </div>

                {/* Картка зі статистикою */}
                <div className="profileStatsCard">
                    <p>Restaurants: 2 selected</p>
                    <p>Achievements: 2</p>
                </div>

                {/* Кнопка "Мої речі" */}
                <button className="profileMyItemsButton">My Items</button>

                {/* Кнопка "Вийти" */}
                <button
                    onClick={handleSignOut} // Прив'язуємо функцію виходу
                    className="modalButton secondary" // Використовуємо стиль вторинної кнопки
                    style={{ width: '100%', marginTop: '0.5rem' }} // Додаткові стилі для розміщення
                >
                    Вийти
                </button>

                {/* Секція досягнень */}
                <div className="profileAchievements">
                    <h3>Achievements</h3>
                    <p>CoffeeLover</p>
                    <p>Explorer</p>
                </div>
            </div>
        </div>
    );
}