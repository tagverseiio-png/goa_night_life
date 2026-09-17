import { useState } from 'react';
import './index.css';

const DUMMY_TABLES = [
  { id: '1', name: 'VIP 1', capacity: 8, status: 'OCCUPIED' },
  { id: '2', name: 'VIP 2', capacity: 8, status: 'AVAILABLE' },
  { id: '3', name: 'Main 1', capacity: 4, status: 'RESERVED' },
  { id: '4', name: 'Main 2', capacity: 4, status: 'AVAILABLE' },
  { id: '5', name: 'Main 3', capacity: 6, status: 'PAID' },
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');

  if (!isAuthenticated) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
            <h1 style={{ letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 'var(--space-1)' }}>GOA</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Management Operations</p>
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); setIsAuthenticated(true); }}>
            <div className="form-group">
              <label className="form-label">Employee ID / Email</label>
              <input type="text" className="form-input" placeholder="admin@goa.com" />
            </div>

            <div className="form-group" style={{ marginBottom: 'var(--space-6)' }}>
              <label className="form-label">Password</label>
              <input type="password" className="form-input" placeholder="••••••••" />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 'var(--space-3)' }}>
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (activeTab === 'Dashboard') {
      return (
        <div>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
            <h1>Today's Overview</h1>
            <div style={{ color: 'var(--text-secondary)' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-6)' }}>
            <div className="card">
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-2)' }}>Total Revenue</div>
              <h2>S$ 0.00</h2>
            </div>
            <div className="card">
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-2)' }}>Occupied Tables</div>
              <h2>0 / 45</h2>
            </div>
            <div className="card">
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-2)' }}>Expected Arrivals</div>
              <h2>12</h2>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'Tables') {
      return (
        <div>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
            <div>
              <h2>Floor Plan</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Real-time table status and POS</p>
            </div>
            <button className="btn btn-primary">+ Walk-in Table</button>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-6)' }}>
            {DUMMY_TABLES.map(table => (
              <div key={table.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>{table.name}</h3>
                  <span className="badge" style={{ fontSize: '0.75rem', padding: 'var(--space-1) var(--space-2)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-card)', color: 'var(--accent-gold)' }}>{table.status}</span>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  <p>Capacity: {table.capacity}</p>
                </div>
                <div>
                  <button className="btn btn-secondary" style={{ width: '100%', backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>Open POS</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
          <div>
            <h2>{activeTab}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Manage {activeTab.toLowerCase()}</p>
          </div>
        </header>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-secondary)' }}>
          <p>Module in development...</p>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container flex flex-col md:flex-row">
      <aside className="sidebar w-full md:w-[260px] md:h-screen md:sticky md:top-0 border-b md:border-b-0 md:border-r">
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>GOA</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)' }}>ADMINISTRATOR</span>
        </div>
        
        <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 hide-scrollbar" style={{ flexWrap: 'nowrap' }}>
          {['Dashboard', 'Tables', 'Reservations', 'POS & Tables', 'Inventory', 'Customers'].map((item) => (
            <button 
              key={item} 
              className="btn whitespace-nowrap" 
              style={{ 
                justifyContent: 'flex-start', 
                backgroundColor: activeTab === item ? 'var(--bg-card)' : 'transparent', 
                color: activeTab === item ? 'var(--accent-gold)' : 'var(--text-secondary)' 
              }}
              onClick={() => setActiveTab(item)}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="hidden md:block mt-auto">
          <button 
            className="btn" 
            style={{ width: '100%', justifyContent: 'flex-start', backgroundColor: 'transparent', color: 'var(--accent-red)' }}
            onClick={() => setIsAuthenticated(false)}
          >
            Sign Out
          </button>
        </div>
      </aside>

      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
