import React from 'react';

/**
 * NeonEffectsDemo Component
 * Showcases all available neon effects in the application
 * 
 * Usage: Add <NeonEffectsDemo /> to any Route to see effects
 */
const NeonEffectsDemo = () => {
  return (
    <div style={{
      padding: '60px 20px',
      backgroundColor: 'var(--bg-main)',
      minHeight: '100vh',
      color: 'var(--text-main)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* NEON TEXT EFFECTS */}
        <section style={{ marginBottom: '80px' }}>
          <h1 className="neon-heading cyan" style={{ marginBottom: '40px' }}>
            🌟 Neon Text Effects
          </h1>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginBottom: '40px' }}>
            <div style={{ padding: '20px', backgroundColor: 'var(--bg-surface)', borderRadius: '12px' }}>
              <p className="neon-text neon-text-cyan">Cyan Glow</p>
              <code style={{ fontSize: '12px', color: 'var(--text-muted)' }}>.neon-text.neon-text-cyan</code>
            </div>
            
            <div style={{ padding: '20px', backgroundColor: 'var(--bg-surface)', borderRadius: '12px' }}>
              <p className="neon-text neon-text-magenta">Magenta Glow</p>
              <code style={{ fontSize: '12px', color: 'var(--text-muted)' }}>.neon-text.neon-text-magenta</code>
            </div>
            
            <div style={{ padding: '20px', backgroundColor: 'var(--bg-surface)', borderRadius: '12px' }}>
              <p className="neon-text neon-text-lime">Lime Glow</p>
              <code style={{ fontSize: '12px', color: 'var(--text-muted)' }}>.neon-text.neon-text-lime</code>
            </div>
            
            <div style={{ padding: '20px', backgroundColor: 'var(--bg-surface)', borderRadius: '12px' }}>
              <p className="neon-text neon-text-purple">Purple Glow</p>
              <code style={{ fontSize: '12px', color: 'var(--text-muted)' }}>.neon-text.neon-text-purple</code>
            </div>
            
            <div style={{ padding: '20px', backgroundColor: 'var(--bg-surface)', borderRadius: '12px' }}>
              <p className="neon-text neon-text-blue">Blue Glow</p>
              <code style={{ fontSize: '12px', color: 'var(--text-muted)' }}>.neon-text.neon-text-blue</code>
            </div>
            
            <div style={{ padding: '20px', backgroundColor: 'var(--bg-surface)', borderRadius: '12px' }}>
              <p className="neon-text-rainbow">Rainbow Effect</p>
              <code style={{ fontSize: '12px', color: 'var(--text-muted)' }}>.neon-text-rainbow</code>
            </div>
          </div>
        </section>

        {/* NEON HEADINGS */}
        <section style={{ marginBottom: '80px' }}>
          <h2 style={{ marginBottom: '40px', fontSize: '2rem', fontWeight: '700' }}>📝 Neon Headings</h2>
          
          <h1 className="neon-heading cyan">Cyan Heading</h1>
          <h1 className="neon-heading magenta">Magenta Heading</h1>
          <h1 className="neon-heading lime">Lime Heading</h1>
          <h1 className="neon-heading purple">Purple Heading</h1>
        </section>

        {/* NEON BUTTONS */}
        <section style={{ marginBottom: '80px' }}>
          <h2 style={{ marginBottom: '40px', fontSize: '2rem', fontWeight: '700' }}>🔘 Neon Buttons</h2>
          
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
            <button className="neon-btn neon-btn-cyan">Cyan Button</button>
            <button className="neon-btn neon-btn-magenta">Magenta Button</button>
            <button className="neon-btn neon-btn-lime">Lime Button</button>
            <button className="neon-btn neon-btn-pink">Pink Button</button>
            <button className="neon-btn neon-btn-purple">Purple Button</button>
          </div>
          
          <h3 style={{ marginTop: '40px', marginBottom: '20px' }}>CTA Buttons (Call-to-Action)</h3>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <button className="neon-cta-btn cyan">Get Started</button>
            <button className="neon-cta-btn magenta">Learn More</button>
            <button className="neon-cta-btn lime">Explore Now</button>
          </div>
        </section>

        {/* NEON INPUT FIELDS */}
        <section style={{ marginBottom: '80px' }}>
          <h2 style={{ marginBottom: '40px', fontSize: '2rem', fontWeight: '700' }}>📝 Neon Input Fields</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>Cyan Input</label>
              <input 
                type="text" 
                className="neon-input cyan" 
                placeholder="Enter text here..."
                style={{ width: '100%' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>Magenta Input</label>
              <input 
                type="text" 
                className="neon-input magenta" 
                placeholder="Type something..."
                style={{ width: '100%' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>Lime Input</label>
              <input 
                type="text" 
                className="neon-input lime" 
                placeholder="Your input..."
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </section>

        {/* NEON CARDS */}
        <section style={{ marginBottom: '80px' }}>
          <h2 style={{ marginBottom: '40px', fontSize: '2rem', fontWeight: '700' }}>🎴 Neon Cards</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            <div className="neon-card neon-card-cyan" style={{ padding: '30px' }}>
              <h3 style={{ marginBottom: '10px' }}>Cyan Card</h3>
              <p>Beautiful card with glowing cyan border</p>
            </div>
            
            <div className="neon-card neon-card-magenta" style={{ padding: '30px' }}>
              <h3 style={{ marginBottom: '10px' }}>Magenta Card</h3>
              <p>Eye-catching magenta neon effect</p>
            </div>
            
            <div className="neon-card neon-card-lime" style={{ padding: '30px' }}>
              <h3 style={{ marginBottom: '10px' }}>Lime Card</h3>
              <p>Vibrant lime glowing card</p>
            </div>
            
            <div className="neon-card neon-card-purple" style={{ padding: '30px' }}>
              <h3 style={{ marginBottom: '10px' }}>Purple Card</h3>
              <p>Royal purple neon border</p>
            </div>
            
            <div className="neon-card neon-card-blue" style={{ padding: '30px' }}>
              <h3 style={{ marginBottom: '10px' }}>Blue Card</h3>
              <p>Electric blue glow effect</p>
            </div>
          </div>
        </section>

        {/* NEON BORDERS */}
        <section style={{ marginBottom: '80px' }}>
          <h2 style={{ marginBottom: '40px', fontSize: '2rem', fontWeight: '700' }}>🔲 Neon Borders</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
            <div className="neon-border neon-border-cyan" style={{ padding: '20px', textAlign: 'center' }}>
              Cyan Border Glow
            </div>
            <div className="neon-border neon-border-magenta" style={{ padding: '20px', textAlign: 'center' }}>
              Magenta Border Glow
            </div>
            <div className="neon-border neon-border-lime" style={{ padding: '20px', textAlign: 'center' }}>
              Lime Border Glow
            </div>
            <div className="neon-border neon-border-pink" style={{ padding: '20px', textAlign: 'center' }}>
              Pink Border Glow
            </div>
            <div className="neon-border neon-border-purple" style={{ padding: '20px', textAlign: 'center' }}>
              Purple Border Glow
            </div>
            <div className="neon-border neon-border-blue" style={{ padding: '20px', textAlign: 'center' }}>
              Blue Border Glow
            </div>
          </div>
        </section>

        {/* NEON BADGES */}
        <section style={{ marginBottom: '80px' }}>
          <h2 style={{ marginBottom: '40px', fontSize: '2rem', fontWeight: '700' }}>🏷️ Neon Badges</h2>
          
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <span className="neon-badge neon-badge-cyan">New</span>
            <span className="neon-badge neon-badge-magenta">Premium</span>
            <span className="neon-badge neon-badge-lime">Featured</span>
            <span className="neon-badge neon-badge-purple">Trending</span>
          </div>
        </section>

        {/* NEON SECTION HEADERS */}
        <section style={{ marginBottom: '80px' }}>
          <h2 style={{ marginBottom: '40px', fontSize: '2rem', fontWeight: '700' }}>📊 Section Headers</h2>
          
          <h2 className="neon-section-header cyan">Our Services</h2>
          <p style={{ marginBottom: '30px' }}>Content under this glowing header...</p>
          
          <h2 className="neon-section-header magenta">Amazing Features</h2>
          <p style={{ marginBottom: '30px' }}>More content with magenta glow...</p>
          
          <h2 className="neon-section-header lime">Why Choose Us</h2>
          <p>Content with lime colored header...</p>
        </section>

        {/* NEON ALERTS */}
        <section style={{ marginBottom: '80px' }}>
          <h2 style={{ marginBottom: '40px', fontSize: '2rem', fontWeight: '700' }}>⚠️ Neon Alerts</h2>
          
          <div style={{ display: 'grid', gap: '20px' }}>
            <div className="neon-alert cyan">
              ✨ Info: This is a cyan neon alert
            </div>
            
            <div className="neon-alert magenta">
              🔔 Notice: This is a magenta neon alert
            </div>
            
            <div className="neon-alert lime">
              ✅ Success: This is a lime neon alert
            </div>
          </div>
        </section>

        {/* NEON LINKS */}
        <section style={{ marginBottom: '80px' }}>
          <h2 style={{ marginBottom: '40px', fontSize: '2rem', fontWeight: '700' }}>🔗 Neon Links</h2>
          
          <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
            <a href="#" className="neon-underline neon-underline-cyan">Cyan Link</a>
            <a href="#" className="neon-underline neon-underline-magenta">Magenta Link</a>
            <a href="#" className="neon-underline neon-underline-lime">Lime Link</a>
            <a href="#" className="neon-underline neon-underline-pink">Pink Link</a>
          </div>
        </section>

        {/* NEON SHADOW EFFECTS */}
        <section style={{ marginBottom: '80px' }}>
          <h2 style={{ marginBottom: '40px', fontSize: '2rem', fontWeight: '700' }}>💫 Neon Shadows</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
            <div className="neon-shadow-cyan" style={{ padding: '20px', backgroundColor: 'var(--bg-surface)', borderRadius: '8px', textAlign: 'center' }}>
              Cyan Shadow
            </div>
            <div className="neon-shadow-magenta" style={{ padding: '20px', backgroundColor: 'var(--bg-surface)', borderRadius: '8px', textAlign: 'center' }}>
              Magenta Shadow
            </div>
            <div className="neon-shadow-lime" style={{ padding: '20px', backgroundColor: 'var(--bg-surface)', borderRadius: '8px', textAlign: 'center' }}>
              Lime Shadow
            </div>
            <div className="neon-shadow-blue" style={{ padding: '20px', backgroundColor: 'var(--bg-surface)', borderRadius: '8px', textAlign: 'center' }}>
              Blue Shadow
            </div>
          </div>
        </section>

        {/* PRACTICAL EXAMPLES */}
        <section style={{ marginBottom: '80px' }}>
          <h2 style={{ marginBottom: '40px', fontSize: '2rem', fontWeight: '700' }}>🎯 Practical Examples</h2>
          
          {/* Hero Section */}
          <div style={{ marginBottom: '60px' }}>
            <h3 style={{ marginBottom: '20px' }}>Hero Section Example</h3>
            <div style={{
              padding: '60px 40px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '16px',
              textAlign: 'center',
            }}>
              <h1 className="neon-heading cyan" style={{ marginBottom: '20px' }}>
                Welcome to V-Assist
              </h1>
              <p className="neon-text neon-text-magenta" style={{ marginBottom: '30px', fontSize: '1.2rem' }}>
                Transform Your Counseling Experience
              </p>
              <button className="neon-cta-btn cyan">Get Started Now</button>
            </div>
          </div>

          {/* Feature Cards */}
          <div style={{ marginBottom: '60px' }}>
            <h3 style={{ marginBottom: '20px' }}>Feature Cards Section</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
              <div className="neon-card neon-card-cyan" style={{ padding: '30px' }}>
                <h4>🤖 AI Powered</h4>
                <p>Intelligent counseling assistance 24/7</p>
              </div>
              <div className="neon-card neon-card-magenta" style={{ padding: '30px' }}>
                <h4>🔒 Secure & Private</h4>
                <p>Your data is protected and confidential</p>
              </div>
              <div className="neon-card neon-card-lime" style={{ padding: '30px' }}>
                <h4>⚡ Fast & Reliable</h4>
                <p>Quick responses and consistent support</p>
              </div>
            </div>
          </div>
        </section>

        {/* END MESSAGE */}
        <section style={{ textAlign: 'center', padding: '40px', backgroundColor: 'var(--bg-surface)', borderRadius: '16px' }}>
          <h2 className="neon-heading lime" style={{ marginBottom: '20px' }}>
            🎆 Neon Effects Ready to Use!
          </h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '20px', color: 'var(--text-muted)' }}>
            All these neon effects automatically adapt to light and dark themes.
          </p>
          <p style={{ color: 'var(--text-muted)' }}>
            Check NEON_EFFECTS_GUIDE.md for complete documentation and usage examples.
          </p>
        </section>
      </div>
    </div>
  );
};

export default NeonEffectsDemo;
