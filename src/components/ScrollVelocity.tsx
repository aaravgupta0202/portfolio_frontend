import { useRef } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from 'framer-motion';

function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

interface VelocityRowProps {
  children: string;
  baseVelocity: number;
}

function VelocityRow({ children, baseVelocity }: VelocityRowProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });
  const directionFactor = useRef(1);

  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div className="inline-block" style={{ x }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="inline-block mr-8">{children}</span>
        ))}
      </motion.div>
    </div>
  );
}

interface ScrollVelocityProps {
  texts: [string, string];
  className?: string;
}

export default function ScrollVelocity({ texts, className = '' }: ScrollVelocityProps) {
  const row1 = `  ${texts[0]}  ·  ${texts[0]}  ·  ${texts[0]}  ·  `;
  const row2 = `  ${texts[1]}  ·  ${texts[1]}  ·  ${texts[1]}  ·  `;
  return (
    <div className={`py-8 overflow-hidden select-none ${className}`}>
      <div className="font-display italic text-2xl md:text-4xl text-primary/40">
        <VelocityRow baseVelocity={-3}>{row1}</VelocityRow>
      </div>
      <div className="font-mono text-sm md:text-base text-secondary/30 uppercase tracking-[0.3em]">
        <VelocityRow baseVelocity={3}>{row2}</VelocityRow>
      </div>
    </div>
  );
}
