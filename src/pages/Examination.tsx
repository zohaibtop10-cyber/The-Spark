import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText, Award, ClipboardCheck } from 'lucide-react';
import ShinyText from '../components/ui/ShinyText';

const Examination: React.FC = () => {
    return (
        <div className="pt-20 min-h-screen bg-stone-50">
            {/* Hero */}
            <div className="bg-stone-900 py-20 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-accent/5 opacity-20"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <ShinyText text="Academic Assessment" disabled={false} speed={3} className="text-accent font-bold tracking-widest uppercase text-sm mb-4 inline-block" />
                        <h1 className="text-3xl md:text-5xl font-serif text-white mb-6 leading-tight">Examinations & Assessment</h1>
                        <p className="text-stone-400 max-w-2xl mx-auto text-lg">
                            Rigorous and fair evaluation systems to measure and encourage academic progress.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-20">
                    {[
                        { icon: Calendar, title: 'Term Schedules', desc: 'Clear timelines for Mid-Term and Final Term examinations.' },
                        { icon: FileText, title: 'Syllabus', desc: 'Comprehensive curriculum coverage for each grade level.' },
                        { icon: ClipboardCheck, title: 'Monthly Tests', desc: 'Regular assessments to track continuous progress.' },
                        { icon: Award, title: 'Grading System', desc: 'Transparent grading criteria following international standards.' }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all text-center"
                        >
                            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                                <item.icon size={24} />
                            </div>
                            <h3 className="font-bold text-stone-800 mb-2">{item.title}</h3>
                            <p className="text-sm text-stone-600">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-stone-100">
                    <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6 border-b border-stone-100 pb-4">Examination Rules & Regulations</h2>
                    <ul className="space-y-4">
                        {[
                            'Attendance is mandatory for all scheduled examinations.',
                            'Students must arrive 15 minutes before the start time.',
                            'Use of unfair means will result in immediate disqualification.',
                            'Medical certificates must be submitted within 24 hours of absence due to illness.',
                            'Result cards will be withheld for outstanding dues.'
                        ].map((rule, i) => (
                            <li key={i} className="flex items-start gap-3 text-stone-700">
                                <span className="bg-stone-100 text-stone-500 text-xs font-bold px-2 py-1 rounded inline-block mt-0.5">{i + 1}</span>
                                {rule}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Examination;
