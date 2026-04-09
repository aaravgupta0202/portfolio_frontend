import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ExternalLink, Gamepad2, Globe, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface DetailItem {
  title: string;
  description: string;
  tags: string[];
  thumbnail: string;
  year: string;
  previewImages: string[];
  url?: string;
  logo?: string;
  itchUrl?: string;
  type: 'service' | 'game';
}

export default function DetailPage({ item, onClose }: { item: DetailItem; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const images = item.previewImages?.length ? item.previewImages : [item.thumbnail];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const raf = requestAnimationFrame(() => setMounted(true));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowRight') setActiveImg(i => Math.min(i + 1, images.length - 1));
      if (e.key === 'ArrowLeft')  setActiveImg(i => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const handleClose = () => {
    setMounted(false);
    setTimeout(onClose, 300);
  };

  const link  = item.type === 'game' ? item.itchUrl : item.url;
  const label = item.type === 'game' ? 'Play on itch.io' : 'Visit Website';
  const Icon  = item.type === 'game' ? Gamepad2 : Globe;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-6"
      style={{
        background: `hsla(230,35%,4%,${mounted ? '0.88' : '0'})`,
        backdropFilter: mounted ? 'blur(20px)' : 'blur(0px)',
        transition: 'background 0.3s ease, backdrop-filter 0.3s ease',
      }}
      onClick={e => { if (e.target === overlayRef.current) handleClose(); }}
    >
      <div
        className="relative w-full md:w-[92vw] md:max-w-4xl max-h-[96vh] md:max-h-[88vh] overflow-y-auto"
        style={{
          background: 'hsl(230,28%,8%)',
          border: '1px solid hsla(248,60%,80%,0.11)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
          borderRadius: window.innerWidth < 768 ? '24px 24px 0 0' : '24px',
          transform: mounted ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.98)',
          opacity: mounted ? 1 : 0,
          transition: 'transform 0.32s cubic-bezier(0.16,1,0.3,1), opacity 0.28s ease',
        }}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={{
            background: 'hsla(248,30%,14%,0.8)',
            border: '1px solid hsla(248,60%,80%,0.12)',
            color: 'hsla(252,100%,95%,0.6)',
          }}
        >
          <X size={15} />
        </button>

        {/* Hero image with prev/next */}
        <div className="relative h-52 md:h-64 overflow-hidden rounded-t-3xl">
          <img
            src={images[activeImg]}
            alt={item.title}
            className="w-full h-full object-cover transition-opacity duration-300"
            key={activeImg}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, hsl(230,28%,8%) 0%, transparent 55%)' }} />

          {/* Prev / Next arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setActiveImg(i => Math.max(i - 1, 0))}
                disabled={activeImg === 0}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-20"
                style={{ background: 'hsla(230,35%,8%,0.75)', border: '1px solid hsla(248,60%,80%,0.12)' }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setActiveImg(i => Math.min(i + 1, images.length - 1))}
                disabled={activeImg === images.length - 1}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-20"
                style={{ background: 'hsla(230,35%,8%,0.75)', border: '1px solid hsla(248,60%,80%,0.12)' }}
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}

          {/* Dot nav */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className="rounded-full transition-all"
                  style={{
                    width: i === activeImg ? '18px' : '6px',
                    height: '6px',
                    background: i === activeImg ? 'hsl(248,90%,73%)' : 'hsla(0,0%,100%,0.3)',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-5 md:px-8 pb-8">

          {/* App icon + title — Play Store header */}
          <div className="flex items-end gap-4 -mt-10 mb-5 relative z-10">
            <div
              className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0"
              style={{ border: '2px solid hsla(248,60%,80%,0.2)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
            >
              <img src={item.logo || item.thumbnail} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="pb-1">
              <div className="flex items-center gap-2 mb-0.5">
                {item.type === 'game' && (
                  <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ background: 'hsla(280,70%,60%,0.15)', border: '1px solid hsla(280,70%,60%,0.25)', color: 'hsl(280,70%,72%)' }}>
                    Game
                  </span>
                )}
                <span className="font-mono text-[10px] text-muted-foreground">{item.year}</span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl text-foreground leading-tight">{item.title}</h2>
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-2 mb-5 p-3 rounded-xl"
            style={{ background: 'hsla(248,28%,11%,0.7)', border: '1px solid hsla(248,60%,80%,0.07)' }}>
            {[
              { label: 'Year', value: item.year },
              { label: 'Screenshots', value: images.length },
              { label: 'Tags', value: item.tags.length },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="font-display text-lg" style={{ color: 'hsl(248,90%,73%)' }}>{value}</div>
                <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {item.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full font-mono text-xs"
                style={{
                  background: item.type === 'game' ? 'hsla(280,70%,60%,0.1)' : 'hsla(192,100%,50%,0.08)',
                  border: `1px solid ${item.type === 'game' ? 'hsla(280,70%,60%,0.22)' : 'hsla(192,100%,50%,0.18)'}`,
                  color: item.type === 'game' ? 'hsl(280,70%,72%)' : 'hsl(192,100%,65%)',
                }}>
                {tag}
              </span>
            ))}
          </div>

          {/* About */}
          <div className="mb-5">
            <h3 className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2">About</h3>
            <p className="font-body text-foreground/75 leading-relaxed text-sm">{item.description}</p>
          </div>

          {/* Screenshot strip */}
          {images.length > 1 && (
            <div className="mb-6">
              <h3 className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Screenshots</h3>
              <div className="screenshots-strip flex gap-2.5 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className="flex-shrink-0 w-44 md:w-56 rounded-xl overflow-hidden transition-all"
                    style={{
                      aspectRatio: '16/9',
                      border: `2px solid ${i === activeImg ? 'hsl(248,90%,73%)' : 'hsla(248,60%,80%,0.1)'}`,
                      transform: i === activeImg ? 'scale(1.03)' : 'scale(1)',
                    }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-btn primary w-full flex items-center justify-center gap-2 py-3"
            >
              <Icon size={16} />
              {label}
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
