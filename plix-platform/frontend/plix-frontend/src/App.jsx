import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="app-container">
        <header className="app-header">
          <h1>Plix</h1>
          <nav>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#profile">Profile</a></li>
              <li><a href="#messages">Messages</a></li>
              <li><a href="#explore">Explore</a></li>
            </ul>
          </nav>
        </header>
        
        <main className="app-main">
          <div className="content-feed">
            <div className="post-card">
              <div className="post-header">
                <img src="/avatar-placeholder.png" alt="User Avatar" className="avatar" />
                <div className="user-info">
                  <h3>User Name</h3>
                  <p>@username · 2h ago</p>
                </div>
              </div>
              <div className="post-content">
                <p>Welcome to Plix, the decentralized social media platform!</p>
              </div>
              <div className="post-actions">
                <button>Like</button>
                <button>Comment</button>
                <button>Share</button>
              </div>
            </div>
            
            <div className="post-card">
              <div className="post-header">
                <img src="/avatar-placeholder.png" alt="User Avatar" className="avatar" />
                <div className="user-info">
                  <h3>Another User</h3>
                  <p>@anotheruser · 5h ago</p>
                </div>
              </div>
              <div className="post-content">
                <p>Just posted my first photo on Plix using decentralized storage!</p>
                <img src="/image-placeholder.png" alt="Post Image" className="post-image" />
              </div>
              <div className="post-actions">
                <button>Like</button>
                <button>Comment</button>
                <button>Share</button>
              </div>
            </div>
          </div>
          
          <div className="sidebar">
            <div className="trending-section">
              <h2>Trending</h2>
              <ul>
                <li>#DecentralizedSocial</li>
                <li>#Web3</li>
                <li>#Blockchain</li>
                <li>#NFT</li>
              </ul>
            </div>
            
            <div className="entertainment-section">
              <h2>Entertainment</h2>
              <div className="entertainment-item">
                <h3>Now Playing</h3>
                <p>Song Title - Artist</p>
              </div>
              <div className="entertainment-item">
                <h3>Popular Movie</h3>
                <p>Movie Title (2025)</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default App