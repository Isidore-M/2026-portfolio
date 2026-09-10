import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigation } from '../context/NavigationContext';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export type Category = 'design' | 'dev' | null;

const portfolioData = {
  design: [
    { id: 1, title: 'Mono', desc: 'UI wireframes and interface components in Figma for a macOS productivity tool. Designed desktop UI screens, interactive timer components, and task creation modals.' },
    { id: 2, title: 'Kinetix', desc: 'Animated UI component marketplace platform. Engineered complete Figma wireframes, component design systems, and dynamic GSAP animation previews.' },
    { id: 3, title: 'Veridian', desc: 'Brand identity concepts, logos, and website landing page structures for an architectural firm. Created visual identities and interface mockups.' }
  ],
  dev: [
    { id: 4, title: 'The Nest', desc: 'Collaborative project-sharing mobile application. Built onboarding workflows, project spaces, and user profile data models utilizing a combined name and role architecture.' },
    { id: 5, title: 'Retroid', desc: 'Retro video game marketplace web application built utilizing Angular component logic, HTTP services, and robust product posting functionality.' },
    { id: 6, title: 'TaskTik', desc: 'React-based study and task management dashboard. Programmed advanced task state management, dynamic filter options, and local storage persistence.' }
  ]
};

interface CategoryCarouselProps {
  category: 'design' | 'dev';
  onBack: () => void;
}

export default function CategoryCarousel({ category, onBack }: CategoryCarouselProps) {
  const projects = portfolioData[category];
  const [activeIndex, setActiveIndex] = useState(0);
  const { setIsDetailViewActive } = useNavigation();
  
  const overlayRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const activeIndexRef = useRef(activeIndex);

  // FIX 1: Safely update the ref outside of the render phase
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Smooth Entry Animation syncing with the Navbar disappearing
  useGSAP(() => {
    if (overlayRef.current) {
      gsap.fromTo(overlayRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.6, ease: "power3.out" }
      );
    }
  }, { scope: overlayRef });

  const handleSmoothBack = () => {
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power3.inOut",
        onComplete: onBack
      });
    }
  };

  useEffect(() => {
    setIsDetailViewActive(true);

    // FIX 2: Use the built-in ReturnType for browser compatibility instead of NodeJS
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleNativeWheel = (e: WheelEvent) => {
      e.preventDefault(); 

      if (isAnimating.current) return;
      if (Math.abs(e.deltaY) < 15) return;

      if (e.deltaY > 0 && activeIndexRef.current < projects.length - 1) {
        isAnimating.current = true;
        setActiveIndex((prev) => prev + 1);
        timeoutId = setTimeout(() => { isAnimating.current = false; }, 600); 
      } else if (e.deltaY < 0 && activeIndexRef.current > 0) {
        isAnimating.current = true;
        setActiveIndex((prev) => prev - 1);
        timeoutId = setTimeout(() => { isAnimating.current = false; }, 600);
      }
    };

    window.addEventListener('wheel', handleNativeWheel, { passive: false });

    return () => {
      setIsDetailViewActive(false);
      window.removeEventListener('wheel', handleNativeWheel);
      clearTimeout(timeoutId);
    };
  }, [setIsDetailViewActive, projects.length]);

  const activeProject = projects[activeIndex];

  return createPortal(
    <div className="carousel-fullscreen-overlay" ref={overlayRef}>
      <div className="carousel-layout">
        
        <div className="carousel-left">
          <button className="back-btn" onClick={handleSmoothBack}>
            <div className="back-icon-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </div>
            <h1 className="back-text">{category === 'design' ? 'Graphic Design' : 'Web | Mobile'}</h1>
          </button>
          
          <div className="carousel-text-content">
            <h2 className="carousel-project-title">{activeProject.title}</h2>
            <p className="carousel-project-desc">{activeProject.desc}</p>
            <p className="carousel-project-desc">
              Explore the full case study to see the complete design process, architectural decisions, and visual assets.
              <button className="read-more-btn">read more</button>
            </p>
          </div>
        </div>
        
        <div className="carousel-right">
          <div className="carousel-card-stack">
            {projects.map((proj, idx) => {
              let positionClass = 'card-hidden';
              if (idx === activeIndex) positionClass = 'card-active';
              else if (idx === activeIndex - 1) positionClass = 'card-prev';
              else if (idx === activeIndex + 1) positionClass = 'card-next';

              return <div key={proj.id} className={`carousel-card ${positionClass}`} />;
            })}
          </div>
          
          <div className="carousel-pagination">
            {projects.map((_, idx) => (
              <span key={idx} className={`dot ${idx === activeIndex ? 'active' : ''}`} />
            ))}
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}