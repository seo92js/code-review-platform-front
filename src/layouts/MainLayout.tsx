import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

const MainLayout: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="max-w-7xl mx-auto w-full px-6 pt-6">
                <Header />
            </div>
            <div className="flex-1">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;
