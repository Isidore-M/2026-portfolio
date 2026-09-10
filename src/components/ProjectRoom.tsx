import { useState } from 'react';
import CategoryCarousel, { type Category } from './CategoryCarousel';

export default function ProjectRoom() {
  const [activeCategory, setActiveCategory] = useState<Category>(null);

  if (activeCategory) {
    return <CategoryCarousel category={activeCategory} onBack={() => setActiveCategory(null)} />;
  }

  // The 2-Column Split View 
  return (
    <div className="project-split-view">
      <div className="project-left-panel">
        <h1 className="project-title">Project Room</h1>
        <p className="project-description">
          Showcasing a dual focus in interactive engineering and digital visual identity.
          Select a discipline to explore the case studies.
        </p>
        <div className="category-buttons">
          <button className="category-btn" onClick={() => setActiveCategory('design')}>Graphic Design</button>
          <button className="category-btn" onClick={() => setActiveCategory('dev')}>Web | Mobile</button>
        </div>
      </div>
      <div className="project-right-panel">
        <div className="hero-placeholder-block"></div>
      </div>
    </div>
  );
}