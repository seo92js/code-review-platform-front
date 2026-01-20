import React from 'react';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

interface HeaderProps {
    isLogin: boolean;
    username: string | null;
}

const Header: React.FC<HeaderProps> = ({ isLogin, username }) => {
    return (
        <header className="mb-8">
            <div className="flex items-center justify-between gap-3">
                {/* Logo & Brand */}
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-glow-sm">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                    </div>
                    <div className="text-left">
                        <h1 className="text-xl font-bold text-gradient">AISenpai</h1>
                        <p className="text-xs text-slate-400">Your PR Agent</p>
                    </div>
                </div>

                {/* Auth Section */}
                <div className="flex-shrink-0">
                    {isLogin && username ? <LogoutButton username={username} /> : <LoginButton />}
                </div>
            </div>
        </header>
    );
};

export default Header;