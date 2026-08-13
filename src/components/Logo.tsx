import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ className = '', size = 'md', showText = true }: LogoProps) {
  const sizeMap = {
    sm: { img: 'h-10 w-auto', text: 'text-base', sub: 'text-[9px]' },
    md: { img: 'h-14 w-auto', text: 'text-xl', sub: 'text-[11px]' },
    lg: { img: 'h-24 w-auto', text: 'text-3xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 font-bold select-none ${className}`}>
      {/* Official Geleia Barber Club Logo Image */}
      <div className="relative shrink-0 flex items-center justify-center">
        <img
          src="/logogeleia.png"
          alt="Geleia Barber Club Logo"
          className={`${currentSize.img} object-contain filter drop-shadow-[0_0_12px_rgba(220,38,38,0.5)]`}
        />
      </div>

      {showText && (
        <div className="flex flex-col tracking-wider">
          <span className={`${currentSize.text} font-black text-white leading-none tracking-widest uppercase`}>
            GELEIA
          </span>
          <div className="flex items-center gap-1 my-0.5">
            <span className="h-[1px] flex-1 bg-brand-red/60"></span>
            <span className={`${currentSize.sub} font-semibold text-brand-red tracking-[0.25em] uppercase`}>
              BARBER CLUB
            </span>
            <span className="h-[1px] flex-1 bg-brand-red/60"></span>
          </div>
        </div>
      )}
    </div>
  );
}
