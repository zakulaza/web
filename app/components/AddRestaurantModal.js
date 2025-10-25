// app/components/AddRestaurantModal.js
'use client';

import { useState } from 'react';

export default function AddRestaurantModal({ isOpen, onClose, onRestaurantAdded }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => {
        setName('');
        setDescription('');
        setImageUrl('');
        setError('');
        setIsLoading(false);
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/manage/restaurants', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description, imageUrl }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to add restaurant');
            }

            onRestaurantAdded(data);
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
                <h2 className="modalTitle">Add Restaurant</h2>

                <form onSubmit={handleSubmit}>
                    <div className="inputGroup">
                        <label htmlFor="resName">Restaurant Name</label>
                        <input
                            id="resName"
                            type="text"
                            className="loginInput"
                            placeholder="Enter restaurant name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="inputGroup">
                        <label htmlFor="resDesc">Description</label>
                        <textarea
                            id="resDesc"
                            className="loginInput"
                            placeholder="Describe the bar..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                        />
                    </div>
                    <div className="inputGroup">
                        <label htmlFor="resImg">Image URL (optional)</label>
                        <input
                            id="resImg"
                            type="text"
                            className="loginInput"
                            placeholder="https://example.com/image.jpg"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
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