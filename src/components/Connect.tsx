import { Github, Linkedin, Twitter, FileText, Mail, Gamepad2 } from 'lucide-react';

interface Personal {
  name: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  itchio: string;
  resume: string;
}

export default function Connect({ links }: { links: Personal }) {
  const socials = [
    { href: links.github,   icon: <Github   size={15} />, label: 'GitHub'   },
    { href: links.linkedin, icon: <Linkedin size={15} />, label: 'LinkedIn' },
    { href: links.twitter,  icon: <Twitter  size={15} />, label: 'Twitter'  },
    { href: links.itchio,   icon: <Gamepad2 size={15} />, label: 'itch.io'  },
    { href: `mailto:${links.email}`, icon: <Mail size={15} />, label: 'Email', noBlank: true },
  ];

  return (
    <section id="connect" className="px-6 py-32 flex flex-col items-center text-center">
      <p className="font-mono text-xs tracking-widest uppercase mb-3 reveal"
        style={{ color: 'hsl(192,100%,65%)' }}>
        // Let's Talk
      </p>

      <h2 className="font-display italic text-5xl md:text-6xl text-foreground mb-4 reveal">
        Let's Build<br />Something
      </h2>

      <p className="font-body text-muted-foreground max-w-md mb-10 reveal text-sm md:text-base leading-relaxed">
        Open to freelance projects, full-time roles, and creative collaborations.
        Drop me a line — I read every message.
      </p>

      {/* Email — large Playfair italic */}
      <a
        href={`mailto:${links.email}`}
        className="font-display italic mb-14 reveal transition-all duration-300 hover:opacity-75"
        style={{ fontSize: 'clamp(1.3rem, 3.5vw, 3rem)', color: 'hsl(248,90%,73%)' }}
      >
        {links.email}
      </a>

      {/* Social links — all glass buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-5 reveal">
        {socials.map(({ href, icon, label, noBlank }) => (
          <a
            key={label}
            href={href}
            {...(!noBlank ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="glass-btn inline-flex items-center gap-2"
          >
            {icon} {label}
          </a>
        ))}
        <a
          href={links.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-btn primary inline-flex items-center gap-2"
        >
          <FileText size={15} /> Résumé
        </a>
      </div>

      {/* Footer */}
      <div
        className="mt-20 pt-8 w-full max-w-2xl flex flex-col md:flex-row items-center justify-between gap-3"
        style={{ borderTop: '1px solid hsla(248,60%,80%,0.08)' }}
      >
        <span className="font-mono text-xs text-muted-foreground/50">
          © 2025 {links.name}
        </span>
        <span className="font-mono text-xs text-muted-foreground/35">
          React · TypeScript · Three.js · Blender
        </span>
      </div>
    </section>
  );
}
