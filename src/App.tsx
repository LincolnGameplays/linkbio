import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Lenis from 'lenis';
import ParticleBackground from './components/ParticleBackground';
import AudioAmbience from './components/AudioAmbience';
import LinkCard from './components/LinkCard';
import heroImage from './assets/hero.jpg';
import protocoloImage from './assets/3.png';
import instagramImage from './assets/4.png';
import tiktokImage from './assets/tiktok.png';

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
        <div className="w-full max-w-[480px]">
          {/* Header Section */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Avatar */}
            <div className="relative inline-block mb-4">
              <motion.div
                className="w-28 h-28 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <img
                  src={heroImage}
                  alt="Lincoln J."
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Status Indicator */}
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-carbon rounded-full border-2 border-void flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full pulse-dot" />
              </div>
            </div>

            {/* Name */}
            <motion.h1
              className="text-3xl font-impact tracking-widest text-white mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              LINCOLN J.
            </motion.h1>

            {/* Badge */}
            <motion.div
              className="inline-block px-4 py-2 rounded-full bg-white/[0.03] backdrop-blur-xl border border-white/10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <p className="text-xs font-semibold tracking-wider text-cyan">
                OPERADOR DARK // NÍVEL 5
              </p>
            </motion.div>

            {/* System Status */}
            <motion.div
              className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full pulse-dot" />
              <span className="font-mono">SYSTEM ONLINE</span>
            </motion.div>
          </motion.div>

          {/* Link Cards - Bento Grid */}
          <div className="grid grid-cols-2 gap-4 w-full">
            {/* Hero Card (Full Width) */}
            <div className="col-span-2">
              <LinkCard
                title="PROTOCOLO DARK"
                subtitle="O sistema de 5 dígitos mensais."
                url="https://protocolodark.vercel.app/"
                image={protocoloImage}
                borderColor="#FFD700"
                variant="hero"
                delay={0.9}
              />
            </div>

            {/* Social Cards (2 Columns) */}
            <LinkCard
              title="INSTAGRAM"
              subtitle="Bastidores"
              url="https://www.instagram.com/lincojoffre/"
              image={instagramImage}
              borderColor="#E1306C"
              variant="grid"
              delay={1.1}
            />

            <LinkCard
              title="TIKTOK"
              subtitle="Cortes Virais"
              url="https://www.tiktok.com/@.omeentor"
              image={tiktokImage}
              borderColor="#00F2EA"
              variant="grid"
              delay={1.3}
            />
          </div>

          {/* Footer */}
          <motion.footer
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
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
