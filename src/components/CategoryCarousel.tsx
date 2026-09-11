import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigation } from '../context/NavigationContext';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import CaseStudyDetail from './CaseStudyDetail';

export type Category = 'design' | 'dev' | null;

const portfolioData = {
  design: [
    { 
      id: 1, 
      title: 'Project Name', 
      desc: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, dolor sit amet, consectetuer',
      images: ['/assets/design-1-hero.jpg', '/assets/design-1-a.jpg', '/assets/design-1-b.jpg'] 
    },
    { 
      id: 2, 
      title: 'Kinetix', 
      desc: 'Animated UI component marketplace platform. Engineered complete Figma wireframes, component design systems, and dynamic GSAP animation previews.',
      images: ['/assets/kinetix-hero.jpg', '/assets/kinetix-a.jpg', '/assets/kinetix-b.jpg'] 
    },
    { 
      id: 3, 
      title: 'Veridian', 
      desc: 'Brand identity concepts, logos, and website landing page structures for an architectural firm. Created visual identities and interface mockups.',
      images: ['/assets/veridian-hero.jpg', '/assets/veridian-a.jpg', '/assets/veridian-b.jpg'] 
    }
  ],
  dev: [
    { 
      id: 4, 
      title: 'Project Name', 
      desc: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, dolor sit amet, consectetuer',
      images: ['/assets/dev-1-hero.jpg', '/assets/dev-1-a.jpg', '/assets/dev-1-b.jpg'] 
    },
    { 
      id: 5, 
      title: 'Retroid', 
      desc: 'Retro video game marketplace web application built utilizing Angular component logic, HTTP services, and robust product posting functionality.',
      images: ['/assets/retroid-hero.jpg', '/assets/retroid-a.jpg', '/assets/retroid-b.jpg'] 
    },
    { 
      id: 6, 
      title: 'TaskTik', 
      desc: 'React-based study and task management dashboard. Programmed advanced task state management, dynamic filter options, and local storage persistence.',
      images: ['/assets/tasktik-hero.jpg', '/assets/tasktik-a.jpg', '/assets/tasktik-b.jpg'] 
    }
  ]
};

interface CategoryCarouselProps {
  category: 'design' | 'dev';
  onBack: () => void;
}

export default function CategoryCarousel({ category, onBack }: CategoryCarouselProps) {
  const projects = portfolioData[category];
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<{ id: number; title: string; desc: string; images?: string[] } | null>(null);
  
  // Track if the description text is expanded
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  
  const { setIsDetailViewActive } = useNavigation();
  
  const overlayRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const activeIndexRef = useRef(activeIndex);

  // Define activeProject early so our effects can use it
  const activeProject = projects[activeIndex];

  // --- Asset Preloader ---
  // Silently caches the images for the active project so the Case Study opens instantly
  useEffect(() => {
    if (!activeProject || !activeProject.images) return;

    activeProject.images.forEach((imageSrc) => {
      const img = new Image();
      img.src = imageSrc;
    });
  }, [activeProject]);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const isDetailOpenRef = useRef(!!selectedProject);
  
  useEffect(() => {
    isDetailOpenRef.current = !!selectedProject;
  }, [selectedProject]);

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

  // --- Unified Input Handling (Wheel, Touch, Keyboard) ---
  useEffect(() => {
    setIsDetailViewActive(true);
    let timeoutId: ReturnType<typeof setTimeout>;
    let touchStartY = 0;

    // Helper functions to keep logic DRY
    const triggerNext = () => {
      isAnimating.current = true;
      setIsDescExpanded(false); // Reset text state
      setActiveIndex((prev) => prev + 1);
      timeoutId = setTimeout(() => { isAnimating.current = false; }, 500); 
    };

    const triggerPrev = () => {
      isAnimating.current = true;
      setIsDescExpanded(false); // Reset text state
      setActiveIndex((prev) => prev - 1);
      timeoutId = setTimeout(() => { isAnimating.current = false; }, 500);
    };

    // 1. Desktop Trackpad/Mouse Wheel
    const handleNativeWheel = (e: WheelEvent) => {
      if (isDetailOpenRef.current) return;
      e.preventDefault(); 

      if (isAnimating.current) return;
      if (Math.abs(e.deltaY) < 15) return;

      if (e.deltaY > 0 && activeIndexRef.current < projects.length - 1) {
        triggerNext();
      } else if (e.deltaY < 0 && activeIndexRef.current > 0) {
        triggerPrev();
      }
    };

    // 2. Mobile Touch Start
    const handleTouchStart = (e: TouchEvent) => {
      if (isDetailOpenRef.current) return;
      touchStartY = e.touches[0].clientY;
    };

    // 3. Mobile Touch End (Swipe detection)
    const handleTouchEnd = (e: TouchEvent) => {
      if (isDetailOpenRef.current || isAnimating.current) return;
      
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      // Ensure the swipe was long enough to be intentional (50px threshold)
      if (Math.abs(deltaY) < 50) return; 

      if (deltaY > 0 && activeIndexRef.current < projects.length - 1) {
        triggerNext();
      } else if (deltaY < 0 && activeIndexRef.current > 0) {
        triggerPrev();
      }
    };

    // 4. Keyboard Navigation (Arrow Keys)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDetailOpenRef.current || isAnimating.current) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        if (activeIndexRef.current < projects.length - 1) triggerNext();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        if (activeIndexRef.current > 0) triggerPrev();
      }
    };

    // Attach all event listeners
    window.addEventListener('wheel', handleNativeWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      setIsDetailViewActive(false);
      // Clean up all listeners
      window.removeEventListener('wheel', handleNativeWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeoutId);
    };
  }, [setIsDetailViewActive, projects.length]);

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
            
            <p className="carousel-project-desc">
              {activeProject.desc}
              {isDescExpanded && (
                <span> Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.</span>
              )}
              <button 
                className="read-more-btn" 
                onClick={() => setIsDescExpanded(!isDescExpanded)}
              >
                {isDescExpanded ? 'read less' : 'read more'}
              </button>
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

              return (
                <div 
                  key={proj.id} 
                  className={`carousel-card ${positionClass}`}
                  onClick={() => {
                    if (idx === activeIndex) {
                      setSelectedProject(proj);
                    }
                  }}
                />
              );
            })}
          </div>
          
          <div className="carousel-pagination">
            {projects.map((_, idx) => (
              <span key={idx} className={`dot ${idx === activeIndex ? 'active' : ''}`} />
            ))}
          </div>
        </div>

      </div>

      {selectedProject && (
        <CaseStudyDetail 
          category={category}
          categoryName={category === 'design' ? 'Graphic Design' : 'Web | Mobile'}
          project={selectedProject as { id: number; title: string; desc: string; images?: string[] }} 
          onClose={() => setSelectedProject(null)} 
          onBackToRoom={() => {
             setSelectedProject(null); 
             handleSmoothBack(); 
          }}
          hasNext={activeIndex < projects.length - 1}
          onNext={() => {
            const nextIdx = activeIndex + 1;
            setActiveIndex(nextIdx);
            setSelectedProject(projects[nextIdx]);
          }}
        />
      )}
    </div>,
    document.body
  );
}