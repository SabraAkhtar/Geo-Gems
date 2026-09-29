import React from 'react';

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
  // Navbar: sm = 40px, md = 48px
  // Footer: md = 64px
  const sizeClasses = {
    sm: 'h-10',
    md: 'h-12 sm:h-14',
    lg: 'h-16 sm:h-20',
    xl: 'h-24 sm:h-28',
  };

  return (
    <div className={`flex items-center justify-center select-none ${className}`}>
      <img
        src="/logo.png"
        alt="GEO GEMS CRYSTALS"
        className={`${sizeClasses[size]} w-auto object-contain`}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
