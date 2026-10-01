import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  layout?: 'horizontal' | 'stacked' | 'badge_only' | 'full';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
}) => {
  /*
    xs  = 40px  — narrow mobile header (320–480px)
    sm  = 44px  — tablet header (480–1023px)
    md  = 52px  — desktop header / footer
    lg  = 80px  — large display
    xl  = 112px — hero / splash
  */
  const sizeClasses: Record<string, string> = {
    xs: 'h-10',
    sm: 'h-11',
    md: 'h-13 sm:h-14',
    lg: 'h-20 sm:h-24',
    xl: 'h-28 sm:h-32',
  };

  return (
    <div className={`flex items-center justify-start select-none ${className}`}>
      <img
        src="/logo.png"
        alt="GEO GEMS CRYSTALS"
        className={`${sizeClasses[size] ?? 'h-11'} w-auto object-contain`}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
