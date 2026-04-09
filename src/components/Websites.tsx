import { useEffect, useRef, useState, useCallback } from 'react';
import { ExternalLink } from 'lucide-react';

interface Website {
  title: string;
  description: string;
  tags: string[];
  url: string;
  thumbnail: string;
  logo?: string;
  year: string;
}

export default function Websites({ data }: { data: Website[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardTransforms, setCardTransforms] = useState<Record<number, { progress: number }>>({});
  const rafRef = useRef<number>();

  const totalCards = data.length;
  // Each card gets a scroll segment
  const segmentHeight = typeof window !== 'undefined' ? window.innerHeight * 0.8 : 800;
  const stickyHeight = segmentHeight * totalCards + window.innerHeight;

  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const scrolled = -rect.top;
    if (scrolled < 0) {
      setActiveIndex(0);
      setCardTransforms({});
      return;
    }

    const newTransforms: Record<number, { progress: number }> = {};
    let currentActive = 0;

    for (let i = 0; i < totalCards; i++) {
      const cardStart = i * segmentHeight;
      const cardEnd = cardStart + segmentHeight;

      if (scrolled >= cardEnd) {
        // Card fully dealt away
        newTransforms[i] = { progress: 1 };
        currentActive = Math.min(i + 1, totalCards - 1);
      } else if (scrolled > cardStart) {
        // Card is being dealt
        const p = (scrolled - cardStart) / segmentHeight;
        newTransforms[i] = { progress: p };
        currentActive = i;
      } else {
        // Card still in stack
        newTransforms[i] = { progress: 0 };
      }
    }

    setActiveIndex(currentActive);
    setCardTransforms(newTransforms);
  }, [totalCards, segmentHeight]);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(handleScroll);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  const getCardStyle = (index: number): React.CSSProperties => {
    const t = cardTransforms[index]?.progress || 0;
    const dir = index % 2 === 0 ? -1 : 1;

    if (t <= 0) {
      // In stack — slight scale offset for depth
      const stackOffset = Math.max(0, index - activeIndex);
      return {
        transform: `translateY(${stackOffset * 6}px) scale(${1 - stackOffset * 0.02})`,
        opacity: stackOffset > 3 ? 0 : 1,
        zIndex: totalCards - index,
      };
    }

    if (t >= 1) {
      return {
        transform: `rotate(${dir * 35}deg) translateX(${dir * 600}px) translateY(300px)`,
        opacity: 0,
        zIndex: totalCards - index,
        pointerEvents: 'none',
      };
    }

    // Dealing animation — card arcs away from center pivot
    const rotation = t * dir * 35;
    const translateX = t * dir * 600;
    const translateY = Math.sin(t * Math.PI) * -120 + t * 300;
    const opacity = 1 - t * t;

    return {
      transform: `rotate(${rotation}deg) translateX(${translateX}px) translateY(${translateY}px)`,
      opacity,
      zIndex: totalCards - index,
      transformOrigin: 'bottom center',
    };
  };

  // Mobile: flat list
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (isMobile) {
    return (
      <section id="websites" className="px-4 py-20">
        <h2 className="font-display italic text-4xl text-foreground text-center mb-12 reveal">
          Websites
        </h2>
        <div className="flex flex-col gap-6">
          {data.map((site, i) => (
            <MobileCard key={i} site={site} index={i} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="websites" ref={sectionRef} style={{ height: stickyHeight }} className="relative">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        <h2 className="font-display italic text-5xl md:text-6xl text-foreground mb-4 reveal">
          Websites
        </h2>

        {/* Progress dots */}
        <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-[60]">
          {data.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === activeIndex ? 'bg-primary scale-125' : i < activeIndex ? 'bg-primary/30' : 'bg-muted'
            }`} />
          ))}
        </div>

        {/* Card stack */}
        <div className="relative w-full max-w-[480px] mx-auto" style={{ height: 520 }}>
          {data.map((site, i) => (
            <div key={i} className="stack-card" style={getCardStyle(i)}>
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img src={site.thumbnail} alt={site.title}
                  className="w-full h-full object-cover" loading="lazy" />
                {site.logo && (
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-lg overflow-hidden bg-card/80 backdrop-blur-sm p-1">
                    <img src={site.logo} alt="" className="w-full h-full object-contain" />
                  </div>
                )}
                <span className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider"
                  style={{ background: 'hsla(142,70%,45%,0.2)', color: 'hsl(142,70%,60%)', border: '1px solid hsla(142,70%,45%,0.3)' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Live
                </span>
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">{site.year}</span>
                </div>
                <h3 className="font-display text-xl text-foreground mb-2">{site.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">{site.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {site.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 rounded-full text-[11px] font-mono text-secondary/80 border border-secondary/20">
                      {tag}
                    </span>
                  ))}
                </div>
                <a href={site.url} target="_blank" rel="noopener" className="glass-btn inline-flex items-center gap-2 text-xs">
                  Visit Site <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MobileCard({ site, index }: { site: Website; index: number }) {
  return (
    <div className="rounded-xl overflow-hidden border border-border/50 bg-card">
      <div className="relative h-48">
        <img src={site.thumbnail} alt={site.title} className="w-full h-full object-cover" loading="lazy" />
        <span className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-mono"
          style={{ background: 'hsla(142,70%,45%,0.2)', color: 'hsl(142,70%,60%)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Live
        </span>
      </div>
      <div className="p-4">
        <span className="font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, '0')} · {site.year}</span>
        <h3 className="font-display text-lg text-foreground mt-1 mb-2">{site.title}</h3>
        <p className="font-body text-sm text-muted-foreground mb-3">{site.description}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {site.tags.map(t => (
            <span key={t} className="px-2 py-0.5 rounded-full text-[10px] font-mono text-secondary/80 border border-secondary/20">{t}</span>
          ))}
        </div>
        <a href={site.url} target="_blank" rel="noopener" className="glass-btn inline-flex items-center gap-2 text-xs">
          Visit Site <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
