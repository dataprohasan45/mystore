import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', showText = true, size = 'md' }) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const titleSizes = {
    sm: 'text-base font-bold',
    md: 'text-xl font-black',
    lg: 'text-3xl font-black',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Bangladesh Green & Red Brand Icon */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center shrink-0 shadow-sm rounded-xl overflow-hidden bg-gradient-to-br from-green-700 via-green-800 to-green-950 p-1.5 border border-green-600/30`}>
        {/* Red circle accent resembling the Bangladesh red sun */}
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-700 rounded-full shadow-md animate-pulse" />
        
        {/* Shopping bag / Store crest */}
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white relative z-10 drop-shadow">
          <path
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="15" r="2" fill="#ef4444" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={`tracking-tight text-gray-950 flex items-center gap-1.5 ${titleSizes[size]}`}>
            <span>My Store</span>
            <span className="text-red-600 bg-red-50 px-1.5 py-0.5 rounded text-sm font-extrabold border border-red-200">
              SITE
            </span>
          </span>
          <span className="text-[10px] font-semibold text-green-700 tracking-wider uppercase">
            কিশোরগঞ্জ ও কিরাটন হাব
          </span>
        </div>
      )}
    </div>
  );
};
