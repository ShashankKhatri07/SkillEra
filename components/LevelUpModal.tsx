import React from 'react';
import { Level } from '../types';
import { LevelUpIcon } from './icons/LevelUpIcon';

interface LevelUpModalProps {
  level: Level;
  onClose: () => void;
}

export const LevelUpModal = ({ level, onClose }: LevelUpModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="absolute inset-0 pointer-events-none z-0">
            {Array.from({ length: 30 }).map((_, i) => (
                <div 
                    key={i}
                    className="absolute w-2 h-3 rounded-sm"
                    style={{
                        left: `${Math.random() * 100}%`,
                        animation: `confetti-fall ${3 + Math.random() * 3}s linear ${Math.random() * 5}s infinite`,
                        backgroundColor: i % 2 === 0 ? 'var(--color-accent)' : 'var(--color-accent-secondary)',
                        transform: `rotate(${Math.random() * 360}deg)`
                    }}
                ></div>
            ))}
      </div>
      <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-sm w-full relative overflow-hidden animate-scale-in z-10">
        <div 
            className="absolute top-0 left-0 w-full h-full opacity-10" 
            style={{
                color: 'var(--color-accent-secondary)',
                backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', 
                backgroundSize: '16px 16px'
            }}>
        </div>

        <div className="relative z-10">
          <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--color-accent-secondary)' }}>Level Up!</h2>
          <div className="my-6 flex justify-center">
            <div className="relative">
                <div style={{ color: 'var(--color-accent-secondary)' }}>
                  <LevelUpIcon className="w-24 h-24 drop-shadow-lg" />
                </div>
                <span className="absolute -bottom-2 -right-2 text-white text-xl font-bold rounded-full w-12 h-12 flex items-center justify-center border-4 border-white" style={{ backgroundColor: 'var(--color-accent-secondary)' }}>{level.level}</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold" style={{ color: 'var(--color-text-main)' }}>You've reached Level {level.level}</h3>
          <p className="mt-2" style={{ color: 'rgba(var(--color-text-main-rgb), 0.7)' }}>Your new title: <span className="font-bold" style={{ color: 'var(--color-text-main)' }}>{level.name}</span></p>
          <button
            onClick={onClose}
            className="mt-8 w-full text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform active:scale-95 duration-200 animate-shiny"
            style={{ backgroundColor: 'var(--color-accent-secondary)', color: 'var(--color-text-main)', '--tw-ring-color': 'var(--color-accent-secondary)' } as React.CSSProperties}
          >
            Awesome!
          </button>
        </div>
      </div>
    </div>
  );
};
