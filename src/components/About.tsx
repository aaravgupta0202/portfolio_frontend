import { useRef, useState, useEffect } from 'react';

function ProfileCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50 });

  const handleMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setRotate({ x: (y - 0.5) * -20, y: (x - 0.5) * 20 });
    setGlare({ x: x * 100, y: y * 100 });
  };

  const handleLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50 });
  };

  return (
    <div className="relative" style={{ perspective: '800px' }}>
      {/* Glow behind */}
      <div className="absolute inset-0 rounded-2xl blur-2xl opacity-30"
        style={{ background: 'hsl(var(--primary))' }} />

      <div ref={cardRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="relative w-64 h-80 rounded-2xl overflow-hidden border border-border/50 transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          background: 'hsl(var(--card))',
        }}>
        {/* Shine */}
        <div className="absolute inset-0 pointer-events-none transition-opacity duration-200"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, hsla(0,0%,100%,0.15), transparent 60%)`,
          }} />

        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center mb-4">
            <span className="font-display italic text-2xl text-primary">A</span>
          </div>
          <h3 className="font-display text-lg text-foreground">Aarav Gupta</h3>
          <p className="font-mono text-xs text-secondary mt-1">Developer & 3D Artist</p>
          <div className="flex items-center gap-2 mt-4">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-[10px] text-muted-foreground">Available for work</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CircularText() {
  const text = '✦ AARAV GUPTA ✦ DEVELOPER ✦ ARTIST ✦ ';
  return (
    <div className="hidden lg:block absolute -right-20 top-1/2 -translate-y-1/2 w-40 h-40">
      <svg viewBox="0 0 200 200" className="w-full h-full animate-spin" style={{ animationDuration: '20s' }}>
        <path id="circlePath" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" fill="none" />
        <text className="fill-primary/40" style={{ fontSize: '11px', fontFamily: 'Fragment Mono' }}>
          <textPath href="#circlePath">{text}</textPath>
        </text>
      </svg>
    </div>
  );
}

function LogoLoop({ items, direction }: { items: string[]; direction: 'left' | 'right' }) {
  return (
    <div className="overflow-hidden relative group"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
      }}>
      <div className={`flex gap-3 ${direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'}`}
        style={{ animationPlayState: 'running' }}
        onMouseEnter={e => (e.currentTarget.style.animationPlayState = 'paused')}
        onMouseLeave={e => (e.currentTarget.style.animationPlayState = 'running')}>
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="shrink-0 px-4 py-2 rounded-full text-sm font-mono text-foreground/70 whitespace-nowrap"
            style={{ background: 'hsla(248,30%,15%,0.35)', border: '1px solid hsla(248,60%,80%,0.12)' }}>
            {item}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee-left { from { transform: translateX(0); } to { transform: translateX(-33.33%); } }
        @keyframes marquee-right { from { transform: translateX(-33.33%); } to { transform: translateX(0); } }
        .animate-marquee-left { animation: marquee-left 30s linear infinite; }
        .animate-marquee-right { animation: marquee-right 30s linear infinite; }
      `}</style>
    </div>
  );
}

export default function About() {
  const skills1 = ['React', 'TypeScript', 'Three.js', 'WebGL', 'Node.js', 'Tailwind', 'Vite', 'Git'];
  const skills2 = ['Blender', 'Substance Painter', 'ZBrush', 'Figma', 'After Effects', 'Unreal Engine', 'Houdini', 'GLSL'];

  return (
    <section id="about" className="px-6 md:px-16 lg:px-24 py-20">
      <h2 className="font-display italic text-5xl md:text-6xl text-foreground text-center mb-16 reveal">About</h2>

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center reveal">
        {/* Bio */}
        <div className="flex-1 space-y-5">
          <p className="font-body text-muted-foreground leading-relaxed">
            I'm Aarav — a developer and 3D artist who thrives at the intersection of code and creativity.
            From building performant web applications to sculpting immersive environments in Blender,
            I love crafting digital experiences that feel alive.
          </p>
          <p className="font-body text-muted-foreground leading-relaxed">
            My journey started in 2020 when I discovered that the browser could be a canvas.
            Since then, I've been obsessed with pushing the boundaries of what's possible on the web,
            blending real-time 3D, generative art, and thoughtful UI design.
          </p>
          <p className="font-body text-muted-foreground leading-relaxed">
            When I'm not coding or rendering, you'll find me experimenting with procedural textures,
            reading about computational geometry, or exploring the latest in WebGPU.
            I believe the best work comes from curiosity and relentless iteration.
          </p>
        </div>

        {/* Card + circular text */}
        <div className="relative flex-shrink-0">
          <ProfileCard />
          <CircularText />
        </div>
      </div>

      {/* Skill marquee */}
      <div className="mt-16 space-y-4 max-w-4xl mx-auto reveal">
        <LogoLoop items={skills1} direction="left" />
        <LogoLoop items={skills2} direction="right" />
      </div>
    </section>
  );
}
