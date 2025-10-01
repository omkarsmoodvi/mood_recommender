import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';

const APPS = [
  { name: 'Ajio', icon: '/icons/ajio.png' },
  { name: 'Amazon', icon: '/icons/amazon.png' },
  { name: 'Flipkart', icon: '/icons/flipkart.svg' },
  { name: 'Google', icon: '/icons/google.svg' },
  { name: 'Instagram', icon: '/icons/instagram.svg' },
  { name: 'Meesho', icon: '/icons/meesho.png' },
  { name: 'Myntra', icon: '/icons/myntra.png' },
  { name: 'Netflix', icon: '/icons/netflix.svg' },
  { name: 'Nykaa', icon: '/icons/nykaa.jpg' },
  { name: 'Prime Video', icon: '/icons/primevideo.png' },
  { name: 'Spotify', icon: '/icons/spotify.svg' },
  { name: 'YouTube', icon: '/icons/youtube.svg' },
];

const TABS = ['Music', 'Reels', 'Videos', 'Products'];

const Dashboard: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState(TABS);
  const [profileOpen, setProfileOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [loginApp, setLoginApp] = useState<string | null>(null);
  const isDark = theme === 'dark';

  return (
    <div className={isDark ? 'dashboard-container dark' : 'dashboard-container light'}>
      {/* Theme toggle and profile icon row */}
      <div className="header-bar">
        <button className="theme-toggle" onClick={() => setTheme(isDark ? 'light' : 'dark')}>
          Switch to {isDark ? 'Light' : 'Dark'} Mode
        </button>
        <div className="user-avatar" onClick={() => setProfileOpen(true)}>
          <FaUserCircle className="mini-profile-icon" />
        </div>
      </div>
      {/* Search bar */}
      <div style={{ width: '100%', margin: '20px 0' }}>
        <input
          type="text"
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="dashboard-search"
        />
      </div>
      {/* Tabs */}
      <div className="dashboard-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`tab${activeTab === tab ? ' active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* Recommendations Box */}
      <div className="recommendation-box">
        <span>Your recommendations will appear here.</span>
      </div>
      {/* App Grid */}
      <div className="app-grid">
        {APPS.map((app) => (
          <div key={app.name} className="app-tile">
            <img
              src={app.icon}
              alt={app.name}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
              className="app-image"
            />
            <div className="app-name">{app.name}</div>
            <button className="app-login" onClick={() => setLoginApp(app.name)}>
              Login/Connect
            </button>
          </div>
        ))}
      </div>
      {/* Login Modal */}
      {loginApp && (
        <div className="modal-overlay">
          <div className="login-modal">
            <h2>Connect to {loginApp}</h2>
            <p>This is a placeholder for {loginApp} login functionality.</p>
            <button className="close-modal" onClick={() => setLoginApp(null)}>
              Close
            </button>
          </div>
        </div>
      )}
      {/* Profile Modal */}
      {profileOpen && (
        <div className="profile-modal">
          <button onClick={() => setProfileOpen(false)}>Close</button>
        </div>
      )}
      <style jsx>{`
        .dashboard-container {
          padding: 24px;
          font-family: Inter, sans-serif;
          min-height: 100vh;
          transition: background .3s, color .3s;
        }
        .dashboard-container.dark {
          background: #18181b;
          color: #fff;
        }
        .dashboard-container.light {
          background: #f8fafc;
          color: #222;
        }
        .header-bar {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 18px;
        }
        .theme-toggle {
          background: ${isDark ? '#fff' : '#222'};
          color: ${isDark ? '#222' : '#fff'};
          padding: 5px 18px;
          border: none;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: background .2s, color .2s;
        }
        .theme-toggle:hover {
          background: #3b82f6;
          color: #fff;
        }
        .user-avatar {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          overflow: hidden;
          background: ${isDark ? '#333' : '#ddd'};
          cursor: pointer;
        }
        .mini-profile-icon {
          font-size: 32px;
          color: #3b82f6;
        }
        .dashboard-search {
          width: 100%;
          padding: 10px 16px;
          font-size: 1rem;
          border-radius: 6px;
          border: none;
          box-sizing: border-box;
        }
        .dashboard-tabs {
          margin: 24px 0 12px 0;
          display: flex;
          gap: 20px;
        }
        .tab {
          background: none;
          border: none;
          padding: 6px 20px;
          font-size: 1rem;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          color: ${isDark ? '#ccc' : '#555'};
        }
        .tab.active {
          border-bottom: 2px solid #3b82f6;
          font-weight: bold;
          color: #3b82f6;
        }
        .recommendation-box {
          margin: 16px 0;
          padding: 12px;
          ${isDark ? 'background: #27272a; color: #aaa;' : 'background: #e5e7eb; color: #444;'}
          border-radius: 8px;
          min-height: 50px;
        }
        .app-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-top: 24px;
        }
        .app-tile {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px;
          ${isDark ? 'background: #222; color: #fff;' : 'background: #fff; color: #222;'}
          border-radius: 10px;
          box-shadow: 0 2px 4px ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(120,120,120,.07)'};
          transition: background 0.3s;
        }
        .app-tile:hover { background: #3b82f617; }
        .app-image {
          width: 48px;
          height: 48px;
          margin-bottom: 8px;
          filter: brightness(100%);
        }
        .app-name {
          margin-bottom: 8px;
          font-weight: bold;
          font-size: 1.17rem;
          color: inherit;
          text-align: center;
          min-height: 20px;
          display: block;
        }
        .app-login {
          font-size: 1.05rem;
          padding: 6px 14px;
          border-radius: 6px;
          background: #3b82f6;
          border: none;
          cursor: pointer;
          color: white;
          font-weight: 700;
          transition: background 0.3s;
          box-shadow: 0 1px 4px #3b82f6CC;
        }
        .app-login:hover { background: #2563eb; }
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }
        .login-modal {
          background: #fff;
          padding: 32px 40px;
          border-radius: 16px;
          min-width: 300px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.23);
          color: #222;
          text-align: center;
        }
        .close-modal {
          margin-top: 30px;
          padding: 8px 32px;
          font-size: 1.05rem;
          background: #3b82f6;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }
        .close-modal:hover { background: #2563eb; }
        .profile-modal {
          position: fixed;
          top: 20%;
          left: 40%;
          background: #fff;
          padding: 40px;
          border-radius: 14px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
          z-index: 1000;
          color: #000;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
