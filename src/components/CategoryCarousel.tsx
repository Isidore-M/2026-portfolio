import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigation } from '../context/NavigationContext';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import CaseStudyDetail from './CaseStudyDetail';

export type Category = 'design' | 'dev' | null;

const portfolioData = {
  design: [
    { id: 1, title: 'Project Name', desc: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, dolor sit amet, consectetuer' },
    { id: 2, title: 'Kinetix', desc: 'Animated UI component marketplace platform. Engineered complete Figma wireframes, component design systems, and dynamic GSAP animation previews.' },
    { id: 3, title: 'Veridian', desc: 'Brand identity concepts, logos, and website landing page structures for an architectural firm. Created visual identities and interface mockups.' }
  ],
  dev: [
    { id: 4, title: 'Project Name', desc: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, dolor sit amet, consectetuer' },
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
  const [selectedProject, setSelectedProject] = useState<{ id: number; title: string; desc: string } | null>(null);
  const { setIsDetailViewActive } = useNavigation();
  
  const overlayRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  
  const activeIndexRef = useRef(activeIndex);
  // NEW: Ref to track if the detail view is open so we can release the scroll wheel
  const isDetailOpenRef = useRef(!!selectedProject);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

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

  useEffect(() => {
    setIsDetailViewActive(true);
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleNativeWheel = (e: WheelEvent) => {
      // THE FIX: If the detail view is open, do not prevent default! Let the browser scroll normally.
      if (isDetailOpenRef.current) return;
      
      e.preventDefault(); 

      if (isAnimating.current) return;
      if (Math.abs(e.deltaY) < 15) return;

      if (e.deltaY > 0 && activeIndexRef.current < projects.length - 1) {
        isAnimating.current = true;
        setActiveIndex((prev) => prev + 1);
        timeoutId = setTimeout(() => { isAnimating.current = false; }, 500); 
      } else if (e.deltaY < 0 && activeIndexRef.current > 0) {
        isAnimating.current = true;
        setActiveIndex((prev) => prev - 1);
        timeoutId = setTimeout(() => { isAnimating.current = false; }, 500);
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
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, dolor sit amet, consectetuer
              <button className="read-more-btn" onClick={() => setSelectedProject(activeProject)}>read more</button>
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

      {selectedProject && (
        <CaseStudyDetail 
          category={category}
          categoryName={category === 'design' ? 'Graphic Design' : 'Web | Mobile'}
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
          onBackToRoom={() => {
             setSelectedProject(null); // Clear the active project
             handleSmoothBack(); // Trigger the carousel's closing animation
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