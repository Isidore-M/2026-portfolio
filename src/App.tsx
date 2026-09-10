import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';
// Removed useNavigation import for now since we aren't using the state yet
import Navbar from './components/Navbar';
import ProjectRoom from './components/ProjectRoom'; 

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
          <section className="space-panel home-space">
             <h1>Home Space</h1>
          </section>

          <section className="space-panel projects-space">
             <ProjectRoom />
          </section>

          <section className="space-panel profile-space">
             <h1>Profile</h1>
          </section>
       </div>
       
       <Navbar onNavClick={handleNavClick} activeIndex={activeIndex} />
    </div>
  )
}

export default App;