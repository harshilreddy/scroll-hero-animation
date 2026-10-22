import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';

export default function App() {
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const statsContainerRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const wheelFrontRef = useRef<SVGGElement>(null);
  const wheelBackRef = useRef<SVGGElement>(null);

  // State to track if GSAP has been loaded via CDN
  const [gsapLoaded, setGsapLoaded] = useState(false);

  // 1. Dynamically load GSAP to bypass the preview environment's missing npm package
  useEffect(() => {
    // If it's already on the window object (e.g., hot reload), just use it
    if ((window as any).gsap && (window as any).ScrollTrigger) {
      setGsapLoaded(true);
      return;
    }

    const loadScript = (src: string) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    // Load GSAP core, then ScrollTrigger
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js')
      .then(() => loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js'))
      .then(() => {
        setGsapLoaded(true);
      })
      .catch(err => console.error("Failed to load GSAP:", err));
  }, []);

  // 2. Run animations once GSAP is loaded
  useLayoutEffect(() => {
    if (!gsapLoaded) return;

    const gsap = (window as any).gsap;
    const ScrollTrigger = (window as any).ScrollTrigger;

    // Register plugin
    gsap.registerPlugin(ScrollTrigger);

    // Using gsap.context for React cleanup best practices
    let ctx = gsap.context(() => {
      // --- Initial Load Animations ---
      
      // Headline Fade & Translate Up
      gsap.fromTo(
        headlineRef.current,
        { opacity: 0, y: 60, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: 'power4.out', delay: 0.2 }
      );

      // Staggered Stat Blocks
      if (statsContainerRef.current) {
        const statBlocks = statsContainerRef.current.children;
        gsap.fromTo(
          statBlocks,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: 'power3.out', delay: 0.8 }
        );
      }

      // Car Initial Entry
      gsap.fromTo(
        carRef.current,
        { opacity: 0, x: 200 },
        { opacity: 1, x: 0, duration: 2, ease: 'power3.out', delay: 0.5 }
      );

      // --- Scroll-Based Animation ---
      
      // Create a timeline linked to the scroll progress of the 300vh container
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: mainContainerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1, // Smooth scrubbing effect (1 second catch-up)
        },
      });

      // Animate the car driving forward (leftwards in the scene), scaling up, and slightly rotating
      scrollTl.to(carRef.current, {
        x: '-60vw', // Move left across the screen
        scale: 1.8,   // Grow in size
        y: '10vh',    // Dip slightly
        rotation: -2, // Slight tilt forward
        ease: 'power1.inOut',
      }, 0);

      // Rotate wheels as the car moves
      scrollTl.to([wheelFrontRef.current, wheelBackRef.current], {
        rotation: -360, // Spin wheels counter-clockwise (since moving left)
        transformOrigin: "center center",
        ease: 'none',
      }, 0);

      // Fade out the car near the end of the scroll
      scrollTl.to(carRef.current, {
        opacity: 0,
        x: '-100vw', // Completely off screen
        scale: 2.2,
        ease: 'power2.in',
      }, ">-0.2");

    }, mainContainerRef);

    return () => ctx.revert(); // Cleanup GSAP animations on unmount
  }, [gsapLoaded]);

  return (
    // Main Scroll Container (300vh to allow plenty of scrolling space)
    <div 
      ref={mainContainerRef} 
      className="relative w-full h-[300vh] bg-zinc-950 text-white font-sans selection:bg-zinc-800 overflow-x-hidden"
    >
      {/* Sticky Hero Section (Stays in viewport while scrolling the 300vh container) */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-center items-center px-6 md:px-12 z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black">
        
        {/* Background Grid Pattern (Subtle) */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        {/* Content Wrapper */}
        <div className="relative z-10 flex flex-col items-center w-full max-w-6xl mt-[-10vh]">
          
          {/* Headline */}
          <h1 
            ref={headlineRef}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-[0.2em] md:tracking-[0.4em] text-center text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 mb-12 uppercase opacity-0"
          >
            Welcome Itzfizz
          </h1>

          {/* Stats Container */}
          <div 
            ref={statsContainerRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 w-full px-4"
          >
            {/* Stat 1 */}
            <div className="flex flex-col items-center text-center space-y-2 opacity-0">
              <span className="text-4xl md:text-5xl font-bold text-emerald-400">58%</span>
              <p className="text-zinc-400 text-sm md:text-base font-medium uppercase tracking-wide">
                Increase in pick up<br />point use
              </p>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col items-center text-center space-y-2 md:border-x border-zinc-800 px-4 opacity-0">
              <span className="text-4xl md:text-5xl font-bold text-rose-400">23%</span>
              <p className="text-zinc-400 text-sm md:text-base font-medium uppercase tracking-wide">
                Decreased in customer<br />phone calls
              </p>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col items-center text-center space-y-2 opacity-0">
              <span className="text-4xl md:text-5xl font-bold text-emerald-400">27%</span>
              <p className="text-zinc-400 text-sm md:text-base font-medium uppercase tracking-wide">
                Increase in pick up<br />point use
              </p>
            </div>
          </div>
        </div>

        {/* The Visual Element (Car) */}
        <div 
          ref={carRef}
          className="absolute bottom-[10%] right-[-5%] md:right-[5%] w-[80vw] max-w-[600px] z-20 pointer-events-none drop-shadow-2xl opacity-0 will-change-transform"
        >
          {/* High-quality stylized SVG Car */}
          <svg viewBox="0 0 800 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            {/* Car Shadow */}
            <ellipse cx="400" cy="270" rx="350" ry="15" fill="black" opacity="0.6" filter="blur(10px)" />
            
            {/* Car Body Main Silhouette */}
            <path d="M120 200 L90 170 C70 150 70 130 100 110 C150 80 250 50 350 40 C450 30 550 50 630 80 C680 100 750 140 760 170 C770 200 760 220 740 230 L160 230 C130 230 120 210 120 200 Z" fill="url(#carGradient)" />
            
            {/* Car Roof & Windows */}
            <path d="M280 100 C320 60 420 40 500 50 C580 60 630 100 630 100 L560 100 C500 70 400 70 340 100 L280 100 Z" fill="#111" />
            <path d="M300 95 C350 65 420 60 480 65 L460 95 L320 95 Z" fill="#333" />
            
            {/* Details & Lines */}
            <path d="M100 150 C200 140 400 130 650 140" stroke="#444" strokeWidth="3" fill="none" />
            <path d="M680 160 L730 160" stroke="#facc15" strokeWidth="8" strokeLinecap="round" />
            <path d="M100 160 L130 160" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />
            
            {/* Back Wheel Group */}
            <g ref={wheelBackRef} style={{ transformOrigin: '220px 220px' }}>
              <circle cx="220" cy="220" r="45" fill="#111" />
              <circle cx="220" cy="220" r="35" fill="#333" />
              <circle cx="220" cy="220" r="15" fill="#777" />
              {/* Spokes */}
              <line x1="220" y1="185" x2="220" y2="255" stroke="#777" strokeWidth="4" />
              <line x1="185" y1="220" x2="255" y2="220" stroke="#777" strokeWidth="4" />
              <line x1="195" y1="195" x2="245" y2="245" stroke="#777" strokeWidth="4" />
              <line x1="195" y1="245" x2="245" y2="195" stroke="#777" strokeWidth="4" />
            </g>
            
            {/* Front Wheel Group */}
            <g ref={wheelFrontRef} style={{ transformOrigin: '600px 220px' }}>
              <circle cx="600" cy="220" r="45" fill="#111" />
              <circle cx="600" cy="220" r="35" fill="#333" />
              <circle cx="600" cy="220" r="15" fill="#777" />
              {/* Spokes */}
              <line x1="600" y1="185" x2="600" y2="255" stroke="#777" strokeWidth="4" />
              <line x1="565" y1="220" x2="635" y2="220" stroke="#777" strokeWidth="4" />
              <line x1="575" y1="195" x2="625" y2="245" stroke="#777" strokeWidth="4" />
              <line x1="575" y1="245" x2="625" y2="195" stroke="#777" strokeWidth="4" />
            </g>

            {/* Definitions */}
            <defs>
              <linearGradient id="carGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3f3f46" />
                <stop offset="50%" stopColor="#18181b" />
                <stop offset="100%" stopColor="#09090b" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Scroll Indicator */}
        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-50 animate-bounce transition-opacity duration-1000 ${gsapLoaded ? 'opacity-50' : 'opacity-0'}`}>
          <span className="text-xs uppercase tracking-widest mb-2">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
        </div>
      </div>
    </div>
  );
}
