import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaBookmark, FaSearch, FaTimes, FaHeart, FaHeartBroken } from 'react-icons/fa';
import Papa from 'papaparse';
import YouTubeEmbed from "../components/YouTubeEmbed";
import SpotifyEmbed from "../components/SpotifyEmbed";

const APPS = [
  { name: 'Google', icon: '/icons/google.svg' },
  { name: 'Spotify', icon: '/icons/spotify.svg' },
  { name: 'YouTube', icon: '/icons/youtube.svg' },
];
const TABS = ['Music', 'Reels', 'Videos'];

// Enhanced YouTube results with all embed types
// This part stays mostly the same
function getYouTubeResults(keyword) {
  if (keyword && keyword.toLowerCase().includes("kannada")) {
    return [
      { id: "SOtJkJYb6Rs", type: "video", title: "Best Kannada Lofi Songs" },
      { id: "PLrAVSTf7VHZQRqZdQc8lkkGJTVLwBQ7M", type: "playlist", title: "Kannada Playlist" },
      { id: "UC9xp0yz0V8G4K_dFY1xpeLg", type: "channel", title: "Kannada Music Channel" }
    ];
  }
  if (keyword && keyword.toLowerCase().includes("study")) {
    return [
      { id: "WPni755-Krg", type: "video", title: "Study Music - Focus" },
      { id: "37i9dQZF1DWZeKCadgRdKQ", type: "playlist", title: "Study Playlist" },
      { id: "UCJhjE7wbdYAae1G25m0tHAA", type: "channel", title: "Study Music Channel" }
    ];
  }
  if (keyword) {
    return [
      { id: "5qap5aO4i9A", type: "video", title: "Lofi Hip Hop" },
      { id: "PLFgquLnL59amEA43CyrkVtZp_BhwDX0_t", type: "playlist", title: "Chill Playlist" },
      { id: "Chillhopdotcom", type: "channel", title: "ChillHop Music" }
    ];
  }
  return [
    { id: "5qap5aO4i9A", type: "video", title: "Lofi Hip Hop" },
    { id: "PLFgquLnL59amEA43CyrkVtZp_BhwDX0_t", type: "playlist", title: "Chill Playlist" },
    { id: "Chillhopdotcom", type: "channel", title: "ChillHop Music" }
  ];
}


function getSpotifyPlaylists(keyword) {
  if (keyword && keyword.toLowerCase().includes("kannada")) 
    return ["2pAHls1zxYl6QW1NNi8CZj", "37i9dQZF1DWVpBW4SMCQbO"];
  if (keyword && keyword.toLowerCase().includes("study")) 
    return ["37i9dQZF1DWZeKCadgRdKQ", "37i9dQZF1DX8Uebhn9wzrS"];
  if (keyword) 
    return ["37i9dQZF1DXcBWIGoYBM5M", "37i9dQZF1DX4WYpdgoIcn6"];
  return ["37i9dQZF1DXcBWIGoYBM5M", "37i9dQZF1DX4WYpdgoIcn6"];
}


