import React from 'react';
import { motion } from 'framer-motion';

interface BlurTextProps {
    text: string;
    className?: string;
    delay?: number;
}

const BlurText: React.FC<BlurTextProps> = ({ text, className = '', delay = 0 }) => {
    const words = text.split(' ');

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className={`flex flex-wrap ${className}`}
        >
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    className="mr-[0.25em] inline-block"
                    variants={{
                        hidden: { filter: 'blur(10px)', opacity: 0, y: 10 },
                        visible: {
                            filter: 'blur(0px)',
                            opacity: 1,
                            y: 0,
                            transition: {
                                duration: 0.8,
                                delay: delay + i * 0.1,
                                ease: "easeOut"
                            }
                        }
                    }}
                >
                    {word}
                </motion.span>
            ))}
        </motion.div>
    );
};

export default BlurText;
