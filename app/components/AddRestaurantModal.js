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
        // profileOverlay
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 z-50" onClick={handleClose}>
            {/* profileModal */}
            <div className="bg-white rounded-xl w-full max-w-md shadow-2xl relative flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
                {/* profileCloseButton */}
                <button className="absolute top-2 right-3 text-2xl text-gray-400 cursor-pointer z-10 hover:text-gray-600" onClick={handleClose}>×</button>

                {/* profileModalContent (адаптований) */}
                <div className="p-6 overflow-y-auto">
                    {/* modalTitle */}
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">Add Restaurant</h2>

                    <form onSubmit={handleSubmit}>
                        {/* inputGroup */}
                        <div className="mb-5 text-left">
                            {/* label */}
                            <label htmlFor="resName" className="block font-medium mb-2 text-sm text-gray-700">Restaurant Name</label>
                            {/* loginInput */}
                            <input
                                id="resName"
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter restaurant name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-5 text-left">
                            <label htmlFor="resDesc" className="block font-medium mb-2 text-sm text-gray-700">Description</label>
                            {/* loginInput + textarea */}
                            <textarea
                                id="resDesc"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base transition focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[80px]"
                                placeholder="Describe the bar..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="3"
                            />
                        </div>
                        <div className="mb-5 text-left">
                            <label htmlFor="resImg" className="block font-medium mb-2 text-sm text-gray-700">Image URL (optional)</label>
                            <input
                                id="resImg"
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="https://example.com/image.jpg"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                            />
                        </div>

                        {/* loginError */}
                        {error && <p className="text-red-700 bg-red-100 border border-red-300 rounded-lg p-3 text-sm text-center mt-4">{error}</p>}

                        {/* modalActions */}
                        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-200">
                            {/* modalButton secondary */}
                            <button
                                type="button"
                                className="px-4 py-2 rounded-lg font-medium text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-60 disabled:cursor-not-allowed"
                                onClick={handleClose}
                                disabled={isLoading}
                            >
                                Скасувати
                            </button>
                            {/* modalButton primary */}
                            <button
                                type="submit"
                                className="px-4 py-2 rounded-lg font-medium text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Збереження...' : 'Зберегти'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}