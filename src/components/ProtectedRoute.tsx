import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

const ProtectedRoute: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    const checkUser = React.useCallback(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setAuthenticated(!!session);
        setLoading(false);
    }, []);

    useEffect(() => {
        const init = async () => {
            await checkUser();
        };
        init();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setAuthenticated(!!session);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [checkUser]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">
                <Loader2 className="animate-spin" size={40} />
            </div>
        );
    }

    return authenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
