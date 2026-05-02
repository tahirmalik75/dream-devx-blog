// components/ads/AdSlot.tsx
'use client';

import { useEffect, useRef } from 'react';

interface AdSlotProps {
  publisherId: string;
  slot: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  responsive?: boolean;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdSlot({
  publisherId,
  slot,
  format = 'auto',
  responsive = true,
  className = '',
}: AdSlotProps) {
  const ref    = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    // Only run in production when publisher ID is configured
    if (!publisherId || !slot || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {}
  }, [publisherId, slot]);

  // Dev / unconfigured: show placeholder
  if (!publisherId || !slot || process.env.NODE_ENV !== 'production') {
    return (
      <div className={`ad-slot ${className}`}>
        <span>Ad — {format}</span>
      </div>
    );
  }

  return (
    <ins
      ref={ref}
      className={`adsbygoogle ${className}`}
      style={{ display: 'block' }}
      data-ad-client={`ca-${publisherId}`}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? 'true' : 'false'}
    />
  );
}
