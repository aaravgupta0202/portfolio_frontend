import { useEffect } from 'react';

export default function GlobalEffects() {
  // Scroll reveal
  useEffect(() => {
    const observe = () => {
      const io = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
        { threshold: 0.08 }
      );
      document.querySelectorAll('.reveal:not(.visible)').forEach(el => io.observe(el));
      return io;
    };
    const io = observe();
    const mo = new MutationObserver(() => { io.disconnect(); observe(); });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);

  // Glass button ripple effect
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest('.glass-btn') as HTMLElement | null;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.cssText = `
        width:${size}px;height:${size}px;
        left:${e.clientX - rect.left - size/2}px;
        top:${e.clientY - rect.top - size/2}px;
      `;
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return (
    <>
      {/* Corner glows */}
      <div className="corner-glow tl" />
      <div className="corner-glow tr" />
      <div className="corner-glow bl" />
      <div className="corner-glow br" />

      {/* 4-edge gradual blur vignette */}
      <div className="gradual-blur gradual-blur-top"    style={{ zIndex: 98 }} />
      <div className="gradual-blur gradual-blur-bottom" style={{ zIndex: 8  }} />
      <div className="gradual-blur gradual-blur-left"   style={{ zIndex: 8  }} />
      <div className="gradual-blur gradual-blur-right"  style={{ zIndex: 8  }} />
    </>
  );
}
