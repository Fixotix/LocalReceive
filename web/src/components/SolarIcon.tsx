import React from 'react';

export type SolarIconName =
  | 'wifi'
  | 'smartphone'
  | 'laptop'
  | 'monitor'
  | 'cloud'
  | 'shield-check'
  | 'zap'
  | 'copy'
  | 'check'
  | 'qrcode'
  | 'clipboard'
  | 'history'
  | 'download'
  | 'upload'
  | 'sun'
  | 'moon'
  | 'settings'
  | 'close'
  | 'lock'
  | 'folder'
  | 'file'
  | 'arrow-right'
  | 'bell'
  | 'radio'
  | 'heart';

interface SolarIconProps {
  name: SolarIconName;
  size?: number;
  className?: string;
  color?: string;
  secondaryOpacity?: number;
}

export const SolarIcon: React.FC<SolarIconProps> = ({
  name,
  size = 24,
  className = '',
  color = 'currentColor',
  secondaryOpacity = 0.35,
}) => {
  const renderPaths = () => {
    switch (name) {
      case 'heart':
        return (
          <>
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill={color}
              opacity={secondaryOpacity + 0.3}
            />
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              stroke={color}
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </>
        );

      case 'wifi':
        return (
          <>
            <circle cx="12" cy="18" r="1.5" fill={color} />
            <path
              d="M7.76 12.24a6 6 0 0 1 8.48 0"
              stroke={color}
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity={secondaryOpacity + 0.3}
            />
            <path
              d="M4.93 9.41a10 10 0 0 1 14.14 0"
              stroke={color}
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity={secondaryOpacity}
            />
            <path
              d="M2.1 6.58a14 14 0 0 1 19.8 0"
              stroke={color}
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity={secondaryOpacity * 0.7}
            />
          </>
        );

      case 'smartphone':
        return (
          <>
            <rect
              x="5"
              y="2"
              width="14"
              height="20"
              rx="4"
              fill={color}
              opacity={secondaryOpacity}
            />
            <rect
              x="5"
              y="2"
              width="14"
              height="20"
              rx="4"
              stroke={color}
              strokeWidth="2"
            />
            <circle cx="12" cy="18" r="1.2" fill={color} />
            <path
              d="M10 5h4"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </>
        );

      case 'laptop':
        return (
          <>
            <rect
              x="3"
              y="4"
              width="18"
              height="12"
              rx="2.5"
              fill={color}
              opacity={secondaryOpacity}
            />
            <rect
              x="3"
              y="4"
              width="18"
              height="12"
              rx="2.5"
              stroke={color}
              strokeWidth="2"
            />
            <path
              d="M1 19h22c0-1.5-1.5-2-3-2H4c-1.5 0-3 .5-3 2Z"
              fill={color}
            />
          </>
        );

      case 'monitor':
        return (
          <>
            <rect
              x="2"
              y="3"
              width="20"
              height="13"
              rx="3"
              fill={color}
              opacity={secondaryOpacity}
            />
            <rect
              x="2"
              y="3"
              width="20"
              height="13"
              rx="3"
              stroke={color}
              strokeWidth="2"
            />
            <path d="M12 16v5" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
            <path d="M8 21h8" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          </>
        );

      case 'zap':
        return (
          <>
            <polygon
              points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
              fill={color}
              opacity={secondaryOpacity}
            />
            <polygon
              points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
              stroke={color}
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </>
        );

      case 'shield-check':
        return (
          <>
            <path
              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              fill={color}
              opacity={secondaryOpacity}
            />
            <path
              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              stroke={color}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="m9 12 2 2 4-4"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        );

      case 'copy':
        return (
          <>
            <rect
              x="8"
              y="8"
              width="13"
              height="13"
              rx="3"
              fill={color}
              opacity={secondaryOpacity}
            />
            <rect
              x="8"
              y="8"
              width="13"
              height="13"
              rx="3"
              stroke={color}
              strokeWidth="2"
            />
            <path
              d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </>
        );

      case 'check':
        return (
          <>
            <circle cx="12" cy="12" r="10" fill={color} opacity={secondaryOpacity} />
            <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
            <path
              d="m8.5 12 2.5 2.5 5-5"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        );

      case 'qrcode':
        return (
          <>
            <rect x="3" y="3" width="7" height="7" rx="1.5" fill={color} />
            <rect x="14" y="3" width="7" height="7" rx="1.5" fill={color} />
            <rect x="3" y="14" width="7" height="7" rx="1.5" fill={color} />
            <rect
              x="4.5"
              y="4.5"
              width="4"
              height="4"
              rx="0.5"
              fill="#000"
              opacity="0.3"
            />
            <rect
              x="15.5"
              y="4.5"
              width="4"
              height="4"
              rx="0.5"
              fill="#000"
              opacity="0.3"
            />
            <rect
              x="4.5"
              y="15.5"
              width="4"
              height="4"
              rx="0.5"
              fill="#000"
              opacity="0.3"
            />
            <circle cx="17.5" cy="17.5" r="3.5" fill={color} opacity={secondaryOpacity + 0.3} />
          </>
        );

      case 'clipboard':
        return (
          <>
            <rect
              x="4"
              y="4"
              width="16"
              height="18"
              rx="3"
              fill={color}
              opacity={secondaryOpacity}
            />
            <rect
              x="4"
              y="4"
              width="16"
              height="18"
              rx="3"
              stroke={color}
              strokeWidth="2"
            />
            <path
              d="M9 3h6a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
              fill={color}
            />
            <path
              d="M8 11h8M8 15h5"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </>
        );

      case 'history':
        return (
          <>
            <circle cx="12" cy="12" r="9" fill={color} opacity={secondaryOpacity} />
            <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
            <polyline
              points="12 7 12 12 15 14"
              stroke={color}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </>
        );

      case 'download':
        return (
          <>
            <path
              d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
              stroke={color}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M12 3v11m0 0-4-4m4 4 4-4"
              stroke={color}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect x="6" y="18" width="12" height="2" rx="1" fill={color} opacity={secondaryOpacity} />
          </>
        );

      case 'upload':
        return (
          <>
            <path
              d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
              stroke={color}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M12 14V3m0 0-4 4m4-4 4 4"
              stroke={color}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect x="6" y="18" width="12" height="2" rx="1" fill={color} opacity={secondaryOpacity} />
          </>
        );

      case 'sun':
        return (
          <>
            <circle cx="12" cy="12" r="5" fill={color} opacity={secondaryOpacity + 0.2} />
            <circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2" />
            <path
              d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </>
        );

      case 'moon':
        return (
          <>
            <path
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
              fill={color}
              opacity={secondaryOpacity}
            />
            <path
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
              stroke={color}
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </>
        );

      case 'settings':
        return (
          <>
            <circle cx="12" cy="12" r="3" fill={color} opacity={secondaryOpacity + 0.3} />
            <path
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
              stroke={color}
              strokeWidth="2"
              fill={color}
              fillOpacity={secondaryOpacity * 0.5}
            />
          </>
        );

      case 'close':
        return (
          <>
            <circle cx="12" cy="12" r="10" fill={color} opacity={secondaryOpacity} />
            <path d="m15 9-6 6M9 9l6 6" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          </>
        );

      case 'arrow-right':
        return (
          <>
            <circle cx="12" cy="12" r="10" fill={color} opacity={secondaryOpacity} />
            <path d="M9 12h6M12 8l4 4-4 4" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </>
        );

      case 'radio':
      default:
        return (
          <>
            <circle cx="12" cy="12" r="4" fill={color} />
            <circle cx="12" cy="12" r="8" stroke={color} strokeWidth="2" opacity={secondaryOpacity + 0.2} />
            <circle cx="12" cy="12" r="11" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" opacity={secondaryOpacity} />
          </>
        );
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none ${className}`}
    >
      {renderPaths()}
    </svg>
  );
};
