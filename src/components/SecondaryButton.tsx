import React from 'react';

export interface SecondaryButtonProps {
  icon: React.ReactNode;
  text: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  href?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
  title?: string;
  className?: string;
  wide?: boolean;
  size?: 'md' | 'sm';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

/**
 * GEO GEMS CRYSTALS — Secondary Action Button
 * Compact Soft Sage (#7D8976) circle expanding into an elegant rounded capsule on hover.
 */
export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  icon,
  text,
  onClick,
  href,
  target,
  rel,
  ariaLabel,
  title,
  className = '',
  wide = false,
  size = 'md',
  type = 'button',
  disabled = false,
}) => {
  const isWide = wide || text.length >= 8;
  const sizeClass = size === 'sm' ? 'sm' : '';
  const combinedClass = `secondary-button ${sizeClass} ${isWide ? 'wide' : ''} ${className}`.replace(/\s+/g, ' ').trim();
  const accessibleLabel = ariaLabel || title || text;

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
        onClick={onClick as any}
        className={combinedClass}
        aria-label={accessibleLabel}
        title={title || text}
      >
        <span className="sign" aria-hidden="true">
          {icon}
        </span>
        <span className="text" aria-hidden="true">
          {text}
        </span>
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick as any}
      disabled={disabled}
      className={combinedClass}
      aria-label={accessibleLabel}
      title={title || text}
    >
      <span className="sign" aria-hidden="true">
        {icon}
      </span>
      <span className="text" aria-hidden="true">
        {text}
      </span>
    </button>
  );
};
