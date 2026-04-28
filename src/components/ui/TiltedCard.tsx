import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltedCardProps {
    children: React.ReactNode;
    className?: string;
    maxKey?: number; // Maximum tilt angle
}

const TiltedCard: React.FC<TiltedCardProps> = ({ children, className = '', maxKey = 10 }) => {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseY = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [maxKey, -maxKey]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-maxKey, maxKey]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = ref.current?.getBoundingClientRect();
        if (rect) {
            const width = rect.width;
            const height = rect.height;
            const mouseXFromCenter = e.clientX - rect.left - width / 2;
            const mouseYFromCenter = e.clientY - rect.top - height / 2;

            x.set(mouseXFromCenter / width);
            y.set(mouseYFromCenter / height);
        }
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
            }}
            className={`relative transform-gpu transition-all duration-200 ease-out will-change-transform ${className}`}
        >
            <div style={{ transform: 'translateZ(50px)', transformStyle: 'preserve-3d' }}>
                {children}
            </div>
        </motion.div>
    );
};

export default TiltedCard;
