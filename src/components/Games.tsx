import { useEffect, useRef, useState, useCallback } from 'react';
import { Gamepad2 } from 'lucide-react';
import DetailPage from './DetailPage';

interface Game {
  title: string;
  description: string;
  tags: string[];
  itchUrl: string;
  thumbnail: string;
  year: string;
  previewImages: string[];
}

export default function Games({ data }: { data: Game[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardTransforms, setCardTransforms] = useState<Record<number, { progress: number }>>({});
  const [selected, setSelected] = useState<Game | null>(null);
  const rafRef = useRef<number>();
  const isMobileRef = useRef(typeof window !== 'undefined' && window.innerWidth < 768);

  const totalCards = data.length;
  const segmentHeight = typeof window !== 'undefined' ? window.innerHeight * 0.85 : 800;
  const stickyHeight = segmentHeight * totalCards + window.innerHeight;

  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const scrolled = -rect.top;
    if (scrolled < 0) { setActiveIndex(0); setCardTransforms({}); return; }

    const newTransforms: Record<number, { progress: number }> = {};
    let currentActive = 0;
    for (let i = 0; i < totalCards; i++) {
      const cardStart = i * segmentHeight;
      const cardEnd = cardStart + segmentHeight;
      if (scrolled >= cardEnd) {
        newTransforms[i] = { progress: 1 };
        currentActive = Math.min(i + 1, totalCards - 1);
      } else if (scrolled > cardStart) {
        newTransforms[i] = { progress: (scrolled - cardStart) / segmentHeight };
        currentActive = i;
      } else {
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
      const stackOffset = Math.max(0, index - activeIndex);
      return {
        transform: `translateY(${stackOffset * 6}px) scale(${1 - stackOffset * 0.02})`,
        opacity: stackOffset > 3 ? 0 : 1,
        zIndex: totalCards - index,
      };
    }
    if (t >= 1) {
      return { transform: `rotate(${dir * 35}deg) translateX(${dir * 600}px) translateY(300px)`, opacity: 0, zIndex: totalCards - index, pointerEvents: 'none' };
    }
    return {
      transform: `rotate(${t * dir * 35}deg) translateX(${t * dir * 600}px) translateY(${Math.sin(t * Math.PI) * -120 + t * 300}px)`,
      opacity: 1 - t * t,
      zIndex: totalCards - index,
      transformOrigin: 'bottom center',
    };
  };

  if (isMobileRef.current) {
    return (
      <section id="games" className="px-4 py-20">
        <p className="font-mono text-xs text-secondary/70 tracking-widest uppercase text-center mb-2">// Indie Games</p>
        <h2 className="font-display italic text-4xl text-foreground text-center mb-12">Games</h2>
        <div className="flex flex-col gap-5">
          {data.map((g, i) => (
            <MobileGameCard key={i} item={g} index={i} onClick={() => setSelected(g)} />
          ))}
        </div>
        {selected && <DetailPage item={{ ...selected, type: 'game' }} onClose={() => setSelected(null)} />}
      </section>
    );
  }

  return (
    <>
      <section id="games" ref={sectionRef} style={{ height: stickyHeight }} className="relative">
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
          <p className="font-mono text-xs text-secondary/70 tracking-widest uppercase mb-2">// Indie Games</p>
          <h2 className="font-display italic text-5xl md:text-6xl text-foreground mb-6">Games</h2>

          {/* Progress dots */}
          <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-[60]">
            {data.map((_, i) => (
              <div key={i} className={`rounded-full transition-all duration-300 ${
                i === activeIndex ? 'w-2 h-4 bg-primary' : i < activeIndex ? 'w-1.5 h-1.5 bg-primary/30' : 'w-1.5 h-1.5 bg-muted'
              }`} />
            ))}
          </div>

          {/* Card stack */}
          <div className="relative w-full max-w-[420px] mx-auto" style={{ height: 500 }}>
            {data.map((game, i) => (
              <div
                key={i}
                className="stack-card cursor-pointer group"
                style={getCardStyle(i)}
                onClick={() => setSelected(game)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={game.thumbnail} alt={game.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  {/* Game badge */}
                  <span className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider"
                    style={{ background: 'hsla(280,70%,60%,0.2)', color: 'hsl(280,70%,75%)', border: '1px solid hsla(280,70%,60%,0.3)' }}>
                    <Gamepad2 size={10} /> Game
                  </span>
                  <span className="absolute top-3 right-3 font-mono text-[10px] text-muted-foreground px-2 py-1 rounded-full"
                    style={{ background: 'hsla(230,35%,10%,0.7)' }}>
                    {game.year}
                  </span>
                  {/* Hover hint */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'hsla(230,35%,7%,0.5)' }}>
                    <span className="glass-btn text-xs">View Details</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="font-display text-xl text-foreground mb-1.5">{game.title}</h3>
                  <p className="font-body text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">{game.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {game.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-mono"
                        style={{ background: 'hsla(280,70%,60%,0.1)', border: '1px solid hsla(280,70%,60%,0.2)', color: 'hsl(280,70%,75%)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="font-mono text-xs text-muted-foreground/50 mt-4 animate-bounce">scroll to deal cards</p>
        </div>
      </section>

      {selected && <DetailPage item={{ ...selected, type: 'game' }} onClose={() => setSelected(null)} />}
    </>
  );
}

function MobileGameCard({ item, index, onClick }: { item: Game; index: number; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full text-left rounded-2xl overflow-hidden transition-transform active:scale-[0.98]"
      style={{ background: 'hsl(var(--card))', border: '1px solid hsla(248,60%,80%,0.1)' }}>
      <div className="relative h-40">
        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
        <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono"
          style={{ background: 'hsla(280,70%,60%,0.2)', color: 'hsl(280,70%,75%)' }}>
          <Gamepad2 size={9} /> Game
        </span>
      </div>
      <div className="p-4">
        <span className="font-mono text-[10px] text-muted-foreground">{String(index + 1).padStart(2, '0')} · {item.year}</span>
        <h3 className="font-display text-lg text-foreground mt-0.5 mb-1">{item.title}</h3>
        <p className="font-body text-xs text-muted-foreground line-clamp-2 mb-2">{item.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map(t => (
            <span key={t} className="px-2 py-0.5 rounded-full text-[10px] font-mono"
              style={{ background: 'hsla(280,70%,60%,0.1)', border: '1px solid hsla(280,70%,60%,0.2)', color: 'hsl(280,70%,75%)' }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
