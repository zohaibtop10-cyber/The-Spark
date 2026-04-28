import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Users,
    Star,
    ArrowRight,
    Quote,
    Calendar as CalendarIcon
} from 'lucide-react';
import { CAMPUSES, REVIEWS } from '../data';
import type { Event as DataEvent, Founder, Review } from '../data';
import { supabase } from '../lib/supabase';
import SplitText from '../components/ui/SplitText';
import ShinyText from '../components/ui/ShinyText';
import Carousel from '../components/ui/Carousel';
import InfiniteSlider from '../components/ui/InfiniteSlider';
import clsx from 'clsx';

const Landing: React.FC = () => {
    const [events, setEvents] = useState<DataEvent[]>([]);
    const [founders, setFounders] = useState<Founder[]>([]);
    const [reviews, setReviews] = useState<Review[]>(REVIEWS);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch Founders
            const { data: foundersData } = await supabase
                .from('founders')
                .select('*')
                .order('order', { ascending: true });

            if (foundersData && foundersData.length > 0) {
                setFounders(foundersData);
            } else {
                setFounders([
                    { name: "Dr. Alistair Spark", role: "Co-Founder & Chairman", quote: "Education is not just about filling a bucket, but lighting a fire.", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
                    { name: "Eleanor V. Thorne", role: "Co-Founder & Director of Academics", quote: "We build character first. Excellence follows naturally.", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" }
                ]);
            }

            const { data: eventsData } = await supabase
                .from('events')
                .select('*')
                .order('date', { ascending: true });

            setEvents(eventsData || []);

            // Fetch Reviews
            const { data: reviewsData } = await supabase
                .from('reviews')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(3);

            if (reviewsData && reviewsData.length > 0) {
                setReviews(reviewsData);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="flex flex-col gap-20 pb-20">
            {/* Hero Section */}
            <section id="home" className="relative min-h-[90vh] flex items-center bg-white overflow-hidden">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                    <div className="z-10 order-2 md:order-1 pt-10 md:pt-0">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block mb-4"
                        >
                            <ShinyText text="Excellence Since 1985" disabled={false} speed={3} className="text-accent font-bold tracking-widest uppercase text-xs" />
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-slate-900 leading-[1.1] mb-8 uppercase tracking-tighter"
                        >
                            <SplitText text="Igniting Minds," className="block" delay={0} />
                            <span className="italic text-gradient block mt-2">Shaping Futures.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-lg text-slate-500 mb-10 max-w-md leading-relaxed font-light"
                        >
                            A legacy of academic prestige and holistic development. Join a global community dedicated to intellectual growth and moral integrity.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Link to="/admissions" className="bg-primary text-white px-10 py-5 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-2xl shadow-primary/20 uppercase tracking-widest text-xs">
                                Apply Now <ArrowRight size={18} />
                            </Link>
                            <Link to="/#campuses" className="px-10 py-5 rounded-xl font-bold text-slate-700 hover:text-primary transition-all border border-slate-200 hover:border-primary/30 text-center uppercase tracking-widest text-xs">
                                Explore Campuses
                            </Link>
                        </motion.div>
                    </div>

                    <div className="relative order-1 md:order-2 h-[50vh] md:h-[80vh] w-full mr-[-10%] rounded-l-[4rem] overflow-hidden shadow-[0_40px_100px_-15px_rgba(0,0,0,0.3)] animate-float border-l-8 border-stone-50">
                        <img
                            src="THE SPARK/src/components/pages/sp main.jpg"
                            alt="Campus Architecture"
                            className="w-full h-full object-cover transform scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent"></div>
                    </div>
                </div>


            </section>

            {/* Introduction Section */}
            <section className="container mx-auto px-4 py-32 md:py-48 mt-12">
                <div className="grid md:grid-cols-2 gap-20 items-center">
                    <div className="relative group">
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-colors"></div>
                        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors"></div>
                        <img
                            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                            alt="Student Life"
                            className="relative rounded-[2.5rem] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)] z-10 w-full object-cover h-[550px]"
                        />
                        <div className="absolute -bottom-12 -right-12 bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl z-20 max-w-xs hidden lg:block border border-stone-100">
                            <Quote size={32} className="text-accent mb-4 opacity-30" />
                            <p className="font-serif italic text-stone-600 text-xl leading-relaxed">"Where tradition meets innovation in perfect harmony."</p>
                        </div>
                    </div>
                    <div>
                        <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4 block text-center md:text-left">Welcome to The Spark</span>
                        <h2 className="text-4xl md:text-6xl font-serif text-slate-900 mb-8 leading-[1.1] text-center md:text-left uppercase">A Legacy of <span className="text-accent italic underline decoration-accent/20 underline-offset-8">Excellence</span></h2>
                        <p className="text-stone-600 text-lg mb-8 leading-relaxed text-center md:text-left font-light">
                            Founded in 1985, The Spark School & College has been a beacon of educational brilliance for nearly four decades. We believe in nurturing the whole child—academically, socially, and morally.
                        </p>
                        <p className="text-stone-500 text-base mb-10 leading-relaxed text-center md:text-left italic">
                            Our curriculum is designed to challenge and inspire, fostering critical thinking and creativity. With state-of-the-art facilities and a dedicated faculty, we prepare students not just for exams, but for life.
                        </p>

                        <div className="grid grid-cols-2 gap-8 mb-12">
                            <div className="flex gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-100/50">
                                <div className="mt-1 bg-white p-3 rounded-xl text-amber-700 h-fit shadow-sm"><Users size={20} /></div>
                                <div>
                                    <h4 className="font-bold text-stone-800 text-sm uppercase tracking-wider">Community</h4>
                                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Inclusive & Diverse</p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-100/50">
                                <div className="mt-1 bg-white p-3 rounded-xl text-accent h-fit shadow-sm"><Star size={20} /></div>
                                <div>
                                    <h4 className="font-bold text-stone-800 text-sm uppercase tracking-wider">Holistic</h4>
                                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Mind, Body & Soul</p>
                                </div>
                            </div>
                        </div>

                        <div className="text-center md:text-left">
                            <Link to="/about" className="text-primary font-bold hover:gap-3 transition-all inline-flex items-center gap-2 group uppercase tracking-widest text-xs">
                                Read Our Full Story <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Founders Section - Premium Carousel */}
            <section id="founders" className="container mx-auto px-4 py-20">
                <div className="text-center mb-16">
                    <span className="text-accent font-bold tracking-[0.4em] uppercase text-[10px] mb-2 block">Our Vision</span>
                    <h2 className="text-4xl md:text-6xl font-serif text-slate-900 mt-2 uppercase tracking-tight">Institutional <span className="text-gradient">Legacy</span></h2>
                </div>

                <div className="max-w-6xl mx-auto px-4">
                    <Carousel className="h-[550px] md:h-[600px]" autoPlay={true} interval={8000}>
                        {founders.map((founder, i) => (
                            <div key={i} className="h-full py-6">
                                <div className="bg-white rounded-[3rem] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-stone-100 h-full flex flex-col md:flex-row">
                                    <div className="w-full md:w-5/12 h-64 md:h-full relative overflow-hidden">
                                        <img
                                            src={founder.img || founder.image_url}
                                            alt={founder.name}
                                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10"></div>
                                    </div>
                                    <div className="w-full md:w-7/12 p-10 md:p-20 flex flex-col justify-center relative">
                                        <Quote size={100} className="text-stone-50 absolute top-10 right-10 -z-0 opacity-40" />
                                        <div className="relative z-10">
                                            <p className="text-2xl md:text-4xl text-stone-700 italic font-serif leading-relaxed mb-12 tracking-tight">
                                                "{founder.quote}"
                                            </p>
                                            <div className="flex items-center gap-6">
                                                <div className="h-px w-16 bg-accent/20"></div>
                                                <div>
                                                    <h4 className="text-3xl font-bold text-stone-900 uppercase tracking-tighter">{founder.name}</h4>
                                                    <p className="text-primary font-bold tracking-[0.3em] uppercase text-[10px] mt-2">{founder.role}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                </div>
            </section>

            {/* Campus Grid */}
            <section id="campuses" className="container mx-auto px-4 py-16">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-4">
                    <div className="text-center md:text-left">
                        <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] mb-2 block">Our Network</span>
                        <h2 className="text-4xl md:text-6xl font-serif text-slate-900 uppercase tracking-tight">Explore Campuses</h2>
                    </div>
                    <Link to="/admissions" className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all uppercase tracking-widest text-[10px] bg-stone-50 px-6 py-3 rounded-full border border-stone-100">
                        Find nearest campus <ArrowRight size={14} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {CAMPUSES.map((campus) => (
                        <Link to={`/campus/${campus.id}`} key={campus.id} className="group relative h-[450px] overflow-hidden rounded-[2.5rem] cursor-pointer shadow-2xl hover:shadow-primary/20 transition-all duration-700">
                            <img
                                src={`${campus.image}&w=800&q=80`}
                                alt={campus.name}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-900/40 to-transparent">
                                <div className="absolute bottom-0 left-0 p-10 w-full">
                                    <h3 className="text-3xl font-serif text-white mb-3 uppercase tracking-tight">{campus.name}</h3>
                                    <div className="h-0 overflow-hidden group-hover:h-auto opacity-0 group-hover:opacity-100 transition-all duration-500">
                                        <p className="text-stone-300 text-sm font-light leading-relaxed transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            {campus.description}
                                        </p>
                                        <div className="flex items-center gap-2 mt-6 text-accent font-bold text-[10px] uppercase tracking-[0.3em]">
                                            View Dashboard <div className="w-8 h-px bg-accent"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Events Section - Redesigned Premium Layout */}
            <section id="events" className="container mx-auto px-4 py-24 bg-stone-50/50 rounded-[4rem] my-10 border border-stone-100/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -ml-48 -mb-48"></div>

                <div className="text-center mb-20 relative z-10">
                    <span className="text-accent font-bold tracking-[0.5em] uppercase text-[10px] mb-4 block">Campus Life</span>
                    <h2 className="text-4xl md:text-6xl font-serif text-stone-900 mt-2 uppercase tracking-tight">Upcoming <span className="text-gradient">Events</span></h2>
                </div>

                {events.length === 0 ? (
                    <div className="text-center py-32 bg-white/50 rounded-[3rem] border border-stone-100 shadow-inner relative z-10">
                        <CalendarIcon size={64} className="mx-auto text-stone-200 mb-6" />
                        <p className="text-stone-400 font-serif italic text-xl">No upcoming events are currently scheduled.</p>
                    </div>
                ) : (
                    <div className="relative z-10">
                        <InfiniteSlider speed={60} gap={32} hoverToPause={true}>
                            {events.map((event) => (
                                <motion.div
                                    key={event.id}
                                    className="w-[300px] md:w-[350px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-stone-100 overflow-hidden group hover:-translate-y-3 transition-all duration-700 flex-shrink-0"
                                >
                                    <Link to={`/events/${event.id}`}>
                                        <div className="relative h-60 overflow-hidden">
                                            <img
                                                src={`${event.image_url || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1'}&w=600&q=80`}
                                                alt={event.title}
                                                loading="lazy"
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                            <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl text-center shadow-2xl min-w-[75px] border border-stone-100">
                                                <span className="block text-[10px] text-accent uppercase font-black tracking-widest leading-none mb-1">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                                <span className="block text-3xl font-black text-stone-800 leading-none">{new Date(event.date).getDate()}</span>
                                            </div>
                                            <div className="absolute top-6 right-6">
                                                <span className={clsx(
                                                    "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-lg backdrop-blur-sm border border-white/20",
                                                    event.category === 'Exam' ? "bg-primary/80" :
                                                        event.category === 'Sports' ? "bg-emerald-600/80" :
                                                            event.category === 'Academic' ? "bg-accent/80" : "bg-stone-500/80"
                                                )}>
                                                    {event.category}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-8 text-left whitespace-normal">
                                            <h3 className="font-bold text-lg text-stone-800 mb-6 line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors uppercase tracking-tight font-serif leading-tight">
                                                {event.title}
                                            </h3>
                                            <div className="flex items-center justify-between pt-6 border-t border-stone-50">
                                                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.3em]">Event Details</span>
                                                <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm ring-4 ring-transparent group-hover:ring-primary/10">
                                                    <ArrowRight size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </InfiniteSlider>
                    </div>
                )}
                <div className="text-center mt-16 relative z-10">
                    <Link to="/calendar" className="text-primary font-bold hover:scale-105 transition-all inline-flex items-center gap-3 uppercase tracking-[0.3em] text-[10px] bg-white px-8 py-4 rounded-full shadow-xl shadow-stone-200/50 border border-stone-100">
                        View Network Calendar <ArrowRight size={16} className="text-accent" />
                    </Link>
                </div>
            </section>

            {/* Reviews Section */}
            <section id="reviews" className="container mx-auto px-4 py-20">
                <div className="text-center mb-20">
                    <span className="text-accent font-bold tracking-[0.4em] uppercase text-[10px] mb-2 block">Testimonials</span>
                    <h2 className="text-4xl md:text-6xl font-serif text-slate-900 mt-2 uppercase tracking-tight">Student <span className="text-gradient">Voices</span></h2>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    {reviews.map((review, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-10 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] border border-stone-100 relative hover:-translate-y-3 transition-all duration-500 h-full flex flex-col"
                        >
                            <Quote size={80} className="text-stone-50 absolute top-6 right-6 -z-0 opacity-60" />
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex gap-1 text-accent mb-8">
                                    {[...Array(5)].map((_, idx) => <Star key={idx} size={16} fill="currentColor" strokeWidth={0} />)}
                                </div>
                                <p className="text-stone-600 italic mb-10 leading-relaxed text-xl font-light font-serif flex-1">"{review.text}"</p>
                                <div className="flex items-center gap-5 pt-8 border-t border-stone-50">
                                    <div className="w-14 h-14 rounded-full bg-stone-100 border-2 border-white shadow-xl overflow-hidden ring-4 ring-stone-50">
                                        <img
                                            src={review.image_url || `https://ui-avatars.com/api/?name=${review.name.replace(' ', '+')}&background=random&color=fff&bold=true`}
                                            alt={review.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-stone-900 text-base uppercase tracking-tight">{review.name}</h4>
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-black mt-1">{review.role}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Fees Section */}
            <section id="fees" className="container mx-auto px-4 py-24 bg-white rounded-[4rem] my-10 border border-stone-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)]">
                <div className="text-center mb-20">
                    <span className="text-accent font-bold tracking-[0.5em] uppercase text-[10px] mb-4 block">Investment in Future</span>
                    <h2 className="text-4xl md:text-6xl font-serif text-stone-900 mt-2 uppercase tracking-tight">Fee <span className="text-gradient">Structure</span></h2>
                    <p className="text-stone-400 mt-8 max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-light">Transparent and competitive academic investment plans for the 2024-2025 cycle.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-10 px-4 md:px-10">
                    {[
                        {
                            level: "Junior School",
                            grades: "PG to Class 2",
                            monthly: "Rs. 8,500",
                            admission: "Rs. 15,000",
                            features: ["Interactive Learning", "Basic Arts & Crafts", "Physical Education", "Play-based Curriculum"],
                            accent: "border-stone-100"
                        },
                        {
                            level: "Middle School",
                            grades: "Class 3 to 8",
                            monthly: "Rs. 10,500",
                            admission: "Rs. 15,000",
                            features: ["Subject Specialization", "Science Labs Access", "ICT Education", "Sports & Clubs"],
                            accent: "border-primary/10",
                            popular: true
                        },
                        {
                            level: "Senior School",
                            grades: "Class 9 to 12",
                            monthly: "Rs. 13,500",
                            admission: "Rs. 15,000",
                            features: ["Board Exam Prep", "Career Counseling", "Advanced Labs", "Leadership Programs"],
                            accent: "border-stone-200"
                        }
                    ].map((plan, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -15 }}
                            className={clsx(
                                "bg-white p-12 rounded-[3rem] shadow-2xl transition-all duration-700 flex flex-col relative overflow-hidden",
                                plan.popular ? "shadow-primary/10 ring-2 ring-primary/20 border-transparent" : "shadow-stone-200/50 border border-stone-100"
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-0 bg-primary text-white px-8 py-2 rounded-bl-3xl text-[9px] font-black uppercase tracking-[0.3em]">
                                    Recommended
                                </div>
                            )}
                            <h3 className="text-3xl font-serif text-stone-900 mb-2 uppercase tracking-tight">{plan.level}</h3>
                            <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10">{plan.grades}</p>

                            <div className="mb-10">
                                <div className="text-5xl font-black text-primary mb-2 tracking-tighter">{plan.monthly}</div>
                                <div className="text-stone-400 text-[9px] font-black uppercase tracking-[0.3em]">Monthly Tuition</div>
                            </div>

                            <div className="mb-12 p-6 bg-stone-50 rounded-[2rem] border border-stone-100/50">
                                <div className="text-[9px] text-stone-400 font-bold uppercase tracking-[0.2em] mb-2">Admission Fee</div>
                                <div className="text-2xl font-black text-stone-800 tracking-tight">{plan.admission}</div>
                            </div>

                            <ul className="space-y-5 mb-12 flex-1">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-4 text-stone-600 text-sm font-light">
                                        <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent shadow-sm">
                                            <Star size={12} fill="currentColor" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link to="/admissions" className={clsx(
                                "w-full py-5 rounded-[1.5rem] font-bold transition-all text-center uppercase tracking-[0.3em] text-[10px] shadow-xl",
                                plan.popular ? "bg-primary text-white hover:bg-stone-900 shadow-primary/20" : "bg-stone-50 text-stone-700 hover:bg-stone-100"
                            )}>
                                Get Prospectus
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Admissions CTA */}
            <section id="apply" className="relative py-32 mt-10 overflow-hidden rounded-[5rem] mx-4 md:mx-10 shadow-[0_50px_100px_rgba(0,0,0,0.3)]">
                <div className="absolute inset-0 bg-[#2d1b0d]">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-stone-900 to-black"></div>
                </div>
                <div className="container mx-auto px-4 text-center relative z-10 py-10">
                    <span className="text-accent font-black tracking-[0.6em] uppercase text-[10px] mb-8 block">Academic Session 2024-25</span>
                    <h2 className="text-5xl md:text-8xl font-serif mb-10 text-white leading-tight uppercase tracking-tighter">Join the <span className="italic text-accent">Spark</span> Legacy</h2>
                    <p className="text-stone-300 text-xl max-w-2xl mx-auto mb-16 font-light leading-relaxed">
                        Admission portals are now active. Begin your journey toward academic distinction and professional leadership.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link to="/admissions" className="inline-block bg-accent text-white px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-white hover:text-stone-900 transition-all shadow-2xl hover:scale-105 active:scale-95 group">
                            Start Application <ArrowRight size={16} className="inline ml-2 group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
