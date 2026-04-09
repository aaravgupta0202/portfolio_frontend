import { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';

interface ArtPiece {
  title: string;
  description: string;
  software: string;
  thumbnail: string;
  sketchfabUrl?: string;
}

function PaperCard({ piece, index }: { piece: ArtPiece; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // 0 = twisted, 1 = flat
  const rafRef = useRef<number>();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // How far the element has travelled into the viewport
      // progress: 0 when bottom of el is at bottom of vp, 1 when center is at center
      const start = vh * 0.95;  // element just entering
      const end   = vh * 0.35;  // element nicely in view
      const pos   = rect.top;
      const p     = Math.max(0, Math.min(1, (start - pos) / (start - end)));
      setProgress(p);
    };

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const isEven = index % 2 === 0;
  // Image twists from the side it enters from
  const startAngle = isEven ? -72 : 72;
  const currentAngle = startAngle * (1 - progress);
  const brightness   = 0.3 + progress * 0.7;
  const infoX        = isEven ? 40 : -40;
  const infoSlide    = infoX * (1 - progress);

  return (
    <div ref={ref} className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${isEven ? '' : 'md:flex-row-reverse'}`}>

      {/* Twisting image */}
      <div className="w-full md:w-1/2">
        <div style={{ perspective: '1100px' }}>
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              transform: `rotateY(${currentAngle}deg)`,
              filter: `brightness(${brightness})`,
              transition: 'none',
              willChange: 'transform, filter',
              boxShadow: progress > 0.5
                ? `0 ${16 + progress * 24}px ${40 + progress * 40}px rgba(0,0,0,${0.3 + progress * 0.3}), 0 0 0 1px hsla(248,60%,80%,${0.05 + progress * 0.1})`
                : 'none',
            }}
          >
            <img
              src={piece.thumbnail}
              alt={piece.title}
              className="w-full aspect-[3/2] object-cover"
              loading="lazy"
            />
            {/* Gloss that appears as card flattens */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(105deg, transparent 30%, hsla(0,0%,100%,0.15) 50%, transparent 70%)',
                opacity: Math.max(0, progress - 0.5) * 2,
              }}
            />
          </div>
        </div>
      </div>

      {/* Info — slides in from opposite side */}
      <div
        className="w-full md:w-1/2"
        style={{
          opacity: Math.max(0, progress * 1.5 - 0.3),
          transform: `translateX(${infoSlide}px)`,
          transition: 'none',
          willChange: 'transform, opacity',
        }}
      >
        <span className="font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
        <h3 className="font-display italic text-3xl md:text-4xl text-foreground mt-2 mb-3">{piece.title}</h3>
        <p className="font-body text-muted-foreground leading-relaxed mb-4">{piece.description}</p>
        <p className="font-mono text-xs mb-6" style={{ color: 'hsl(192,100%,65%)' }}>{piece.software}</p>
        {piece.sketchfabUrl && (
          <a href={piece.sketchfabUrl} target="_blank" rel="noopener" className="glass-btn inline-flex items-center gap-2 text-xs">
            View on Sketchfab <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
}

export default function Art3D({ data }: { data: ArtPiece[] }) {
  return (
    <section id="art3d" className="px-6 md:px-16 lg:px-24 py-24">
      <p className="font-mono text-xs text-secondary/70 tracking-widest uppercase text-center mb-2">// Blender Renders</p>
      <h2 className="font-display italic text-5xl md:text-6xl text-foreground text-center mb-20">3D Art</h2>

      <div className="flex flex-col gap-28 max-w-6xl mx-auto">
        {data.map((piece, i) => (
          <PaperCard key={i} piece={piece} index={i} />
        ))}
      </div>
    </section>
  );
}
