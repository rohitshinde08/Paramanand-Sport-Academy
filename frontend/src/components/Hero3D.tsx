import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scaleImage = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-primary">
      
      {/* Cinematic Parallax Background Image */}
      <motion.div 
        className="absolute inset-0 z-0 origin-top"
        style={{ y: yBackground, scale: scaleImage }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-top"
          style={{ backgroundImage: "url('/img/banners/mainbanner1.jpg')" }}
        />
        {/* Aggressive gradient overlays for contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/50 to-primary"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-transparent to-primary/90"></div>
      </motion.div>

      {/* Foreground Content & Kinetic Typography */}
      <motion.div 
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6"
        style={{ y: yText, opacity: opacityText }}
      >
        <div className="text-center max-w-5xl w-full">
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 inline-block"
          >
            <span className="text-accent font-bold tracking-[0.4em] uppercase text-xs md:text-sm px-4 py-2 border border-accent/30 rounded-full backdrop-blur-md bg-primary/20">
              Parmanand Sports Academy
            </span>
          </motion.div>

          {/* Massive Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl lg:text-[9rem] font-extrabold font-heading text-white leading-[0.9] tracking-tighter uppercase"
          >
            Forge Your <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-accent via-yellow-400 to-orange-500">
              Legacy
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-8 text-slate-300 text-lg md:text-2xl max-w-2xl mx-auto font-body font-light leading-relaxed"
          >
            Elite coaching, state-of-the-art facilities, and a culture of relentless excellence. Step into the future of athletic training.
          </motion.p>

          {/* Call to Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link to="/register" className="group relative px-8 py-4 bg-accent text-primary font-bold text-lg rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(245,166,35,0.4)] flex items-center gap-2">
              <span className="relative z-10">Start Training</span>
              <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            </Link>
            
            <Link to="/about" className="px-8 py-4 text-white font-medium text-lg flex items-center gap-2 hover:text-accent transition-colors">
              Discover Facilities
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Scroll to Explore</span>
        <div className="w-[1px] h-16 bg-white/20 overflow-hidden relative">
          <motion.div 
            className="w-full h-1/2 bg-accent absolute top-0"
            animate={{ y: [0, 64, 64] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
