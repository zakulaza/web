// app/components/EditItemModal.js
'use client';

import { useState, useEffect } from 'react';

// Дуже схожий на AddItemModal, але отримує дані існуючого товару
export default function EditItemModal({ isOpen, onClose, onItemUpdated, itemToEdit, restaurantId, categoryId }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [calories, setCalories] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Заповнюємо форму даними товару, коли модалка відкривається
    useEffect(() => {
        if (itemToEdit) {
            setName(itemToEdit.name || '');
            setDescription(itemToEdit.description || '');
            setPrice(itemToEdit.price?.toString() || ''); // Перетворюємо на рядок для input type="number"
            setCalories(itemToEdit.calories?.toString() || '');
            setImageUrl(itemToEdit.imageUrl || '');
        }
    }, [itemToEdit]); // Ефект спрацює, коли зміниться itemToEdit

    const handleClose = () => {
        setError('');
        setIsLoading(false);
        onClose(); // Просто закриваємо, не скидаючи поля одразу
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // URL для оновлення конкретного товару
        const apiUrl = `/api/manage/restaurants/${restaurantId}/categories/${categoryId}/items/${itemToEdit.id}`;

        const parsedPrice = parseFloat(price);
        const parsedCalories = calories ? parseInt(calories) : null;
        if (isNaN(parsedPrice) || (calories && isNaN(parsedCalories))) {
            setError('Price and Calories must be numbers.');
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(apiUrl, {
                method: 'PUT', // Використовуємо метод PUT
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    description,
                    price: parsedPrice,
                    calories: parsedCalories,
                    imageUrl
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to update item');
            }

            onItemUpdated(data); // Передаємо оновлений товар батьківському компоненту
            handleClose();

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !itemToEdit) { // Перевіряємо і isOpen і itemToEdit
        return null;
    }

    return (
        <div className="profileOverlay" onClick={handleClose}>
            <div className="profileModal" onClick={(e) => e.stopPropagation()}>
                <button className="profileCloseButton" onClick={handleClose}>×</button>
                <h2 className="modalTitle">Edit Item</h2> {/* Змінено заголовок */}

                <form onSubmit={handleSubmit}>
                    {/* Поля форми (ідентичні AddItemModal, але з value) */}
                    <div className="inputGroup">
                        <label htmlFor="editItemName">Item Name</label>
                        <input id="editItemName" type="text" className="loginInput" placeholder="Enter item name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="inputGroup">
                        <label htmlFor="editItemDesc">Description (optional)</label>
                        <textarea id="editItemDesc" className="loginInput" placeholder="Describe the item..." value={description} onChange={(e) => setDescription(e.target.value)} rows="2" />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="inputGroup" style={{ flex: 1 }}>
                            <label htmlFor="editItemPrice">Price (грн)</label>
                            <input id="editItemPrice" type="number" step="0.01" className="loginInput" placeholder="e.g., 150.50" value={price} onChange={(e) => setPrice(e.target.value)} required />
                        </div>
                        <div className="inputGroup" style={{ flex: 1 }}>
                            <label htmlFor="editItemCal">Calories (optional)</label>
                            <input id="editItemCal" type="number" className="loginInput" placeholder="e.g., 350" value={calories} onChange={(e) => setCalories(e.target.value)} />
                        </div>
                    </div>
                    <div className="inputGroup">
                        <label htmlFor="editItemImg">Image URL (optional)</label>
                        <input id="editItemImg" type="text" className="loginInput" placeholder="https://example.com/image.jpg" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                    </div>

                    {error && <p className="loginError">{error}</p>}

                    <div className="modalActions">
                        <button type="button" className="modalButton secondary" onClick={handleClose} disabled={isLoading}>Скасувати</button>
                        <button type="submit" className="modalButton primary" disabled={isLoading}>{isLoading ? 'Збереження...' : 'Зберегти Зміни'}</button> {/* Змінено текст кнопки */}
                    </div>
                </form>
            </div>
        </div>
    );
}