const Dashboard: React.FC = () => {
  const [userHistory, setUserHistory] = useState<any[]>([]);
  const [historyKeywords, setHistoryKeywords] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [loginApp, setLoginApp] = useState<string | null>(null);
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [googleResults, setGoogleResults] = useState([]);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isDark = theme === 'dark';

  // This is the correct place to add this!
  const effectiveSearch =
    search && search.trim().length > 0
      ? search
      : historyKeywords.length > 0
        ? historyKeywords[0]
        : "";

  const [results, setResults] = useState({
    youtube: getYouTubeResults(''),
    spotify: getSpotifyPlaylists(''),
  });

  useEffect(() => {
    fetch('/data/synthetic_user_history-1.csv')
      .then(res => res.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: function(results) {
            setUserHistory(results.data);
            // Use the actual CSV header names!
            const allText = results.data.map((row) =>
              [row.query_text, row.mood_tag, row.inferred_genre, row.item_title]
                .filter(Boolean).join(" ")
            ).join(" ").toLowerCase();

            const freq = {};
            allText.split(/\W+/).forEach(w => {
              if (w && w.length > 2) freq[w] = (freq[w] || 0) + 1;
            });

            const best = Object.entries(freq)
              .filter(([word]) => isNaN(Number(word)) && word !== "the" && word !== "and")
              .sort((a, b) => b[1] - a[1])
              .slice(0, 10)
              .map(e => e[0]);
            setHistoryKeywords(best);
          }
        });
      });
  }, []);



  async function fetchGoogleResults(query: string) {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const resp = await fetch(`/api/search-google?q=${encodeURIComponent(query)}`);
      const data = await resp.json();
      console.log('Search results:', data);
      setGoogleResults(data.items || []);
    } catch (error) {
      console.error('Search failed:', error);
      setGoogleResults([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSearchAll(ev?: React.FormEvent) {
    if (ev) ev.preventDefault();
    setResults({
      youtube: getYouTubeResults(search),
      spotify: getSpotifyPlaylists(search),
    });
    fetchGoogleResults(search);
  }

  function addToFavorites(item: any, type: string) {
    const favoriteItem = { ...item, type, id: Date.now() };
    setFavorites(prev => [...prev, favoriteItem]);
  }

  function removeFromFavorites(id: number) {
    setFavorites(prev => prev.filter(item => item.id !== id));
  }

  function openVideoPlayer(videoId: string) {
    setCurrentVideo(videoId);
  }

  function closeVideoPlayer() {
    setCurrentVideo(null);
  }

  return (
    <div className={isDark ? 'dashboard-container dark' : 'dashboard-container light'}>
      {/* Header: Theme toggle, profile */}
      <div className="header-bar">
        <button className="theme-toggle" onClick={() => setTheme(isDark ? 'light' : 'dark')}>
          Switch to {isDark ? 'Light' : 'Dark'} Mode
        </button>
        <div className="user-avatar" onClick={() => setProfileOpen(true)}>
          <FaUserCircle className="mini-profile-icon" />
        </div>
      </div>

      {/* Search + Mood Input */}
      <form
        style={{ width: '100%', margin: '24px 0 6px 0', display: 'flex', gap: 14, flexWrap: 'wrap' }}
        onSubmit={handleSearchAll}
      >
        <input
          type="text"
          placeholder="Type your mood or search (e.g. best kannada lofi songs, happy, study...)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="dashboard-search"
          style={{ flex: 3, minWidth: 190 }}
        />
        <button className="search-all-btn" type="submit" style={{ flex: 1, minWidth: 170 }} disabled={loading}>
          <FaSearch style={{ marginRight: 9, position: "relative", top: 2 }} />
          {loading ? 'Searching...' : 'Search all platforms'}
        </button>
      </form>

      {/* Tabs */}
      <div className="dashboard-tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`tab${activeTab === tab ? ' active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Recommendations/Mood */}
      <div className="recommendation-box">
        <b>Recommendations</b>
        <div style={{ marginTop: 8 }}>{search ? `Your search: ${search}` : 'Your recommendations will appear here.'}</div>
      </div>
      {historyKeywords.length > 0 && (
      <div style={{ marginTop: 12, color: "#3b82f6" }}>
      Top keywords from your history: {historyKeywords.join(', ')}
      </div>
      )}

      {/* Google Search Results Section */}
      {googleResults.length > 0 && (
        <>
          <div className="section-header" style={{marginTop:28}}>Google Search Results</div>
          <div className="google-results">
            {googleResults.map((item, i) => (
              <div key={item.link || i} className="google-result-card">
                <div className="google-result-title">{item.title}</div>
                <div className="google-result-snippet">{item.snippet}</div>
                <div className="google-result-link">{item.link}</div>
                <div className="result-actions">
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="view-btn">
                    View
                  </a>
                  <button onClick={() => addToFavorites(item, 'google')} className="favorite-btn">
                    <FaHeart /> Save
                  </button>
                </div>
                {item.pagemap && item.pagemap.cse_image && item.pagemap.cse_image[0]?.src &&
                  <img src={item.pagemap.cse_image[0].src} alt="" style={{maxWidth:"100px"}} />}
              </div>
            ))}
          </div>
        </>
      )}

{/* Main content responsive grid */}
<div className="dashboard-content-grid">
  {/* Column 1: Video & Music */}
  <div className="section-col">
    <div className="section-header">YouTube (All Types: Video, Playlist, Channel)</div>
    <div className="youtube-row">
      {getYouTubeResults(effectiveSearch).map((item, i) => (
        <div key={item.id} className="youtube-item">
          <div onClick={() => item.type === 'video' ? openVideoPlayer(item.id) : null} 
               style={{ cursor: item.type === 'video' ? 'pointer' : 'default' }}>
            <YouTubeEmbed id={item.id} embedType={item.type} large />
          </div>
          <div className="item-title">{item.title}</div>
          <button onClick={() => addToFavorites(item, 'youtube')} className="favorite-btn">
            <FaHeart /> Save
          </button>
        </div>
      ))}
    </div>
    <div className="section-header">Spotify Playlists</div>
    <div className="spotify-row">
      {getSpotifyPlaylists(effectiveSearch).map((pl, i) => (
        <div key={pl} className="spotify-item">
          <SpotifyEmbed playlistId={pl} large />
          <button onClick={() => addToFavorites({id: pl, title: `Playlist ${i+1}`}, 'spotify')} className="favorite-btn">
            <FaHeart /> Save
          </button>
        </div>
      ))}
    </div>
  </div>
  {/* ... your other columns, like Favorites ... */}
</div>


        
        {/* Column 2: Favorites */}
        <div className="section-col">
          <div className="section-header"><FaBookmark style={{ position: 'relative', top: 2 }} /> Favorites ({favorites.length})</div>
          <div className="favorites-container">
            {favorites.length === 0 ? (
              <div style={{
                minHeight: 200, background: isDark ? "#232327" : "#f3f4f6", borderRadius: 14, padding: 18, textAlign: "center", color: isDark ? "#bbb" : "#666"
              }}>
                <div style={{ fontSize: "1.1rem", marginTop: 24 }}>
                  Save your favorite posts, songs, videos, or products here!
                </div>
              </div>
            ) : (
              favorites.map((item) => (
                <div key={item.id} className="favorite-item">
                  <div className="favorite-info">
                    <div className="favorite-title">{item.title || item.name || 'Untitled'}</div>
                    <div className="favorite-type">{item.type}</div>
                  </div>
                  <button onClick={() => removeFromFavorites(item.id)} className="remove-favorite">
                    <FaHeartBroken />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Full Screen Video Player */}
      {currentVideo && (
        <div className="video-modal-overlay">
          <div className="video-modal">
            <button className="close-video" onClick={closeVideoPlayer}>
              <FaTimes />
            </button>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${currentVideo}?autoplay=1`}
              title="YouTube Video Player"
              frameBorder="0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          </div>
        </div>
      )}

      {/* App Grid (at bottom) */}
      <div className="app-grid">
        {APPS.map(app => (
          <div key={app.name} className="app-tile">
            <img
              src={app.icon}
              alt={app.name}
              onError={e => (e.target as HTMLImageElement).style.display = 'none'}
              className="app-image"
            />
            <div className="app-name">{app.name}</div>
            <button className="app-login" onClick={() => setLoginApp(app.name)}>
              {googleUser && app.name === 'Google' ? 'Connected' : 'Login/Connect'}
            </button>
          </div>
        ))}
      </div>

      {loginApp && (
        <div className="modal-overlay">
          <div className="login-modal">
            <h2>Connect to {loginApp}</h2>
            {loginApp === "Google" ? (
              googleUser ? (
                <div>
                  <h4>Welcome, {googleUser.name}</h4>
                  <p>Email: {googleUser.email}</p>
                  <img src={googleUser.picture} alt="Google Profile" style={{ borderRadius: "50%", width: 60 }} />
                  <button onClick={() => setGoogleUser(null)} className="close-modal" style={{marginTop: 15}}>
                    Sign Out
                  </button>
                </div>
              ) : (
                <GoogleLogin
                  onSuccess={credentialResponse => {
                    if (credentialResponse.credential) {
                      const decoded: any = jwtDecode(credentialResponse.credential);
                      setGoogleUser(decoded);
                      console.log(decoded);
                    }
                  }}
                  onError={() => {
                    console.log("Google Login Failed");
                  }}
                  width="270"
                />
              )
            ) : (
              <p>This is a placeholder for {loginApp} login functionality.</p>
            )}
            <button className="close-modal" onClick={() => setLoginApp(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      {profileOpen && (
        <div className="profile-modal">
          <h3>Profile</h3>
          {googleUser ? (
            <div>
              <p>Name: {googleUser.name}</p>
              <p>Email: {googleUser.email}</p>
            </div>
          ) : (
            <p>Not logged in</p>
          )}
          <button onClick={() => setProfileOpen(false)}>Close</button>
        </div>
      )}

      {/* Styles */}
      <style jsx>{`
        .dashboard-container {
          padding: 16px;
          font-family: Inter, sans-serif;
          min-height: 100vh;
          transition: background .3s, color .3s;
        }
        .dashboard-container.dark { background: #18181b; color: #fff; }
        .dashboard-container.light { background: #f8fafc; color: #222; }
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
        .theme-toggle:hover { background: #3b82f6; color: #fff; }
        .user-avatar {
          width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; overflow: hidden; background: ${isDark ? '#333' : '#ddd'}; cursor: pointer;
        }
        .mini-profile-icon { font-size: 32px; color: #3b82f6; }
        .dashboard-search {
          width: 100%;
          padding: 10px 16px;
          font-size: 1rem;
          border-radius: 6px;
          border: none;
          box-sizing: border-box;
          background: ${isDark ? '#2a2a2a' : '#fff'};
          color: ${isDark ? '#fff' : '#000'};
        }
        .dashboard-tabs {
          margin: 10px 0 12px 0;
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
          margin: 8px 0 22px 0;
          padding: 13px 14px;
          ${isDark ? 'background: #25252a; color: #b8bcc2;' : 'background: #e5e7eb; color: #444;'}
          border-radius: 12px;
          min-height: 48px;
        }
        .google-results {
          display: flex;
          flex-wrap: wrap;
          gap: 18px;
          margin-bottom: 22px;
        }
        .google-result-card {
          display: block;
          background: ${isDark ? '#2a2a2a' : '#fff'};
          color: ${isDark ? '#fff' : '#1b1c1d'};
          border-radius: 12px;
          box-shadow: 0 1.5px 8px ${isDark ? '#000' : '#b4b4b474'};
          padding: 18px;
          margin: 10px 0;
          width: 330px;
          max-width: 98vw;
          border: 1.2px solid ${isDark ? '#444' : '#e2e2e2'};
          transition: box-shadow 0.13s;
        }
        .google-result-card:hover {
          box-shadow: 0 8px 28px ${isDark ? '#3b82f6' : '#13ecd47d'};
          border: 1.7px solid #13acec;
        }
        .google-result-title {
          font-weight: bold;
          color: #237be8;
          margin-bottom: 8px;
        }
        .google-result-link {
          color: #326bea;
          font-size: 0.85rem;
          margin-bottom: 8px;
          word-break: break-all;
        }
        .google-result-snippet {
          margin-bottom: 12px;
          color: ${isDark ? '#ccc' : '#454545'};
          font-size: 0.95rem;
        }
        .result-actions {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }
        .view-btn, .favorite-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .view-btn {
          background: #3b82f6;
          color: white;
          text-decoration: none;
        }
        .favorite-btn {
          background: #f59e0b;
          color: white;
        }
        .dashboard-content-grid {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }
        .section-col {
          flex: 1 1 315px; min-width: 320px; display: flex; flex-direction: column; gap: 16px;
        }
        .section-header { font-weight: bold; font-size: 1.11rem; margin-bottom: 4px; margin-top: 1px; }
        .youtube-row, .spotify-row { display: flex; gap: 16px; flex-wrap: wrap; justify-content: flex-start; }
        .youtube-item, .spotify-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .item-title {
          font-size: 0.9rem;
          font-weight: 500;
          color: ${isDark ? '#ccc' : '#555'};
        }
        .favorites-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .favorite-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: ${isDark ? '#2a2a2a' : '#f9f9f9'};
          border-radius: 8px;
          border: 1px solid ${isDark ? '#444' : '#e5e5e5'};
        }
        .favorite-info {
          flex: 1;
        }
        .favorite-title {
          font-weight: 500;
          font-size: 0.95rem;
        }
        .favorite-type {
          font-size: 0.8rem;
          color: ${isDark ? '#888' : '#666'};
          text-transform: uppercase;
        }
        .remove-favorite {
          background: #ef4444;
          color: white;
          border: none;
          padding: 6px;
          border-radius: 4px;
          cursor: pointer;
        }
        .video-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3000;
        }
        .video-modal {
          position: relative;
          width: 90vw;
          height: 90vh;
          background: black;
          border-radius: 8px;
          overflow: hidden;
        }
        .close-video {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          padding: 10px;
          border-radius: 50%;
          cursor: pointer;
          z-index: 3001;
          font-size: 20px;
        }
        :global(.responsive-youtube-iframe-large) { width: 312px !important; height: 186px !important; max-width: 98vw; border-radius: 12px; border: none; }
        :global(.responsive-spotify-embed-large) { min-width: 320px !important; width: 332px !important; height: 116px !important; border-radius: 12px; border: none; }
        @media (max-width: 1200px) {
          .dashboard-content-grid { flex-direction: column; gap: 22px; }
          .section-col { min-width: 0; }
        }
        @media (max-width: 700px) {
          .dashboard-container { padding: 5px !important; }
          .dashboard-content-grid { flex-direction: column; gap: 6px; }
          .section-col { min-width: 0; }
          .youtube-row, .spotify-row { flex-direction: column; align-items: stretch; }
          :global(.responsive-youtube-iframe-large), :global(.responsive-spotify-embed-large) { width: 99vw !important; min-width: 0 !important; }
        }
        .app-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
          gap: 18px;
          margin-top: 26px;
        }
        .app-tile {
          display: flex; flex-direction: column; align-items: center; padding: 13px;
          ${isDark ? 'background: #232327; color: #fff;' : 'background: #fff; color: #222;'}
          border-radius: 10px;
          box-shadow: 0 1.5px 4px ${isDark ? 'rgba(0,0,0,0.18)' : 'rgba(120,120,120,.09)'};
          transition: background 0.3s;
        }
        .app-tile:hover { background: #3b82f617; }
        .app-image { width: 44px; height: 44px; margin-bottom: 8px; filter: brightness(100%); }
        .app-name { margin-bottom: 8px; font-weight: bold; font-size: 1.13rem; color: inherit; text-align: center; min-height: 20px; }
        .app-login {
          font-size: 1.02rem;
          padding: 5px 13px;
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
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6);
          display: flex; align-items: center; justify-content: center;
          z-index: 2000;
        }
        .login-modal {
          background: #fff; padding: 32px 40px; border-radius: 16px; min-width: 300px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.23); color: #222; text-align: center;
        }
        .close-modal { margin-top: 30px; padding: 8px 32px; font-size: 1.05rem; background: #3b82f6; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }
        .close-modal:hover { background: #2563eb; }
        .profile-modal { position: fixed; top: 20%; left: 40%; background: #fff; padding: 40px; border-radius: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.12); z-index: 1000; color: #000; }
        .search-all-btn {
          background: #3b82f6; color: #fff; font-size: 1rem; padding: 10px 16px; border-radius: 8px; border: none;
          font-weight: 600; cursor: pointer; box-shadow: 0 1px 3px #3b82f6bb;
        }
        .search-all-btn:hover { background: #2563eb; }
        .search-all-btn:disabled { background: #888; cursor: not-allowed; }
      `}</style>
    </div>
  );
};

export default Dashboard;
