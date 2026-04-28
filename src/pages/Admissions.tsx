import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Admissions: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        grade: '',
        dob: '',
        gender: '',
        guardianName: '',
        guardianContact: '',
        previousSchool: '',
    });

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('admissions')
                .insert([
                    {
                        student_name: formData.fullName,
                        grade: formData.grade,
                        dob: formData.dob || null,
                        gender: formData.gender,
                        guardian_name: formData.guardianName,
                        guardian_contact: formData.guardianContact,
                        previous_school: formData.previousSchool,
                        status: 'Pending'
                    }
                ]);

            if (error) throw error;

            alert('Application submitted successfully!');
            // Reset form
            setFormData({
                fullName: '',
                grade: '',
                dob: '',
                gender: '',
                guardianName: '',
                guardianContact: '',
                previousSchool: '',
            });
            setCurrentStep(1);

        } catch (error) {
            console.error('Error submitting application:', error);
            alert('Failed to submit application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const steps = [
        { id: 1, title: "Student Info" },
        { id: 2, title: "Parental Details" },
        { id: 3, title: "Academic History" }
    ];

    return (
        <div className="bg-stone-50 min-h-[calc(100vh-80px)] py-12">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-4xl font-serif text-stone-900 mb-4 tracking-tight leading-tight">Admissions Application</h1>
                    <p className="text-stone-500 font-medium text-sm md:text-base px-4">Join the Spark legacy. Complete the form below to begin your journey.</p>
                </div>

                {/* Stepper */}
                <div className="flex items-center justify-between mb-12 relative">
                    <div className="absolute left-0 top-1/2 w-full h-0.5 bg-stone-200 -z-10"></div>
                    {steps.map((step) => {
                        const isCompleted = currentStep > step.id;
                        const isCurrent = currentStep === step.id;
                        return (
                            <div key={step.id} className="bg-stone-50 px-2 sm:px-4 flex flex-col items-center gap-2">
                                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-colors duration-300 ${isCompleted || isCurrent ? 'bg-primary text-white shadow-md' : 'bg-stone-200 text-stone-500'
                                    }`}>
                                    {isCompleted ? <Check size={16} /> : step.id}
                                </div>
                                <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider text-center ${isCurrent ? 'text-primary' : 'text-stone-400'
                                    } hidden xs:block`}>{step.title}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 md:p-12 rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-100"
                >
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-serif font-bold text-stone-800 mb-6 uppercase tracking-wide">Student Information</h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-stone-700">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-stone-300"
                                        placeholder="e.g. John Doe"
                                        value={formData.fullName}
                                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-stone-700">Grade Level</label>
                                    <select
                                        className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                                        value={formData.grade}
                                        onChange={e => setFormData({ ...formData, grade: e.target.value })}
                                    >
                                        <option value="">Select Grade</option>
                                        <option value="pg">Playgroup</option>
                                        <option value="k1">Kindergarten 1</option>
                                        <option value="1">Grade 1</option>
                                        <option value="9">Grade 9</option>
                                        <option value="alevel">A-Levels</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-stone-700">Date of Birth</label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-stone-600"
                                        value={formData.dob}
                                        onChange={e => setFormData({ ...formData, dob: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-stone-700 mb-2 block">Gender</label>
                                    <div className="flex gap-6">
                                        {['Male', 'Female'].map(g => (
                                            <label key={g} className="flex items-center gap-3 cursor-pointer group">
                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.gender === g ? 'border-primary' : 'border-stone-300 group-hover:border-primary'
                                                    }`}>
                                                    {formData.gender === g && <div className="w-3 h-3 rounded-full bg-primary" />}
                                                </div>
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value={g}
                                                    className="hidden"
                                                    onChange={() => setFormData({ ...formData, gender: g })}
                                                />
                                                <span className={`${formData.gender === g ? 'text-stone-900 font-medium' : 'text-stone-500'}`}>{g}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-serif font-bold text-stone-800 mb-6 uppercase tracking-wide">Parental Details</h2>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-stone-700">Guardian Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-stone-300"
                                        placeholder="Parent/Guardian Full Name"
                                        value={formData.guardianName}
                                        onChange={e => setFormData({ ...formData, guardianName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-stone-700">Guardian Contact</label>
                                    <input
                                        type="tel"
                                        className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-stone-300"
                                        placeholder="+92 300 1234567"
                                        value={formData.guardianContact}
                                        onChange={e => setFormData({ ...formData, guardianContact: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-serif font-bold text-stone-800 mb-6 uppercase tracking-wide">Academic History</h2>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-stone-700">Previous School</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-stone-300"
                                        placeholder="Name of previous institution"
                                        value={formData.previousSchool}
                                        onChange={e => setFormData({ ...formData, previousSchool: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex justify-end items-center mt-12 pt-8 border-t border-stone-100">
                        <button
                            onClick={handleNext}
                            disabled={isSubmitting}
                            className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
                        >
                            {isSubmitting ? (
                                <>Processing <Loader2 size={18} className="animate-spin" /></>
                            ) : (
                                <>{currentStep === 3 ? 'Submit Application' : 'Next Step'} <ChevronRight size={18} /></>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Admissions;
