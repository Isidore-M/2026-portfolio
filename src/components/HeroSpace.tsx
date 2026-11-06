import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// ABAB Disposition: Image, Video, Image, Video
const heroMedia = [
  { 
    id: 1, 
    type: 'image', 
    src: '/assets/hero-image-1.jpg' 
  },
  { 
    id: 2, 
    type: 'video', 
    src: '/assets/hero-video-1.mp4', 
    poster: '/assets/hero-video-1-poster.jpg' 
  },
  { 
    id: 3, 
    type: 'image', 
    src: '/assets/hero-image-2.jpg' 
  },
  { 
    id: 4, 
    type: 'video', 
    src: '/assets/hero-video-2.mp4', 
    poster: '/assets/hero-video-2-poster.jpg' 
  }
];

export default function HeroSpace() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const globalNav = document.querySelector('.floating-navbar');
    const globalNavBtns = document.querySelectorAll('.floating-navbar .nav-btn');
    
    if (globalNav) {
      gsap.set(globalNav, { y: 100, opacity: 0 });
      gsap.set(globalNavBtns, { scale: 0.5, opacity: 0 });
    }

    const tl = gsap.timeline();

    tl.fromTo('.hero-text-reveal', 
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.3 }
    )
    .fromTo('.hero-card-stack',
      { y: 50, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' },
      "-=0.2" 
    )
    .to({}, { duration: 0.3 })
    .to('.hero-card-1', { x: '-110%', y: 16, rotation: -9, duration: 0.9, ease: 'back.out(1.2)' })
    .to('.hero-card-2', { x: '-36%', y: 4, rotation: -3, duration: 0.9, ease: 'back.out(1.2)' }, "<")
    .to('.hero-card-3', { x: '36%', y: 4, rotation: 3, duration: 0.9, ease: 'back.out(1.2)' }, "<")
    .to('.hero-card-4', { x: '110%', y: 16, rotation: 9, duration: 0.9, ease: 'back.out(1.2)' }, "<");

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
          for those with visions to share and more...
        </p>
      </div>

      <div className="hero-cards-wrapper hero-card-stack">
        {heroMedia.map((media, index) => (
          <div key={media.id} className={`hero-fan-card hero-card-${index + 1}`}>
            {media.type === 'video' ? (
              <video
                src={media.src}
                poster={media.poster}
                autoPlay
                muted
                loop
                playsInline
                className="hero-media-content"
              />
            ) : (
              <img
                src={media.src}
                alt={`Hero visual ${index + 1}`}
                className="hero-media-content"
              />
            )}
          </div>
        ))}
      </div>

    </div>
  );
}