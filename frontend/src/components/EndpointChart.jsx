export default function EndpointChart({ endpoints }) {
  if (!endpoints || endpoints.length === 0) return (
    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px', fontFamily: 'var(--font-mono)' }}>
      NO DATA YET — MAKE SOME API CALLS
    </div>
  );

  const max = Math.max(...endpoints.map(e => parseInt(e.hits)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {endpoints.map((ep, i) => (
        <div key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-primary)' }}>{ep.endpoint}</span>
            <span style={{ color: 'var(--accent-cyan)' }}>{ep.hits} hits</span>
          </div>
          <div style={{ background: 'var(--border)', borderRadius: '1px', height: '6px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(parseInt(ep.hits) / max) * 100}%`,
              background: `linear-gradient(90deg, var(--accent-green), var(--accent-cyan))`,
              borderRadius: '1px',
              transition: 'width 1s ease',
              boxShadow: '0 0 8px rgba(0,255,157,0.5)'
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}