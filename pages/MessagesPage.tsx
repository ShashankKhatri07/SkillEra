import React, { useState, useEffect, useRef } from 'react';
import { Student, Message } from '../types';
import { Card } from '../components/Card';
import { validateText } from '../utils/validationUtils';

interface MessagesPageProps {
  currentUser: Student;
  otherUsers: Student[];
  messages: Message[];
  onSendMessage: (receiverId: string, text: string) => void;
}

export const MessagesPage = ({ currentUser, otherUsers, messages, onSendMessage }: MessagesPageProps) => {
  const [selectedContact, setSelectedContact] = useState<Student | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [mobileView, setMobileView] = useState<'contacts' | 'chat'>('contacts');
  const [error, setError] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (otherUsers.length > 0 && !selectedContact) {
      const firstContact = otherUsers.find(u => u.role !== currentUser.role) || otherUsers[0];
      setSelectedContact(firstContact);
    }
  }, [otherUsers, selectedContact, currentUser.role]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedContact]);
  
  useEffect(() => {
    if (!selectedContact) {
        setMobileView('contacts');
    }
  }, [selectedContact]);

  const handleSelectContact = (user: Student) => {
    setSelectedContact(user);
    setMobileView('chat');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateText(newMessage, 'Message');
    if (validationError) {
        setError(validationError);
        return;
    }
    setError('');

    if (newMessage.trim() && selectedContact) {
      onSendMessage(selectedContact.id, newMessage);
      setNewMessage('');
    }
  };

  const conversation = messages.filter(
    m =>
      (m.senderId === currentUser.id && m.receiverId === selectedContact?.id) ||
      (m.senderId === selectedContact?.id && m.receiverId === currentUser.id)
  ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Messages</h1>
      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-12rem)]">
        {/* Contact List */}
        <div className={`w-full md:w-1/3 ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'} flex-col`}>
          <Card title="Contacts" className="h-full flex flex-col">
            <div className="space-y-2 overflow-y-auto pr-2 flex-grow">
              {otherUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => handleSelectContact(user)}
                  className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${selectedContact?.id === user.id ? '' : 'hover:bg-[rgba(var(--color-text-main-rgb),0.05)]'}`}
                  style={{ backgroundColor: selectedContact?.id === user.id ? 'var(--color-primary)' : 'transparent' }}
                >
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <p className="font-semibold" style={{ color: selectedContact?.id === user.id ? 'var(--color-primary-text)' : 'inherit' }}>{user.name}</p>
                    <p className={`text-xs capitalize`} style={{ color: selectedContact?.id === user.id ? 'var(--color-primary-text)' : 'inherit', opacity: selectedContact?.id === user.id ? 0.8 : 0.7 }}>{user.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Chat Window */}
        <div className={`w-full md:w-2/3 ${mobileView === 'contacts' ? 'hidden md:flex' : 'flex'} flex-col`}>
          <Card className="h-full flex flex-col">
            {selectedContact ? (
              <>
                <div className="flex items-center p-4 border-b" style={{ borderColor: 'var(--color-border)'}}>
                  <button onClick={() => setMobileView('contacts')} className="md:hidden mr-3 p-1 rounded-full hover:bg-black/10">
                    &larr;
                  </button>
                  <img src={selectedContact.avatar} alt={selectedContact.name} className="w-10 h-10 rounded-full mr-3" />
                  <h2 className="font-bold text-lg">{selectedContact.name}</h2>
                </div>
                <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                  {conversation.map(msg => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                      {msg.senderId !== currentUser.id && <img src={selectedContact.avatar} alt={selectedContact.name} className="w-6 h-6 rounded-full self-end" />}
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.senderId === currentUser.id ? 'rounded-br-none' : 'rounded-bl-none'}`}
                        style={{
                           backgroundColor: msg.senderId === currentUser.id ? 'var(--color-primary)' : 'rgba(var(--color-text-main-rgb), 0.1)',
                           color: msg.senderId === currentUser.id ? 'var(--color-primary-text)' : 'var(--color-text-main)',
                        }}
                      >
                        <p className="text-sm break-words">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <div className="p-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <form onSubmit={handleSendMessage} className="flex gap-3">
                    <div className="flex-grow">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={e => {
                            setNewMessage(e.target.value)
                            if (error) setError('');
                          }}
                          placeholder="Type a message..."
                          className="w-full rounded-lg p-2 focus:ring-2 focus:border-transparent"
                           style={{'--tw-ring-color': 'var(--color-primary)', backgroundColor: 'rgba(var(--color-text-main-rgb), 0.05)', border: '1px solid var(--color-border)'} as React.CSSProperties}
                        />
                        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                    </div>
                    <button type="submit" className="font-semibold py-2 px-4 rounded-lg" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>Send</button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full opacity-70">
                <p>Select a contact to start chatting.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};