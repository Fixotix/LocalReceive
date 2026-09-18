import React from 'react';

interface GlassSurfaceProps {
  children?: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  showHighlight?: boolean;
  onClick?: () => void;
  isDark?: boolean;
}

export const GlassSurface: React.FC<GlassSurfaceProps> = ({
  children,
  className = '',
  intensity = 'medium',
  showHighlight = true,
  onClick,
  isDark = true,
}) => {
  const darkIntensityClasses = {
    low: 'backdrop-blur-md bg-[#1C1C1E]/50 border-white/[0.08] shadow-lg',
    medium: 'backdrop-blur-xl bg-[#1C1C1E]/70 border-white/[0.14] shadow-glass',
    high: 'backdrop-blur-2xl bg-[#1C1C1E]/85 border-white/[0.18] shadow-2xl',
  };

  const lightIntensityClasses = {
    low: 'backdrop-blur-md bg-white/65 border-black/[0.06] shadow-sm text-[#1C1C1E]',
    medium: 'backdrop-blur-xl bg-white/80 border-black/[0.09] shadow-md text-[#1C1C1E]',
    high: 'backdrop-blur-2xl bg-white/92 border-black/[0.12] shadow-xl text-[#1C1C1E]',
  };

  const intensityClass = isDark ? darkIntensityClasses[intensity] : lightIntensityClasses[intensity];

  return (
    <div
      onClick={onClick}
      className={`relative rounded-apple-2xl transition-colors duration-200 overflow-hidden ${intensityClass} ${className}`}
    >
      {/* Specular top highlight reflection line */}
      {showHighlight && (
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-[1.5px] ${
            isDark
              ? 'bg-gradient-to-r from-transparent via-white/25 to-transparent'
              : 'bg-gradient-to-r from-transparent via-white/80 to-transparent'
          }`}
        />
      )}
      {children}
    </div>
  );
};
