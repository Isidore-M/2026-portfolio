import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function HeroSpace() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Target the REAL global navbar rendered in App.tsx
    const globalNav = document.querySelector('.floating-navbar');
    const globalNavBtns = document.querySelectorAll('.floating-navbar .nav-btn');
    
    // Immediately hide the global nav so it doesn't flash before the animation starts
    if (globalNav) {
      gsap.set(globalNav, { y: 100, opacity: 0 });
      gsap.set(globalNavBtns, { scale: 0.5, opacity: 0 });
    }

    const tl = gsap.timeline();

    // 2. Text Reveal (We added the 0.3s delay here instead of the whole timeline)
    tl.fromTo('.hero-text-reveal', 
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.3 }
    )
    
    // 3. Single Block Appears
    .fromTo('.hero-card-stack',
      { y: 50, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' },
      "-=0.2" 
    )

    // 4. Pause for a split second
    .to({}, { duration: 0.3 })

    // 5. Cards Fan Out (Narrowed the X distances and softened the rotation to match your design)
    .to('.hero-card-1', { x: '-110%', y: 16, rotation: -9, duration: 0.9, ease: 'back.out(1.2)' })
    .to('.hero-card-2', { x: '-36%', y: 4, rotation: -3, duration: 0.9, ease: 'back.out(1.2)' }, "<")
    .to('.hero-card-3', { x: '36%', y: 4, rotation: 3, duration: 0.9, ease: 'back.out(1.2)' }, "<")
    .to('.hero-card-4', { x: '110%', y: 16, rotation: 9, duration: 0.9, ease: 'back.out(1.2)' }, "<");

    // 6. Global Navbar slides up smoothly
    if (globalNav && globalNavBtns.length > 0) {
      tl.to(globalNav,
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
        "-=0.5"
      )
      .to(globalNavBtns,
        { scale: 1, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(2)' },
        "-=0.3"
      );
    }

  }, { scope: containerRef });

  return (
    <div className="space-panel hero-space" ref={containerRef}>
      
      <div className="hero-text-content">
        <h1 className="hero-name hero-text-reveal">Isidore Manga</h1>
        <h2 className="hero-role hero-text-reveal">
          Front end developer <span className="hero-divider">|</span> Bridge builder
        </h2>
        <p className="hero-tagline hero-text-reveal">
          For those with visions to share and more...
        </p>
      </div>

      <div className="hero-cards-wrapper hero-card-stack">
        <div className="hero-fan-card hero-card-1"></div>
        <div className="hero-fan-card hero-card-2"></div>
        <div className="hero-fan-card hero-card-3"></div>
        <div className="hero-fan-card hero-card-4"></div>
      </div>

      {/* The dummy navbar has been completely removed! */}

    </div>
  );
}