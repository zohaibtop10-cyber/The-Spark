import React, { useState } from 'react';
import { HOUSES, CAMPUSES } from '../data';
import type { House } from '../data';
import { Plus, Minus, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AdminDashboard: React.FC = () => {
    // Scoreboard Controller State
    const [selectedCampus, setSelectedCampus] = useState(CAMPUSES[0].id);
    const [selectedSection, setSelectedSection] = useState<House['section']>('PG - Class 2');
    const [selectedHouse, setSelectedHouse] = useState<string>('');
    const [pendingPoints, setPendingPoints] = useState(0);
    const [isUpdatingPoints, setIsUpdatingPoints] = useState(false);

    // Filter houses based on selected section
    const activeHouses = HOUSES.filter(h => h.section === selectedSection);

    // Auto-select first house when section changes
    React.useEffect(() => {
        if (activeHouses.length > 0) {
            setSelectedHouse(activeHouses[0].id);
        }
    }, [selectedSection, activeHouses]);

    const handleConfirmPoints = async () => {
        if (pendingPoints === 0 || !selectedHouse) return;
        setIsUpdatingPoints(true);

        try {
            // First check if a record exists
            const { data: existing } = await supabase
                .from('house_points')
                .select('*')
                .eq('campus_id', selectedCampus)
                .eq('house_id', selectedHouse)
                .single();

            // Calculate new points
            let newPoints = pendingPoints;
            const targetHouse = HOUSES.find(h => h.id === selectedHouse);

            // If record exists, add to existing points
            if (existing) {
                newPoints = existing.points + pendingPoints;

                // Update
                const { error } = await supabase
                    .from('house_points')
                    .update({ points: newPoints, updated_at: new Date().toISOString() })
                    .eq('id', existing.id);

                if (error) throw error;
            } else {
                // Insert
                const { error } = await supabase
                    .from('house_points')
                    .insert([{
                        campus_id: selectedCampus,
                        house_id: selectedHouse,
                        house_name: targetHouse?.name || 'Unknown',
                        section: selectedSection, // Ensure DB has this column or ignore if just UI
                        points: newPoints
                    }]);
                if (error) throw error;
            }

            alert('Points updated successfully!');
            setPendingPoints(0);

        } catch (error) {
            console.error('Error updating points:', error);
            alert('Failed to update points.');
        } finally {
            setIsUpdatingPoints(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Students', value: '1,240', color: 'bg-primary', icon: 'User' },
                    { label: 'Faculty Members', value: '86', color: 'bg-emerald-700', icon: 'User' },
                    { label: 'Upcoming Events', value: '12', color: 'bg-accent', icon: 'Calendar' },
                    { label: 'Avg. Attendance', value: '94%', color: 'bg-[#5c3d2e]', icon: 'Chart' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                            <p className="text-stone-500 text-sm font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-stone-800 mt-1">{stat.value}</h3>
                        </div>
                        <div className={`w-12 h-12 ${stat.color} bg-opacity-10 rounded-full flex items-center justify-center text-white shadow-sm`} style={{ backgroundColor: stat.color }}>
                            <div className="w-4 h-4 bg-white rounded-full opacity-50"></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                    <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
                        <span className="w-2 h-2 bg-accent rounded-full"></span>
                        Scoreboard Controller
                    </h2>
                    <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full uppercase tracking-wide">Live Active</span>
                </div>

                <div className="p-8">

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Controls */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-2">Select Campus</label>
                                <select
                                    className="w-full p-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                    value={selectedCampus}
                                    onChange={(e) => setSelectedCampus(e.target.value)}
                                >
                                    {CAMPUSES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-2">Grade Level</label>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {['PG - Class 2', 'Class 3 - 5', 'Class 6 - 8', 'Class 9 - 10/12'].map((section) => (
                                        <button
                                            key={section}
                                            onClick={() => setSelectedSection(section as House['section'])}
                                            className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all ${selectedSection === section
                                                ? 'bg-primary text-white shadow-md'
                                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                                }`}
                                        >
                                            {section}
                                        </button>
                                    ))}
                                </div>
                                <label className="block text-sm font-medium text-stone-700 mb-2">Select House ({activeHouses.length})</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {activeHouses.map(house => (
                                        <button
                                            key={house.id}
                                            onClick={() => setSelectedHouse(house.id)}
                                            className={`p-3 rounded-lg border text-sm font-bold transition-all ${selectedHouse === house.id
                                                ? 'ring-2 ring-offset-2 ring-primary border-transparent shadow-md'
                                                : 'border-stone-200 hover:border-stone-300 text-stone-600 bg-white'
                                                }`}
                                        >
                                            <div className={`w-3 h-3 rounded-full ${house.color} inline-block mr-2`}></div>
                                            {house.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Action Area */}
                        <div className="bg-stone-50 p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col items-center justify-center">
                            <div className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-4">Adjust Points</div>
                            <div className="flex items-center gap-6 mb-6">
                                <button
                                    onClick={() => setPendingPoints(prev => prev - 10)}
                                    className="w-16 h-16 rounded-full bg-white border border-stone-200 hover:bg-stone-100 flex items-center justify-center text-stone-600 transition-colors shadow-sm"
                                >
                                    <Minus size={24} />
                                </button>
                                <span className={`text-5xl font-bold font-serif w-32 text-center select-none ${pendingPoints !== 0 ? 'text-primary' : 'text-stone-300'}`}>
                                    {pendingPoints > 0 ? '+' : ''}{pendingPoints}
                                </span>
                                <button
                                    onClick={() => setPendingPoints(prev => prev + 10)}
                                    className="w-16 h-16 rounded-full bg-white border border-stone-200 hover:bg-stone-100 flex items-center justify-center text-stone-600 transition-colors shadow-sm"
                                >
                                    <Plus size={24} />
                                </button>
                            </div>
                            <button
                                onClick={handleConfirmPoints}
                                disabled={pendingPoints === 0 || isUpdatingPoints}
                                className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20 w-full max-w-xs flex justify-center items-center gap-2"
                            >
                                {isUpdatingPoints ? <RefreshCw className="animate-spin" size={20} /> : 'Confirm Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
