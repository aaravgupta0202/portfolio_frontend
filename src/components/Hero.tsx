import { ChevronDown, Github, Gamepad2, Globe } from 'lucide-react';

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
    >
      {/* Ghost monogram */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span
          className="font-display italic leading-none"
          style={{
            fontSize: 'clamp(18rem, 38vw, 52rem)',
            color: 'transparent',
            WebkitTextStroke: '1px hsla(248,90%,73%,0.055)',
          }}
        >
          AG
        </span>
      </div>

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        {/* Eyebrow */}
        <p className="font-mono text-secondary text-xs md:text-sm tracking-[0.28em] uppercase mb-8 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-secondary/40" />
          Developer · 3D Artist · Game Dev
          <span className="h-px w-8 bg-secondary/40" />
        </p>

        {/* Name — italic + bold Playfair contrast */}
        <h1 className="font-display leading-[0.9] mb-2">
          <span
            className="italic text-foreground block"
            style={{ fontSize: 'clamp(3.5rem, 13vw, 10rem)' }}
          >
            Aarav
          </span>
          {/* Editorial divider */}
          <div className="flex items-center justify-center gap-4 my-3">
            <span className="h-px flex-1 max-w-[80px]" style={{ background: 'hsl(248,90%,73%,0.3)' }} />
            <span className="font-mono text-[11px] text-muted-foreground tracking-widest">est. 2020</span>
            <span className="h-px flex-1 max-w-[80px]" style={{ background: 'hsla(35,87%,57%,0.3)' }} />
          </div>
          <span
            className="font-bold uppercase text-foreground block tracking-[0.1em]"
            style={{ fontSize: 'clamp(3.2rem, 12vw, 9rem)' }}
          >
            GUPTA
          </span>
        </h1>

        {/* Subtitle */}
        <p className="font-body text-muted-foreground max-w-md mx-auto mt-6 text-sm md:text-base leading-relaxed">
          Crafting immersive digital experiences — from pixel-perfect UIs to three-dimensional worlds and indie games.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
          <button
            onClick={() => scrollTo('services')}
            className="glass-btn primary inline-flex items-center gap-2"
          >
            <Globe size={14} />
            View Services
          </button>
          <button
            onClick={() => scrollTo('games')}
            className="glass-btn inline-flex items-center gap-2"
          >
            <Gamepad2 size={14} />
            Games
          </button>
          <button
            onClick={() => scrollTo('art3d')}
            className="glass-btn inline-flex items-center gap-2"
          >
            3D Art
          </button>
          <button
            onClick={() => scrollTo('connect')}
            className="glass-btn"
          >
            Get in Touch
          </button>
        </div>
      </div>

      {/* Centre scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div
          className="w-px"
          style={{
            height: '48px',
            background: 'linear-gradient(to bottom, hsl(248,90%,73%), transparent)',
            animation: 'scrollPulse 2.2s ease-in-out infinite',
          }}
        />
        <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
          Scroll
        </span>
      </div>

      {/* Right chevron on desktop */}
      <div className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-1 text-muted-foreground/50">
        <span className="font-mono text-[9px] tracking-widest uppercase">Scroll</span>
        <ChevronDown size={14} className="animate-bounce" />
      </div>
    </section>
  );
}
