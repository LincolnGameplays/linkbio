import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MatrixRain from './MatrixRain';

interface LinkCardProps {
  url: string;
  variant: 'matrix' | 'instagram' | 'tiktok';
  delay?: number;
}

const LinkCard: React.FC<LinkCardProps> = ({ url, variant, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [scrambledText, setScrambledText] = useState('');

  const config = {
    matrix: {
      title: 'PROTOCOLO DARK',
      className: 'h-40 col-span-2',
    },
    instagram: {
      title: 'INSTAGRAM',
      className: 'h-32 col-span-1',
    },
    tiktok: {
      title: 'TIKTOK',
      className: 'h-32 col-span-1',
    },
  };

  const { title, className } = config[variant];

  // Decode/Scramble animation for Matrix variant
  useEffect(() => {
    if (variant !== 'matrix' || !isHovered) {
      setScrambledText(title);
      return;
    }

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
    let iteration = 0;
    const interval = setInterval(() => {
      setScrambledText(
        title
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return title[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= title.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [isHovered, title, variant]);

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} relative block overflow-hidden rounded-xl group cursor-pointer`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* MATRIX VARIANT */}
      {variant === 'matrix' && (
        <>
          {/* Canvas Background */}
          <div className="absolute inset-0 bg-black">
            <MatrixRain color="#00FF41" fontSize={12} speed={40} />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center justify-center">
            <h2 className="text-3xl md:text-4xl font-mono font-bold text-green-400 tracking-wider">
              {scrambledText}
            </h2>
          </div>

          {/* Glowing Border */}
          <div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              boxShadow: isHovered
                ? '0 0 30px rgba(0, 255, 65, 0.6), inset 0 0 30px rgba(0, 255, 65, 0.2)'
                : '0 0 20px rgba(0, 255, 65, 0.4)',
              border: '2px solid rgba(0, 255, 65, 0.5)',
              transition: 'all 0.3s ease',
            }}
          />
        </>
      )}

      {/* INSTAGRAM VARIANT */}
      {variant === 'instagram' && (
        <>
          {/* Animated Gradient Background */}
          <div
            className="absolute inset-0 instagram-gradient"
            style={{
              backgroundSize: isHovered ? '400% 400%' : '200% 200%',
              transition: 'background-size 0.5s ease',
            }}
          />

          {/* Content */}
          <div className="relative z-10 h-full flex items-center justify-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
              INSTAGRAM
            </h2>
          </div>

          {/* Border */}
          <div
            className="absolute inset-0 rounded-xl pointer-events-none border-2 border-white/20"
            style={{
              boxShadow: isHovered ? '0 0 20px rgba(253, 29, 29, 0.4)' : 'none',
              transition: 'box-shadow 0.3s ease',
            }}
          />
        </>
      )}

      {/* TIKTOK VARIANT */}
      {variant === 'tiktok' && (
        <>
          {/* Background */}
          <div className="absolute inset-0 bg-black" />

          {/* Content */}
          <div className="relative z-10 h-full flex items-center justify-center">
            <h2
              className={`text-2xl md:text-3xl font-bold text-white tracking-wide transition-all duration-200 ${
                isHovered ? 'tiktok-glitch' : ''
              }`}
            >
              TIKTOK
            </h2>
          </div>

          {/* RGB Split Border */}
          <div className="absolute inset-0 rounded-xl pointer-events-none">
            {/* Cyan Left Border */}
            <div
              className="absolute left-0 top-0 bottom-0 w-0.5 bg-cyan"
              style={{
                boxShadow: isHovered ? '0 0 10px #00F2EA' : 'none',
                transition: 'box-shadow 0.3s ease',
              }}
            />
            {/* Red Right Border */}
            <div
              className="absolute right-0 top-0 bottom-0 w-0.5 bg-[#FF0050]"
              style={{
                boxShadow: isHovered ? '0 0 10px #FF0050' : 'none',
                transition: 'box-shadow 0.3s ease',
              }}
            />
            {/* Top/Bottom Borders */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan via-white to-[#FF0050]" />
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan via-white to-[#FF0050]" />
          </div>
        </>
      )}
    </motion.a>
  );
};

export default LinkCard;
