import { useNavigation } from '../context/NavigationContext';

interface NavbarProps {
  onNavClick: (index: number) => void;
  activeIndex: number;
}

export default function Navbar({ onNavClick, activeIndex }: NavbarProps) {
  const { isDetailViewActive } = useNavigation();

  return (
    <nav className={`floating-navbar ${isDetailViewActive ? 'hidden' : ''}`}>
      <button onClick={() => onNavClick(0)} className={`nav-btn ${activeIndex === 0 ? 'active' : ''}`} aria-label="Home">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      </button>
      
      <button onClick={() => onNavClick(1)} className={`nav-btn ${activeIndex === 1 ? 'active' : ''}`} aria-label="Projects">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="9" y1="21" x2="9" y2="9"></line>
        </svg>
      </button>
      
      <button onClick={() => onNavClick(2)} className={`nav-btn ${activeIndex === 2 ? 'active' : ''}`} aria-label="Profile">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </button>
    </nav>
  );
}