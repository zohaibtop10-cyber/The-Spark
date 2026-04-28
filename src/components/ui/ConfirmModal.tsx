import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Delete',
    cancelText = 'Cancel',
    type = 'danger'
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-stone-200"
                    >
                        <div className="p-6">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-full ${type === 'danger' ? 'bg-red-50 text-red-600' :
                                        type === 'warning' ? 'bg-amber-50 text-amber-600' :
                                            'bg-blue-50 text-blue-600'
                                    }`}>
                                    <AlertTriangle size={24} />
                                </div>
                                <div className="flex-1 pt-1">
                                    <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">{title}</h3>
                                    <p className="text-stone-500 leading-relaxed text-sm">
                                        {message}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-stone-50 p-4 px-6 flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-5 py-2 rounded-lg font-bold text-sm text-stone-600 hover:bg-stone-200 transition-colors"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className={`px-5 py-2 rounded-lg font-bold text-sm text-white shadow-lg transition-transform active:scale-95 ${type === 'danger' ? 'bg-red-600 hover:bg-red-700 shadow-red-200' :
                                        type === 'warning' ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-200' :
                                            'bg-primary hover:bg-primary/90 shadow-primary/20'
                                    }`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmModal;
