import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { RefreshCw, Check, X, Trash2 } from 'lucide-react';
import ConfirmModal from '../components/ui/ConfirmModal';

interface Admission {
    id: string;
    student_name: string;
    grade: string;
    status: string;
    created_at: string;
    guardian_name: string;
    guardian_contact: string;
}

const AdminAdmissions: React.FC = () => {
    const [admissions, setAdmissions] = useState<Admission[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState<string | null>(null);

    const fetchAdmissions = React.useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('admissions')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setAdmissions(data);
        if (error) console.error('Error fetching admissions:', error);
        setLoading(false);
    }, []);

    useEffect(() => {
        const init = async () => {
            await fetchAdmissions();
        };
        init();
    }, [fetchAdmissions]);

    const updateStatus = async (id: string, newStatus: string) => {
        const { error } = await supabase
            .from('admissions')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) {
            fetchAdmissions();
        } else {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const handleDelete = async (id: string) => {
        setIdToDelete(id);
        setIsConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!idToDelete) return;

        const { error } = await supabase
            .from('admissions')
            .delete()
            .eq('id', idToDelete);

        if (error) {
            console.error('Delete error:', error);
            alert('Error deleting application: ' + error.message);
        } else {
            fetchAdmissions();
        }
        setIsConfirmOpen(false);
        setIdToDelete(null);
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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2 font-serif">
                    <span className="w-1 h-6 bg-accent rounded-full"></span>
                    Admissions Management
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
                            <th className="p-4 font-semibold text-stone-600 text-sm">Date</th>
                            <th className="p-4 font-semibold text-stone-600 text-sm">Grade</th>
                            <th className="p-4 font-semibold text-stone-600 text-sm">Contact</th>
                            <th className="p-4 font-semibold text-stone-600 text-sm">Status</th>
                            <th className="p-4 font-semibold text-stone-600 text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-stone-500">Loading admissions...</td>
                            </tr>
                        ) : admissions.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-stone-500">No applications found.</td>
                            </tr>
                        ) : (
                            admissions.map(app => (
                                <tr key={app.id} className="hover:bg-stone-50 transition-colors">
                                    <td className="p-4 text-sm font-medium text-stone-900">{app.student_name}</td>
                                    <td className="p-4 text-sm text-stone-500">{new Date(app.created_at).toLocaleDateString()}</td>
                                    <td className="p-4 text-sm font-bold text-stone-700">{app.grade}</td>
                                    <td className="p-4 text-sm text-stone-600">
                                        <div className="flex flex-col">
                                            <span>{app.guardian_name}</span>
                                            <span className="text-xs text-stone-400">{app.guardian_contact}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider ${getStatusColor(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {app.status !== 'Accepted' && (
                                                <button
                                                    onClick={() => updateStatus(app.id, 'Accepted')}
                                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                                    title="Accept"
                                                >
                                                    <Check size={18} />
                                                </button>
                                            )}
                                            {app.status !== 'Rejected' && (
                                                <button
                                                    onClick={() => updateStatus(app.id, 'Rejected')}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                                    title="Reject"
                                                >
                                                    <X size={18} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(app.id)}
                                                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                title="Delete Application"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Admission Application"
                message="Are you sure you want to delete this application? This action cannot be undone."
            />
        </div>
    );
};

export default AdminAdmissions;
