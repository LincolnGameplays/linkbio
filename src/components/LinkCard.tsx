import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import VanillaTilt from 'vanilla-tilt';

interface LinkCardProps {
    title: string;
    url: string;
    image: string;
    borderColor?: string;
    isPriority?: boolean;
    delay?: number;
}

const LinkCard: React.FC<LinkCardProps> = ({
    title,
    url,
    image,
    borderColor = '#333',
    isPriority = false,
    delay = 0,
}) => {
    const cardRef = useRef<HTMLAnchorElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    useEffect(() => {
        if (!cardRef.current) return;

        // Initialize Vanilla Tilt
        VanillaTilt.init(cardRef.current, {
            max: 3, // Reduced tilt for banners
            speed: 400,
            glare: true,
            'max-glare': 0.1,
            scale: 1.02,
        });

        return () => {
            if (cardRef.current) {
                const instance = (cardRef.current as any).vanillaTilt;
                if (instance) instance.destroy();
            }
        };
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;

        // Magnetic effect
        const maxDistance = 150;
        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

        if (distance < maxDistance) {
            const strength = (maxDistance - distance) / maxDistance;
            mouseX.set(distanceX * strength * 0.15);
            mouseY.set(distanceY * strength * 0.15);
        } else {
            mouseX.set(0);
            mouseY.set(0);
        }
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <motion.a
            ref={cardRef}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`
        relative block w-full h-32 md:h-36 overflow-hidden rounded-xl
        border transition-all duration-300 group
        ${isPriority ? 'heartbeat shadow-[0_0_20px_rgba(255,215,0,0.15)]' : ''}
        active:scale-95
      `}
            style={{
                borderColor: borderColor,
                borderWidth: '1px',
                x,
                y,
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.8,
                delay: delay,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
            whileHover={{
                borderColor: isPriority ? '#FFD700' : borderColor === '#333' ? '#ffffff' : borderColor,
                boxShadow: isPriority
                    ? '0 0 30px rgba(255, 215, 0, 0.3)'
                    : `0 0 30px ${borderColor}40`,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Background Image */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${image})` }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent transition-opacity duration-300 group-hover:from-black/80" />

            {/* Content Container */}
            <div className="relative h-full flex items-center justify-between px-6 z-10">
                {/* Title */}
                <h3 className={`text-2xl md:text-3xl font-impact tracking-wide text-white ${isPriority ? 'glitch' : ''}`}>
                    {title}
                </h3>

                {/* Arrow Icon */}
                <div className="flex-shrink-0 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] group-hover:translate-x-2 transition-transform duration-300">
                    <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </motion.a>
    );
};

export default LinkCard;
