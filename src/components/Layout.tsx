import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col font-sans text-slate-800">
            <Navbar />
            <main className="flex-grow pt-20">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
