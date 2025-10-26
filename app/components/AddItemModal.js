// app/components/AddItemModal.js
'use client';

import { useState } from 'react';

export default function AddItemModal({ isOpen, onClose, onItemAdded, restaurantId, categoryId }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [calories, setCalories] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => {
        // Скидаємо поля
        setName(''); setDescription(''); setPrice(''); setCalories(''); setImageUrl('');
        setError('');
        setIsLoading(false);
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const apiUrl = `/api/manage/restaurants/${restaurantId}/categories/${categoryId}/items`;

        // Перевірка чи ціна та калорії є числами (якщо введені)
        const parsedPrice = parseFloat(price);
        const parsedCalories = calories ? parseInt(calories) : null;
        if (isNaN(parsedPrice) || (calories && isNaN(parsedCalories))) {
            setError('Price and Calories must be numbers.');
            setIsLoading(false);
            return;
        }


        try {
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    description,
                    price: parsedPrice, // Надсилаємо число
                    calories: parsedCalories, // Надсилаємо число або null
                    imageUrl
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to add item');
            }

            onItemAdded(data);
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
                <h2 className="modalTitle">Add Item</h2>

                <form onSubmit={handleSubmit}>
                    {/* Поля форми */}
                    <div className="inputGroup">
                        <label htmlFor="itemName">Item Name</label>
                        <input id="itemName" type="text" className="loginInput" placeholder="Enter item name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="inputGroup">
                        <label htmlFor="itemDesc">Description (optional)</label>
                        <textarea id="itemDesc" className="loginInput" placeholder="Describe the item..." value={description} onChange={(e) => setDescription(e.target.value)} rows="2" />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}> {/* Ціна та калорії поруч */}
                        <div className="inputGroup" style={{ flex: 1 }}>
                            <label htmlFor="itemPrice">Price (грн)</label>
                            <input id="itemPrice" type="number" step="0.01" className="loginInput" placeholder="e.g., 150.50" value={price} onChange={(e) => setPrice(e.target.value)} required />
                        </div>
                        <div className="inputGroup" style={{ flex: 1 }}>
                            <label htmlFor="itemCal">Calories (optional)</label>
                            <input id="itemCal" type="number" className="loginInput" placeholder="e.g., 350" value={calories} onChange={(e) => setCalories(e.target.value)} />
                        </div>
                    </div>
                    <div className="inputGroup">
                        <label htmlFor="itemImg">Image URL (optional)</label>
                        <input id="itemImg" type="text" className="loginInput" placeholder="https://example.com/image.jpg" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                    </div>

                    {error && <p className="loginError">{error}</p>}

                    <div className="modalActions">
                        <button type="button" className="modalButton secondary" onClick={handleClose} disabled={isLoading}>Скасувати</button>
                        <button type="submit" className="modalButton primary" disabled={isLoading}>{isLoading ? 'Збереження...' : 'Зберегти'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}