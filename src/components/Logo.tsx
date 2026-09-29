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
    sm: 'h-12',
    md: 'h-14 sm:h-16',
    lg: 'h-20 sm:h-24',
    xl: 'h-28 sm:h-32',
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
