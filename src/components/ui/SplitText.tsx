import React from 'react';
import { motion, type Variants } from 'framer-motion';

interface SplitTextProps {
    text: string;
    className?: string;
    delay?: number;
}

const SplitText: React.FC<SplitTextProps> = ({ text, className = '', delay = 0 }) => {
    const letters = text.split('');

    const container: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.03, delayChildren: delay * 0.1 },
        },
    };

    const child: Variants = {
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
                type: 'spring',
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            rotateX: -90,
        },
    };

    return (
        <motion.span
            style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }} // overflow hidden for clean unified look
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={className}
        >
            {letters.map((letter, index) => (
                <motion.span key={index} variants={child} style={{ display: 'inline-block' }}>
                    {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
            ))}
        </motion.span>
    );
};

export default SplitText;
