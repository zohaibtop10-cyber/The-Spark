import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Event {
    id: string;
    title: string;
    date: string;
    description?: string;
    image_url?: string;
    category: string;
    time?: string;
    location?: string;
    general_info?: string;
}

const EventDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('id', id)
                .single();

            if (data) setEvent(data);
            if (error) console.error('Error fetching event:', error);
            setLoading(false);
        };

        if (id) fetchEvent();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-stone-500 font-medium font-serif italic">Loading event details...</p>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50">
                <h2 className="text-2xl font-serif font-bold text-stone-800 mb-4 tracking-tight uppercase">Event Not Found</h2>
                <Link to="/#events" className="text-primary font-bold hover:underline uppercase tracking-widest text-sm">Return to Events</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Hero Image */}
            <div className="h-[50vh] relative overflow-hidden">
                <div className="absolute inset-0 bg-stone-900/60 z-10 opacity-70"></div>
                <img
                    src={event.image_url || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full z-20 bg-gradient-to-t from-stone-900/95 to-transparent pt-32 pb-12">
                    <div className="container mx-auto px-4">
                        <Link to="/#events" className="inline-flex items-center text-stone-300 hover:text-white mb-6 transition-colors font-bold uppercase tracking-widest text-xs">
                            <ArrowLeft size={16} className="mr-2" /> Back to Events
                        </Link>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <span className="bg-primary/90 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block backdrop-blur-sm border border-white/10">
                                {event.category}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 tracking-tight shadow-sm uppercase">{event.title}</h1>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12 -mt-10 relative z-30">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2 bg-white rounded-2xl shadow-xl shadow-stone-200/50 p-8 md:p-12 border border-stone-100"
                    >
                        <div className="prose prose-lg text-stone-600 max-w-none">
                            <h3 className="text-2xl font-serif font-bold text-stone-800 mb-6 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1 h-6 bg-accent rounded-full"></span>
                                Event Overview
                            </h3>
                            <p className="leading-relaxed mb-6 font-medium text-lg text-stone-700">
                                {event.description || "Join us for this exciting event at The Spark School & College. It's a great opportunity for students to engage, learn, and grow."}
                            </p>
                            <div className="my-10 h-px bg-stone-100"></div>
                            <h4 className="text-xl font-serif font-bold text-stone-800 mb-4 uppercase tracking-widest">General Information</h4>
                            <p className="text-sm leading-relaxed mb-8 text-stone-500">
                                {event.general_info || "Please ensure all participants arrive 15 minutes prior to the scheduled start time. For co-curricular events, students are expected to be in their respective house colors unless stated otherwise. Professional behavior and adherence to the school's code of conduct are mandatory for all attendees."}
                            </p>
                        </div>
                    </motion.div>

                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        {/* Info Card */}
                        <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 p-8 border-l-4 border-primary border border-stone-100">
                            <h3 className="text-lg font-serif font-bold text-stone-800 mb-8 uppercase tracking-widest">Event Details</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-primary shrink-0 border border-stone-100">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-1">Date</p>
                                        <p className="font-bold text-stone-700 leading-tight">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-primary shrink-0 border border-stone-100">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-1">Time</p>
                                        <p className="font-bold text-stone-700 leading-tight">{event.time || "09:00 AM - 02:00 PM"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-primary shrink-0 border border-stone-100">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-1">Location</p>
                                        <p className="font-bold text-stone-700 leading-tight text-sm">{event.location || "Main Auditorium"}</p>
                                    </div>
                                </div>
                            </div>


                        </div>

                        {/* Share Card */}

                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
