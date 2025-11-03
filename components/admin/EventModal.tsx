import React, { useState, useEffect } from 'react';
import { Event } from '../../types';
import { validateText } from '../../utils/validationUtils';

interface EventModalProps {
    event: Event | null;
    onSave: (eventData: Omit<Event, 'id'> | Event) => void;
    onClose: () => void;
}

export const EventModal = ({ event, onSave, onClose }: EventModalProps) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (event) {
            setTitle(event.title);
            setDate(event.date);
            setDescription(event.description);
        }
    }, [event]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const titleError = validateText(title, 'Event title');
        if (titleError) {
            setError(titleError);
            return;
        }
        const descriptionError = validateText(description, 'Event description');
        if (descriptionError) {
            setError(descriptionError);
            return;
        }
        setError('');

        const eventData = { title, date, description };
        if (event) {
            onSave({ ...eventData, id: event.id });
        } else {
            onSave(eventData);
        }
    };
    
    const modalTitle = event ? 'Edit Event' : 'Add New Event';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-scale-in" style={{ backgroundColor: 'var(--color-bg-main)', border: '1px solid var(--color-border)' }} onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-6">{modalTitle}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-1 opacity-80">Event Title</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                            required
                            className="w-full rounded-lg p-2"
                            style={{backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)', border: '1px solid var(--color-border)'}}
                        />
                    </div>
                     <div>
                        <label htmlFor="date" className="block text-sm font-medium mb-1 opacity-80">Date</label>
                        <input
                            id="date"
                            type="text"
                            value={date}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
                            placeholder="e.g., Sep 1, 2024"
                            required
                            className="w-full rounded-lg p-2"
                            style={{backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)', border: '1px solid var(--color-border)'}}
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium mb-1 opacity-80">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                            required
                            rows={3}
                            className="w-full rounded-lg p-2 resize-y"
                             style={{backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)', border: '1px solid var(--color-border)'}}
                        />
                    </div>
                    {error && <p className="text-sm text-red-400">{error}</p>}
                     <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="w-full font-semibold py-2 px-4 rounded-lg transition-colors hover:bg-white/10" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', color: 'var(--color-text-main)' }}>
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="w-full font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-transform active:scale-95"
                            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-primary-text)' }}
                        >
                            Save Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};