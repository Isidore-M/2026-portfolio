interface NavbarProps {
  onNavClick: (index: number) => void;
  activeIndex: number;
}

const icons = [
  <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" /></>,
  <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M3 9h18M10 9v12" /></>,
  <><circle cx="12" cy="8" r="4" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" /></>,
];

export default function Navbar({ onNavClick, activeIndex }: NavbarProps) {
  return (
    <nav className="floating-navbar" aria-label="Portfolio navigation">
      {['Home', 'Projects', 'About'].map((label, index) => (
        <button key={label} onClick={() => onNavClick(index)}
          className={`nav-btn ${activeIndex === index ? 'active' : ''}`}
          aria-current={activeIndex === index ? 'location' : undefined}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {icons[index]}
          </svg>
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
