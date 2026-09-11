import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';

// Components
import Navbar from './components/Navbar';
import ProjectRoom from './components/ProjectRoom'; 
import HeroSpace from './components/HeroSpace'; 
import ProfileSpace from './components/ProfileSpace';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  const [activeIndex, setActiveIndex] = useState(0);

  const { contextSafe } = useGSAP(() => {
    const totalScroll = trackRef.current ? trackRef.current.offsetWidth - window.innerWidth : 0;

    gsap.to(trackRef.current, {
      x: -totalScroll,
      ease: "none",
      scrollTrigger: {
        id: "main-track",
        trigger: containerRef.current,
        pin: true,
        scrub: 1.5, 
        snap: {
          snapTo: [0, 0.5, 1], 
          duration: { min: 0.6, max: 1.2 },
          delay: 0.05,
          ease: "power3.inOut",
          directional: false 
        },
        end: () => `+=${totalScroll}`,
        onUpdate: (self) => {
          const currentIndex = Math.round(self.progress * 2);
          setActiveIndex(currentIndex);
        }
      }
    });
  }, { scope: containerRef }); 

  const handleNavClick = contextSafe((index: number) => {
    const st = ScrollTrigger.getById("main-track");
    
    if (st) {
      const progress = index / 2; 
      const targetScroll = st.start + (st.end - st.start) * progress;
      
      gsap.to(window, {
        scrollTo: { y: targetScroll, autoKill: false },
        duration: 1.2,
        ease: "power3.inOut",
        overwrite: true 
      });
    }
  });

  return (
    <div className="app-wrapper" ref={containerRef}>
       <div className="horizontal-track" ref={trackRef}>
          
          <HeroSpace />

          <section className="space-panel projects-space">
             <ProjectRoom />
          </section>

          {/* Replaced the placeholder section with the animated Profile component */}
          <ProfileSpace />
          
       </div>
       
       <Navbar onNavClick={handleNavClick} activeIndex={activeIndex} />
    </div>
  )
}

export default App;