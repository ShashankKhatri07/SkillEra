import React from 'react';
import { Badge } from '../types';

interface NewBadgeUnlockedModalProps {
  badge: Badge;
  onClose: () => void;
}

export const NewBadgeUnlockedModal = ({ badge, onClose }: NewBadgeUnlockedModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
       <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Confetti */}
            {Array.from({ length: 30 }).map((_, i) => (
                <div 
                    key={`confetti-${i}`}
                    className="absolute w-2 h-3 rounded-sm"
                    style={{
                        left: `${Math.random() * 100}%`,
                        animation: `confetti-fall ${3 + Math.random() * 3}s linear ${Math.random() * 5}s infinite`,
                        backgroundColor: i % 2 === 0 ? 'var(--color-accent)' : 'var(--color-accent-secondary)',
                        transform: `rotate(${Math.random() * 360}deg)`
                    }}
                ></div>
            ))}
            {/* Balloons */}
            {Array.from({ length: 15 }).map((_, i) => {
                const color = i % 3 === 0 ? 'var(--color-accent)' : i % 3 === 1 ? 'var(--color-accent-secondary)' : 'var(--color-primary)';
                const size = 3 + Math.random() * 3; // size in rem
                return (
                    <div 
                        key={`balloon-${i}`}
                        className="absolute bottom-[-10rem] rounded-full"
                        style={{
                            left: `${5 + Math.random() * 90}%`,
                            width: `${size}rem`,
                            height: `${size * 1.2}rem`,
                            backgroundColor: color,
                            animation: `balloon-rise ${5 + Math.random() * 5}s ease-in-out ${0.1 + (Math.random() * 1.5)}s forwards`,
                            opacity: 0.7
                        }}
                    >
                      <div 
                        className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-x-[6px] border-x-transparent border-t-[10px]"
                        style={{ borderTopColor: color, filter: 'brightness(0.8)' }} 
                      />
                    </div>
                );
            })}
        </div>

      <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-sm w-full relative overflow-hidden animate-scale-in z-10">
        <div 
          className="absolute top-0 left-0 w-full h-full opacity-10" 
          style={{
            color: 'var(--color-primary)',
            backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', 
            backgroundSize: '16px 16px'
          }}>
        </div>

        <div className="relative z-10">
          <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--color-primary)' }}>New Badge Unlocked!</h2>
          <div className="my-6 flex justify-center">
            <div className="animate-icon-pop-in" style={{ color: 'var(--color-primary)', opacity: 0 }}>
              <badge.icon className="w-24 h-24 drop-shadow-lg" />
            </div>
          </div>
          <h3 className="text-2xl font-bold" style={{ color: 'var(--color-text-main)' }}>{badge.name}</h3>
          <p className="mt-2" style={{ color: 'rgba(var(--color-text-main-rgb), 0.7)' }}>{badge.description}</p>
          <button
            onClick={onClose}
            className="mt-8 w-full text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform active:scale-95 duration-200"
            style={{ backgroundColor: 'var(--color-primary)', '--tw-ring-color': 'var(--color-primary)' } as React.CSSProperties}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};