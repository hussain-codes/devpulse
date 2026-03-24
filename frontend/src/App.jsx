import { useEffect, useState } from 'react';
import StatCard from './components/StatCard';
import EndpointChart from './components/EndpointChart';
import RequestFeed from './components/RequestFeed';
import './index.css';

const API = 'http://34.68.86.126:5000/api';
function PulseDot() {
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: '10px', height: '10px', marginRight: '8px' }}>
      <span style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'var(--accent-green)',
        animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite',
        opacity: 0.4
      }} />
      <span style={{ position: 'absolute', inset: '2px', borderRadius: '50%', background: 'var(--accent-green)' }} />
    </span>
  );
}

function Card({ title, children, accent = 'var(--accent-green)' }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: '2px', overflow: 'hidden'
    }}>
      <div style={{
        padding: '14px 20px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: '8px'
      }}>
        <div style={{ width: '3px', height: '16px', background: accent, borderRadius: '1px' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '3px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{title}</span>
      </div>
      <div style={{ padding: '20px' }}>{children}</div>
    </div>
  );
}

export default function App() {
  const [stats, setStats] = useState(null);
  const [health, setHealth] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async () => {
    try {
      const [s, h] = await Promise.all([
        fetch(`${API}/stats`).then(r => r.json()),
        fetch(`${API}/health`).then(r => r.json()),
      ]);
      setStats(s);
      setHealth(h);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (e) {
      console.error('API unreachable', e);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (s) => {
    if (!s) return '0s';
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${sec}s`;
    return `${sec}s`;
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <style>{`
        @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
      `}</style>

      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--border)',
        padding: '0 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '60px', position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(6,9,16,0.9)', backdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: '20px', letterSpacing: '-0.5px' }}>
            DEV<span style={{ color: 'var(--accent-green)' }}>PULSE</span>
          </div>
          <div style={{ width: '1px', height: '20px', background: 'var(--border)' }} />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '2px' }}>
            API MONITOR
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
          {health && (
            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--accent-green)' }}>
              <PulseDot /> LIVE
            </div>
          )}
          {lastUpdated && <span style={{ color: 'var(--text-muted)' }}>UPDATED {lastUpdated}</span>}
        </div>
      </header>

      {/* Main */}
      <main style={{ padding: '32px 40px', maxWidth: '1400px', margin: '0 auto' }}>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <StatCard label="Total Requests" value={stats?.total_requests ?? 0} accent="var(--accent-green)" icon="⬡" />
          <StatCard label="Uptime" value={formatUptime(health?.uptime)} accent="var(--accent-cyan)" icon="◈" />
          <StatCard label="Avg Response" value={stats?.avg_response_time ?? 0} unit="ms" accent="var(--accent-orange)" icon="◎" />
          <StatCard label="Endpoints" value={stats?.endpoints?.length ?? 0} accent="#aa88ff" icon="◇" />
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <Card title="Endpoint Hit Distribution" accent="var(--accent-cyan)">
            <EndpointChart endpoints={stats?.endpoints} />
          </Card>
          <Card title="Server Info" accent="var(--accent-green)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              {[
                ['STATUS', health ? '● OPERATIONAL' : '○ OFFLINE', health ? 'var(--accent-green)' : 'var(--accent-orange)'],
                ['UPTIME', formatUptime(health?.uptime), 'var(--accent-cyan)'],
                ['TOTAL HITS', (stats?.total_requests ?? 0).toLocaleString(), 'var(--text-primary)'],
                ['AVG LATENCY', `${stats?.avg_response_time ?? 0}ms`, 'var(--accent-orange)'],
                ['REFRESH', 'EVERY 5s', 'var(--text-muted)'],
              ].map(([k, v, c]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '14px' }}>
                  <span style={{ color: 'var(--text-muted)', letterSpacing: '2px', fontSize: '11px' }}>{k}</span>
                  <span style={{ color: c }}>{v}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Request Feed */}
        <Card title="Live Request Feed" accent="var(--accent-orange)">
          <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 50px 60px', gap: '12px', padding: '0 12px 10px', borderBottom: '1px solid var(--border)', marginBottom: '8px' }}>
            {['METHOD', 'ENDPOINT', 'STATUS', 'TIME'].map(h => (
              <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', color: 'var(--text-muted)' }}>{h}</span>
            ))}
          </div>
          <RequestFeed requests={stats?.recent} />
        </Card>
      </main>
    </div>
  );
}