import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

function DetailColumn({ title, content }: { title: string, content: string }) {
  return (
    <div className="case-study-column">
      <h3 className="sr-only">{title}</h3> 
      <p>{content}</p>
    </div>
  );
}

interface CaseStudyDetailProps {
  category: 'design' | 'dev';
  categoryName: string;
  // NEW: Added the images array to the expected project prop
  project: { id: number; title: string; desc: string; images?: string[] };
  onClose: () => void;
  onBackToRoom: () => void; 
  onNext: () => void;
  hasNext: boolean;
}

export default function CaseStudyDetail({ category, categoryName, project, onClose, onBackToRoom, onNext, hasNext }: CaseStudyDetailProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null); 
  const bottomRef = useRef<HTMLDivElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    if (overlayRef.current) {
      gsap.fromTo(overlayRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.5, ease: "power2.out" }
      );
    }
  }, { scope: overlayRef });

  const handleClose = () => {
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: onClose
      });
    }
  };

  const handleBackToRoom = () => {
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: onBackToRoom
      });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextBtnRef.current) {
        gsap.to(nextBtnRef.current, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" });
      } else if (nextBtnRef.current) {
        gsap.to(nextBtnRef.current, { autoAlpha: 0, y: 20, duration: 0.3, ease: "power2.in" });
      }
    }, { 
      root: scrollContainerRef.current, 
      threshold: 0 
    });

    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, []);

  return createPortal(
    <div className="case-study-fullscreen" ref={overlayRef}>
      <div className="carousel-layout">
        
        <div className="carousel-left">
          <button className="detail-top-label" onClick={handleBackToRoom}>
            <div className="back-icon-circle detail-faded-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </div>
            <span className="back-text detail-faded-text">{categoryName}</span>
          </button>
          
          <div className="carousel-text-content detail-content-shift">
            <button className="detail-title-btn" onClick={handleClose}>
              <div className="detail-back-arrow">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              </div>
              <h2 className="carousel-project-title m-0">{project.title}</h2>
            </button>
            
            <p className="carousel-project-desc">{project.desc}</p>
            <p className="carousel-project-desc">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, dolor sit amet, consectetuer
            </p>

            {category === 'dev' && (
              <div className="project-dev-links">
                <a href="#" className="dev-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                  Github access
                </a>
                <a href="#" className="dev-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                  View website
                </a>
              </div>
            )}
          </div>
        </div>
        
        <div className="detail-right-scroll" ref={scrollContainerRef}>
          <div className="detail-scroll-content">
            
            {category === 'design' ? (
              <>
                <div className="detail-images-grid">
                  {/* NEW: Maps index 0 and 1 from the images array into the background styles */}
                  <div 
                    className="detail-img-block"
                    style={project.images && project.images[0] ? { backgroundImage: `url(${project.images[0]})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                  ></div>
                  <div 
                    className="detail-img-block"
                    style={project.images && project.images[1] ? { backgroundImage: `url(${project.images[1]})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                  ></div>
                </div>
                <div className="detail-content-row">
                  <DetailColumn title="P1" content="Lorem ipsum dolor sit amet, consectetuer adipiscing elit, adipiscing elit, dolor sit amet, consectetuer Lorem ipsum dolor sit amet, consectetuer adipiscing elit, adipiscing elit, dolor sit amet, consectetuer adipiscing elit, dolor sit amet, consectetuer Lorem ipsum dolor sit amet, consectetuer adipiscing elit, adipiscing elit, dolor sit amet, consectetuer Lorem ipsum dolor sit amet, consectetuer adipiscing elit, adipiscing elit, dolor sit amet, consectetuer" />
                  <DetailColumn title="P2" content="Lorem ipsum dolor sit amet, consectetuer adipiscing elit, adipiscing elit, dolor sit amet, consectetuer Lorem ipsum dolor sit amet, consectetuer adipiscing elit, adipiscing elit, dolor sit amet, consectetuer" />
                </div>
              </>
            ) : (
              <>
                <div className="detail-images-grid" style={{ gridTemplateColumns: '1fr' }}>
                  {/* NEW: Maps index 0 into the large hero image block */}
                  <div 
                    className="detail-img-block large"
                    style={project.images && project.images[0] ? { backgroundImage: `url(${project.images[0]})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                  ></div>
                </div>
                <div className="detail-text-block">
                   <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, adipiscing elit, dolor sit amet, consectetuer Lorem ipsum dolor sit amet, consectetuer adipiscing elit, adipiscing elit, dolor sit amet, consectetuer</p>
                </div>
              </>
            )}

            <div className="detail-bottom-spacer"></div>
            
            <div className="scroll-trigger-pixel" ref={bottomRef}></div>

          </div>
        </div>

        {hasNext && (
          <button className="next-project-btn" ref={nextBtnRef} onClick={onNext}>
            Next project
            <div className="next-icon-circle">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </button>
        )}

      </div>
    </div>,
    document.body
  );
}