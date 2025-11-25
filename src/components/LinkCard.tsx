import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import VanillaTilt from 'vanilla-tilt';

interface LinkCardProps {
    title: string;
    subtitle?: string;
    url: string;
    image: string;
    borderColor?: string;
    variant?: 'hero' | 'grid';
    delay?: number;
}

const LinkCard: React.FC<LinkCardProps> = ({
    title,
    subtitle,
    url,
    image,
    borderColor = '#333',
    variant = 'grid',
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

        VanillaTilt.init(cardRef.current, {
            max: 2,
            speed: 400,
            glare: true,
            'max-glare': 0.05,
            scale: 1.01,
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

        const maxDistance = 150;
        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

        if (distance < maxDistance) {
            const strength = (maxDistance - distance) / maxDistance;
            mouseX.set(distanceX * strength * 0.1);
            mouseY.set(distanceY * strength * 0.1);
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
                relative block overflow-hidden rounded-2xl
                bg-zinc-900/50 backdrop-blur-md border border-white/10
                transition-all duration-300 group
                hover:shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]
                ${variant === 'hero' ? 'h-32' : 'h-40 flex flex-col items-center justify-center text-center p-4'}
            `}
            style={{
                borderColor: borderColor,
                x,
                y,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.6,
                delay: delay,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
            whileHover={{
                borderColor: borderColor === '#333' ? '#ffffff' : borderColor,
                boxShadow: `0 0 20px ${borderColor}20`,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {variant === 'hero' ? (
                // Hero Variant (Horizontal)
                <div className="flex items-center h-full p-4 gap-5">
                    <div className="relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-black/50 border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-500">
                        <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h3 className="text-xl font-semibold text-white tracking-tight group-hover:text-white/90 transition-colors">
                            {title}
                        </h3>
                        {subtitle && (
                            <p className="text-sm text-zinc-400 mt-1 font-medium">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    <div className="flex-shrink-0 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            ) : (
                // Grid Variant (Vertical)
                <>
                    <div className="relative w-14 h-14 mb-3 rounded-xl overflow-hidden bg-black/50 border border-white/10 shadow-lg group-hover:scale-110 transition-transform duration-500">
                        <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <h3 className="text-sm font-semibold text-white tracking-tight">
                        {title}
                    </h3>
                    {subtitle && (
                        <p className="text-xs text-zinc-500 mt-1">
                            {subtitle}
                        </p>
                    )}
                </>
            )}
        </motion.a>
    );
};

export default LinkCard;
