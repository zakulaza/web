// app/components/AddCategoryModal.js
'use client';

import { useState } from 'react';

// Дуже схожий на AddRestaurantModal, але відправляє запит на інший API
export default function AddCategoryModal({ isOpen, onClose, onCategoryAdded, restaurantId }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => {
        setName('');
        setDescription('');
        setError('');
        setIsLoading(false);
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Важливо: використовуємо динамічний URL з restaurantId
        const apiUrl = `/api/manage/restaurants/${restaurantId}/categories`;

        try {
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description }), // Передаємо тільки потрібні поля
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to add category');
            }

            onCategoryAdded(data);
            handleClose();

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="profileOverlay" onClick={handleClose}>
            <div className="profileModal" onClick={(e) => e.stopPropagation()}>
                <button className="profileCloseButton" onClick={handleClose}>×</button>
                <h2 className="modalTitle">Add Category</h2>

                <form onSubmit={handleSubmit}>
                    <div className="inputGroup">
                        <label htmlFor="catName">Category Name</label>
                        <input
                            id="catName"
                            type="text"
                            className="loginInput"
                            placeholder="e.g., Coffee, Main Dishes"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="inputGroup">
                        <label htmlFor="catDesc">Description (optional)</label>
                        <textarea
                            id="catDesc"
                            className="loginInput"
                            placeholder="Describe the category..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                        />
                    </div>

                    {error && <p className="loginError">{error}</p>}

                    <div className="modalActions">
                        <button
                            type="button"
                            className="modalButton secondary"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Скасувати
                        </button>
                        <button
                            type="submit"
                            className="modalButton primary"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Збереження...' : 'Зберегти'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}