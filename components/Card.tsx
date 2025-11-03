import React from 'react';

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
}

export const Card = ({ children, className = '', title, icon, style, titleStyle }: CardProps) => {
  return (
    <div className={`rounded-2xl shadow-sm p-6 border-t-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${className}`} style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-accent-secondary)', ...style }}>
      {title && (
        <div className="flex items-center mb-4">
          {icon && <div className="mr-3" style={{ color: 'var(--color-text-main)' }}>{icon}</div>}
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-main)', ...titleStyle }}>{title}</h2>
        </div>
      )}
      <div className="h-full">
        {children}
      </div>
    </div>
  );
};