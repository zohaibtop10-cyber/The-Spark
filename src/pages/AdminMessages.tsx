import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trash2, Mail, CheckCircle, Clock } from 'lucide-react';
import ConfirmModal from '../components/ui/ConfirmModal';

const AdminMessages: React.FC = () => {
    const [messages, setMessages] = useState<import('../data').ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState<string | null>(null);

    const fetchMessages = React.useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching messages:', error);
        } else {
            setMessages(data || []);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        const init = async () => {
            await fetchMessages();
        };
        init();
    }, [fetchMessages]);

    const handleDelete = async (id: string) => {
        setIdToDelete(id);
        setIsConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!idToDelete) return;

        const { error } = await supabase
            .from('contact_messages')
            .delete()
            .eq('id', idToDelete);

        if (error) {
            console.error('Delete error:', error);
            alert('Error deleting message: ' + error.message);
        } else {
            fetchMessages();
        }
        setIsConfirmOpen(false);
        setIdToDelete(null);
    };

    const handleMarkAsRead = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'unread' ? 'read' : 'unread';
        const { error } = await supabase
            .from('contact_messages')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            alert('Error updating status');
        } else {
            fetchMessages();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-serif text-stone-800">Messages</h2>
                <div className="flex items-center gap-2 text-sm text-stone-500">
                    <Mail size={16} />
                    <span>{messages.length} Total Messages</span>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-stone-400">Loading messages...</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-stone-100">
                    {messages.length === 0 ? (
                        <div className="text-center py-20 text-stone-500">No messages found.</div>
                    ) : (
                        <div className="divide-y divide-stone-100">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`p-6 hover:bg-stone-50 transition-colors ${msg.status === 'unread' ? 'bg-primary/5' : ''}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className={`font-bold text-stone-900 ${msg.status === 'unread' ? 'text-primary' : ''}`}>
                                                {msg.name}
                                            </h3>
                                            <span className="text-sm text-stone-500 bg-stone-100 px-2 py-1 rounded-full flex items-center gap-1">
                                                <Mail size={12} /> {msg.email}
                                            </span>
                                            {msg.status === 'unread' && (
                                                <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-1 rounded-full">NEW</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-stone-400 flex items-center gap-1 mr-4">
                                                <Clock size={12} />
                                                {new Date(msg.created_at).toLocaleDateString()} {new Date(msg.created_at).toLocaleTimeString()}
                                            </span>
                                            <button
                                                onClick={() => handleMarkAsRead(msg.id, msg.status)}
                                                className={`p-2 rounded-lg transition-colors ${msg.status === 'unread' ? 'text-accent hover:bg-accent/10' : 'text-stone-400 hover:text-stone-600'}`}
                                                title={msg.status === 'unread' ? "Mark as Read" : "Mark as Unread"}
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(msg.id)}
                                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Message"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-stone-700 leading-relaxed pl-1 border-l-2 border-stone-200 ml-1">
                                        {msg.message}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Message"
                message="Are you sure you want to delete this contact message? This action is permanent."
            />
        </div>
    );
};

export default AdminMessages;
