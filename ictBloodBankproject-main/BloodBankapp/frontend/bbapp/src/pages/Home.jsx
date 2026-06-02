import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="home-page">
      <section className="hero-section">
        <div className="hero-left">
          <div className="hero-tag">Live donation network</div>
          <h1>Donate blood, empower hope.</h1>
          <p>
            Connect donors, manage requests, and save lives through a modern and
            trusted blood bank platform.
          </p>
          <div className="hero-buttons">
            <Link to="/signup" className="primary-btn">
              Get Started
            </Link>
            <Link to="/login" className="secondary-btn">
              Login
            </Link>
          </div>
          <div className="hero-features">
            <div className="feature-pill">Easy donor search</div>
            <div className="feature-pill">Fast request tracking</div>
            <div className="feature-pill">Secure profile management</div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-banner">
            <div className="hero-banner-top">
              <span className="hero-banner-label">Blood Donation</span>
              <strong>Community care starts here</strong>
            </div>
            <div className="hero-banner-graphic">
              <div className="blood-drop">🩸</div>
              <div className="hero-banner-text">
                <p>Join our blood bank network and help patients find lifesaving support.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
