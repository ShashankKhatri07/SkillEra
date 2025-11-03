import { useState } from 'react';
import { Event } from '../types';
import { Card } from '../components/Card';
import { BellIcon } from '../components/icons/BellIcon';
import { EventModal } from '../components/admin/EventModal';

interface EventsPageProps {
  events: Event[];
  isAdmin?: boolean;
  onAddEvent?: (event: Omit<Event, 'id'>) => void;
  onUpdateEvent?: (event: Event) => void;
  onDeleteEvent?: (eventId: string) => void;
}

export const EventsPage = ({ events, isAdmin = false, onAddEvent, onUpdateEvent, onDeleteEvent }: EventsPageProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };
  
  const handleSave = (eventData: Omit<Event, 'id'> | Event) => {
    if ('id' in eventData && onUpdateEvent) {
        onUpdateEvent(eventData);
    } else if (onAddEvent) {
        onAddEvent(eventData as Omit<Event, 'id'>);
    }
    setIsModalOpen(false);
  };

  const pageTitle = isAdmin ? "Manage Events" : "Events & Notifications";

  return (
    <div>
      {isModalOpen && onAddEvent && onUpdateEvent && (
        <EventModal 
            event={editingEvent}
            onSave={handleSave}
            onClose={() => setIsModalOpen(false)}
        />
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text-main)' }}>{pageTitle}</h1>
        {isAdmin && (
            <button 
                onClick={handleAdd}
                className="font-semibold py-2 px-4 rounded-lg"
                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-text)' }}
            >
                + Add Event
            </button>
        )}
      </div>
      <div className="max-w-4xl">
        <Card 
            title="Upcoming Events" 
            icon={<BellIcon />}
        >
          <div className="space-y-4">
            {events.length > 0 ? events.map((event) => (
              <div key={event.id} className="p-3 rounded-lg flex justify-between items-start" style={{ backgroundColor: 'rgba(var(--color-text-main-rgb), 0.05)'}}>
                <div>
                    <p className="font-semibold">{event.title} - <span className="text-sm font-normal opacity-70">{event.date}</span></p>
                    <p className="text-sm opacity-90">{event.description}</p>
                </div>
                {isAdmin && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => handleEdit(event)} className="text-sm font-semibold opacity-70 hover:opacity-100" style={{ color: 'var(--color-primary)'}}>
                            Edit
                        </button>
                        <button onClick={() => onDeleteEvent && onDeleteEvent(event.id)} className="text-sm font-semibold text-red-500/70 hover:text-red-500/100">
                            Delete
                        </button>
                    </div>
                )}
              </div>
            )) : (
              <p className="text-center py-8 opacity-70">No upcoming events have been scheduled.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};