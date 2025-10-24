// app/components/ProfileModal.js
'use client'; // Це клієнтський компонент

export default function ProfileModal({ isOpen, onClose }) {
    if (!isOpen) {
        return null;
    }

    return (
        // Оверлей (темний фон)
        <div className="profileOverlay" onClick={onClose}>
            {/* Cаме модальне вікно */}
            <div className="profileModal" onClick={(e) => e.stopPropagation()}>
                {/* Кнопка закриття */}
                <button className="profileCloseButton" onClick={onClose}>×</button>

                {/* Вміст профілю */}
                <div className="profileHeader">
                    <div className="profileAvatar">P</div>
                    <div className="profileInfo">
                        <h2>NAZVA</h2>
                        <p>Profile</p>
                    </div>
                </div>

                <div className="profileStatsCard">
                    {/* ... (Тут буде ваша картка зі статистикою) ... */}
                    <p>Restaurants: 2 selected</p>
                    <p>Achievements: 2</p>
                </div>

                <button className="profileMyItemsButton">My Items</button>

                <div className="profileAchievements">
                    <h3>Achievements</h3>
                    <p>CoffeeLover</p>
                    <p>Explorer</p>
                </div>
            </div>
        </div>
    );
}