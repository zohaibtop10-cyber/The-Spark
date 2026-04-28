import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ShinyText from '../components/ui/ShinyText';
import { X } from 'lucide-react';

const Gallery: React.FC = () => {
    const images = [
        { src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', category: 'Campus' },
        { src: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', category: 'Events' },
        { src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', category: 'Academic' },
        { src: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', category: 'Campus' },
        { src: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', category: 'Academic' },
        { src: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', category: 'Events' },
        { src: 'https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', category: 'Campus' },
        { src: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', category: 'Events' }
    ];

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <div className="pt-20 min-h-screen bg-stone-50">
            {/* Hero */}
            <div className="bg-primary py-24 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <ShinyText text="Life at The Spark" disabled={false} speed={3} className="text-accent font-bold tracking-widest uppercase text-sm mb-4 inline-block" />
                        <h1 className="text-4xl md:text-5xl font-serif text-white mb-6 tracking-tight">Our Gallery</h1>
                        <p className="text-stone-300 opacity-90 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
                            Capturing moments of learning, joy, and achievement across our campuses.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="container mx-auto px-4 py-20">
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {images.map((img, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="break-inside-avoid relative group overflow-hidden rounded-2xl cursor-pointer"
                            onClick={() => setSelectedImage(img.src)}
                        >
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                                <span className="text-white font-medium tracking-wide border border-white/50 px-4 py-1 rounded-full">{img.category}</span>
                            </div>
                            <img src={img.src} alt="Gallery" className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500" />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button className="absolute top-6 right-6 text-white hover:text-accent transition-colors">
                            <X size={32} />
                        </button>
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            src={selectedImage}
                            alt="Full View"
                            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;
