import { useState } from 'react';
import swal from 'sweetalert';
import { Target, TrendingUp, Search, User, ExternalLink } from 'lucide-react';
import './App.css';
import { getInfluencerMatches } from './services/influencerService';
import type { InfluencerMatchRequest, InfluencerRanking } from './services/influencerService';

function App() {
  const [formData, setFormData] = useState<InfluencerMatchRequest>({
    link: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [rankings, setRankings] = useState<InfluencerRanking[] | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.link.trim()) {
      swal("แจ้งเตือน", "อย่าลืมใส่ลิงก์เว็บไซต์หรือเพจเฟซบุ๊กด้วยน้า", "warning");
      return;
    }

    setIsLoading(true);
    setRankings(null);

    try {
      const responseData = await getInfluencerMatches(formData);

      if (responseData && responseData.length > 0) {
        setRankings(responseData);
      } else {
        // Handle mock fallback if n8n is not set up correctly to return specific structure yet
        console.warn("Webhook returned no array. Simulating ranking display for demo.");
        const mockData: InfluencerRanking[] = [
          { id: '1', rank: 1, name: 'Alice Walker', category: 'Tech & Lifestyle', matchScore: 98, followers: '1.2M', reason: 'High engagement matching the specified brand profile, with excellent alignment on tech products and aesthetics.' },
          { id: '2', rank: 2, name: 'John Doe', category: 'Gadgets', matchScore: 85, followers: '850K', reason: 'Consistently posts high-quality reviews that have strong conversion rates, though slightly less aligned with the exact aesthetic.' },
          { id: '3', rank: 3, name: 'Jane Smith', category: 'Business', matchScore: 78, followers: '420K', reason: 'Good follower base but focus is broader than the selected niche. Still provides a great reach for awareness.' },
        ];
        // Note: Remove mockData when the actual webhook returns the expected array payload
        setRankings(responseData?.length ? responseData : mockData);
      }

    } catch (error) {
      console.error("Webhook Error:", error);
      swal("เกิดข้อผิดพลาด", "ไม่สามารถติดต่อระบบได้ ลองเช็คดูว่า N8N สตาร์ทโหมดทดสอบอยู่รึเปล่านะ", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setRankings(null);
    setFormData({ link: '' });
  };

  return (
    <div className="app-wrapper">
      <div className="background-shapes">
        {/* Animated background specific to the TikTok vibe (dark + neon colors) */}
        <div className="shape shape-1 tiktok-blue"></div>
        <div className="shape shape-2 tiktok-pink"></div>
        <div className="shape shape-3"></div>
      </div>

      <main className={`main-content ${rankings ? 'has-results' : ''}`}>
        <div className="form-container">
          <div className="form-header">
            <div className="logo-container">
              <Target size={40} className="logo-icon" />
            </div>
            <h1>TikTok Influencer Matcher</h1>
            <p>ค้นหาครีเอเตอร์ที่ใช่ เหมาะกับสไตล์แบรนด์ของคุณที่สุด</p>
          </div>

          <form onSubmit={handleSubmit} className="glass-form message-form">
            <div className="input-group">
              <label htmlFor="link">Link Website หรือ Facebook</label>
              <div className="input-wrapper">
                <Search className="input-icon" size={18} />
                <input
                  type="url"
                  id="link"
                  placeholder="แปะลิงก์ของแบรนด์ไว้ที่นี่เลย..."
                  value={formData.link}
                  onChange={e => setFormData({ link: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            </div>

            <button type="submit" className={`submit-btn ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
              {isLoading ? (
                <span className="spinner"></span>
              ) : (
                <>
                  <TrendingUp size={20} className="btn-icon" />
                  <span>ค้นหา Influencer</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {rankings && (
          <div className="results-container slide-in">
            <div className="results-header">
              <h2>ผลการจับคู่ Influencer</h2>
              <button onClick={handleReset} className="reset-btn">ค้นหาใหม่</button>
            </div>

            <div className="ranking-list">
              {rankings.map((influencer, i) => (
                <div key={influencer.id || i} className="ranking-card glass-panel scale-in" style={{ animationDelay: `${influencer.rank! * 0.1}s` }}>
                  <div className="ranking-card-main">
                    <div className="rank-badge">#{influencer.rank}</div>
                    <div className="influencer-info">
                      <div className="influencer-avatar">
                        {influencer.avatarUrl ? (
                          <img src={influencer.avatarUrl} alt={influencer.name} />
                        ) : (
                          <User size={24} className="default-avatar" />
                        )}
                      </div>
                      <div className="influencer-details">
                        <h3>{influencer.name}</h3>
                        <div className="tags-container">
                          {influencer.category && <span className="category-tag">{influencer.category}</span>}
                          {influencer.profileUrl && (
                            <a href={influencer.profileUrl} target="_blank" rel="noreferrer" className="profile-link-tag">
                              ดูโปรไฟล์ TikTok <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="influencer-stats">
                      <div className="stat-column">
                        <span className="stat-value">{influencer.matchScore}</span>
                        <span className="stat-label">คะแนน</span>
                      </div>
                      {influencer.followers && (
                        <div className="stat-column">
                          <span className="stat-value">{influencer.followers}</span>
                          <span className="stat-label">ผู้ติดตาม</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="influencer-reason">
                    <p><strong>ทำไมถึงเหมาะ:</strong> {influencer.reason}</p>
                  </div>
                </div>
              ))}

              {rankings.length === 0 && (
                <div className="no-results glass-panel">
                  <p>อ้าว... ไม่เจอ Influencer ที่ตรงกับสไตล์คุณเลย ลองแปะลิงก์อิงค์ดูนะ!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
