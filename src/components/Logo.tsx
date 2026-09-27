import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  layout?: 'horizontal' | 'stacked' | 'badge_only' | 'full';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-9 sm:h-12',
    md: 'h-14 sm:h-16',
    lg: 'h-20 sm:h-24',
    xl: 'h-28 sm:h-32',
  };

  return (
    <div className={`flex items-center justify-center select-none ${className}`}>
      <img
        src="/logo.png"
        alt="GEO GEMS CRYSTALS Logo"
        className={`${sizeClasses[size]} w-auto object-contain transition-transform duration-300`}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

