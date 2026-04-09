import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Services', id: 'services' },
  { label: 'Games',    id: 'games'    },
  { label: '3D Art',   id: 'art3d'   },
  { label: 'About',    id: 'about'   },
  { label: 'Connect',  id: 'connect' },
];

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

export default function Navbar() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* ── Nav bar ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-5 md:px-10"
        style={{
          height: '66px',
          backdropFilter: 'blur(24px) saturate(1.5)',
          background: scrolled
            ? 'hsla(230,35%,7%,0.75)'
            : 'hsla(230,35%,7%,0.45)',
          borderBottom: `1px solid hsla(248,60%,80%,${scrolled ? '0.10' : '0.05'})`,
          transition: 'background 0.35s ease, border-color 0.35s ease',
        }}
      >
        {/* Logo */}
        <button
          onClick={() => scrollTo('hero')}
          className="font-display italic text-2xl tracking-wide"
          style={{ color: 'hsl(248,90%,73%)' }}
        >
          AG
        </button>

        {/* Desktop tab group — glass pill */}
        <div className="nav-pill-group hidden md:flex items-center gap-0.5">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="nav-pill-tab"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Résumé CTA */}
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener"
          className="glass-btn hidden md:inline-flex text-sm"
          style={{ padding: '8px 20px', fontSize: '0.78rem' }}
        >
          Résumé
        </a>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(o => !o)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl"
          style={{
            background: 'hsla(248,30%,15%,0.5)',
            border: '1px solid hsla(248,60%,80%,0.1)',
          }}
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* ── Mobile overlay ── */}
      <div
        className={`mobile-nav-overlay flex-col gap-6 ${open ? 'open' : ''}`}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-xl"
          style={{ background: 'hsla(248,30%,15%,0.5)', border: '1px solid hsla(248,60%,80%,0.1)' }}
        >
          <X size={18} />
        </button>

        {navItems.map((item, i) => (
          <button
            key={item.id}
            onClick={() => { scrollTo(item.id); setOpen(false); }}
            className="font-display italic transition-colors"
            style={{
              fontSize: 'clamp(2rem, 8vw, 3rem)',
              color: 'hsla(252,100%,95%,0.75)',
              opacity: open ? 1 : 0,
              transform: open ? 'translateY(0)' : 'translateY(16px)',
              transition: `opacity 0.3s ease ${i * 45}ms, transform 0.35s ease ${i * 45}ms, color 0.2s`,
            }}
            onMouseEnter={e => ((e.target as HTMLElement).style.color = 'hsl(248,90%,73%)')}
            onMouseLeave={e => ((e.target as HTMLElement).style.color = 'hsla(252,100%,95%,0.75)')}
          >
            {item.label}
          </button>
        ))}

        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener"
          className="glass-btn primary mt-2"
          style={{
            opacity: open ? 1 : 0,
            transition: `opacity 0.3s ease ${navItems.length * 45}ms`,
          }}
          onClick={() => setOpen(false)}
        >
          Résumé
        </a>
      </div>
    </>
  );
}
