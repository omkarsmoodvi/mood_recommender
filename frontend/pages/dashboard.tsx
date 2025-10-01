import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';

const APPS = [
  { name: 'YouTube', icon: '/icons/youtube.svg' },
  { name: 'Instagram', icon: '/icons/instagram.svg' },
  { name: 'Spotify', icon: '/icons/spotify.svg' },
  { name: 'Netflix', icon: '/icons/netflix.svg' },
  { name: 'Prime Video', icon: '/icons/primevideo.svg' },
  { name: 'Flipkart', icon: '/icons/flipkart.svg' },
  { name: 'Amazon', icon: '/icons/amazon.svg' },
  { name: 'Myntra', icon: '/icons/myntra.svg' },
  { name: 'Meesho', icon: '/icons/meesho.svg' },
  { name: 'Ajio', icon: '/icons/ajio.svg' },
  { name: 'Nykaa', icon: '/icons/nykaa.svg' },
  { name: 'Google', icon: '/icons/google.svg' },
];

const TABS = ['Music', 'Reels', 'Videos', 'Products'];

const Dashboard: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const isDark = theme === 'dark';

  return (
    <div className={isDark ? 'dashboard-container dark' : 'dashboard-container light'}>
      {/* Theme toggle button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button className="theme-toggle" onClick={() => setTheme(isDark ? 'light' : 'dark')}>
          Switch to {isDark ? 'Light' : 'Dark'} Mode
        </button>
      </div>
      {/* Top bar with search and profile */}
      <div className="top-bar">
        <input
          type="text"
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="dashboard-search"
        />
        <FaUserCircle className="profile-icon" onClick={() => setProfileOpen(true)} />
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
            />
            <div className="app-name">{app.name}</div>
            <button className="app-login">Login/Connect</button>
          </div>
        ))}
      </div>
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
        .theme-toggle {
          background: ${isDark ? '#fff' : '#222'};
          color: ${isDark ? '#222' : '#fff'};
          padding: 5px 18px;
          border: none;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          margin-right: 2px;
          transition: background .2s, color .2s;
        }
        .theme-toggle:hover {
          background: #3b82f6;
          color: #fff;
        }
        .top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .dashboard-search { width: 65%; padding: 8px 12px; font-size: 1rem; border-radius: 6px; border: none; }
        .profile-icon { font-size: 3.6rem; cursor: pointer; color: #3b82f6; margin-left: 18px; }
        .dashboard-tabs { margin: 24px 0 12px 0; display: flex; gap: 20px; }
        .tab { background: none; border: none; padding: 6px 16px; font-size: 1rem; cursor: pointer; border-bottom: 2px solid transparent; color: ${isDark ? '#ccc' : '#555'}; }
        .tab.active { border-bottom: 2px solid #3b82f6; font-weight: bold; color: #3b82f6; }
        .recommendation-box { margin: 16px 0; padding: 12px; ${isDark ? 'background: #27272a; color: #aaa;' : 'background: #e5e7eb; color: #444;'} border-radius: 8px; min-height: 50px; }
        .app-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: 24px; }
        .app-tile { display: flex; flex-direction: column; align-items: center; padding: 16px; ${isDark ? 'background: #222; color: #fff;' : 'background: #fff; color: #222;'} border-radius: 10px; box-shadow: 0 2px 4px ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(120,120,120,.07)'}; transition: background 0.3s; }
        .app-tile:hover { background: #3b82f617; }
        .app-tile img { width: 44px; height: 44px; margin-bottom: 8px; filter: brightness(100%); }
        .app-name { margin-bottom: 8px; font-weight: bold; font-size: 1.17rem; color: inherit; text-align: center; min-height: 20px; display: block; }
        .app-login { font-size: 1.05rem; padding: 6px 14px; border-radius: 6px; background: #3b82f6; border: none; cursor: pointer; color: white; font-weight: 700; transition: background 0.3s; box-shadow: 0 1px 4px #3b82f6CC; }
        .app-login:hover { background: #2563eb; }
        .profile-modal { position: fixed; top: 20%; left: 40%; background: #fff; padding: 40px; border-radius: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.12); z-index: 1000; color: #000; }
      `}</style>
    </div>
  );
};

export default Dashboard;
