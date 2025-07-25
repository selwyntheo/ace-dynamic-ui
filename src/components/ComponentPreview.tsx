import { Box } from '@mui/material';
import type { ComponentType } from '../types';

interface ComponentPreviewProps {
  type: ComponentType;
  size?: number;
}

export function ComponentPreview({ type, size = 40 }: ComponentPreviewProps) {
  const getSvgContent = () => {
    const commonProps = {
      width: size,
      height: size,
      viewBox: "0 0 40 40",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    };

    switch (type) {
      case 'table':
        return (
          <svg {...commonProps}>
            <rect x="4" y="8" width="32" height="24" stroke="black" strokeWidth="1" fill="white"/>
            <line x1="4" y1="14" x2="36" y2="14" stroke="black" strokeWidth="1"/>
            <line x1="4" y1="20" x2="36" y2="20" stroke="black" strokeWidth="1"/>
            <line x1="4" y1="26" x2="36" y2="26" stroke="black" strokeWidth="1"/>
            <line x1="14" y1="8" x2="14" y2="32" stroke="black" strokeWidth="1"/>
            <line x1="26" y1="8" x2="26" y2="32" stroke="black" strokeWidth="1"/>
          </svg>
        );
      
      case 'button':
        return (
          <svg {...commonProps}>
            <rect x="8" y="14" width="24" height="12" rx="2" stroke="black" strokeWidth="1" fill="white"/>
            <rect x="10" y="16" width="20" height="8" fill="black" opacity="0.1"/>
            <text x="20" y="22" textAnchor="middle" fontSize="6" fill="black">BTN</text>
          </svg>
        );
      
      case 'input':
        return (
          <svg {...commonProps}>
            <rect x="6" y="16" width="28" height="8" rx="1" stroke="black" strokeWidth="1" fill="white"/>
            <line x1="8" y1="20" x2="16" y2="20" stroke="black" strokeWidth="0.5" opacity="0.5"/>
          </svg>
        );
      
      case 'text':
        return (
          <svg {...commonProps}>
            <line x1="6" y1="12" x2="30" y2="12" stroke="black" strokeWidth="1"/>
            <line x1="6" y1="16" x2="34" y2="16" stroke="black" strokeWidth="1"/>
            <line x1="6" y1="20" x2="28" y2="20" stroke="black" strokeWidth="1"/>
            <line x1="6" y1="24" x2="32" y2="24" stroke="black" strokeWidth="1"/>
            <line x1="6" y1="28" x2="24" y2="28" stroke="black" strokeWidth="1"/>
          </svg>
        );
      
      case 'card':
        return (
          <svg {...commonProps}>
            <rect x="6" y="8" width="28" height="24" rx="2" stroke="black" strokeWidth="1" fill="white"/>
            <rect x="8" y="10" width="24" height="4" fill="black" opacity="0.1"/>
            <line x1="8" y1="18" x2="20" y2="18" stroke="black" strokeWidth="0.5"/>
            <line x1="8" y1="21" x2="24" y2="21" stroke="black" strokeWidth="0.5"/>
            <line x1="8" y1="24" x2="18" y2="24" stroke="black" strokeWidth="0.5"/>
          </svg>
        );
      
      case 'form':
        return (
          <svg {...commonProps}>
            <rect x="6" y="6" width="28" height="28" rx="2" stroke="black" strokeWidth="1" fill="white"/>
            <rect x="8" y="10" width="20" height="4" rx="1" stroke="black" strokeWidth="0.5" fill="white"/>
            <rect x="8" y="16" width="24" height="4" rx="1" stroke="black" strokeWidth="0.5" fill="white"/>
            <rect x="8" y="22" width="16" height="4" rx="1" stroke="black" strokeWidth="0.5" fill="white"/>
            <rect x="26" y="28" width="8" height="4" rx="1" fill="black" opacity="0.1"/>
          </svg>
        );
      
      case 'checkbox':
        return (
          <svg {...commonProps}>
            <rect x="8" y="16" width="8" height="8" rx="1" stroke="black" strokeWidth="1" fill="white"/>
            <polyline points="10,20 12,22 14,18" stroke="black" strokeWidth="1" fill="none"/>
            <line x1="20" y1="20" x2="32" y2="20" stroke="black" strokeWidth="1"/>
          </svg>
        );
      
      case 'select':
        return (
          <svg {...commonProps}>
            <rect x="6" y="16" width="28" height="8" rx="1" stroke="black" strokeWidth="1" fill="white"/>
            <polygon points="30,18 32,20 30,22" fill="black"/>
            <line x1="8" y1="20" x2="18" y2="20" stroke="black" strokeWidth="0.5" opacity="0.5"/>
          </svg>
        );
      
      case 'bar-chart':
        return (
          <svg {...commonProps}>
            <rect x="8" y="24" width="4" height="8" fill="black" opacity="0.7"/>
            <rect x="14" y="18" width="4" height="14" fill="black" opacity="0.7"/>
            <rect x="20" y="20" width="4" height="12" fill="black" opacity="0.7"/>
            <rect x="26" y="12" width="4" height="20" fill="black" opacity="0.7"/>
            <line x1="6" y1="32" x2="34" y2="32" stroke="black" strokeWidth="1"/>
            <line x1="6" y1="8" x2="6" y2="32" stroke="black" strokeWidth="1"/>
          </svg>
        );
      
      case 'line-chart':
        return (
          <svg {...commonProps}>
            <polyline points="8,28 14,22 20,24 26,16 32,18" stroke="black" strokeWidth="2" fill="none"/>
            <circle cx="8" cy="28" r="1.5" fill="black"/>
            <circle cx="14" cy="22" r="1.5" fill="black"/>
            <circle cx="20" cy="24" r="1.5" fill="black"/>
            <circle cx="26" cy="16" r="1.5" fill="black"/>
            <circle cx="32" cy="18" r="1.5" fill="black"/>
            <line x1="6" y1="32" x2="34" y2="32" stroke="black" strokeWidth="1"/>
            <line x1="6" y1="8" x2="6" y2="32" stroke="black" strokeWidth="1"/>
          </svg>
        );
      
      case 'pie-chart':
        return (
          <svg {...commonProps}>
            <circle cx="20" cy="20" r="12" stroke="black" strokeWidth="1" fill="white"/>
            <path d="M 20 8 A 12 12 0 0 1 32 20 L 20 20 Z" fill="black" opacity="0.3"/>
            <path d="M 20 20 L 32 20 A 12 12 0 0 1 26 30.9 Z" fill="black" opacity="0.6"/>
            <path d="M 20 20 L 26 30.9 A 12 12 0 1 1 20 8 Z" fill="black" opacity="0.2"/>
          </svg>
        );
      
      case 'date-picker':
        return (
          <svg {...commonProps}>
            <rect x="8" y="12" width="24" height="20" rx="1" stroke="black" strokeWidth="1" fill="white"/>
            <rect x="8" y="12" width="24" height="6" fill="black" opacity="0.1"/>
            <line x1="12" y1="10" x2="12" y2="14" stroke="black" strokeWidth="1"/>
            <line x1="28" y1="10" x2="28" y2="14" stroke="black" strokeWidth="1"/>
            <circle cx="14" cy="22" r="1" fill="black"/>
            <circle cx="18" cy="22" r="1" fill="black"/>
            <circle cx="22" cy="22" r="1" fill="black"/>
            <circle cx="26" cy="22" r="1" fill="black"/>
            <circle cx="14" cy="26" r="1" fill="black"/>
            <circle cx="18" cy="26" r="1" fill="black"/>
            <circle cx="22" cy="26" r="1" fill="black"/>
            <circle cx="26" cy="26" r="1" fill="black"/>
          </svg>
        );
      
      case 'switch':
        return (
          <svg {...commonProps}>
            <rect x="12" y="18" width="16" height="4" rx="2" stroke="black" strokeWidth="1" fill="white"/>
            <circle cx="24" cy="20" r="3" fill="black" opacity="0.7"/>
          </svg>
        );
      
      case 'slider':
        return (
          <svg {...commonProps}>
            <line x1="8" y1="20" x2="32" y2="20" stroke="black" strokeWidth="2"/>
            <circle cx="22" cy="20" r="3" fill="black" stroke="white" strokeWidth="1"/>
          </svg>
        );
      
      case 'rating':
        return (
          <svg {...commonProps}>
            <polygon points="12,16 14,20 18,20 15,23 16,27 12,25 8,27 9,23 6,20 10,20" fill="black" opacity="0.7"/>
            <polygon points="20,16 22,20 26,20 23,23 24,27 20,25 16,27 17,23 14,20 18,20" fill="black" opacity="0.3"/>
            <polygon points="28,16 30,20 34,20 31,23 32,27 28,25 24,27 25,23 22,20 26,20" fill="black" opacity="0.1"/>
          </svg>
        );
      
      default:
        // Generic component icon
        return (
          <svg {...commonProps}>
            <rect x="8" y="8" width="24" height="24" rx="2" stroke="black" strokeWidth="1" fill="white"/>
            <rect x="12" y="12" width="16" height="4" fill="black" opacity="0.1"/>
            <line x1="12" y1="20" x2="20" y2="20" stroke="black" strokeWidth="0.5"/>
            <line x1="12" y1="24" x2="24" y2="24" stroke="black" strokeWidth="0.5"/>
            <line x1="12" y1="28" x2="18" y2="28" stroke="black" strokeWidth="0.5"/>
          </svg>
        );
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      width: size,
      height: size,
      filter: 'grayscale(100%)',
      '& svg': {
        transition: 'transform 0.2s ease',
      },
      '&:hover svg': {
        transform: 'scale(1.05)',
      }
    }}>
      {getSvgContent()}
    </Box>
  );
}
