import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

interface InfiniteSliderProps {
    children: React.ReactNode[];
    gap?: number;
    speed?: number; // Higher is slower
    hoverToPause?: boolean;
}

const InfiniteSlider: React.FC<InfiniteSliderProps> = ({
    children,
    gap = 24,
    speed = 40,
    hoverToPause = true
}) => {
    const [containerWidth, setContainerWidth] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const controls = useAnimationControls();

    useEffect(() => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.scrollWidth / 2);
        }
    }, [children]);

    useEffect(() => {
        if (containerWidth > 0) {
            controls.start({
                x: -containerWidth,
                transition: {
                    duration: speed,
                    ease: "linear",
                    repeat: Infinity,
                },
            });
        }
    }, [containerWidth, controls, speed]);

    const handleMouseEnter = () => {
        if (hoverToPause) controls.stop();
    };

    const handleMouseLeave = () => {
        if (hoverToPause && containerWidth > 0) {
            controls.start({
                x: -containerWidth,
                transition: {
                    duration: speed * (1 - Math.abs(parseFloat(containerRef.current?.style.transform.split('(')[1] || '0') / containerWidth)),
                    ease: "linear",
                    repeat: Infinity,
                },
            });
            // Note: The simple speed adjustment above is a heuristic. 
            // For a truly perfect resume at constant speed, more complex logic is needed,
            // but "controls.start" with linear ease and same duration usually works well enough
            // for most UX if we just restart the full loop or jump to start.
            // Better approach for constant speed:
            controls.start({
                x: [null, -containerWidth],
                transition: {
                    duration: speed,
                    ease: "linear",
                    repeat: Infinity,
                }
            });
        }
    };

    return (
        <div
            className="overflow-hidden whitespace-nowrap mask-fade-edges"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                ref={containerRef}
                animate={controls}
                className="inline-flex"
                style={{ gap: `${gap}px` }}
            >
                {children}
                {children}
            </motion.div>
        </div>
    );
};

export default InfiniteSlider;
