import { useEffect, useState } from 'react';

export default function StatCard({ label, value, unit = '', accent = '#00ff9d', icon }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (typeof value !== 'number') return;
    let start = 0;
    const step = Math.ceil(value / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplayed(value); clearInterval(timer); }
      else setDisplayed(start);
    }, 30);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: `1px solid var(--border)`,
      borderTop: `2px solid ${accent}`,
      borderRadius: '2px',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.2s',
      cursor: 'default',
    }}
    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
        background: `radial-gradient(ellipse at top right, ${accent}08, transparent 60%)`,
        pointerEvents: 'none'
      }} />
      <div style={{ fontSize: '11px', letterSpacing: '3px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>
        {icon} {label}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '42px', color: accent, lineHeight: 1, letterSpacing: '-1px' }}>
        {typeof value === 'number' ? displayed.toLocaleString() : value}
        <span style={{ fontSize: '16px', marginLeft: '6px', color: 'var(--text-muted)' }}>{unit}</span>
      </div>
    </div>
  );
}