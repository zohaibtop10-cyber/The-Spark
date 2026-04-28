import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { CAMPUSES, HOUSES } from '../data';
import { motion } from 'framer-motion';
import { Trophy, Users, ChevronDown, Clock, Calendar, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import InfiniteSlider from '../components/ui/InfiniteSlider';

interface HouseStats {
    house_id: string;
    points: number;
}

interface FacultyMember {
    id: string;
    name: string;
    role: string;
    section: 'Junior' | 'Middle' | 'Senior';
    image_url?: string;
}

const getThemeColors = (theme: string) => {
    switch (theme) {
        case 'green': return { text: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', gradient: 'from-green-600', ring: 'focus:ring-green-500', accent: 'text-green-700' };
        case 'yellow': return { text: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', gradient: 'from-amber-500', ring: 'focus:ring-amber-500', accent: 'text-amber-600' };
        case 'blue': return { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', gradient: 'from-blue-600', ring: 'focus:ring-blue-500', accent: 'text-blue-700' };
        case 'rose': return { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', gradient: 'from-rose-600', ring: 'focus:ring-rose-500', accent: 'text-rose-700' };
        case 'orange': return { text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', gradient: 'from-orange-600', ring: 'focus:ring-orange-500', accent: 'text-orange-700' };
        case 'red': return { text: 'text-red-800', bg: 'bg-red-50', border: 'border-red-200', gradient: 'from-red-800', ring: 'focus:ring-red-500', accent: 'text-red-900' };
        default: return { text: 'text-primary', bg: 'bg-stone-50', border: 'border-stone-200', gradient: 'from-primary', ring: 'focus:ring-primary', accent: 'text-accent' };
    }
};

const CampusDashboard: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const campus = CAMPUSES.find(c => c.id === id);

    const [houseStats, setHouseStats] = useState<HouseStats[]>([]);
    const [faculty, setFaculty] = useState<FacultyMember[]>([]);
    const [events, setEvents] = useState<import('../data').Event[]>([]); // Proper Event type

    const [openSection, setOpenSection] = useState<'Junior' | 'Middle' | 'Senior'>('Junior');
    const [selectedHouseSection, setSelectedHouseSection] = useState<string>('PG - Class 2');

    const fetchFaculty = React.useCallback(async () => {
        const { data } = await supabase
            .from('faculty')
            .select('*')
            .eq('campus_id', id)
            .order('created_at', { ascending: true });

        if (data) setFaculty(data as FacultyMember[]);
    }, [id]);

    const fetchEvents = React.useCallback(async (campusId: string) => {
        const { data } = await supabase
            .from('events')
            .select('*')
            .eq('campus_id', campusId)
            .order('date', { ascending: true })
            .limit(4);

        if (data && data.length > 0) {
            setEvents(data);
        }
    }, []);

    const fetchHousePoints = React.useCallback(async (campusId: string) => {
        const { data, error } = await supabase
            .from('house_points')
            .select('house_id, points')
            .eq('campus_id', campusId);

        if (error) {
            console.error('Error fetching points:', error);
            const fallback = HOUSES.map(h => ({ house_id: h.id, points: h.points }));
            setHouseStats(fallback);
        } else if (data && data.length > 0) {
            setHouseStats(data);
        } else {
            const fallback = HOUSES.map(h => ({ house_id: h.id, points: h.points }));
            setHouseStats(fallback);
        }
    }, []);

    useEffect(() => {
        const init = async () => {
            if (id) {
                await fetchHousePoints(id);
                await fetchFaculty();
                await fetchEvents(id);
            }
        };

        if (id) {
            init();

            // Subscribe to real-time changes
            const channel = supabase
                .channel('house_points_changes')
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'house_points', filter: `campus_id=eq.${id}` },
                    (payload) => {
                        console.log('Realtime update:', payload);
                        fetchHousePoints(id);
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [id, fetchHousePoints, fetchFaculty, fetchEvents]);


    if (!campus) {
        return <Navigate to="/" />;
    }

    // Filter and merge House info
    const filteredHouses = HOUSES.filter(h => h.section === selectedHouseSection);
    const housesWithPoints = filteredHouses.map(staticHouse => {
        const dynamicStat = houseStats.find(h => h.house_id === staticHouse.id);
        return {
            ...staticHouse,
            points: dynamicStat ? dynamicStat.points : staticHouse.points // Use dynamic or fallback
        };
    }).sort((a, b) => b.points - a.points);

    const galleryImages = [
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1564981797816-1043664bf78d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1516534775068-ba3e84529573?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ];

    return (
        <div className="min-h-screen bg-stone-50 pb-20">
            {/* Hero */}
            <div className="h-[60vh] relative overflow-hidden">
                <div className="absolute inset-0 bg-stone-900/50 z-10"></div>
                <img src={campus.image} alt={campus.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 w-full z-20 bg-gradient-to-t from-stone-900 via-stone-900/50 to-transparent pt-32 pb-12">
                    <div className="container mx-auto px-4">
                        <Link to="/#campuses" className="text-white/80 hover:text-white flex items-center gap-2 mb-4 transition-colors">
                            <ArrowRight className="rotate-180" size={18} /> Back to Campuses
                        </Link>
                        <h1 className={`text-3xl sm:text-5xl md:text-7xl font-serif font-bold text-white mb-4 ${getThemeColors(campus.theme).text} leading-tight`}>
                            {campus.name}
                        </h1>
                        <p className="text-base sm:text-xl text-stone-200 max-w-2xl px-1">{campus.description}</p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 relative z-30">
                {/* House Section Selector */}
                <div className="bg-white p-4 rounded-xl shadow-lg border border-stone-100 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div className="flex items-center gap-2">
                        <Trophy className="text-amber-500" size={24} />
                        <h3 className="font-bold text-stone-700 text-lg">House Scoreboard</h3>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className="text-sm text-stone-500 font-medium whitespace-nowrap">Select Class:</span>
                        <select
                            value={selectedHouseSection}
                            onChange={(e) => setSelectedHouseSection(e.target.value)}
                            className="bg-stone-50 border border-stone-200 rounded-lg px-4 py-2 text-sm font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer flex-1 sm:flex-none"
                        >
                            <option value="PG - Class 2">PG - Class 2</option>
                            <option value="Class 3 - 5">Class 3 - 5</option>
                            <option value="Class 6 - 8">Class 6 - 8</option>
                            <option value="Class 9 - 10/12">Class 9 - 10/12</option>
                        </select>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-stone-100 flex items-center gap-4">
                        <div className={`p-4 rounded-full ${getThemeColors(campus.theme).bg} ${getThemeColors(campus.theme).text}`}>
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-stone-500 text-sm font-bold uppercase tracking-wider">Students</p>
                            <p className="text-2xl font-bold text-stone-800">1,200+</p>
                        </div>
                    </div>

                    {housesWithPoints.map((house, index) => (
                        <div key={house.id} className="bg-white p-6 rounded-xl shadow-lg border border-stone-100 flex items-center gap-4">
                            <div className={`p-4 rounded-full ${getThemeColors(campus.theme).bg} ${getThemeColors(campus.theme).text}`}>
                                <Trophy size={24} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-stone-700">{house.name}</span>
                                    <span className="font-bold text-amber-500">{house.points}</span>
                                </div>
                                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min((house.points / 5000) * 100, 100)}%` }}
                                        transition={{ duration: 1, delay: index * 0.1 }}
                                        className={`h-full ${house.color}`}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Sidebar / Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
                        <h3 className="font-bold text-stone-800 mb-4 font-serif">Campus News</h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="pb-3 border-b border-stone-50 last:border-0 last:pb-0">
                                    <span className="text-xs text-accent font-bold uppercase">Oct {10 + i}, 2024</span>
                                    <p className="text-sm text-stone-600 mt-1 hover:text-primary cursor-pointer">
                                        Inter-house debate competition finals scheduled at the auditorium.
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Faculty Directory */}
                <div className="lg:col-span-2">
                    <h2 className="text-3xl font-serif font-bold text-stone-900 mb-8">Faculty Directory</h2>
                    <div className="space-y-4">
                        {(['Junior', 'Middle', 'Senior'] as const).map(section => (
                            <div key={section} className={`bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden ${openSection !== section ? 'opacity-70' : ''}`}>
                                <button
                                    onClick={() => setOpenSection(section)}
                                    className="w-full flex justify-between items-center p-6 bg-stone-50 hover:bg-stone-100 transition-colors text-left"
                                >
                                    <span className="font-bold text-lg text-stone-800">{section} Section</span>
                                    <ChevronDown className={`text-stone-400 transition-transform ${openSection === section ? '' : 'transform -rotate-90'}`} />
                                </button>

                                <motion.div
                                    initial={false}
                                    animate={{ height: openSection === section ? 'auto' : 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 border-t border-slate-100">
                                        {faculty.filter(f => f.section === section).map((teacher) => (
                                            <div key={teacher.id} className="flex items-center gap-4">
                                                <img src={teacher.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}`} className="w-12 h-12 rounded-full object-cover bg-slate-100" alt={teacher.name} />
                                                <div>
                                                    <div className="font-bold text-slate-800 text-sm">{teacher.name}</div>
                                                    <div className="text-xs text-slate-500">{teacher.role}</div>
                                                </div>
                                            </div>
                                        ))}
                                        {faculty.filter(f => f.section === section).length === 0 && (
                                            <div className="col-span-2 text-center text-slate-400 text-sm py-4 italic">No faculty listings available.</div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Upcoming Events */}
            <div className="container mx-auto px-4 mt-12">
                <h2 className="text-3xl font-serif font-bold text-stone-900 mb-8 flex items-center gap-3">
                    Upcoming Events
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {events.length > 0 ? (
                        events.map((event, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="bg-primary/5 rounded-lg p-3 flex flex-col items-center justify-center min-w-[70px]">
                                        <span className="text-primary font-bold text-2xl">{new Date(event.date).getDate()}</span>
                                        <span className="text-xs text-stone-500 uppercase font-bold">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                    </div>
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${event.category === 'Exam' ? 'bg-amber-100 text-amber-700' :
                                        event.category === 'Sports' ? 'bg-green-100 text-green-700' :
                                            event.category === 'Holiday' ? 'bg-red-100 text-red-700' :
                                                'bg-[#f7f3ed] text-primary'
                                        }`}>
                                        {event.category}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-stone-800 leading-tight group-hover:text-primary transition-colors">{event.title}</h3>
                                <div className="mt-4 pt-4 border-t border-stone-50 flex items-center text-stone-400 text-sm gap-2">
                                    <Clock size={14} />
                                    <span>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-stone-300">
                            <Calendar className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                            <p className="text-stone-500 italic">No upcoming events scheduled for this campus.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Gallery */}
            <div className="container mx-auto px-4 mt-16">
                <h2 className="text-3xl font-serif font-bold text-stone-900 mb-8">Campus Gallery</h2>
                {galleryImages.length > 4 ? (
                    <InfiniteSlider speed={35}>
                        {galleryImages.map((src, i) => (
                            <div key={i} className="w-64 sm:w-72 h-48 sm:h-64 rounded-xl overflow-hidden hover:opacity-90 transition-opacity cursor-pointer flex-shrink-0">
                                <img src={src} alt="Campus view" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                            </div>
                        ))}
                    </InfiniteSlider>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {galleryImages.map((src, i) => (
                            <div key={i} className="h-64 rounded-xl overflow-hidden hover:opacity-90 transition-opacity cursor-pointer">
                                <img src={src} alt="Campus view" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CampusDashboard;
