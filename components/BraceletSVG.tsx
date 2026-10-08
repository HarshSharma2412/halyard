import type { Product } from '@/lib/types';

interface BraceletSVGProps {
  finishId: string;
  size?: number;
  type?: string;
  product?: Product | { type: string };
}

const GRADIENTS: Record<string, { stops: string[] }> = {
  silver: { stops: ['#e8eaf0', '#a0a8b8', '#d0d4de'] },
  gold: { stops: ['#f5d98e', '#b8942a', '#f0c94c'] },
  black: { stops: ['#555', '#111', '#333'] },
};

export function BraceletSVG({ finishId, size = 120, type = 'chain', product }: BraceletSVGProps) {
  const actualType = product?.type ?? type;
  const g = GRADIENTS[finishId] ?? GRADIENTS.silver;
  const id = `grad-${finishId}-${size}`;
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const strokeW = size * 0.06;

  if (actualType === 'cuff') {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            {g.stops.map((s, i) => (
              <stop key={i} offset={`${i * 50}%`} stopColor={s} />
            ))}
          </linearGradient>
        </defs>
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={strokeW}
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Chain bracelet: circular ring with small oval links
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          {g.stops.map((s, i) => (
            <stop key={i} offset={`${i * 50}%`} stopColor={s} />
          ))}
        </linearGradient>
      </defs>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth={strokeW}
        strokeDasharray={`${size * 0.12} ${size * 0.04}`}
        strokeLinecap="round"
      />
    </svg>
  );
}
