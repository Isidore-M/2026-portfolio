import { useState } from 'react';

export default function ProfileSpace() {
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  return (
    <div className="space-panel profile-space">
      <div className="project-split-view">
        
        {/* Left Column: Text & Socials */}
        <div className="profile-left-panel">
          <h2 className="profile-title">I’m Isidore</h2>
          
          <div className="profile-desc">
            <p>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, adipiscing elit, dolor sit amet, consectetuer
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, adipiscing elit, dolor sit amet, consectetuer
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, adipiscing elit, dolor sit amet, 
              {isDescExpanded && (
                <span> consectetuer. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.</span>
              )}
              <button 
                className="read-more-btn" 
                onClick={() => setIsDescExpanded(!isDescExpanded)}
              >
                {isDescExpanded ? 'read less' : 'read more'}
              </button>
            </p>
          </div>

          <div className="profile-socials">
            {/* Mailto Link */}
            <a href="mailto:hello@example.com" className="social-btn" aria-label="Send an email">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </a>
            
            {/* Instagram Link */}
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            
            {/* GitHub Link */}
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
          </div>
        </div>

        {/* Right Column: Image Placeholder */}
        <div className="profile-right-panel">
           <div className="profile-image-block"></div>
        </div>

      </div>
    </div>
  );
}