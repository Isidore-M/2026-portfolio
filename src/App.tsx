import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Navbar from './components/Navbar';
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
import './App.css';
import './journey.css';
import './theme.css';
type ProjectId = 'forma' | 'goodthings' | 'object';
const projects: {
    id: ProjectId;
    name: string;
    kind: string;
    title: string;
    description: string;
    detail: string;
    tags: string[];
}[] = [
    { id: 'forma', name: 'Forma', kind: '01 / CORPORATE', title: 'Structure with a softer side.', description: 'An architectural practice, expressed through space, rhythm, and restraint.', detail: 'A corporate concept for an independent architecture practice. An editorial grid, sculptural geometry, and an expandable project index put the work first. Built with responsive layouts and clear paths from exploration to enquiry.', tags: ['Art direction', 'Web development', 'Architecture'] },
    { id: 'goodthings', name: 'Good Things', kind: '02 / PLAYFUL', title: 'A little unexpected. A lot of fun.', description: 'An independent creative studio with a personality you can play with.', detail: 'A playful studio concept that makes interaction part of its identity. Oversized type and a character built from simple shapes create a memorable first impression. Visitors can change the character’s mood and explore the studio’s selected disciplines.', tags: ['Creative development', 'Interaction', 'Studio'] },
    { id: 'object', name: 'Object', kind: '03 / ECOMMERCE', title: 'Everyday objects. Considered.', description: 'A quiet shopping experience for things worth keeping around.', detail: 'A home-goods storefront concept built around an uncomplicated product grid. Category filters, a product detail view, and a working local cart make the shopping flow tangible. Checkout is a demonstration; no payments are taken.', tags: ['Ecommerce', 'UI design', 'Frontend'] },
];
const Arrow = () => <span aria-hidden="true">↗</span>;
function Artwork({ kind }: {
    kind: ProjectId;
}) { return <div className={`artwork art-${kind}`} aria-hidden="true">{kind === 'forma' ? <><div className="arch arch-one"/><div className="arch arch-two"/><div className="arch-shadow"/></> : kind === 'goodthings' ? <div className="flower"><span className="eye eye-left"/><span className="eye eye-right"/><span className="smile"/></div> : <><div className="vase"/><div className="vase vase-small"/><div className="object-shadow"/></>}</div>; }
function Preview({ id, paused }: {
    id: ProjectId;
    paused: boolean;
}) {
    const ref = useRef<HTMLVideoElement>(null);
    useEffect(() => { const video = ref.current; if (!video)
        return; const media = matchMedia('(prefers-reduced-motion: reduce)'); const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting && !media.matches && !paused)
        void video.play().catch(() => { });
    else
        video.pause(); }, { threshold: .2 }); observer.observe(video); return () => observer.disconnect(); }, [paused]);
    return <div className={`preview preview-${id}`}><div className="browser-bar"><i /><i /><i /><span>{id === 'goodthings' ? 'goodthings.studio' : `${id}.design`}</span><span>↗</span></div><video ref={ref} src={`/previews/${id}.mp4`} poster={`/previews/${id}.png`} muted loop playsInline preload="none" aria-label={`${id} website preview`}/><div className="preview-label">LIVE CONCEPT <span>↗</span></div></div>;
}
function Portfolio() {
    const shell = useRef<HTMLDivElement>(null);
    const track = useRef<HTMLElement>(null);
    const goToPanel = useRef<(index: number) => void>(() => {});
    const close = useRef<HTMLButtonElement>(null);
    const origin = useRef<HTMLElement | null>(null);
    const [activePanel, setActivePanel] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>(() => document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
    const [category, setCategory] = useState<'design' | 'dev' | null>(null);
    const [projectIndex, setProjectIndex] = useState(0);
    const [selected, setSelected] = useState<ProjectId | null>(null);
    const [paused, setPaused] = useState(false);
    const [expandedDescription, setExpandedDescription] = useState(false);
    const collection = category === 'design' ? [projects[1], projects[0], projects[2]] : projects;
    const current = collection[projectIndex % collection.length];
    const detail = projects.find(p => p.id === selected);

    useLayoutEffect(() => {
        document.documentElement.dataset.theme = theme;
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f5f5f5' : '#171818');
        try { localStorage.setItem('portfolio-theme', theme); } catch { /* Private browsing may disable storage. */ }
    }, [theme]);

    useEffect(() => {
        const timer = window.setTimeout(() => setLoaded(true), 450);
        return () => clearTimeout(timer);
    }, []);

    useLayoutEffect(() => {
        const media = gsap.matchMedia();
        media.add('(min-width: 0px)', () => {
            const main = track.current!;
            const scene = gsap.to(main, {
                x: () => -(main.scrollWidth - window.innerWidth),
                ease: 'none',
                scrollTrigger: {
                    id: 'main-track',
                    trigger: shell.current,
                    pin: true,
                    start: 'top top',
                    end: () => `+=${main.scrollWidth - window.innerWidth}`,
                    scrub: true,
                    snap: { snapTo: [0, 0.5, 1], duration: { min: 1, max: 1.4 }, delay: 0.12, ease: 'sine.inOut', directional: false },
                    invalidateOnRefresh: true,
                    onUpdate: self => setActivePanel(Math.round(self.progress * 2)),
                },
            });
            const trigger = scene.scrollTrigger!;
            let moving = false;
            let targetIndex = Math.round(trigger.progress * 2);
            let transition: gsap.core.Tween | null = null;
            let lastWheel = 0;
            let consumed = false;
            let accumulated = 0;
            const nestedViewOpen = () => !!document.querySelector('.journey-dialog,.room-panel.is-carousel');
            const moveTo = (index: number) => {
                targetIndex = Math.max(0, Math.min(2, index));
                moving = true;
                trigger.getTween(true)?.kill();
                transition?.kill();
                transition = gsap.to(window, {
                    scrollTo: { y: trigger.start + (trigger.end - trigger.start) * targetIndex / 2, autoKill: false },
                    duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1.3,
                    ease: 'sine.inOut',
                    overwrite: 'auto',
                    onComplete: () => { moving = false; },
                });
            };
            goToPanel.current = moveTo;
            const advance = (direction: number) => {
                if (!moving) moveTo(Math.round(trigger.progress * 2) + direction);
            };
            const wheel = (event: WheelEvent) => {
                if (event.ctrlKey || nestedViewOpen()) return;
                event.preventDefault();
                const now = performance.now();
                // A fresh gesture starts after the trackpad's momentum has stopped.
                if (now - lastWheel > 180) { consumed = false; accumulated = 0; }
                lastWheel = now;
                if (moving || consumed) return;
                const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
                const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
                if (Math.sign(delta) !== Math.sign(accumulated)) accumulated = 0;
                accumulated += delta * unit;
                if (Math.abs(accumulated) >= 35) {
                    consumed = true;
                    advance(Math.sign(accumulated));
                    accumulated = 0;
                }
            };
            let touchX = 0;
            let touchY = 0;
            const touchStart = (event: TouchEvent) => {
                if (event.touches.length !== 1) return;
                touchX = event.touches[0].clientX;
                touchY = event.touches[0].clientY;
            };
            const touchMove = (event: TouchEvent) => {
                if (event.touches.length === 1 && !nestedViewOpen()) event.preventDefault();
            };
            const touchEnd = (event: TouchEvent) => {
                if (nestedViewOpen() || !event.changedTouches.length) return;
                const x = touchX - event.changedTouches[0].clientX;
                const y = touchY - event.changedTouches[0].clientY;
                const delta = Math.abs(x) > Math.abs(y) ? x : y;
                if (Math.abs(delta) >= 45) advance(Math.sign(delta));
            };
            const key = (event: KeyboardEvent) => {
                if (nestedViewOpen() || event.altKey || event.metaKey || event.ctrlKey) return;
                const target = event.target as HTMLElement;
                if (target.closest('button,a,input,textarea,select,[contenteditable="true"]')) return;
                if (!['ArrowDown','ArrowRight','ArrowUp','ArrowLeft','PageDown','PageUp','Home','End',' '].includes(event.key)) return;
                event.preventDefault();
                if (moving || event.repeat) return;
                if (event.key === 'Home') moveTo(0);
                else if (event.key === 'End') moveTo(2);
                else advance(['ArrowUp','ArrowLeft','PageUp'].includes(event.key) || (event.key === ' ' && event.shiftKey) ? -1 : 1);
            };
            window.addEventListener('wheel', wheel, { passive: false });
            window.addEventListener('touchstart', touchStart, { passive: true });
            window.addEventListener('touchmove', touchMove, { passive: false });
            window.addEventListener('touchend', touchEnd, { passive: true });
            window.addEventListener('keydown', key);
            return () => {
                transition?.kill();
                window.removeEventListener('wheel', wheel);
                window.removeEventListener('touchstart', touchStart);
                window.removeEventListener('touchmove', touchMove);
                window.removeEventListener('touchend', touchEnd);
                window.removeEventListener('keydown', key);
                goToPanel.current = () => {};
            };
        });
        return () => media.revert();
    }, []);

    const navigate = (index: number) => {
        setCategory(null);
        setSelected(null);
        goToPanel.current(index);
    };

    useEffect(() => {
        if (!category && !selected) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = previous; };
    }, [category, selected]);

    useEffect(() => {
        if (!category || selected) return;
        let accumulated = 0;
        let lastWheel = 0;
        let lockedUntil = 0;
        let touchX = 0;
        let touchY = 0;
        const advance = (direction: number) => {
            const now = performance.now();
            if (now < lockedUntil) return;
            lockedUntil = now + 650;
            setProjectIndex(index => Math.max(0, Math.min(collection.length - 1, index + direction)));
            setExpandedDescription(false);
        };
        const wheel = (event: WheelEvent) => {
            if (event.ctrlKey) return;
            event.preventDefault();
            const now = performance.now();
            const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
            const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
            // Ignore the tail of a trackpad gesture, so a single swipe moves one card.
            if (now < lockedUntil) { lastWheel = now; accumulated = 0; return; }
            if (now - lastWheel > 160 || Math.sign(delta) !== Math.sign(accumulated)) accumulated = 0;
            lastWheel = now;
            accumulated += delta * unit;
            if (Math.abs(accumulated) >= 45) { advance(Math.sign(accumulated)); accumulated = 0; }
        };
        const key = (event: KeyboardEvent) => {
            if (event.key === 'Escape') { setCategory(null); return; }
            if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(event.key)) return;
            event.preventDefault();
            advance(event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1);
        };
        const touchStart = (event: TouchEvent) => { touchX = event.touches[0].clientX; touchY = event.touches[0].clientY; };
        const touchMove = (event: TouchEvent) => {
            if (event.touches.length !== 1) return;
            event.preventDefault();
        };
        const touchEnd = (event: TouchEvent) => {
            const x = touchX - event.changedTouches[0].clientX;
            const y = touchY - event.changedTouches[0].clientY;
            const delta = Math.abs(x) > Math.abs(y) ? x : y;
            if (Math.abs(delta) > 45) advance(Math.sign(delta));
        };
        window.addEventListener('wheel', wheel, { passive: false });
        window.addEventListener('keydown', key);
        const room = document.getElementById('work')!;
        room.addEventListener('touchstart', touchStart, { passive: true });
        room.addEventListener('touchmove', touchMove, { passive: false });
        room.addEventListener('touchend', touchEnd, { passive: true });
        return () => {
            window.removeEventListener('wheel', wheel);
            window.removeEventListener('keydown', key);
            room.removeEventListener('touchstart', touchStart);
            room.removeEventListener('touchmove', touchMove);
            room.removeEventListener('touchend', touchEnd);
        };
    }, [category, selected, collection.length]);

    useEffect(() => {
        if (!selected) return;
        origin.current = document.activeElement as HTMLElement;
        close.current?.focus();
        const key = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setSelected(null);
            if (event.key !== 'Tab') return;
            const nodes = Array.from(document.querySelectorAll<HTMLElement>('.journey-dialog button,.journey-dialog a'));
            const first = nodes[0], last = nodes[nodes.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        };
        document.addEventListener('keydown', key);
        return () => { document.removeEventListener('keydown', key); origin.current?.focus(); };
    }, [selected]);

    useEffect(() => {
        if (!selected) return;
        const rail = document.querySelector<HTMLElement>('.detail-story');
        if (!rail) return;
        let lastStep = 0;
        let accumulated = 0;
        let startX = 0;
        let startY = 0;
        const step = (direction: number) => {
            const now = performance.now();
            if (now - lastStep < 650) return;
            lastStep = now;
            rail.scrollBy({ left: direction * rail.clientWidth, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
        };
        const wheel = (event: WheelEvent) => {
            if (event.ctrlKey) return;
            event.preventDefault();
            accumulated += Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
            if (Math.abs(accumulated) > 35) { step(Math.sign(accumulated)); accumulated = 0; }
        };
        const start = (event: TouchEvent) => { startX = event.touches[0].clientX; startY = event.touches[0].clientY; };
        const move = (event: TouchEvent) => { if (event.touches.length === 1) event.preventDefault(); };
        const end = (event: TouchEvent) => {
            const x = startX - event.changedTouches[0].clientX;
            const y = startY - event.changedTouches[0].clientY;
            const delta = Math.abs(x) > Math.abs(y) ? x : y;
            if (Math.abs(delta) > 40) step(Math.sign(delta));
        };
        const key = (event: KeyboardEvent) => {
            if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) return;
            event.preventDefault();
            step(event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1);
        };
        rail.addEventListener('wheel', wheel, { passive: false });
        rail.addEventListener('touchstart', start, { passive: true });
        rail.addEventListener('touchmove', move, { passive: false });
        rail.addEventListener('touchend', end, { passive: true });
        rail.addEventListener('keydown', key);
        return () => {
            rail.removeEventListener('wheel', wheel);
            rail.removeEventListener('touchstart', start);
            rail.removeEventListener('touchmove', move);
            rail.removeEventListener('touchend', end);
            rail.removeEventListener('keydown', key);
        };
    }, [selected]);

    const chooseCategory = (value: 'design' | 'dev') => { navigate(1); setCategory(value); setProjectIndex(0); setExpandedDescription(false); };
    return <div className={`journey ${loaded ? 'journey-ready' : ''}`}>
        <div className="splash" aria-hidden="true"><span>im.</span></div>
        {!selected && <button className="theme-toggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{theme === 'dark' ? <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></> : <path d="M21 13a9 9 0 0 1-10-10 9 9 0 1 0 10 10Z"/>}</svg>
            <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>}
        <a className="skip-link" href="#work" onClick={event => { event.preventDefault(); navigate(1); }}>Skip to projects</a>
        <div className="journey-shell" ref={shell}>
            <main className="journey-track" ref={track} aria-label="Horizontal portfolio">
                <section id="home" className="journey-panel intro-panel" data-index="0" aria-label="Introduction">
                    <div className="intro-copy"><h1>Isidore Manga</h1><p>Front end developer <span>|</span> Bridge builder</p><small>for those with visions to share and more…</small></div>
                    <div className="intro-fan" aria-label="Selected project previews">
                        {[projects[0], projects[1], projects[2], projects[0]].map((project, index) => <a className={`fan-card fan-card-${index}`} key={index} href={`?demo=${project.id}`} aria-label={`Explore ${project.name} concept`}><Preview id={project.id} paused={paused} /></a>)}
                    </div>
                    <div className="intro-foot"><span>DESIGN MEETS DEVELOPMENT</span><button onClick={() => navigate(1)}>Scroll to explore <span>→</span></button></div>
                </section>
                <section id="work" className={`journey-panel room-panel ${category ? 'is-carousel' : ''}`} data-index="1" aria-label="Project Room">
                    <div className="room-copy">
                        {category ? <><button className="room-back" onClick={() => setCategory(null)}><span className="back-disc">←</span><span>{category === 'design' ? 'Graphic Design' : 'Web / Mobile'}</span></button><div className="project-copy" key={current.id}><h2>{current.name}</h2><p>{current.description}</p><p className="room-secondary">{current.title} {expandedDescription && <span>{current.detail}</span>} <button className="description-toggle" aria-expanded={expandedDescription} onClick={() => setExpandedDescription(!expandedDescription)}>{expandedDescription ? 'read less' : 'read more'}</button></p><button className="room-pill solid" onClick={() => setSelected(current.id)}>View case study <Arrow /></button><a className="room-demo-link" href={`?demo=${current.id}`}>Explore website <Arrow /></a></div></> : <div className="room-introduction"><h2>Project Room</h2><p>A dual focus in interactive engineering and digital visual identity. Choose a discipline to explore.</p><div className="room-categories"><button className="room-pill" onClick={() => chooseCategory('design')}>Graphic Design</button><button className="room-pill" onClick={() => chooseCategory('dev')}>Web / Mobile</button></div></div>}
                    </div>
                    <div className={`room-visual ${category ? 'is-browsing' : ''}`}>
                        <div className="stacked-previews">{category && <><div className="stack-sheet sheet-left"/><div className="stack-sheet sheet-right"/></>}{(category ? collection : [current]).map((project, index) => {
                            const offset = category ? index - projectIndex : 0;
                            return <div className={`stack-front carousel-project ${offset === 0 ? 'is-active' : ''}`} key={project.id} style={{ transform: `translateX(${offset * 11}%) scale(${offset === 0 ? 1 : 0.91})`, opacity: Math.abs(offset) > 1 ? 0 : offset === 0 ? 1 : 0.3, zIndex: offset === 0 ? 3 : 1 }} aria-hidden={offset !== 0}>
                                <button className="stack-open" tabIndex={offset === 0 ? 0 : -1} onClick={() => category ? setSelected(project.id) : chooseCategory('dev')} aria-label={category ? `Read ${project.name} case study` : 'Explore web projects'}><Preview id={project.id} paused={paused || activePanel !== 1 || offset !== 0}/></button>
                            </div>;
                        })}</div>
                        {category ? <div className="project-pagination"><button aria-label="Previous project" disabled={projectIndex === 0} onClick={() => setProjectIndex(Math.max(0, projectIndex - 1))}>←</button><div>{collection.map((project, index) => <button key={project.id} aria-label={`Show ${project.name}`} aria-pressed={projectIndex === index} onClick={() => setProjectIndex(index)} />)}</div><span>{String(projectIndex + 1).padStart(2, '0')} / {String(collection.length).padStart(2, '0')}</span><button aria-label="Next project" disabled={projectIndex === collection.length - 1} onClick={() => setProjectIndex(Math.min(collection.length - 1, projectIndex + 1))}>→</button></div> : null}
                        <span className="carousel-scroll-hint">{category ? 'Scroll to browse projects ↔' : ''}</span><button className="room-pause" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? 'Play previews ▷' : 'Pause previews Ⅱ'}</button>
                    </div>
                </section>
                <section id="about" className="journey-panel bio-panel" data-index="2" aria-label="About Isidore">
                    <div className="bio-copy"><span className="eyebrow">THE PERSON BEHIND THE PIXELS</span><h2>I’m Isidore</h2><p>I’m a frontend developer working at the intersection of design and technology. I build digital experiences that feel clear, considered, and easy to use.</p><p className="room-secondary">From the first interaction to the smallest screen, I care about how every detail comes together.</p><div className="skill-list"><span>React & TypeScript</span><span>Creative development</span><span>Motion & interaction</span></div><a className="bio-contact" href="https://www.linkedin.com/search/results/people/?keywords=Isidore%20Manga" target="_blank" rel="noreferrer">Let’s connect <Arrow /></a></div>
                    <div className="bio-visual"><div className="bio-monogram" aria-hidden="true">im.</div><span>THOUGHTFULLY DESIGNED. CAREFULLY BUILT.</span></div><small className="bio-copyright">© {new Date().getFullYear()} Isidore Manga</small>
                </section>
            </main>
            {!selected && <Navbar onNavClick={navigate} activeIndex={activePanel}/>}
            <span className="journey-position" aria-hidden="true">0{activePanel + 1} <span>/ 03</span></span>
        </div>
        {detail && <div className="case-backdrop journey-case-backdrop" onClick={() => setSelected(null)}>
            <section className={`journey-dialog ${category === 'design' ? 'graphic-detail' : 'web-detail'}`} role="dialog" aria-modal="true" aria-labelledby="case-title" onClick={event => event.stopPropagation()}>
                <div className="detail-copy">
                    <button ref={close} className="room-back detail-category-back" onClick={() => { setSelected(null); setCategory(null); }}><span className="back-disc">←</span>{category === 'design' ? 'Graphic Design' : 'Web | Mobile'}</button>
                    <div className="detail-summary"><button className="detail-title-back" onClick={() => setSelected(null)}><span className="back-disc">←</span><h2 id="case-title">{detail.name}</h2></button>
                    <p>{detail.description}</p><p className="room-secondary">{detail.title}</p>
                    <span className="detail-concept-label">SELF-INITIATED CONCEPT / 2026</span>
                    <div className="skill-list">{detail.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
                    {category !== 'design' && <a className="bio-contact" href={`?demo=${detail.id}`}>Explore website <Arrow /></a>}</div>
                </div>
                <div className="detail-story" key={detail.id} tabIndex={0} aria-label={`${detail.name} project details`}>
                    {category === 'design' ? <div className="design-visual-pair"><Artwork kind={detail.id}/><div className={`identity-board identity-${detail.id}`}><span>VISUAL IDENTITY / CONCEPT</span><strong>{detail.name}{detail.id === 'goodthings' ? '✳' : '®'}</strong><p>{detail.title}</p><div className="identity-swatches"><i/><i/><i/></div></div></div> : <Preview id={detail.id} paused={paused}/>}
                    <div className="detail-editorial"><p>{detail.detail}</p><p>{category === 'design' ? 'The visual exploration pairs a typographic identity with sculptural forms, a restrained layout, and a distinct palette. These elements carry through the concept website so the brand feels consistent from its first impression to its smaller details.' : 'Fluid layouts, considered typography, and purposeful interactions carry the same visual identity from desktop to mobile. The demo lets you explore the interface and its interactions directly.'}</p></div>
                    {category === 'design' ? <img className="detail-site-image" src={`/previews/${detail.id}.png`} alt={`${detail.name} concept identity applied to its website`} /> : <Artwork kind={detail.id}/>}
                    <div className="detail-editorial"><h3>{category === 'design' ? 'From identity to interface.' : 'One idea. Every screen.'}</h3><p>This self-initiated study explores the complete visual journey. The live concept demonstrates how the design adapts across screen sizes.</p><a className="bio-contact" href={`?demo=${detail.id}`}>Explore the concept <Arrow /></a></div>
                    <button className="room-pill" onClick={() => { const next = (collection.findIndex(project => project.id === detail.id) + 1) % collection.length; setProjectIndex(next); setSelected(collection[next].id); }}>Next project →</button>
                </div>
                <button className="detail-close" onClick={() => setSelected(null)} aria-label="Close case study">✕</button>
            </section>
        </div>}

    </div>;
}
const products = [{ name: 'Arc vessel', price: 48, category: 'Ceramics', className: 'pot' }, { name: 'Column lamp', price: 120, category: 'Lighting', className: 'lamp' }, { name: 'Pebble bowl', price: 32, category: 'Ceramics', className: 'bowl' }, { name: 'Fold side table', price: 180, category: 'Furniture', className: 'table' }];
function Demo({ id }: {
    id: ProjectId;
}) {
    const [filter, setFilter] = useState('All');
    const [cart, setCart] = useState<number[]>([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [product, setProduct] = useState<number | null>(null);
    const [mood, setMood] = useState(false);
    const [expanded, setExpanded] = useState<number | null>(null);
    const [notice, setNotice] = useState('');
    useEffect(() => { if (!cartOpen && product === null)
        return; const focused = document.activeElement as HTMLElement; const prev = document.body.style.overflow; document.body.style.overflow = 'hidden'; const handler = (event: KeyboardEvent) => { if (event.key === 'Escape') {
        setCartOpen(false);
        setProduct(null);
    } if (event.key === 'Tab') {
        const elements = Array.from(document.querySelectorAll<HTMLElement>('.shop-panel button:not(:disabled),.shop-panel a'));
        const first = elements[0], last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
        }
        else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
        }
    } }; document.addEventListener('keydown', handler); return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', handler); focused?.focus(); }; }, [cartOpen, product]);
    return <div className={`demo demo-${id}`}><div className="demo-banner"><a href="/">← Isidore Manga / Portfolio</a><span>SELF-INITIATED CONCEPT — INTERACTIVE DEMO</span></div>{id === 'forma' ? <><nav className="demo-nav"><a href="?demo=forma" className="demo-logo">forma<span>®</span></a><div><a href="#practice">Practice</a><a href="#projects">Selected projects</a><a href="#enquire">Get in touch ↗</a></div></nav><section className="forma-hero"><span className="demo-eyebrow">ARCHITECTURE & SPACES</span><h1>Spaces for<br />a different<br /><em>perspective.</em></h1><Artwork kind="forma"/><div className="forma-hero-foot"><p>Thoughtful architecture.<br />Lasting connections.</p><a href="#projects">Explore our approach ↓</a></div></section><section id="practice" className="demo-section forma-intro"><span className="demo-eyebrow">01 / OUR PRACTICE</span><h2>We shape spaces.<br />Spaces shape us.</h2><p>Forma is a fictional architecture practice exploring the balance between people, place, and possibility. Quiet materials. Intentional details. Room to live.</p></section><section id="projects" className="demo-section"><span className="demo-eyebrow">02 / SELECTED EXPLORATIONS</span>{['The Courtyard House', 'Stillwater Pavilion', 'Common Ground'].map((name, i) => <div className="forma-project" key={name}><button aria-expanded={expanded === i} onClick={() => setExpanded(expanded === i ? null : i)}><span>0{i + 1}</span><h3>{name}</h3><span>{expanded === i ? '−' : '+'}</span></button>{expanded === i && <div className="project-expanded"><Artwork kind="forma"/><p>{['A private retreat arranged around a light-filled central courtyard.', 'An open pavilion exploring the relationship between shelter and landscape.', 'A shared workspace designed around movement, daylight, and community.'][i]} Concept study / 2026.</p></div>}</div>)}</section><section id="enquire" className="demo-section forma-contact"><h2>Every space begins<br />with a conversation.</h2><button onClick={() => setNotice('Thanks for exploring Forma. This is a concept practice; return to the portfolio to connect with Isidore.')}>Start a conversation ↗</button>{notice && <p role="status">{notice}</p>}</section></> : id === 'goodthings' ? <><nav className="demo-nav"><a className="demo-logo" href="?demo=goodthings">good things<span>✳</span></a><div><a href="#studio-work">Our things</a><a href="#studio-about">The studio</a><a href="#say-hello">Say hello ↗</a></div></nav><section className={`play-hero ${mood ? 'happy' : ''}`}><div className="play-label">SMALL STUDIO. BIG GOOD ENERGY.</div><h1>We make<br />good <em>things.</em></h1><button className="character-button" onClick={() => setMood(!mood)} aria-label="Change the character’s mood"><Artwork kind="goodthings"/></button><div className="play-foot"><p>Ideas with a twist.<br />Design with a smile.</p><span>↑ GO ON, GIVE IT A TAP</span><a href="#studio-work">See the good stuff ↓</a></div></section><div className="ticker">GOOD PEOPLE ✳ GOOD IDEAS ✳ GOOD THINGS ✳ GOOD PEOPLE ✳ GOOD IDEAS ✳</div><section id="studio-work" className="demo-section"><span className="demo-eyebrow">THINGS WE LIKE MAKING</span><div className="play-services">{['Brands with personality', 'Websites with a pulse', 'Things that move'].map((s, i) => <button key={s} onClick={() => setExpanded(expanded === i ? null : i)} aria-expanded={expanded === i}><span>0{i + 1}</span><h2>{s}</h2><span>↗</span>{expanded === i && <p>{['From a first scribble to a visual world. Identity, typography, and a little unexpected magic.', 'Digital homes for big ideas. Responsive, expressive, and made for actual humans.', 'Small interactions, big reactions. Motion that brings a brand to life.'][i]}</p>}</button>)}</div></section><section id="studio-about" className="demo-section play-about"><span>✳</span><h2>Serious about<br />not being boring.</h2><p>Good Things is a fictional independent creative studio. This concept is an exploration of a friendlier, more expressive corner of the internet.</p></section><section id="say-hello" className="demo-section"><h2>Got a good feeling?</h2><button className="play-hello" onClick={() => setNotice('Hello right back! 👋 This studio is a concept by Isidore Manga.')}>Give us a wave ↗</button>{notice && <p role="status">{notice}</p>}</section></> : <><nav className="demo-nav"><a className="demo-logo" href="?demo=object">object<span>®</span></a><div><a href="#collection">Shop collection</a><a href="#philosophy">Our philosophy</a><button onClick={() => setCartOpen(true)}>Bag ({cart.length})</button></div></nav><section className="shop-hero"><div><span className="demo-eyebrow">FEWER THINGS. BETTER THINGS.</span><h1>Objects for<br />the everyday.</h1><p>Considered forms. Honest materials.<br />A little more meaning in the ordinary.</p><a className="shop-cta" href="#collection">Discover the collection ↗</a></div><Artwork kind="object"/><span className="shop-edition">THE EVERYDAY EDIT / 01</span></section><section id="collection" className="demo-section"><div className="collection-heading"><h2>The collection</h2><span>DESIGNED TO STAY.</span></div><div className="shop-filters" aria-label="Product categories">{['All', 'Ceramics', 'Lighting', 'Furniture'].map(f => <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>{f}</button>)}</div><div className="product-grid">{products.map((p, i) => (filter === 'All' || p.category === filter) && <button key={p.name} className="product-tile" onClick={() => setProduct(i)}><div className={`product-art ${p.className}`}><div /></div><div className="product-caption"><span>{p.name}<small>{p.category}</small></span><span>${p.price}</span></div></button>)}</div></section><section id="philosophy" className="demo-section shop-philosophy"><span className="demo-eyebrow">THE OBJECT PHILOSOPHY</span><h2>Made for living.<br />Worth keeping.</h2><p>A concept collection exploring thoughtful objects and a quieter way to shop. All products and prices are illustrative.</p></section>{(cartOpen || product !== null) && <div className="shop-backdrop" onClick={() => { setCartOpen(false); setProduct(null); }}><section className="shop-panel" role="dialog" aria-modal="true" aria-label={cartOpen ? 'Shopping bag' : 'Product details'} onClick={e => e.stopPropagation()}><button className="close-button" autoFocus onClick={() => { setCartOpen(false); setProduct(null); }}>Close ✕</button>{product !== null ? <><div className={`product-art ${products[product].className}`}><div /></div><h2>{products[product].name}</h2><p>A considered form for everyday spaces. Illustrative concept product.</p><p>${products[product].price} CAD</p><button className="shop-cta" onClick={() => { setCart([...cart, product]); setProduct(null); setCartOpen(true); }}>Add to bag ↗</button></> : <><h2>Your bag ({cart.length})</h2>{cart.length ? cart.map((idx, i) => <div className="bag-item" key={i}><span>{products[idx].name} · ${products[idx].price}</span><button onClick={() => setCart(cart.filter((_, n) => n !== i))}>Remove</button></div>) : <p>Your bag is waiting for something good.</p>}<h3>Total: ${cart.reduce((sum, i) => sum + products[i].price, 0)} CAD</h3><button className="shop-cta" disabled={!cart.length} onClick={() => setNotice('This is a demo checkout. No order was placed and no payment is collected.')}>Demo checkout ↗</button>{notice && <p role="status">{notice}</p>}</>}</section></div>}</>}<footer className="demo-footer"><span>{id === 'forma' ? 'forma®' : id === 'goodthings' ? 'good things ✳' : 'object®'} — A concept by Isidore Manga</span><a href="/">Back to portfolio ↗</a></footer></div>;
}
export default function App() { const id = new URLSearchParams(window.location.search).get('demo'); useEffect(() => { document.title = id && projects.some(p => p.id === id) ? `${projects.find(p => p.id === id)?.name} — Concept by Isidore Manga` : 'Isidore Manga — Frontend Developer'; }, [id]); return id && projects.some(p => p.id === id) ? <Demo id={id as ProjectId}/> : <Portfolio />; }
