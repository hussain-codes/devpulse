export default function RequestFeed({ requests }) {
  const methodColor = { GET: '#00ff9d', POST: '#00d4ff', PUT: '#ff6b35', DELETE: '#ff4466', PATCH: '#aa88ff' };

  if (!requests || requests.length === 0) return (
    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px', fontFamily: 'var(--font-mono)' }}>
      WAITING FOR REQUESTS...
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {requests.map((req, i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: '60px 1fr 50px 60px',
          gap: '12px', padding: '10px 12px',
          background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
          borderRadius: '2px', fontFamily: 'var(--font-mono)', fontSize: '12px',
          alignItems: 'center',
          animation: 'fadeIn 0.3s ease',
        }}>
          <span style={{ color: methodColor[req.method] || '#fff', fontWeight: 'bold' }}>{req.method}</span>
          <span style={{ color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.endpoint}</span>
          <span style={{ color: req.status_code < 400 ? 'var(--accent-green)' : 'var(--accent-orange)' }}>{req.status_code}</span>
          <span style={{ color: 'var(--text-muted)', textAlign: 'right' }}>{req.response_time}ms</span>
        </div>
      ))}
    </div>
  );
}