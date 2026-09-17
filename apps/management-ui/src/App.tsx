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

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
    <div className="app-container flex flex-col md:flex-row relative min-h-screen">
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center p-4 border-b border-[var(--border-color)] bg-[var(--bg-sidebar)]">
        <h2 style={{ letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>GOA</h2>
        <button className="p-2" onClick={() => setIsDrawerOpen(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isDrawerOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        sidebar w-[280px] md:w-[260px] 
        h-full md:h-screen md:sticky md:top-0 
        border-r border-[var(--border-color)]
        fixed md:relative z-50
        top-0 left-0
        transform transition-transform duration-300 ease-in-out
        ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-8)' }}>
          <div>
            <h2 style={{ letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>GOA</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)' }}>ADMINISTRATOR</span>
          </div>
          <button className="md:hidden p-2 text-[var(--text-secondary)]" onClick={() => setIsDrawerOpen(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <nav className="flex flex-col gap-2 overflow-y-auto pb-4 hide-scrollbar">
          {['Dashboard', 'Tables', 'Reservations', 'POS & Tables', 'Inventory', 'Customers'].map((item) => (
            <button 
              key={item} 
              className="btn whitespace-nowrap" 
              style={{ 
                justifyContent: 'flex-start', 
                backgroundColor: activeTab === item ? 'var(--bg-card)' : 'transparent', 
                color: activeTab === item ? 'var(--accent-gold)' : 'var(--text-secondary)' 
              }}
              onClick={() => {
                setActiveTab(item);
                setIsDrawerOpen(false);
              }}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="md:block mt-auto pt-4 border-t border-[var(--border-color)]">
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
