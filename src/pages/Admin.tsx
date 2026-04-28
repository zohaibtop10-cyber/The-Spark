import React, { useState, useEffect } from 'react';
import { HOUSES, CAMPUSES } from '../data';
import { Plus, Minus, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Admission {
    id: string;
    student_name: string;
    grade: string;
    status: string;
    created_at: string;
}

const Admin: React.FC = () => {
    // Scoreboard Controller State
    const [selectedCampus, setSelectedCampus] = useState(CAMPUSES[0].id);
    const [selectedHouse, setSelectedHouse] = useState(HOUSES[0].id);
    const [pendingPoints, setPendingPoints] = useState(0);
    const [isUpdatingPoints, setIsUpdatingPoints] = useState(false);

    // Admissions State
    const [admissions, setAdmissions] = useState<Admission[]>([]);
    const [loadingAdmissions, setLoadingAdmissions] = useState(true);

    useEffect(() => {
        fetchAdmissions();
    }, []);

    const fetchAdmissions = async () => {
        setLoadingAdmissions(true);
        const { data, error } = await supabase
            .from('admissions')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setAdmissions(data);
        if (error) console.error('Error fetching admissions:', error);
        setLoadingAdmissions(false);
    };

    const handleConfirmPoints = async () => {
        if (pendingPoints === 0) return;
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
                        house_name: HOUSES.find(h => h.id === selectedHouse)?.name || 'Unknown',
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-amber-100 text-amber-700';
            case 'Under Review': return 'bg-primary/10 text-primary';
            case 'Accepted': return 'bg-green-100 text-green-700';
            case 'Rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-stone-100 text-stone-700';
        }
    };

    return (
        <div className="space-y-12">

            {/* Scoreboard Controller */}
            <section className="bg-stone-50 p-8 rounded-xl border border-stone-200">
                <h2 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-accent rounded-full"></span>
                    Scoreboard Controller
                </h2>

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
                            <label className="block text-sm font-medium text-stone-700 mb-2">Select House</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {HOUSES.map(house => (
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
                    <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col items-center justify-center">
                        <div className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-4">Adjust Points</div>
                        <div className="flex items-center gap-6 mb-6">
                            <button
                                onClick={() => setPendingPoints(prev => prev - 10)}
                                className="w-16 h-16 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors"
                            >
                                <Minus size={24} />
                            </button>
                            <span className={`text-5xl font-bold font-serif w-32 text-center select-none ${pendingPoints !== 0 ? 'text-primary' : 'text-stone-300'}`}>
                                {pendingPoints > 0 ? '+' : ''}{pendingPoints}
                            </span>
                            <button
                                onClick={() => setPendingPoints(prev => prev + 10)}
                                className="w-16 h-16 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors"
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
            </section>

            {/* Admissions Table */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
                        <span className="w-1 h-6 bg-accent rounded-full"></span>
                        Recent Applications
                    </h2>
                    <button onClick={fetchAdmissions} className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1">
                        <RefreshCw size={16} /> Refresh
                    </button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-stone-200 shadow-sm">
                    <table className="w-full text-left bg-white">
                        <thead className="bg-stone-50 border-b border-stone-200">
                            <tr>
                                <th className="p-4 font-semibold text-stone-600 text-sm">Student Name</th>
                                <th className="p-4 font-semibold text-stone-600 text-sm">Applied Date</th>
                                <th className="p-4 font-semibold text-stone-600 text-sm">Grade</th>
                                <th className="p-4 font-semibold text-stone-600 text-sm">Status</th>
                                <th className="p-4 font-semibold text-stone-600 text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {loadingAdmissions ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-stone-500">Loading admissions...</td>
                                </tr>
                            ) : admissions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-stone-500">No applications found.</td>
                                </tr>
                            ) : (
                                admissions.map(app => (
                                    <tr key={app.id} className="hover:bg-stone-50 transition-colors">
                                        <td className="p-4 text-sm font-medium text-stone-900">{app.student_name}</td>
                                        <td className="p-4 text-sm text-stone-500">{new Date(app.created_at).toLocaleDateString()}</td>
                                        <td className="p-4 text-sm font-bold text-stone-700">{app.grade}</td>
                                        <td className="p-4">
                                            <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider ${getStatusColor(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button className="text-primary hover:text-primary/80 font-medium text-sm">Review</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default Admin;
