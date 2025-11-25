import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import VanillaTilt from 'vanilla-tilt';

interface LinkCardProps {
    url: string;
    image: string;
    borderColor?: string;
    delay?: number;
}

const LinkCard: React.FC<LinkCardProps> = ({
    url,
    image,
    borderColor = '#333',
    delay = 0,
}) => {
    const cardRef = useRef<HTMLAnchorElement>(null);

    // Motion Values for Parallax
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth Spring Physics
    const springConfig = { damping: 20, stiffness: 200 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    // Inverse Parallax Transform (Mouse Left -> Image Right)
    // Mapping +/- 150px mouse movement to +/- 15px image movement (inverted)
    const bgX = useTransform(springX, [-150, 150], [15, -15]);
    const bgY = useTransform(springY, [-150, 150], [15, -15]);

    useEffect(() => {
        if (!cardRef.current) return;

        // Layer 1: Vanilla Tilt (Physical Card Tilt)
        VanillaTilt.init(cardRef.current, {
            max: 5,
            speed: 400,
            glare: true,
            'max-glare': 0.2,
            scale: 1.02,
            gyroscope: true,
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

        // Calculate distance from center
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;

        mouseX.set(distanceX);
        mouseY.set(distanceY);
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
            className="
                relative block w-full h-32 overflow-hidden rounded-xl
                border-2 bg-black
                transition-all duration-500 group
                animate-pulse hover:animate-none
            "
            style={{
                borderColor: borderColor,
                boxShadow: `0 0 15px ${borderColor}40`,
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.8,
                delay: delay,
                ease: [0.22, 1, 0.36, 1],
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Layer 2: Parallax Image Background */}
            <motion.div
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{
                    backgroundImage: `url(${image})`,
                    scale: 1.2, // Scale up to allow movement
                    x: bgX,
                    y: bgY,
                }}
            />

            {/* Glass Reflection Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Inner Border Glow */}
            <div
                className="absolute inset-0 border border-white/20 rounded-xl opacity-50 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: `inset 0 0 20px ${borderColor}20` }}
            />
        </motion.a>
    );
};

export default LinkCard;
