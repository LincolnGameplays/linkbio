import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Lenis from 'lenis';
import ParticleBackground from './components/ParticleBackground';
import AudioAmbience from './components/AudioAmbience';
import LinkCard from './components/LinkCard';
import heroImage from './assets/hero.jpg';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Three.js Particle Void */}
      <ParticleBackground />

      {/* Spotlight Effect */}
      <div className="spotlight" />

      {/* Audio Ambience */}
      <AudioAmbience />

      {/* Main Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          
          {/* CLEAN HEADER */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Avatar */}
            <motion.div
              className="relative inline-block mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-cyan/50 shadow-[0_0_20px_rgba(0,174,239,0.3)]">
                <img
                  src={heroImage}
                  alt="Lincoln J."
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Status Dot */}
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-carbon rounded-full border-2 border-void flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full pulse-dot" />
              </div>
            </motion.div>

            {/* Name */}
            <motion.h1
              className="text-2xl font-bold text-white tracking-wide mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              LINCOLN J.
            </motion.h1>

            {/* Badge */}
            <motion.div
              className="inline-block px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-cyan/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <p className="text-xs font-semibold tracking-wider text-cyan/80">
                OPERADOR DARK
              </p>
            </motion.div>
          </motion.div>

          {/* GRID LAYOUT */}
          <motion.div
            className="grid grid-cols-2 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
          >
            {/* MATRIX - Full Width */}
            <LinkCard
              url="https://protocolodark.vercel.app/"
              variant="matrix"
              delay={0.6}
            />

            {/* INSTAGRAM - Left Column */}
            <LinkCard
              url="https://www.instagram.com/lincojoffre/"
              variant="instagram"
              delay={0.8}
            />

            {/* TIKTOK - Right Column */}
            <LinkCard
              url="https://www.tiktok.com/@.omeentor"
              variant="tiktok"
              delay={1.0}
            />
          </motion.div>

          {/* Footer */}
          <motion.footer
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <p className="text-xs font-mono text-gray-600 tracking-wider">
              © 2025 SINDICATO. ACESSO RESTRITO.
            </p>
          </motion.footer>
        </div>
      </div>
    </div>
  );
}

export default App;
