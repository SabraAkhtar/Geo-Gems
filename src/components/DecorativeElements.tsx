import React from 'react';

/**
 * GEO GEMS CRYSTALS — SUBTLE EDITORIAL DECORATIVE ELEMENT SYSTEM
 *
 * Strictly controlled visual system:
 * 1. Thin outline rings / circles (opacity 0.08 – 0.16)
 * 2. Very small decorative dots (opacity 0.20 – 0.35)
 * 3. Subtle dot grids with edge fade (opacity 0.12 – 0.22)
 * 4. Thin elegant lines (opacity 0.15 – 0.30)
 * 5. Open rectangular editorial frame (opacity 0.10 – 0.18, used ONLY in Jewelry section)
 *
 * Palette:
 * - Warm Stone: #F3EFE8
 * - Cream: #FAF8F3
 * - Muted Taupe: #B7AEA2
 * - Soft Sage: #7D8976
 * - Luxury Gold Accent: #B08D57 (used sparingly)
 */

interface OutlineRingProps {
  size?: number;
  color?: '#B7AEA2' | '#7D8976' | '#B08D57' | '#F3EFE8';
  opacity?: number;
  className?: string;
  dashed?: boolean;
}

export const EditorialOutlineRing: React.FC<OutlineRingProps> = ({
  size = 420,
  color = '#B7AEA2',
  opacity = 0.13,
  className = '',
}) => {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none rounded-full ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        border: `1px solid ${color}`,
        opacity,
      }}
    />
  );
};

interface DotGridProps {
  rows?: number;
  cols?: number;
  gap?: number;
  dotSize?: number;
  color?: '#B7AEA2' | '#7D8976' | '#B08D57';
  opacity?: number;
  fadeDirection?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
  className?: string;
}

export const EditorialDotGrid: React.FC<DotGridProps> = ({
  rows = 6,
  cols = 7,
  gap = 18,
  dotSize = 3,
  color = '#B7AEA2',
  opacity = 0.16,
  fadeDirection = 'top-right',
  className = '',
}) => {
  const width = (cols - 1) * gap + dotSize * 2;
  const height = (rows - 1) * gap + dotSize * 2;

  const getDotOpacityFactor = (r: number, c: number) => {
    const normR = r / Math.max(1, rows - 1);
    const normC = c / Math.max(1, cols - 1);

    if (fadeDirection === 'top-right') {
      // Stronger near top-right, gently fading out toward bottom-left and outer edge
      const distFromCorner = Math.sqrt(Math.pow(normR, 2) + Math.pow(1 - normC, 2));
      return Math.max(0.18, 1 - distFromCorner * 0.65);
    }
    if (fadeDirection === 'bottom-right') {
      const distFromCorner = Math.sqrt(Math.pow(1 - normR, 2) + Math.pow(1 - normC, 2));
      return Math.max(0.18, 1 - distFromCorner * 0.65);
    }
    if (fadeDirection === 'top-left') {
      const distFromCorner = Math.sqrt(Math.pow(normR, 2) + Math.pow(normC, 2));
      return Math.max(0.18, 1 - distFromCorner * 0.65);
    }
    const distFromCorner = Math.sqrt(Math.pow(1 - normR, 2) + Math.pow(normC, 2));
    return Math.max(0.18, 1 - distFromCorner * 0.65);
  };

  return (
    <svg
      aria-hidden="true"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={`pointer-events-none select-none ${className}`}
      style={{ opacity }}
    >
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((__, c) => {
          const factor = getDotOpacityFactor(r, c);
          return (
            <circle
              key={`${r}-${c}`}
              cx={dotSize + c * gap}
              cy={dotSize + r * gap}
              r={dotSize / 2}
              fill={color}
              fillOpacity={factor}
            />
          );
        })
      )}
    </svg>
  );
};

interface SmallDotsClusterProps {
  variant?: 'trio-irregular' | 'pair-horizontal' | 'trio-editorial';
  color?: '#B7AEA2' | '#7D8976' | '#B08D57';
  accentColor?: '#B08D57' | '#7D8976' | '#B7AEA2';
  opacity?: number;
  className?: string;
}

export const EditorialSmallDots: React.FC<SmallDotsClusterProps> = ({
  variant = 'trio-irregular',
  color = '#B7AEA2',
  accentColor = '#B08D57',
  opacity = 0.28,
  className = '',
}) => {
  if (variant === 'pair-horizontal') {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none select-none inline-flex items-center gap-3 ${className}`}
        style={{ opacity }}
      >
        <span
          className="w-[3.5px] h-[3.5px] rounded-full inline-block"
          style={{ backgroundColor: color }}
        />
        <span
          className="w-[3px] h-[3px] rounded-full inline-block"
          style={{ backgroundColor: accentColor }}
        />
      </div>
    );
  }

  if (variant === 'trio-editorial') {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none select-none inline-flex items-center ${className}`}
        style={{ opacity }}
      >
        <span
          className="w-[3.5px] h-[3.5px] rounded-full inline-block mr-2.5"
          style={{ backgroundColor: color }}
        />
        <span
          className="w-[3px] h-[3px] rounded-full inline-block mr-4 translate-y-[-2px]"
          style={{ backgroundColor: accentColor }}
        />
        <span
          className="w-[2.5px] h-[2.5px] rounded-full inline-block translate-y-[1.5px]"
          style={{ backgroundColor: color }}
        />
      </div>
    );
  }

  // Default: trio-irregular (controlled asymmetric editorial spacing)
  return (
    <svg
      aria-hidden="true"
      width="44"
      height="26"
      viewBox="0 0 44 26"
      fill="none"
      className={`pointer-events-none select-none ${className}`}
      style={{ opacity }}
    >
      <circle cx="4" cy="14" r="2" fill={color} />
      <circle cx="21" cy="5" r="1.75" fill={accentColor} />
      <circle cx="39" cy="20" r="1.5" fill={color} />
    </svg>
  );
};
