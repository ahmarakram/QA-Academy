'use client';

import Image from 'next/image';

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 40, showText = false, className }: LogoProps) {
  return (
    <div className={className} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Image
        src="/favicon.svg"
        alt="QA Academy"
        width={size}
        height={size}
        style={{ flexShrink: 0 }}
      />
      {showText && (
        <div style={{
          fontWeight: 800,
          fontSize: size * 0.38,
          color: '#f1f5f9',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
        }}>QA Academy</div>
      )}
    </div>
  );
}
