import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Games from '@/components/Games';
import Art3D from '@/components/Art3D';
import About from '@/components/About';
import Connect from '@/components/Connect';
import ScrollVelocity from '@/components/ScrollVelocity';
import GlobalEffects from '@/components/GlobalEffects';

interface SiteData {
  personal: {
    name: string;
    email: string;
    github: string;
    linkedin: string;
    twitter: string;
    itchio: string;
    resume: string;
  };
  services: any[];
  games: any[];
  art3d: any[];
}

export default function Index() {
  const [data, setData] = useState<SiteData | null>(null);

  useEffect(() => {
    fetch('/data.json').then(r => r.json()).then(setData).catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          <span className="font-mono text-xs text-muted-foreground tracking-widest">Loading</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 bg-background">
      <GlobalEffects />
      <Navbar />

      <Hero />

      <ScrollVelocity
        texts={[
          'Aarav Gupta · Developer · 3D Artist · Game Dev',
          'Crafting immersive digital experiences'
        ]}
      />

      <Services data={data.services} />

      <ScrollVelocity
        texts={[
          'Unity · Godot · C# · GDScript · Blender · Game Jam',
          'Three.js · WebGL · React · TypeScript · Node.js'
        ]}
      />

      <Games data={data.games} />

      <ScrollVelocity
        texts={[
          'Blender · Cycles · Eevee · Substance Painter · Octane',
          'Crafted with curiosity · Built with intention'
        ]}
      />

      <Art3D data={data.art3d} />

      <ScrollVelocity
        texts={[
          'Design · Code · Create · Iterate · Ship',
          'Always building something new'
        ]}
      />

      <About />

      <Connect links={data.personal} />
    </div>
  );
}
