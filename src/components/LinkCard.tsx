import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import VanillaTilt from 'vanilla-tilt';

interface LinkCardProps {
    title: string;
    subtitle: string;
    url: string;
    image: string;
    borderColor?: string;
    isPriority?: boolean;
    delay?: number;
}

const LinkCard: React.FC<LinkCardProps> = ({
    title,
    subtitle,
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
            max: 5,
            speed: 400,
            glare: true,
            'max-glare': 0.2,
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

        // Magnetic effect - pull card towards cursor
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
        relative block w-full overflow-hidden rounded-xl
        bg-white/[0.02] backdrop-blur-xl border-2
        transition-all duration-300 group
        ${isPriority ? 'heartbeat' : ''}
      `}
            style={{
                borderColor: borderColor,
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
                borderColor: isPriority ? '#FFD700' : '#00AEEF',
                boxShadow: isPriority
                    ? '0 0 30px rgba(255, 215, 0, 0.3)'
                    : '0 0 30px rgba(0, 174, 239, 0.3)',
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className="flex items-center gap-4 p-4">
                {/* Thumbnail */}
                <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-carbon border border-white/10">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className={`text-lg font-bold text-white mb-1 ${isPriority ? 'glitch' : ''}`}>
                        {title}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">
                        {subtitle}
                    </p>
                </div>

                {/* Arrow Icon */}
                <div className="flex-shrink-0 text-white/50 group-hover:text-cyan group-hover:translate-x-1 transition-all duration-300">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </div>
            </div>

            {/* Priority Badge */}
            {isPriority && (
                <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-gold/20 border border-gold/50 text-gold text-xs font-bold tracking-wider">
                    PRIORIDADE
                </div>
            )}
        </motion.a>
    );
};

export default LinkCard;
